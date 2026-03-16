import React from "react";
import "../styles/como-funciona.css";

const ComoFunciona = () => {
  return (
    <div className="cf-wrapper" id="como-funciona">
      <section className="cf-hero">
        <h1 className="cf-title">¿Cómo funciona StayAway?</h1>
        <p className="cf-subtitle">
          Te explicamos paso a paso cómo participar en nuestras rifas reales y
          recibir tus números de forma automática y segura.
        </p>
      </section>

      <section className="cf-steps">
        {/* Paso 1 */}
        <div className="cf-step-card">
          <div className="cf-step-badge">Paso 1</div>
          <h2>Elige el sorteo</h2>
          <p>
            Explora los sorteos disponibles en la página principal y selecciona
            la rifa en la que quieras participar. Allí verás la información del
            premio, porcentaje de boletos vendidos y fecha del sorteo.
          </p>
        </div>

        {/* Paso 2 */}
        <div className="cf-step-card">
          <div className="cf-step-badge">Paso 2</div>
          <h2>Selecciona tu paquete</h2>
          <p>
            En la página de compra elige uno de los paquetes de boletos
            recomendados o ingresa de forma personalizada la cantidad de números
            que quieras comprar, siempre respetando la cantidad mínima de la rifa.
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
          <h2>Recibe tus números por correo</h2>
          <p>
            Una vez que Mercado Pago confirma la transacción, te enviaremos un{" "}
            correo electrónico con todos tus números comprados, bien
            organizados y listos para el sorteo.
          </p>
        </div>

        {/* Paso 6 */}
        <div className="cf-step-card">
          <div className="cf-step-badge">Paso 6</div>
          <h2>Consulta tus números en tu perfil</h2>
          <p>
            Además del correo, tus números quedan guardados en tu{" "}
            <strong>perfil de StayAway</strong>. Solo debes iniciar sesión, ir a
            la sección de “Mis rifas” y allí verás cada compra con sus números
            asociados y el estado de cada sorteo.
          </p>
        </div>

        {/* Paso 7 */}
        <div className="cf-step-card">
          <div className="cf-step-badge">Paso 7</div>
          <h2>Esperas el sorteo… ¡y ganas!</h2>
          <p>
            Llegada la fecha del sorteo, usamos el resultado oficial indicado en
            la descripción de la rifa. Si uno de tus números resulta ganador,
            nuestro equipo se pondrá en contacto contigo por teléfono y correo
            para coordinar la entrega del premio.
          </p>
        </div>
      </section>

      <section className="cf-footer-note">
        <p>
          En StayAway nos enfocamos en rifas reales, transparencia y pagos
          seguros. Cada compra queda registrada, y siempre tendrás acceso a tus
          números y al historial de tus participaciones.
        </p>
      </section>
    </div>
  );
};

export default ComoFunciona;
