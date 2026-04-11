import React from "react";
import "../styles/como-funciona.css";

const ComoFunciona = () => {
  return (
    <div className="cf-wrapper" id="como-funciona">
      <section className="cf-hero">
        <h1 className="cf-title">¿Cómo funciona StayAway?</h1>
        <p className="cf-subtitle">
          Te explicamos paso a paso cómo participar en nuestras actividades reales y
          recibir tus calcas de forma automática y segura.
        </p>
      </section>

      <section className="cf-steps">
        {/* Paso 1 */}
        <div className="cf-step-card">
          <div className="cf-step-badge">Paso 1</div>
          <h2>Elige la actividad</h2>
          <p>
            Explora las actividades disponibles en la página principal y selecciona
            en la que quieras participar. Allí verás la información del
            premio, porcentaje de calcas vendidas y estado de la actividad.
          </p>
        </div>

        {/* Paso 2 */}
        <div className="cf-step-card">
          <div className="cf-step-badge">Paso 2</div>
          <h2>Selecciona tu paquete</h2>
          <p>
            En la página de compra elige uno de los paquetes de calcas
            recomendados o ingresa de forma personalizada la cantidad de calcas
            que quieras comprar, siempre respetando la cantidad mínima de la actividad.
          </p>
        </div>

        {/* Paso 3 */}
        <div className="cf-step-card">
          <div className="cf-step-badge">Paso 3</div>
          <h2>Continúa al pago</h2>
          <p>
            Haz clic en <strong>“Continuar al pago”</strong>. Te llevaremos a una
            sección donde verificamos tus datos. Si ya tienes cuenta, se
            actualizarán automáticamente; si eres nuevo, creamos tu cuenta con la
            información que ingreses.
          </p>
        </div>

        {/* Paso 4 */}
        <div className="cf-step-card">
          <div className="cf-step-badge">Paso 4</div>
          <h2>Paga con Mercado Pago</h2>
          <p>
            Después de confirmar tus datos, te redirigimos a la página segura de{" "}
            <strong>Mercado Pago</strong>, donde completas el pago con el método
            que prefieras (tarjeta, PSE, billeteras, etc.). Todo el proceso de
            cobro se hace directamente con ellos.
          </p>
        </div>

        {/* Paso 5 */}
        <div className="cf-step-card">
          <div className="cf-step-badge">Paso 5</div>
          <h2>Recibe tus calcas por correo</h2>
          <p>
            Una vez que Mercado Pago confirma la transacción, te enviaremos un{" "}
            correo electrónico con todas tus calcas compradas, bien
            organizadas y listas para el sorteo.
          </p>
        </div>

        {/* Paso 6 */}
        <div className="cf-step-card">
          <div className="cf-step-badge">Paso 6</div>
          <h2>Consulta tus calcas en tu perfil</h2>
          <p>
            Además del correo, tus calcas quedan guardadas en tu{" "}
            <strong>perfil de StayAway</strong>. Solo debes iniciar sesión, ir a
            tu cuenta y allí verás cada compra con tus calcas
            asociadas y el estado de cada actividad.
          </p>
        </div>

        {/* Paso 7 */}
        <div className="cf-step-card">
          <div className="cf-step-badge">Paso 7</div>
          <h2>Esperas el resultado… ¡y ganas!</h2>
          <p>
            Llegada la fecha, usamos el resultado oficial indicado en
            la descripción de la actividad. Si una de tus calcas resulta ganadora,
            nuestro equipo se pondrá en contacto contigo por teléfono y correo
            para coordinar la entrega del premio.
          </p>
        </div>
      </section>

      {/* ── SECCIÓN DE RESULTADOS COMO LA IMAGEN ── */}
      <section className="cf-premios-info" style={{ marginTop: '50px', marginBottom: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '800px', margin: '50px auto 30px' }}>
        <h3 style={{ color: '#0a369d', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px', fontSize: '20px', textAlign: 'center', fontWeight: '800' }}>
          Ojo, las calcas se premian así:
        </h3>
        
        <p style={{ textAlign: 'center', color: '#4b5563', marginBottom: '25px', lineHeight: '1.6', fontSize: '0.95rem' }}>
          Queremos ser 100% transparentes contigo. El resultado oficial de la actividad se obtiene única y exclusivamente de los <strong>números principales</strong> del sorteo oficial de referencia. La <strong>Serie</strong> del billete no se tendrá en cuenta para determinar al ganador bajo ninguna circunstancia.
        </p>

        <div style={{
          display: 'flex',
          border: '2px dashed #4472ca',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #f8faff 0%, #f0f7ff 100%)',
          padding: '30px 50px',
          minWidth: '320px',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '40px',
          boxShadow: '0 10px 30px rgba(10, 54, 157, 0.08)'
        }}>
          <div style={{ textAlign: 'center', paddingRight: '40px', borderRight: '2px solid #cfdee7' }}>
            <p style={{ color: '#0a369d', fontWeight: '800', margin: '0 0 15px 0', fontSize: '15px', textTransform: 'uppercase', letterSpacing: '2px' }}>Número</p>
            <p style={{ color: '#0a369d', fontSize: '32px', letterSpacing: '8px', margin: 0, fontWeight: '900' }}>0 0 0 0</p>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#4472ca', fontWeight: '800', margin: '0 0 15px 0', fontSize: '15px', textTransform: 'uppercase', letterSpacing: '2px' }}>Serie</p>
            <p style={{ color: '#6b7280', fontSize: '32px', letterSpacing: '8px', margin: 0, fontWeight: '900' }}>
              0 <span style={{ color: '#9ca3af', textDecoration: 'line-through' }}>X X</span>
            </p>
          </div>
        </div>
      </section>

      <section className="cf-footer-note">
        <p>
          En StayAway nos enfocamos en actividades reales, transparencia y pagos
          seguros. Cada compra queda registrada, y siempre tendrás acceso a tus
          calcas y al historial de tus participaciones.
        </p>
      </section>
    </div>
  );
};

export default ComoFunciona;
