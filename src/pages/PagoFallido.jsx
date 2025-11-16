import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../styles/pago-resultado.css";

export default function PagoFallido() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const motivo = searchParams.get(' motivo') || "El pago no pudo ser procesado";

  return (
    <div className="pago-resultado">
      <div className="resultado-content error">
        <div className="icono-error">❌</div>
        <h1>Pago Fallido</h1>
        <p className="mensaje-error">{motivo}</p>
        
        <div className="sugerencias">
          <h3>¿Qué puedes hacer?</h3>
          <ul>
            <li>Verificar los datos de tu tarjeta</li>
            <li>Intentar con otro método de pago</li>
            <li>Contactar a tu entidad bancaria</li>
            <li>Reintentar el pago</li>
          </ul>
        </div>

        <div className="acciones-resultado">
          <button onClick={() => navigate(-2)} className="btn-primario">
            Reintentar Pago
          </button>
          <button onClick={() => navigate("/")} className="btn-secundario">
            Volver al Inicio
          </button>
        </div>

        <div className="info-adicional">
          <p>💳 Asegúrate de que tu tarjeta tenga fondos suficientes.</p>
          <p>🔒 Si el problema persiste, contacta a soporte.</p>
        </div>
      </div>
    </div>
  );
}