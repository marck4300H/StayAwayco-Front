import React, { useState, useEffect } from "react";
import { asignarNumerosManual, API_URL } from "../api";
import "../styles/asignarNumeros.css";

export default function AsignarNumeros() {
  const [rifas, setRifas] = useState([]);
  const [rifaSeleccionada, setRifaSeleccionada] = useState(null);
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [notasAdmin, setNotasAdmin] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });
  const [resultado, setResultado] = useState(null);

  useEffect(() => {
    cargarRifas();
  }, []);

  const cargarRifas = async () => {
    try {
      const res = await fetch(`${API_URL}/rifas/`);
      if (!res.ok) throw new Error("Error al obtener las rifas");
      
      const data = await res.json();
      
      if (data.success && data.rifas) {
        const rifasActivas = data.rifas.filter(rifa => rifa.estado === "activa" || !rifa.estado);
        setRifas(rifasActivas);
      } else {
        mostrarMensaje("error", "Error al cargar las rifas");
      }
    } catch (error) {
      console.error("Error cargando rifas:", error);
      mostrarMensaje("error", "Error de conexión al cargar rifas");
    }
  };

  const handleAsignarNumeros = async (e) => {
    e.preventDefault();

    if (!rifaSeleccionada) {
      mostrarMensaje("warning", "Selecciona una rifa");
      return;
    }

    if (!numeroDocumento.trim()) {
      mostrarMensaje("warning", "Ingresa el número de documento del usuario");
      return;
    }

    if (!cantidad || cantidad < 1) {
      mostrarMensaje("warning", "La cantidad debe ser al menos 1");
      return;
    }

    const cantidadNum = parseInt(cantidad);
    const total = rifaSeleccionada.precio_unitario * cantidadNum;

    const confirmar = window.confirm(
      `¿Confirmas asignar ${cantidadNum} números al usuario con documento ${numeroDocumento}?\n\n` +
      `Rifa: ${rifaSeleccionada.titulo}\n` +
      `Total: $${total.toLocaleString("es-CO")}`
    );

    if (!confirmar) return;

    setLoading(true);
    setMensaje({ tipo: "", texto: "" });

    try {
      const token = localStorage.getItem("token");
      const datos = {
        rifa_id: rifaSeleccionada.id,
        numero_documento: numeroDocumento.trim(),
        cantidad: cantidadNum,
        notas_admin: notasAdmin.trim() || undefined,
      };

      const res = await asignarNumerosManual(datos, token);

      if (res.success) {
        setResultado(res.data);
        mostrarMensaje("success", res.message);
        setNumeroDocumento("");
        setCantidad("");
        setNotasAdmin("");
        setRifaSeleccionada(null);
      } else {
        mostrarMensaje("error", res.message || "Error al asignar números");
      }
    } catch (error) {
      console.error("Error asignando números:", error);
      mostrarMensaje("error", "Error de conexión al asignar números");
    } finally {
      setLoading(false);
    }
  };

  const mostrarMensaje = (tipo, texto) => {
    setMensaje({ tipo, texto });
    setTimeout(() => setMensaje({ tipo: "", texto: "" }), 6000);
  };

  const handleNuevaAsignacion = () => {
    setResultado(null);
    setMensaje({ tipo: "", texto: "" });
  };

  if (resultado) {
    return (
      <div className="asignar-numeros-container">
        <div className="asignacion-exitosa">
          <div className="exito-header">
            <div className="exito-icon">✅</div>
            <h2>¡Números Asignados Exitosamente!</h2>
          </div>

          <div className="exito-info">
            <div className="exito-seccion">
              <h3>Usuario</h3>
              <p className="exito-dato">{resultado.usuario.nombre_completo}</p>
              <p className="exito-subdato">{resultado.usuario.correo}</p>
              <p className="exito-subdato">Doc: {resultado.usuario.documento}</p>
            </div>

            <div className="exito-seccion">
              <h3>Rifa</h3>
              <p className="exito-dato">{resultado.rifa.titulo}</p>
            </div>

            <div className="exito-seccion">
              <h3>Detalles</h3>
              <p className="exito-dato">Cantidad: {resultado.cantidad_asignada} números</p>
              <p className="exito-dato">Total: ${resultado.valor_total.toLocaleString("es-CO")}</p>
              <p className="exito-subdato">Precio unitario: ${resultado.precio_unitario.toLocaleString("es-CO")}</p>
            </div>
          </div>

          <div className="numeros-asignados-grid">
            <h3>🎯 Números Asignados</h3>
            <div className="numeros-grid">
              {resultado.numeros_asignados.map((numero, index) => (
                <div key={index} className="numero-badge">
                  #{numero}
                </div>
              ))}
            </div>
          </div>

          <div className="exito-referencia">
            <p><strong>Referencia:</strong> {resultado.referencia_transaccion}</p>
            <p><strong>Asignado por:</strong> {resultado.asignado_por}</p>
            <p><strong>Fecha:</strong> {new Date(resultado.fecha_asignacion).toLocaleString("es-CO")}</p>
          </div>

          <div className="exito-nota">
            <p>📧 Se ha enviado un correo electrónico a <strong>{resultado.usuario.correo}</strong> con los detalles de la asignación.</p>
          </div>

          <button 
            onClick={handleNuevaAsignacion}
            className="admin-button"
          >
            Nueva Asignación
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="asignar-numeros-container">
      <div className="admin-form-container">
        <h1 className="admin-form-title">🎯 Asignar Números Manualmente</h1>
        <p className="admin-form-subtitle">
          Asigna números de rifa a un usuario que pagó directamente (efectivo, transferencia, etc.)
        </p>

        {mensaje.texto && (
          <div className={`admin-message ${mensaje.tipo}`}>
            {mensaje.texto}
          </div>
        )}

        <form onSubmit={handleAsignarNumeros} className="admin-form">
          <div className="form-group">
            <label className="admin-label">Rifa *</label>
            <select
              className="admin-input admin-select"
              value={rifaSeleccionada?.id || ""}
              onChange={(e) => {
                const rifa = rifas.find(r => r.id === e.target.value);
                setRifaSeleccionada(rifa);
              }}
              required
            >
              <option value="">Selecciona una rifa...</option>
              {rifas.map((rifa) => (
                <option key={rifa.id} value={rifa.id}>
                  {rifa.titulo} - ${rifa.precio_unitario.toLocaleString("es-CO")} c/u - Disponibles: {rifa.disponibles}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="admin-label">Documento del Usuario *</label>
            <input
              type="text"
              className="admin-input"
              placeholder="Ej: 1234567890"
              value={numeroDocumento}
              onChange={(e) => setNumeroDocumento(e.target.value)}
              required
            />
            <p className="campo-ayuda">El usuario debe estar registrado previamente en el sistema</p>
          </div>

          <div className="form-group">
            <label className="admin-label">Cantidad de Números *</label>
            <input
              type="number"
              className="admin-input"
              placeholder="Ej: 10"
              min="1"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              required
            />
            {rifaSeleccionada && cantidad > 0 && (
              <p className="precio-total">
                Total a cobrar: <strong>${(rifaSeleccionada.precio_unitario * parseInt(cantidad)).toLocaleString("es-CO")}</strong>
              </p>
            )}
          </div>

          <div className="form-group">
            <label className="admin-label">Notas u Observaciones (Opcional)</label>
            <textarea
              className="admin-input admin-textarea"
              placeholder="Ej: Pago recibido en efectivo - Validado por María"
              value={notasAdmin}
              onChange={(e) => setNotasAdmin(e.target.value)}
              rows="3"
            />
          </div>

          <button
            type="submit"
            className="admin-button"
            disabled={loading || !rifaSeleccionada || !numeroDocumento.trim() || !cantidad}
          >
            {loading ? "Asignando Números... 🎲" : "Asignar Números 🎲"}
          </button>
        </form>
      </div>
    </div>
  );
}
