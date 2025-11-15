import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { API_URL } from "../api";

export default function ConfirmacionPago() {
  const [estado, setEstado] = useState("verificando");
  const [transaccion, setTransaccion] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  const referencia = location.state?.referencia;

  useEffect(() => {
    if (referencia) {
      verificarPago();
      // Verificar cada 5 segundos si sigue pendiente
      const interval = setInterval(() => {
        if (estado === 'pendiente') {
          verificarPago();
        }
      }, 5000);
      
      return () => clearInterval(interval);
    } else {
      setEstado("error");
    }
  }, [referencia, estado]);

  const verificarPago = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/pagos/estado/${referencia}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const data = await res.json();
      
      if (data.success) {
        setEstado(data.transaccion.estado);
        setTransaccion(data.transaccion);
      } else {
        setEstado("error");
      }
    } catch (error) {
      setEstado("error");
    }
  };

  return (
    <div className="confirmacion-container">
      {estado === "verificando" && (
        <div className="estado-verificando">
          <h2>🔄 Verificando tu pago...</h2>
          <p>Estamos confirmando el estado de tu transacción.</p>
          <div className="loading-spinner"></div>
        </div>
      )}
      
      {estado === "pendiente" && (
        <div className="estado-pendiente">
          <h2>⏳ Pago Pendiente</h2>
          <p>Tu pago está siendo procesado. Esta verificación puede tomar algunos minutos.</p>
          <p>Referencia: <strong>{referencia}</strong></p>
          <div className="loading-spinner"></div>
          <button onClick={verificarPago}>Actualizar Estado</button>
        </div>
      )}
      
      {estado === "aprobado" && (
        <div className="estado-exitoso">
          <h2>✅ ¡Pago Exitoso!</h2>
          <p>Tu compra ha sido procesada correctamente. Los números han sido asignados a tu cuenta.</p>
          {transaccion && (
            <div className="detalles-compra">
              <p><strong>Referencia:</strong> {transaccion.referencia}</p>
              <p><strong>Cantidad:</strong> {transaccion.cantidad} números</p>
              <p><strong>Total:</strong> ${transaccion.valorTotal?.toLocaleString()}</p>
            </div>
          )}
          <button onClick={() => navigate("/perfil")}>Ver mis números</button>
          <button className="btn-secondary" onClick={() => navigate("/")}>Volver al Inicio</button>
        </div>
      )}
      
      {estado === "rechazado" && (
        <div className="estado-rechazado">
          <h2>❌ Pago Rechazado</h2>
          <p>Tu pago no pudo ser procesado. Por favor intenta nuevamente.</p>
          <button onClick={() => navigate("/comprar")}>Intentar de nuevo</button>
          <button className="btn-secondary" onClick={() => navigate("/")}>Volver al Inicio</button>
        </div>
      )}
      
      {estado === "error" && (
        <div className="estado-error">
          <h2>⚠️ Error en la verificación</h2>
          <p>No pudimos verificar el estado de tu pago. Revisa tu perfil más tarde.</p>
          <button onClick={() => navigate("/perfil")}>Ir a mi perfil</button>
          <button className="btn-secondary" onClick={() => navigate("/")}>Volver al Inicio</button>
        </div>
      )}
    </div>
  );
}