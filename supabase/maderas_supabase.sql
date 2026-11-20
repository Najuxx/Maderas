/* MADERAS · Esquema de Supabase */
/* Pegalo completo en: Supabase > SQL Editor > New query > Run */
/* Qué crea: */
/* · Tablas: config, products, profiles, favorites, points_ledger, orders, order_items */
/* · RLS (seguridad por fila) y permisos mínimos en todas las tablas */
/* · Un trigger que, al registrarse un usuario, crea su perfil y le da puntos de bienvenida */
/* · Funciones: mi_estado(), crear_pedido(items), eliminar_mi_cuenta() */
/* · 12 productos de ejemplo (editá nombres, precios y fotos) */
/* Reglas del sistema (todas editables en la tabla "config", sin tocar código): */
/* · Puntos: cada $5000 pagados suman 500 puntos */
/* · Descuento: cada 1000 puntos acumulados da 5%, con tope de 20% */
/* · Nivel (separado del descuento): al registrarse se empieza en nivel 3, */
/* que habilita personalizar el perfil */
/* · Puntos de bienvenida: 500 */
/* Es seguro correrlo más de una vez (no duplica productos ni pisa datos). */
/* Importante: el cliente (la app) NUNCA puede escribir puntos, pedidos ni niveles. */
/* Eso solo lo hacen las funciones de abajo, que se ejecutan en el servidor. */

/* 1. Configuración de las reglas */
create table if not exists public.config (
  key   text primary key,
  value numeric not null
);

insert into public.config (key, value) values
  ('monto_por_bloque',    5000),  -- cada $5000 pagados...
  ('puntos_por_bloque',    500),  -- ...suman 500 puntos
  ('puntos_por_paso',     1000),  -- cada 1000 puntos acumulados...
  ('descuento_por_paso',     5),  -- ...dan 5% de descuento
  ('descuento_maximo',      20),  -- tope de descuento (%)
  ('puntos_bienvenida',    500),  -- puntos al crear la cuenta
  ('nivel_inicial',          3)   -- nivel al crear la cuenta
on conflict (key) do nothing;

create or replace function public.cfg(k text)
returns numeric
language sql
stable
set search_path = public
as $$
  select value from public.config where key = k
$$;

/* 2. Tablas */
create table if not exists public.products (
  id          bigint generated always as identity primary key,
  name        text not null,
  description text,
  price       numeric(12,2) not null check (price >= 0),
  category    text not null,
  material    text,
  image_url   text,
  stock       int not null default 0 check (stock >= 0),
  featured    boolean not null default false,
  created_at  timestamptz not null default now()
);

create table if not exists public.profiles (
  id                uuid primary key references auth.users (id) on delete cascade,
  full_name         text,
  phone             text,
  nivel             int not null default 3,
  avatar            text,
  apodo             text,
  material_favorito text,
  ciudad            text,
  created_at        timestamptz not null default now()
);

