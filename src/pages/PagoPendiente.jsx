import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { API_URL } from "../api";
import "../styles/pago-resultado.css";

export default function PagoPendiente() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [transaccion, setTransaccion] = useState(null);

  useEffect(() => {
    const referencia = searchParams.get('external_reference');
    if (referencia) {
      verificarTransaccionPeriodicamente(referencia);
    }
  }, [searchParams]);

  const verificarTransaccionPeriodicamente = async (referencia) => {
    try {
      const res = await fetch(`${API_URL}/pagos/estado/${referencia}`);
      const data = await res.json();
      
      if (data.success) {
        setTransaccion(data.transaccion);
        
        // Si el pago se aprueba, redirigir a éxito
        if (data.transaccion.estado === 'aprobado') {
          setTimeout(() => {
            navigate('/pago-exitoso');
          }, 2000);
        }
        
        // Si el pago es rechazado, redirigir a fallido
        if (data.transaccion.estado === 'rechazado') {
          setTimeout(() => {
            navigate('/pago-fallido');
          }, 2000);
        }
      }
    } catch (error) {
      console.error("Error verificando transacción:", error);
    }
  };

  return (
    <div className="pago-resultado">
      <div className="resultado-content pending">
        <div className="icono-pendiente">⏳</div>
        <h1>Pago en Proceso</h1>
        <p className="mensaje-pendiente">
          Tu pago está siendo procesado. Esto puede tomar unos minutos.
        </p>
        
        <div className="loading-spinner"></div>

        {transaccion && (
          <div className="transaccion-info">
            <div className="detalle-item">
              <strong>Referencia:</strong> {transaccion.referencia}
            </div>
            <div className="detalle-item">
              <strong>Estado actual:</strong> {transaccion.estado}
            </div>
          </div>
        )}

        <div className="info-proceso">
          <h3>¿Qué está pasando?</h3>
          <ul>
            <li>1. Estamos verificando el pago</li>
            <li>2. Esto puede tomar 2-5 minutos</li>
            <li>3. Recibirás una confirmación por correo</li>
            <li>4. Tu transacción fue recibida</li>
          </ul>
        </div>

        <div className="acciones-resultado">
          <button onClick={() => navigate("/")} className="btn-secundario">
            Volver al Inicio
          </button>
        </div>

        <div className="info-adicional">
          <p>No cierres esta ventana hasta que se complete el proceso.</p>
          <p>Te notificaremos por correo cuando el pago se complete.</p>
        </div>
      </div>
    </div>
  );
}