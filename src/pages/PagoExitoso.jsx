import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { API_URL } from "../api";
import "../styles/pago-resultado.css";

export default function PagoExitoso() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [transaccion, setTransaccion] = useState(null);
  const [numerosAsignados, setNumerosAsignados] = useState([]);

  useEffect(() => {
    // Intentar obtener datos de sessionStorage primero
    const ultimaTransaccion = sessionStorage.getItem('ultimaTransaccion');
    
    if (ultimaTransaccion) {
      const transaccionData = JSON.parse(ultimaTransaccion);
      setTransaccion(transaccionData);
      sessionStorage.removeItem('ultimaTransaccion'); // Limpiar después de usar
    }

    // También verificar si hay parámetros en la URL
    const paymentId = searchParams.get('payment_id');
    const status = searchParams.get('status');
    const externalReference = searchParams.get('external_reference');

    if (externalReference) {
      verificarTransaccion(externalReference);
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  const verificarTransaccion = async (referencia) => {
    try {
      const res = await fetch(`${API_URL}/pagos/estado/${referencia}`);
      const data = await res.json();
      
      if (data.success) {
        setTransaccion(data.transaccion);
        
        // Si la transacción está aprobada, obtener números asignados
        if (data.transaccion.estado === 'aprobado') {
          await obtenerNumerosAsignados(data.transaccion.usuario_id || data.transaccion.usuario_documento);
        }
      }
    } catch (error) {
      console.error("Error verificando transacción:", error);
    } finally {
      setLoading(false);
    }
  };

  const obtenerNumerosAsignados = async (usuarioId) => {
    try {
      // En una implementación real, aquí llamarías a tu API para obtener los números
      // Por ahora simulamos números aleatorios
      const numerosSimulados = Array.from({ length: transaccion?.cantidad || 5 }, () => 
        Math.floor(Math.random() * 10000).toString().padStart(4, '0')
      );
      setNumerosAsignados(numerosSimulados);
    } catch (error) {
      console.error("Error obteniendo números:", error);
    }
  };

  if (loading) {
    return (
      <div className="pago-resultado">
        <div className="resultado-content loading">
          <h2>🔄 Verificando tu pago...</h2>
          <p>Estamos confirmando el estado de tu transacción.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pago-resultado">
      <div className="resultado-content success">
        <div className="icono-exito">✅</div>
        <h1>¡Pago Exitoso!</h1>
        <p className="mensaje-exito">Tu compra ha sido procesada correctamente. ¡Gracias por participar!</p>
        
        {transaccion && (
          <div className="transaccion-info">
            <h3>Detalles de la compra:</h3>
            <div className="detalles-grid">
              <div className="detalle-item">
                <strong>Rifa:</strong> {transaccion.rifaTitulo || "Rifa"}
              </div>
              <div className="detalle-item">
                <strong>Cantidad:</strong> {transaccion.cantidad} números
              </div>
              <div className="detalle-item">
                <strong>Total pagado:</strong> ${transaccion.total?.toLocaleString() || "0"}
              </div>
              {transaccion.referencia && (
                <div className="detalle-item">
                  <strong>Referencia:</strong> {transaccion.referencia}
                </div>
              )}
            </div>
          </div>
        )}

        {numerosAsignados.length > 0 && (
          <div className="numeros-asignados">
            <h3>🎉 ¡Tus números asignados!</h3>
            <p>Se te han asignado {numerosAsignados.length} números aleatorios:</p>
            <div className="numeros-grid">
              {numerosAsignados.map((numero, index) => (
                <span key={index} className="numero-item">
                  #{numero}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="acciones-resultado">
          <button onClick={() => navigate("/")} className="btn-primario">
            Volver al Inicio
          </button>
          <button onClick={() => navigate("/perfil")} className="btn-secundario">
            Ver Mis Números
          </button>
        </div>

        <div className="info-adicional">
          <p>📧 Recibirás un correo de confirmación con los detalles de tu compra.</p>
          <p>🔢 Los números asignados también estarán disponibles en tu perfil.</p>
        </div>
      </div>
    </div>
  );
}