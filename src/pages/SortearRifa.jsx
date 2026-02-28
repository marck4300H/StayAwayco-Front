import React, { useState, useEffect } from "react";
import { sortearRifa, API_URL } from "../api";
import "../styles/sortearRifa.css";

export default function SortearRifa() {
  const [rifas, setRifas] = useState([]);
  const [rifaSeleccionada, setRifaSeleccionada] = useState(null);
  const [numeroGanador, setNumeroGanador] = useState("");
  const [loteriaReferencia, setLoteriaReferencia] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });
  const [resultado, setResultado] = useState(null);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  useEffect(() => {
    cargarRifas();
  }, []);

  const cargarRifas = async () => {
    try {
      const res = await fetch(`${API_URL}/rifas/`);
      if (!res.ok) throw new Error("Error al obtener las rifas");
      
      const data = await res.json();
      
      if (data.success && data.rifas) {
        // Solo mostrar rifas activas (no sorteadas ni canceladas)
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

  const validarNumeroGanador = (numero, cantidadNumeros) => {
    const numeroInt = parseInt(numero.replace(/\s/g, ""), 10);
    
    if (isNaN(numeroInt)) {
      return { valid: false, error: "El número debe ser un valor numérico" };
    }
    
    if (numeroInt < 0 || numeroInt >= cantidadNumeros) {
      return {
        valid: false,
        error: `El número debe estar entre 0 y ${(cantidadNumeros - 1).toLocaleString("es-CO")}`,
      };
    }
    
    return { valid: true };
  };

  const formatearNumero = (value, cantidadNumeros) => {
    const digitos = (cantidadNumeros - 1).toString().length;
    const cleaned = value.replace(/\D/g, "");
    return cleaned.slice(0, digitos);
  };

  const handleNumeroChange = (e) => {
    if (rifaSeleccionada) {
      const formatted = formatearNumero(e.target.value, rifaSeleccionada.cantidad_numeros);
      setNumeroGanador(formatted);
    }
  };

  const abrirConfirmacion = (e) => {
    e.preventDefault();

    if (!rifaSeleccionada) {
      mostrarMensaje("warning", "Selecciona una rifa");
      return;
    }

    if (!numeroGanador.trim()) {
      mostrarMensaje("warning", "Ingresa el número ganador");
      return;
    }

    const validacion = validarNumeroGanador(numeroGanador, rifaSeleccionada.cantidad_numeros);
    
    if (!validacion.valid) {
      mostrarMensaje("warning", validacion.error);
      return;
    }

    setMostrarConfirmacion(true);
  };

  const handleSortear = async () => {
    setMostrarConfirmacion(false);
    setLoading(true);
    setMensaje({ tipo: "", texto: "" });

    try {
      const token = localStorage.getItem("token");
      const datos = {
        rifa_id: rifaSeleccionada.id,
        numero_ganador: numeroGanador.trim(),
        loteria_referencia: loteriaReferencia.trim() || undefined,
      };

      const res = await sortearRifa(datos, token);

      if (res.success) {
        setResultado(res.data);
        mostrarMensaje("success", res.message);
        setNumeroGanador("");
        setLoteriaReferencia("");
        setRifaSeleccionada(null);
        cargarRifas(); // Recargar rifas para actualizar estados
      } else {
        mostrarMensaje("error", res.message || "Error al sortear la rifa");
      }
    } catch (error) {
      console.error("Error sorteando rifa:", error);
      mostrarMensaje("error", "Error de conexión al sortear la rifa");
    } finally {
      setLoading(false);
    }
  };

  const mostrarMensaje = (tipo, texto) => {
    setMensaje({ tipo, texto });
    setTimeout(() => setMensaje({ tipo: "", texto: "" }), 6000);
  };

  const handleNuevoSorteo = () => {
    setResultado(null);
    setMensaje({ tipo: "", texto: "" });
  };

  // Pantalla de resultado exitoso
  if (resultado) {
    const { ganador, rifa, estadisticas, loteria_referencia } = resultado;

    return (
      <div className="sortear-rifa-container">
        <div className="sorteo-exitoso">
          <div className="exitoso-header">
            <div className="trophy-animation">🏆</div>
            <h2>¡Rifa Sorteada Exitosamente!</h2>
          </div>

          <div className="ganador-section">
            <h3>🎉 Ganador</h3>
            <div className="ganador-card">
              <div className="numero-ganador-grande">#{ganador.numero}</div>
              <p className="ganador-nombre">{ganador.nombre_completo}</p>
              <div className="ganador-detalles">
                <p>📄 {ganador.tipo_documento} {ganador.documento}</p>
                <p>📧 {ganador.correo}</p>
                <p>📱 {ganador.telefono}</p>
                <p>📍 {ganador.ciudad}, {ganador.departamento}</p>
              </div>
            </div>
          </div>

          <div className="rifa-sorteada-info">
            <h3>Información de la Rifa</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Rifa:</span>
                <span className="info-valor">{rifa.titulo}</span>
              </div>
              {loteria_referencia && (
                <div className="info-item">
                  <span className="info-label">Lotería:</span>
                  <span className="info-valor">{loteria_referencia}</span>
                </div>
              )}
              <div className="info-item">
                <span className="info-label">Fecha de sorteo:</span>
                <span className="info-valor">
                  {new Date(rifa.fecha_sorteo).toLocaleString("es-CO")}
                </span>
              </div>
            </div>
          </div>

          <div className="estadisticas-section">
            <h3>📊 Estadísticas</h3>
            <div className="stats-grid">
              <div className="stat-box">
                <div className="stat-icono">👥</div>
                <div className="stat-valor">{estadisticas.total_participantes}</div>
                <div className="stat-label">Participantes</div>
              </div>
              <div className="stat-box">
                <div className="stat-icono">🎟️</div>
                <div className="stat-valor">{estadisticas.total_numeros_vendidos}</div>
                <div className="stat-label">Números Vendidos</div>
              </div>
              <div className="stat-box">
                <div className="stat-icono">📧</div>
                <div className="stat-valor">{estadisticas.correos_pendientes}</div>
                <div className="stat-label">Correos Enviados</div>
              </div>
            </div>
          </div>

          <div className="nota-correos">
            <p>
              📧 Se han enviado correos de notificación a todos los participantes.
              El ganador ha sido notificado con los detalles para reclamar el premio.
            </p>
          </div>

          <button onClick={handleNuevoSorteo} className="admin-button">
            Sortear Otra Rifa
          </button>
        </div>
      </div>
    );
  }

  // Modal de confirmación
  const ModalConfirmacion = () => {
    if (!mostrarConfirmacion) return null;

    return (
      <div className="modal-overlay" onClick={() => setMostrarConfirmacion(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header-warning">
            <h2>⚠️ Confirmar Sorteo</h2>
          </div>
          <div className="modal-body">
            <p><strong>Rifa:</strong> {rifaSeleccionada?.titulo}</p>
            <p><strong>Número Ganador:</strong> #{numeroGanador}</p>
            {loteriaReferencia && (
              <p><strong>Lotería:</strong> {loteriaReferencia}</p>
            )}
            
            <div className="warning-box">
              <p>⚠️ <strong>Esta acción es IRREVERSIBLE</strong></p>
              <ul>
                <li>Se buscará automáticamente al comprador del número</li>
                <li>La rifa se marcará como "Sorteada"</li>
                <li>Se enviarán correos a todos los participantes</li>
                <li>No se podrán comprar más números de esta rifa</li>
              </ul>
            </div>
          </div>
          <div className="modal-footer">
            <button 
              onClick={() => setMostrarConfirmacion(false)}
              className="btn-cancelar-modal"
            >
              Cancelar
            </button>
            <button 
              onClick={handleSortear}
              className="btn-confirmar-sorteo"
            >
              Confirmar Sorteo
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Formulario de sorteo
  return (
    <div className="sortear-rifa-container">
      <div className="admin-form-container">
        <h1 className="admin-form-title">🎲 Sortear Rifa</h1>
        <p className="admin-form-subtitle">
          Ingresa el número ganador basado en la lotería oficial para determinar el ganador de la rifa
        </p>

        {mensaje.texto && (
          <div className={`admin-message ${mensaje.tipo}`}>
            {mensaje.texto}
          </div>
        )}

        <form onSubmit={abrirConfirmacion} className="admin-form">
          <div className="form-group">
            <label className="admin-label">Seleccionar Rifa *</label>
            <select
              className="admin-input admin-select"
              value={rifaSeleccionada?.id || ""}
              onChange={(e) => {
                const rifa = rifas.find((r) => r.id === e.target.value);
                setRifaSeleccionada(rifa);
                setNumeroGanador(""); // Limpiar número al cambiar de rifa
              }}
              required
            >
              <option value="">Selecciona una rifa activa...</option>
              {rifas.map((rifa) => (
                <option key={rifa.id} value={rifa.id}>
                  {rifa.titulo} - {rifa.vendidos} números vendidos
                </option>
              ))}
            </select>
            {rifas.length === 0 && (
              <p className="campo-ayuda error-text">
                No hay rifas activas disponibles para sortear
              </p>
            )}
          </div>

          {rifaSeleccionada && (
            <>
              <div className="rifa-info-box">
                <h4>📋 Información de la Rifa</h4>
                <p><strong>Rango de números:</strong> 0 - {(rifaSeleccionada.cantidad_numeros - 1).toLocaleString("es-CO")}</p>
                <p><strong>Números vendidos:</strong> {rifaSeleccionada.vendidos.toLocaleString("es-CO")}</p>
                <p><strong>Disponibles:</strong> {rifaSeleccionada.disponibles.toLocaleString("es-CO")}</p>
              </div>

              <div className="form-group">
                <label className="admin-label">Número Ganador *</label>
                <input
                  type="text"
                  className="admin-input numero-input"
                  placeholder={rifaSeleccionada.cantidad_numeros === 100000 ? "00000" : "0000"}
                  value={numeroGanador}
                  onChange={handleNumeroChange}
                  maxLength={rifaSeleccionada.cantidad_numeros === 100000 ? 5 : 4}
                  required
                />
                <p className="campo-ayuda">
                  Ingresa el número ganador según la lotería oficial (entre 0 y {(rifaSeleccionada.cantidad_numeros - 1).toLocaleString("es-CO")})
                </p>
              </div>

              <div className="form-group">
                <label className="admin-label">Referencia de Lotería (Opcional)</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="Ej: Lotería de Bogotá - 27 de Febrero 2026"
                  value={loteriaReferencia}
                  onChange={(e) => setLoteriaReferencia(e.target.value)}
                />
                <p className="campo-ayuda">
                  Nombre y fecha de la lotería de referencia (opcional pero recomendado)
                </p>
              </div>
            </>
          )}

          <button
            type="submit"
            className="admin-button btn-sortear"
            disabled={loading || !rifaSeleccionada || !numeroGanador.trim()}
          >
            {loading ? "Sorteando... 🎲" : "Sortear Rifa 🎲"}
          </button>
        </form>
      </div>

      <ModalConfirmacion />
    </div>
  );
}
