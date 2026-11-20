import React, { useState } from 'react'

const faqData = {
  titulo: 'Preguntas frecuentes',
  preguntas: [
    {
      pregunta: '¿Cómo hago un pedido?',
      respuesta: 'Elegí tus productos, agregalos al carrito y tocá “Finalizar pedido”. Vamos a abrir WhatsApp con el detalle ya armado: solo tenés que enviar el mensaje para que coordinemos el pago y la entrega.'
    },
    {
      pregunta: '¿Necesito una cuenta para comprar?',
      respuesta: 'No. Podés comprar sin cuenta. Con una cuenta, además, guardás tus favoritos, sumás puntos con cada compra y accedés a descuentos.'
    },
    {
      pregunta: '¿Cómo funcionan los puntos?',
      respuesta: 'Al crear tu cuenta recibís 500 puntos de bienvenida. Después, cada $5.000 que pagás en un pedido te suman 500 puntos. Podés ver tu saldo y tus movimientos en Perfil, dentro de “Puntos y nivel”.'
    },
    {
      pregunta: '¿Cómo funcionan los descuentos?',
      respuesta: 'Cada 1.000 puntos acumulados te dan un 5% de descuento, hasta un máximo del 20%. El descuento se aplica automáticamente en tus próximos pedidos con cuenta. Los puntos no se gastan: se acumulan.'
    },
    {
      pregunta: '¿Qué es el nivel de mi cuenta?',
      respuesta: 'Al registrarte empezás en el nivel 3, que te permite personalizar tu perfil con un avatar, un apodo, tu material favorito y tu ciudad. El nivel es independiente del descuento, que depende solo de tus puntos.'
    },
    {
      pregunta: '¿Qué medios de pago aceptan?',
      respuesta: 'Por ahora el pago se coordina por WhatsApp una vez enviado el pedido. Google Pay y Apple Pay están en camino: los vas a ver marcados como “Próximamente”.'
    },
    {
      pregunta: '¿Cómo coordino el envío o el retiro?',
      respuesta: 'Después de que envíes tu pedido por WhatsApp, te respondemos para acordar el envío o el retiro y confirmar la disponibilidad de los productos.'
    },
    {
      pregunta: '¿Cómo sé si mi pedido fue confirmado?',
      respuesta: 'Tu pedido queda confirmado cuando te respondemos por WhatsApp. Si tenés cuenta, lo ves también en Perfil, en “Mis pedidos”. El seguimiento por etapas es una de las mejoras que vienen.'
    },
    {
      pregunta: '¿Puedo cambiar o cancelar un pedido?',
      respuesta: 'Sí, escribinos por WhatsApp lo antes posible indicando tu pedido y vemos cómo resolverlo.'
    },
    {
      pregunta: 'Me olvidé la contraseña, ¿qué hago?',
      respuesta: 'En la pantalla de inicio de sesión tocá “¿Olvidaste tu contraseña?”, ingresá tu email y te enviamos un enlace para crear una nueva.'
    },
    {
      pregunta: '¿Cómo elimino mi cuenta?',
      respuesta: 'Entrá a Perfil, luego a “Editar perfil” y elegí “Eliminar cuenta”. Vas a tener que escribir BORRAR para confirmar. Se eliminan tus datos, favoritos, pedidos y puntos, y la acción no se puede deshacer.'
    },
    {
      pregunta: '¿Qué opciones de accesibilidad tiene el sitio?',
      respuesta: 'Con el botón de accesibilidad podés cambiar el tamaño del texto, activar el tema oscuro, el alto contraste, subrayar enlaces y botones, aumentar el espacio del texto, pausar las animaciones y resaltar el foco del teclado. Tus preferencias se guardan en este dispositivo.'
    },
    {
      pregunta: '¿Las fotos y los productos son reales?',
      respuesta: 'MADERAS es un sitio demostrativo. Los productos y precios son ilustrativos, y las imágenes fueron generadas con inteligencia artificial con fines ilustrativos. No se realizan ventas reales.'
    },
    {
      pregunta: '¿Quién creó este sitio?',
      respuesta: 'Es un proyecto académico de diseño UX/UI y desarrollo con React. Podés ver cómo se pensó el diseño en la sección “Detrás del diseño”.'
    }
  ]
}

export function Faq() {
  const [openIndex, setOpenIndex] = useState(null)

  function toggle(i) {
    setOpenIndex(openIndex === i ? null : i)
  }

  return (
    <div className="page-section faq-page">
      <h1 className="page-title">{faqData.titulo}</h1>

      <div className="faq-list" role="list">
        {faqData.preguntas.map((item, i) => {
          const isOpen = openIndex === i
          const headingId = `faq-q-${i}`
          const panelId = `faq-a-${i}`

          return (
            <div key={i} className={`faq-item ${isOpen ? 'faq-item--open' : ''}`} role="listitem">
              <button
                type="button"
                id={headingId}
                className="faq-question"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(i)}
              >
                <span>{item.pregunta}</span>
                <svg
                  className="faq-chevron"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s' }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              <div
                id={panelId}
                role="region"
                aria-labelledby={headingId}
                className="faq-answer"
                hidden={!isOpen}
              >
                <p>{item.respuesta}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
