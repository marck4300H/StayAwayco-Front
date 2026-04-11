import React, { useState } from "react";
import "../styles/contacto.css";

const Contacto = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    asunto: "",
    mensaje: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEnviarWhatsApp = () => {
    const { nombre, correo, asunto, mensaje } = formData;
    
    if (!mensaje.trim()) {
      alert("Por favor, escribe un mensaje antes de contactarnos.");
      return;
    }

    const textoMensaje = `¡Hola StayAway!\nMi nombre es ${nombre || "un usuario"}.\nAsunto: ${asunto || "Consulta general"}\n\n${mensaje}${correo ? `\n\nMi correo es: ${correo}` : ""}`;
    const encodedText = encodeURIComponent(textoMensaje);
    const phoneNumber = "573136787040"; 
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedText}`;
    
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="contacto-wrapper">
      <section className="contacto-hero">
        <h1 className="contacto-title">Hablemos 👋</h1>
        <p className="contacto-subtitle">
          En <span>StayAway</span> nos especializamos en actividades reales y
          transparentes para que puedas ganar premios increíbles de forma
          segura desde el municipio de Vijes, Valle del Cauca.
        </p>
      </section>

      <section className="contacto-content">
        {/* Columna izquierda: info de contacto */}
        <div className="contacto-info-card">
          <h2>Información de Contacto</h2>
          <p className="contacto-text">
            Si tienes dudas sobre nuestras actividades, pagos, resultados o quieres
            proponer una nueva actividad, estamos listos para ayudarte.
          </p>

          <div className="contacto-item">
            <span className="contacto-label">Teléfono / WhatsApp</span>
            <a href="tel:+573136787040" className="contacto-value">
              +57 313 678 70 40
            </a>
          </div>

          <div className="contacto-item">
            <span className="contacto-label">Correo electrónico</span>
            <a href="mailto:stayaway.col@gmail.com" className="contacto-value">
              stayaway.col@gmail.com
            </a>
          </div>

          <div className="contacto-item">
            <span className="contacto-label">Ubicación</span>
            <p className="contacto-value">
              Vijes, Valle del Cauca, Colombia
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
            Actividades reales · Premios verificados · Comunidad StayAway
          </div>
        </div>

        {/* Columna derecha: formulario WhatsApp */}
        <div className="contacto-form-card">
          <h2>Escríbenos un mensaje</h2>
          <p className="contacto-text">
            Cuéntanos en qué podemos ayudarte y te enviaremos al WhatsApp oficial para conectarnos al instante.
          </p>

          <form className="contacto-form" onSubmit={(e) => e.preventDefault()}>
            <div className="contacto-field">
              <label>Nombre completo</label>
              <input 
                type="text" 
                name="nombre" 
                value={formData.nombre} 
                onChange={handleChange} 
                placeholder="Tu nombre" 
              />
            </div>

            <div className="contacto-field">
              <label>Correo electrónico (Opcional)</label>
              <input 
                type="email" 
                name="correo" 
                value={formData.correo} 
                onChange={handleChange} 
                placeholder="tunombre@correo.com" 
              />
            </div>

            <div className="contacto-field">
              <label>Asunto</label>
              <input 
                type="text" 
                name="asunto" 
                value={formData.asunto} 
                onChange={handleChange} 
                placeholder="Ej: Duda sobre una actividad" 
              />
            </div>

            <div className="contacto-field">
              <label>Mensaje *</label>
              <textarea
                rows="4"
                name="mensaje"
                value={formData.mensaje}
                onChange={handleChange}
                placeholder="Escríbenos los detalles de tu consulta..."
                required
              />
            </div>

            <button type="button" onClick={handleEnviarWhatsApp} className="contacto-button" style={{ backgroundColor: "#25D366", borderColor: "#25D366", display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
              📞 Enviar por WhatsApp
            </button>

            <p className="contacto-note">
              Al enviarnos un mensaje serás redirigido a WhatsApp para continuar la conversación con nuestro equipo de forma ágil y personalizada.
            </p>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Contacto;
