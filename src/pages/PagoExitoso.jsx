import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { API_URL } from "../api";
import { trackPurchase } from "../utils/metaPixel";
import "../styles/pago-resultado.css";

export default function PagoExitoso() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [transaccion, setTransaccion] = useState(null);
  const [numerosAsignados, setNumerosAsignados] = useState([]);
  // Evita disparar Purchase más de una vez si el componente re-renderiza
  const pixelDisparado = useRef(false);

  useEffect(() => {
    verificarTransaccion();
  }, [searchParams]);

  // Dispara Purchase solo cuando transaccion quede confirmada como aprobada
  useEffect(() => {
    if (transaccion && !pixelDisparado.current) {
      const estado = transaccion.estado;
      if (estado === "aprobado" || estado === "approved") {
        pixelDisparado.current = true;
        trackPurchase({
          value: transaccion.valor_total || transaccion.total || 0,
          currency: "COP",
          content_name: transaccion.rifaTitulo || "Rifa StayAway",
          num_items: transaccion.cantidad || 1,
          content_ids: transaccion.rifa_id || null,
        });
      }
    }
  }, [transaccion]);

  const verificarTransaccion = async () => {
    try {
      const ultimaTransaccion = sessionStorage.getItem("ultimaTransaccion");

      let referencia;

      if (ultimaTransaccion) {
        const transaccionData = JSON.parse(ultimaTransaccion);
        setTransaccion(transaccionData);
        referencia = transaccionData.referencia;
        sessionStorage.removeItem("ultimaTransaccion");
      }

      const externalReference = searchParams.get("external_reference");
      if (externalReference) {
        referencia = externalReference;
      }

      if (referencia) {
        await obtenerTransaccionCompleta(referencia);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error("Error verificando transacción:", error);
      setLoading(false);
    }
  };

  const obtenerTransaccionCompleta = async (referencia) => {
    try {
      const res = await fetch(`${API_URL}/pagos/estado/${referencia}`);
      const data = await res.json();

      if (data.success) {
        const transaccionCompleta = data.transaccion;
        setTransaccion(transaccionCompleta);

        if (transaccionCompleta.datos_respuesta?.numeros_asignados) {
          setNumerosAsignados(transaccionCompleta.datos_respuesta.numeros_asignados);
        } else if (transaccionCompleta.estado === "aprobado") {
          await obtenerNumerosDesdeBD(transaccionCompleta);
        }
      }
    } catch (error) {
      console.error("Error obteniendo transacción completa:", error);
    } finally {
      setLoading(false);
    }
  };

  const obtenerNumerosDesdeBD = async (transaccionData) => {
    try {
      const usuarioId = transaccionData.usuario_id;
      const rifaId = transaccionData.rifa_id;

      if (usuarioId && rifaId) {
        const response = await fetch(`${API_URL}/compras/usuario`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.numeros) {
            const numerosEstaRifa = data.numeros
              .filter((item) => item.rifa_id === rifaId)
              .map((item) => item.numero);
            setNumerosAsignados(numerosEstaRifa);
          }
        }
      }
    } catch (error) {
      console.error("Error obteniendo números desde BD:", error);
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

  const cantidadReal =
    numerosAsignados.length > 0 ? numerosAsignados.length : transaccion?.cantidad || 0;

  return (
    <div className="pago-resultado">
      <div className="resultado-content success">
        <div className="icono-exito">✅</div>
        <h1>¡Pago Exitoso!</h1>
        <p className="mensaje-exito">
          Tu compra ha sido procesada correctamente. ¡Gracias por participar!
        </p>

        {transaccion && (
          <div className="transaccion-info">
            <h3>Detalles de la compra:</h3>
            <div className="detalles-grid">
              <div className="detalle-item">
                <strong>Rifa:</strong> {transaccion.rifaTitulo || "Rifa"}
              </div>
              <div className="detalle-item">
                <strong>Cantidad solicitada:</strong> {transaccion.cantidad} números
              </div>
              <div className="detalle-item">
                <strong>Cantidad asignada:</strong> {cantidadReal} números
              </div>
              <div className="detalle-item">
                <strong>Total pagado:</strong> $
                {transaccion.valor_total?.toLocaleString() ||
                  transaccion.total?.toLocaleString() ||
                  "0"}
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
            <p>
              Se te han asignado <strong>{numerosAsignados.length}</strong> números
              aleatorios:
            </p>
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