create table if not exists public.favorites (
  user_id    uuid not null references public.profiles (id) on delete cascade,
  product_id bigint not null references public.products (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

create table if not exists public.orders (
  id              bigint generated always as identity primary key,
  user_id         uuid not null references public.profiles (id) on delete cascade,
  subtotal        numeric(12,2) not null,
  descuento_pct   int not null default 0,
  descuento_monto numeric(12,2) not null default 0,
  total           numeric(12,2) not null,
  puntos_ganados  int not null default 0,
  status          text not null default 'pendiente'
                  check (status in ('pendiente', 'confirmado', 'entregado', 'cancelado')),
  created_at      timestamptz not null default now()
);

create table if not exists public.order_items (
  id         bigint generated always as identity primary key,
  order_id   bigint not null references public.orders (id) on delete cascade,
  product_id bigint not null references public.products (id),
  nombre     text not null,                       -- se guarda el nombre del momento
  qty        int not null check (qty > 0),
  unit_price numeric(12,2) not null               -- y el precio del momento
);

/* Libro de puntos: el saldo es la suma de "delta". Nunca se edita, solo se agregan movimientos. */
create table if not exists public.points_ledger (
  id         bigint generated always as identity primary key,
  user_id    uuid not null references public.profiles (id) on delete cascade,
  delta      int not null,
  motivo     text not null check (motivo in ('bienvenida', 'compra', 'ajuste')),
  order_id   bigint references public.orders (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists idx_favorites_user    on public.favorites (user_id);
create index if not exists idx_orders_user       on public.orders (user_id);
create index if not exists idx_order_items_order on public.order_items (order_id);
create index if not exists idx_ledger_user       on public.points_ledger (user_id);
create index if not exists idx_products_category on public.products (category);

/* 3. Al registrarse: perfil + puntos de bienvenida */
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, nivel)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    cfg('nivel_inicial')::int
  );

  insert into public.points_ledger (user_id, delta, motivo)
  values (new.id, cfg('puntos_bienvenida')::int, 'bienvenida');

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

/* 4. Funciones que llama la app */

/* Estado del usuario logueado: puntos, descuento vigente y nivel. */
/* Uso desde React:  const { data } = await supabase.rpc('mi_estado') */
create or replace function public.mi_estado()
returns table (puntos int, descuento_pct int, nivel int)
language plpgsql
stable
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_pts int;
  v_lvl int;
begin
  if v_uid is null then
    return query select 0, 0, null::int;
    return;
  end if;

  select coalesce(sum(l.delta), 0)::int into v_pts
  from public.points_ledger l where l.user_id = v_uid;

  select p.nivel into v_lvl from public.profiles p where p.id = v_uid;

  return query select
    v_pts,
    least(
      (v_pts / cfg('puntos_por_paso')::int) * cfg('descuento_por_paso')::int,
      cfg('descuento_maximo')::int
    ),
    v_lvl;
end;
$$;

/* Función interna: agrupa los ítems del carrito y trae precio y stock REALES de la base. */
create or replace function public._carrito_agrupado(p_items jsonb)
returns table (product_id bigint, nombre text, qty int, precio numeric, stock int)
language sql
stable
set search_path = public
as $$
  select p.id, p.name, r.qty::int, p.price, p.stock
  from (
    select (e ->> 'product_id')::bigint as product_id,
           sum((e ->> 'qty')::int)      as qty
    from jsonb_array_elements(p_items) e
    group by 1
  ) r
  left join public.products p on p.id = r.product_id
$$;

/* Crea el pedido, aplica el descuento y suma los puntos. Todo en el servidor. */
/* Uso desde React: */
/* const { data, error } = await supabase.rpc('crear_pedido', */
/* { p_items: [{ product_id: 1, qty: 2 }, { product_id: 5, qty: 1 }] }) */
/* "data" trae: order_id, subtotal, descuento_pct, descuento_monto, total, */
/* puntos_ganados, puntos_totales e items (para armar el mensaje de WhatsApp). */
/* Nota: el stock se valida pero no se descuenta (el pedido se cierra por WhatsApp). */
create or replace function public.crear_pedido(p_items jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid      uuid := auth.uid();
  v_puntos   int;
  v_pct      int;
  v_subtotal numeric(12,2);
  v_desc     numeric(12,2);
  v_total    numeric(12,2);
  v_ganados  int;
  v_order_id bigint;
begin
  if v_uid is null then
    raise exception 'Necesitás iniciar sesión para guardar un pedido' using errcode = '28000';
  end if;

  if p_items is null
     or jsonb_typeof(p_items) <> 'array'
     or jsonb_array_length(p_items) = 0 then
    raise exception 'El carrito está vacío';
  end if;

  if jsonb_array_length(p_items) > 50 then
    raise exception 'El carrito tiene demasiados productos';
  end if;

  if exists (
    select 1 from jsonb_array_elements(p_items) e
    where (e ->> 'product_id') is null
       or (e ->> 'qty') is null
       or (e ->> 'qty')::int < 1
       or (e ->> 'qty')::int > 99
  ) then
    raise exception 'Hay productos con datos inválidos';
  end if;

  /* Bloquea al usuario para que dos pedidos simultáneos no calculen mal sus puntos. */
  perform 1 from public.profiles where id = v_uid for update;
  if not found then
    raise exception 'No se encontró tu perfil';
  end if;

  if exists (select 1 from public._carrito_agrupado(p_items) where product_id is null) then
    raise exception 'Hay productos que ya no existen';
  end if;

  if exists (select 1 from public._carrito_agrupado(p_items) where stock < qty) then
    raise exception 'No hay stock suficiente de alguno de los productos';
  end if;

  select sum(precio * qty) into v_subtotal from public._carrito_agrupado(p_items);

  select coalesce(sum(l.delta), 0)::int into v_puntos
  from public.points_ledger l where l.user_id = v_uid;

  v_pct := least(
    (v_puntos / cfg('puntos_por_paso')::int) * cfg('descuento_por_paso')::int,
    cfg('descuento_maximo')::int
  );
  v_desc    := round(v_subtotal * v_pct / 100.0, 2);
  v_total   := v_subtotal - v_desc;
  /* Los puntos se calculan sobre lo que realmente se paga (ya con descuento). */
  v_ganados := floor(v_total / cfg('monto_por_bloque'))::int * cfg('puntos_por_bloque')::int;

  insert into public.orders (user_id, subtotal, descuento_pct, descuento_monto, total, puntos_ganados)
  values (v_uid, v_subtotal, v_pct, v_desc, v_total, v_ganados)
  returning id into v_order_id;

  insert into public.order_items (order_id, product_id, nombre, qty, unit_price)
  select v_order_id, product_id, nombre, qty, precio
  from public._carrito_agrupado(p_items);

  if v_ganados > 0 then
    insert into public.points_ledger (user_id, delta, motivo, order_id)
    values (v_uid, v_ganados, 'compra', v_order_id);
  end if;

  return jsonb_build_object(
    'order_id',        v_order_id,
    'subtotal',        v_subtotal,
    'descuento_pct',   v_pct,
    'descuento_monto', v_desc,
    'total',           v_total,
    'puntos_ganados',  v_ganados,
    'puntos_totales',  v_puntos + v_ganados,
    'items', (
      select jsonb_agg(jsonb_build_object('nombre', nombre, 'qty', qty, 'precio', precio))
      from public._carrito_agrupado(p_items)
    )
  );
end;
$$;

/* Elimina la cuenta del usuario logueado y todos sus datos (perfil, favoritos, pedidos, puntos). */
/* Uso desde React:  await supabase.rpc('eliminar_mi_cuenta')  y después  supabase.auth.signOut() */
create or replace function public.eliminar_mi_cuenta()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Necesitás iniciar sesión' using errcode = '28000';
  end if;
  delete from auth.users where id = auth.uid();
end;
$$;

/* 5. Permisos mínimos */
revoke all on public.config, public.products, public.profiles, public.favorites,
              public.orders, public.order_items, public.points_ledger
  from anon, authenticated;

grant select on public.config   to anon, authenticated;
grant select on public.products to anon, authenticated;

grant select on public.profiles to authenticated;
/* Solo estas columnas se pueden editar desde la app (nunca "nivel" ni "id"): */
grant update (full_name, phone, avatar, apodo, material_favorito, ciudad)
  on public.profiles to authenticated;

grant select, insert, delete on public.favorites     to authenticated;
grant select                 on public.points_ledger to authenticated;
grant select                 on public.orders        to authenticated;
grant select                 on public.order_items   to authenticated;

revoke execute on function public.crear_pedido(jsonb)      from public, anon, authenticated;
revoke execute on function public.mi_estado()              from public, anon, authenticated;
revoke execute on function public.eliminar_mi_cuenta()     from public, anon, authenticated;
revoke execute on function public._carrito_agrupado(jsonb) from public, anon, authenticated;
revoke execute on function public.handle_new_user()        from public, anon, authenticated;

grant execute on function public.crear_pedido(jsonb)  to authenticated;
grant execute on function public.mi_estado()          to authenticated;
grant execute on function public.eliminar_mi_cuenta() to authenticated;

/* 6. RLS: cada usuario solo ve y toca lo suyo */
alter table public.config        enable row level security;
alter table public.products      enable row level security;
alter table public.profiles      enable row level security;
alter table public.favorites     enable row level security;
alter table public.orders        enable row level security;
alter table public.order_items   enable row level security;
alter table public.points_ledger enable row level security;

drop policy if exists "config_lectura_publica"   on public.config;
drop policy if exists "productos_lectura_publica" on public.products;
drop policy if exists "perfil_ver_propio"        on public.profiles;
drop policy if exists "perfil_editar_propio"     on public.profiles;
drop policy if exists "favoritos_ver_propios"    on public.favorites;
drop policy if exists "favoritos_agregar_propios" on public.favorites;
drop policy if exists "favoritos_quitar_propios" on public.favorites;
drop policy if exists "puntos_ver_propios"       on public.points_ledger;
drop policy if exists "pedidos_ver_propios"      on public.orders;
drop policy if exists "items_ver_propios"        on public.order_items;

create policy "config_lectura_publica" on public.config
  for select to anon, authenticated using (true);

create policy "productos_lectura_publica" on public.products
  for select to anon, authenticated using (true);

create policy "perfil_ver_propio" on public.profiles
  for select to authenticated using (id = (select auth.uid()));

/* Personalizar el perfil requiere nivel 3 o más. */
create policy "perfil_editar_propio" on public.profiles
  for update to authenticated
  using (id = (select auth.uid()) and nivel >= 3)
  with check (id = (select auth.uid()));

create policy "favoritos_ver_propios" on public.favorites
  for select to authenticated using (user_id = (select auth.uid()));

create policy "favoritos_agregar_propios" on public.favorites
  for insert to authenticated with check (user_id = (select auth.uid()));

create policy "favoritos_quitar_propios" on public.favorites
  for delete to authenticated using (user_id = (select auth.uid()));

create policy "puntos_ver_propios" on public.points_ledger
  for select to authenticated using (user_id = (select auth.uid()));

create policy "pedidos_ver_propios" on public.orders
  for select to authenticated using (user_id = (select auth.uid()));

create policy "items_ver_propios" on public.order_items
  for select to authenticated
  using (exists (
    select 1 from public.orders o
    where o.id = order_items.order_id and o.user_id = (select auth.uid())
  ));

/* 7. Productos de ejemplo (solo si la tabla está vacía) */
/* Los precios son de ejemplo en pesos argentinos. Las imágenes van en */
/* /public/img/productos/ del proyecto (o subilas a Supabase Storage). */
do $$
begin
  if not exists (select 1 from public.products) then
    insert into public.products (name, description, price, category, material, image_url, stock, featured) values
      ('Tabla de picar de nogal',     'Tabla de picar con canaleta para jugos, terminada con aceite apto para alimentos.', 18500, 'Cocina',       'Nogal',     '/img/productos/tabla-de-picar-nogal.webp',  12, true),
      ('Set de cucharas de madera x3','Tres cucharas de distintos tamaños, lijadas a mano y listas para usar.',              9800, 'Cocina',       'Paraíso',   '/img/productos/set-cucharas.webp',          20, false),
      ('Bowl artesanal de algarrobo', 'Bowl torneado con veta marcada. Cada pieza es única.',                               14200, 'Cocina',       'Algarrobo', '/img/productos/bowl-algarrobo.webp',         8, true),
      ('Posavasos x6 con soporte',    'Seis posavasos con base para guardarlos a mano.',                                     7600, 'Cocina',       'Eucalipto', '/img/productos/posavasos.webp',             25, false),
      ('Estante flotante de pino',    'Estante de pared con herrajes ocultos. Ideal para libros y plantas.',                16900, 'Hogar',        'Pino',      '/img/productos/estante-pino.webp',          10, false),
      ('Perchero de pared 4 ganchos', 'Perchero con cuatro ganchos reforzados para el recibidor.',                          21500, 'Hogar',        'Algarrobo', '/img/productos/perchero-pared.webp',         7, true),
      ('Portallaves con repisa',      'Portallaves con repisa superior para correspondencia y objetos chicos.',             12800, 'Hogar',        'Pino',      '/img/productos/portallaves.webp',           14, false),
      ('Banquito multiuso',           'Banquito resistente para sentarse, apoyar plantas o alcanzar estantes.',             28900, 'Hogar',        'Eucalipto', '/img/productos/banquito.webp',               5, false),
      ('Caja organizadora con tapa',  'Caja con tapa encastrada para guardar objetos pequeños.',                            15400, 'Organización', 'Paraíso',   '/img/productos/caja-organizadora.webp',     11, false),
      ('Organizador de escritorio',   'Organizador con compartimentos para lapiceras, notas y accesorios.',                 17300, 'Organización', 'Nogal',     '/img/productos/organizador-escritorio.webp', 9, false),
      ('Macetero de madera con base', 'Macetero con base elevada que protege el piso de la humedad.',                       11900, 'Decoración',   'Eucalipto', '/img/productos/macetero.webp',              16, true),
      ('Bandeja de desayuno',         'Bandeja con asas para llevar el desayuno a la mesa o a la cama.',                    19800, 'Decoración',   'Algarrobo', '/img/productos/bandeja-desayuno.webp',       6, false);
  end if;
end $$;
