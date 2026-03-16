import React from "react";
import "../styles/contacto.css";

const Contacto = () => {
  return (
    <div className="contacto-wrapper">
      <section className="contacto-hero">
        <h1 className="contacto-title">Hablemos 👋</h1>
        <p className="contacto-subtitle">
          En <span>StayAway</span> nos especializamos en rifas reales y
          transparentes para que puedas ganar premios increíbles de forma
          segura desde el municipio de Viges, Valle del Cauca.
        </p>
      </section>

      <section className="contacto-content">
        {/* Columna izquierda: info de contacto */}
        <div className="contacto-info-card">
          <h2>Información de Contacto</h2>
          <p className="contacto-text">
            Si tienes dudas sobre nuestras rifas, pagos, resultados o quieres
            proponer una nueva rifa, estamos listos para ayudarte.
          </p>

          <div className="contacto-item">
            <span className="contacto-label">Teléfono / WhatsApp</span>
            <a href="tel:+573001112233" className="contacto-value">
              +57 300 111 22 33
            </a>
          </div>

          <div className="contacto-item">
            <span className="contacto-label">Correo electrónico</span>
            <a href="mailto:contacto@stayaway.co" className="contacto-value">
              contacto@stayaway.co
            </a>
          </div>

          <div className="contacto-item">
            <span className="contacto-label">Ubicación</span>
            <p className="contacto-value">
              Viges, Valle del Cauca, Colombia
            </p>
          </div>

          <div className="contacto-redes">
            <span className="contacto-label">Síguenos</span>
            <div className="redes-list">
              <a
                href="https://facebook.com/stayawayco"
                target="_blank"
                rel="noreferrer"
                className="red-social fb"
              >
                Facebook
              </a>
              <a
                href="https://instagram.com/stayawayco"
                target="_blank"
                rel="noreferrer"
                className="red-social ig"
              >
                Instagram
              </a>
              <a
                href="https://www.tiktok.com/@stayawayco"
                target="_blank"
                rel="noreferrer"
                className="red-social tk"
              >
                TikTok
              </a>
            </div>
          </div>

          <div className="contacto-badge">
            Rifas reales · Premios verificados · Comunidad StayAway
          </div>
        </div>

        {/* Columna derecha: formulario “dummy” */}
        <div className="contacto-form-card">
          <h2>Escríbenos un mensaje</h2>
          <p className="contacto-text">
            Cuéntanos en qué podemos ayudarte y te responderemos lo antes
            posible.
          </p>

          <form className="contacto-form">
            <div className="contacto-field">
              <label>Nombre completo</label>
              <input type="text" placeholder="Tu nombre" />
            </div>

            <div className="contacto-field">
              <label>Correo electrónico</label>
              <input type="email" placeholder="tunombre@correo.com" />
            </div>

            <div className="contacto-field">
              <label>Asunto</label>
              <input type="text" placeholder="Ej: Duda sobre una rifa" />
            </div>

            <div className="contacto-field">
              <label>Mensaje</label>
              <textarea
                rows="4"
                placeholder="Escríbenos los detalles de tu consulta..."
              />
            </div>

            <button type="button" className="contacto-button">
              Enviar mensaje
            </button>

            <p className="contacto-note">
              Al enviarnos un mensaje aceptas ser contactado por nuestro equipo
              a través de los datos suministrados.
            </p>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Contacto;
