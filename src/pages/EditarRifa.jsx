import React, { useState, useEffect } from "react";
import { API_URL } from "../api";
import "../styles/admin.css";

const ESTADO_OPCIONES = ["activa", "inactiva", "finalizada"];

export default function EditarRifa() {
  const [rifas, setRifas] = useState([]);
  const [selectedRifa, setSelectedRifa] = useState(null);

  // Básicos
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [cantidadNumeros, setCantidadNumeros] = useState(0);
  const [precioUnitario, setPrecioUnitario] = useState("1000");
  const [cantidadMinima, setCantidadMinima] = useState("5");
  const [estado, setEstado] = useState("activa");
  const [fechaSorteo, setFechaSorteo] = useState("");
  const [borrarFecha, setBorrarFecha] = useState(false);

  // Imágenes
  const [imagen, setImagen] = useState(null);
  const [imagenBoleta, setImagenBoleta] = useState(null);

  // Sorteo
  const [loteriaReferencia, setLoteriaReferencia] = useState("");
  const [valorPremios, setValorPremios] = useState("");
  const [descripcionPremios, setDescripcionPremios] = useState("");
  const [esPagaderoPortador, setEsPagaderoPortador] = useState(false);

  // Coljuegos
  const [numeroResolucion, setNumeroResolucion] = useState("");
  const [fechaAutorizacion, setFechaAutorizacion] = useState("");
  const [terminoCaducidad, setTerminoCaducidad] = useState("");
  const [responsableNombre, setResponsableNombre] = useState("");
  const [responsableId, setResponsableId] = useState("");
  const [responsableDomicilio, setResponsableDomicilio] = useState("");

  // Paquetes
  const [usarPromociones, setUsarPromociones] = useState(false);
  const [paquetes, setPaquetes] = useState([
    { cantidad_compra: "", numeros_gratis: "" },
    { cantidad_compra: "", numeros_gratis: "" },
    { cantidad_compra: "", numeros_gratis: "" },
  ]);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchRifas();
  }, []);

  const fetchRifas = async () => {
    try {
      const res = await fetch(`${API_URL}/rifas/`);
      const data = await res.json();
      if (data.success) {
        setRifas(data.rifas);
      } else {
        setMessage("❌ Error al cargar las rifas");
      }
    } catch (err) {
      console.error("Error cargando rifas:", err);
      setMessage("❌ Error de conexión al cargar rifas");
    }
  };

  // Convierte un ISO del backend a formato YYYY-MM-DDTHH:mm en hora colombiana
  // para que el input datetime-local lo muestre correctamente
  const isoToLocal = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    // Convertir a string en zona Colombia y luego extraer los componentes
    const partes = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Bogota",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).formatToParts(date);
    const get = (type) => partes.find((p) => p.type === type)?.value || "00";
    return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
  };

  const isoToDate = (isoString) => {
    if (!isoString) return "";
    return isoString.split("T")[0].split(" ")[0];
  };

  const handleSelect = (rifa) => {
    setSelectedRifa(rifa);
    setMessage("");
    setBorrarFecha(false);
    setImagen(null);
    setImagenBoleta(null);

    // Básicos
    setTitulo(rifa.titulo || "");
    setDescripcion(rifa.descripcion || "");
    setCantidadNumeros(rifa.cantidad_numeros || 0);
    setPrecioUnitario(rifa.precio_unitario?.toString() || "1000");
    setCantidadMinima(rifa.cantidad_minima?.toString() || "5");
    setEstado(rifa.estado || "activa");
    setFechaSorteo(rifa.fecha_sorteo ? isoToLocal(rifa.fecha_sorteo) : "");

    // Sorteo
    setLoteriaReferencia(rifa.loteria_referencia || "");
    setValorPremios(rifa.valor_premios?.toString() || "");
    setDescripcionPremios(rifa.descripcion_premios || "");
    setEsPagaderoPortador(rifa.es_pagadero_portador || false);

    // Coljuegos
    setNumeroResolucion(rifa.numero_resolucion || "");
    setFechaAutorizacion(isoToDate(rifa.fecha_autorizacion) || "");
    setTerminoCaducidad(rifa.termino_caducidad || "");
    setResponsableNombre(rifa.responsable_nombre || "");
    setResponsableId(rifa.responsable_id || "");
    setResponsableDomicilio(rifa.responsable_domicilio || "");

    // Paquetes
    if (rifa.paquetes_promocion) {
      setUsarPromociones(true);
      setPaquetes([
        {
          cantidad_compra: rifa.paquetes_promocion.paquete1?.cantidad_compra?.toString() || "",
          numeros_gratis: rifa.paquetes_promocion.paquete1?.numeros_gratis?.toString() || "",
        },
        {
          cantidad_compra: rifa.paquetes_promocion.paquete2?.cantidad_compra?.toString() || "",
          numeros_gratis: rifa.paquetes_promocion.paquete2?.numeros_gratis?.toString() || "",
        },
        {
          cantidad_compra: rifa.paquetes_promocion.paquete3?.cantidad_compra?.toString() || "",
          numeros_gratis: rifa.paquetes_promocion.paquete3?.numeros_gratis?.toString() || "",
        },
      ]);
    } else {
      setUsarPromociones(false);
      setPaquetes([
        { cantidad_compra: "", numeros_gratis: "" },
        { cantidad_compra: "", numeros_gratis: "" },
        { cantidad_compra: "", numeros_gratis: "" },
      ]);
    }

    document.querySelectorAll('input[type="file"]').forEach((el) => (el.value = ""));
  };

  const handlePaquete = (index, field, value) => {
    setPaquetes((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRifa) return;
    setMessage("");

    if (fechaSorteo && !borrarFecha) {
      if (new Date(fechaSorteo) <= new Date()) {
        setMessage("❌ La fecha del sorteo debe ser una fecha futura.");
        return;
      }
    }

    setLoading(true);

    try {
      const formData = new FormData();

      // Básicos
      formData.append("titulo", titulo);
      formData.append("descripcion", descripcion);
      formData.append("cantidad_numeros", cantidadNumeros.toString());
      formData.append("precio_unitario", precioUnitario);
      formData.append("cantidad_minima", cantidadMinima);
      formData.append("estado", estado);

      if (imagen) formData.append("imagen_url", imagen);
      if (imagenBoleta) formData.append("imagen_boleta_url", imagenBoleta);

      // Fecha sorteo
      if (borrarFecha) {
        formData.append("fecha_sorteo", "null");
      } else if (fechaSorteo) {
        // Enviar el valor del input datetime-local directamente (ej: "2026-05-20T20:00")
        // El backend lo interpretará como hora colombiana (UTC-5)
        formData.append("fecha_sorteo", fechaSorteo);
      }

      // Sorteo
      formData.append("loteria_referencia", loteriaReferencia || "");
      if (valorPremios) formData.append("valor_premios", valorPremios);
      formData.append("descripcion_premios", descripcionPremios || "");
      formData.append("es_pagadero_portador", esPagaderoPortador);

      // Coljuegos
      formData.append("numero_resolucion", numeroResolucion || "");
      formData.append("fecha_autorizacion", fechaAutorizacion || "");
      formData.append("termino_caducidad", terminoCaducidad || "");
      formData.append("responsable_nombre", responsableNombre || "");
      formData.append("responsable_id", responsableId || "");
      formData.append("responsable_domicilio", responsableDomicilio || "");

      // Paquetes
      if (usarPromociones) {
        const paquetesPromocion = {};
        paquetes.forEach((p, i) => {
          const c = parseInt(p.cantidad_compra);
          const g = parseInt(p.numeros_gratis);
          if (c > 0 && g > 0) {
            paquetesPromocion[`paquete${i + 1}`] = { cantidad_compra: c, numeros_gratis: g };
          }
        });
        formData.append(
          "paquetes_promocion",
          Object.keys(paquetesPromocion).length > 0
            ? JSON.stringify(paquetesPromocion)
            : "null"
        );
      } else {
        formData.append("paquetes_promocion", "null");
      }

      const res = await fetch(`${API_URL}/rifas/editar/${selectedRifa.id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(`❌ ${data.message || `Error ${res.status}`}`);
        if (res.status === 401) localStorage.removeItem("token");
        return;
      }

      if (data.success) {
        setMessage("✅ Rifa editada con éxito");
        setSelectedRifa(data.rifa);
        setBorrarFecha(false);
        fetchRifas();
      } else {
        setMessage("❌ " + (data.message || "Error al editar rifa"));
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-sidebar-layout">
      {/* ── SIDEBAR ── */}
      <div className="admin-sidebar">
        <h2 className="admin-sidebar-title">Rifas Disponibles</h2>
        {rifas.map((rifa) => (
          <div
            key={rifa.id}
            className={`admin-rifa-item ${selectedRifa?.id === rifa.id ? "selected" : ""}`}
            onClick={() => handleSelect(rifa)}
          >
            <div className="admin-rifa-title">{rifa.titulo}</div>
            <div className="admin-rifa-stats">
              <span>🎯 {rifa.cantidad_numeros} nums</span>
              <span>💰 ${rifa.precio_unitario || 1000}</span>
              <span>📊 {rifa.porcentaje}%</span>
              {rifa.fecha_sorteo && <span>📅 Con fecha</span>}
              {rifa.paquetes_promocion && <span>🎁 Promo</span>}
              {rifa.numero_resolucion && <span>⚖️ Coljuegos</span>}
            </div>
          </div>
        ))}
      </div>

      {/* ── CONTENIDO PRINCIPAL ── */}
      <div className="admin-main-content">
        {selectedRifa ? (
          <>
            <h1 className="admin-form-title">✏️ Editar Rifa</h1>

            <form onSubmit={handleSubmit} className="admin-form">

              {/* ── BÁSICOS ── */}
              <div className="admin-seccion">
                <h3 className="admin-seccion-titulo">📋 Datos Básicos</h3>

                <label className="admin-label">Título</label>
                <input
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  required
                  className="admin-input"
                />

                <label className="admin-label">Descripción</label>
                <textarea
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  required
                  className="admin-input admin-textarea"
                />

                <div className="admin-fila-2">
                  <div>
                    <label className="admin-label">Cantidad de números (solo lectura)</label>
                    <input
                      type="number"
                      value={cantidadNumeros}
                      readOnly
                      className="admin-input"
                      style={{ backgroundColor: "#f8f9fa", color: "#6c757d", cursor: "not-allowed" }}
                    />
                  </div>
                  <div>
                    <label className="admin-label">Estado</label>
                    <select
                      value={estado}
                      onChange={(e) => setEstado(e.target.value)}
                      className="admin-input admin-select"
                    >
                      {ESTADO_OPCIONES.map((e) => (
                        <option key={e} value={e}>
                          {e.charAt(0).toUpperCase() + e.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="admin-fila-2">
                  <div>
                    <label className="admin-label">Precio Unitario (COP)</label>
                    <input
                      type="number"
                      value={precioUnitario}
                      onChange={(e) => setPrecioUnitario(e.target.value)}
                      min="100"
                      required
                      className="admin-input"
                    />
                  </div>
                  <div>
                    <label className="admin-label">Cantidad Mínima</label>
                    <input
                      type="number"
                      value={cantidadMinima}
                      onChange={(e) => setCantidadMinima(e.target.value)}
                      min="1"
                      required
                      className="admin-input"
                    />
                  </div>
                </div>

                {/* Fecha sorteo */}
                <div className="admin-fecha-section">
                  <label className="admin-label">📅 Fecha y Hora del Sorteo (Opcional)</label>
                  {!borrarFecha ? (
                    <>
                      <input
                        type="datetime-local"
                        value={fechaSorteo}
                        onChange={(e) => setFechaSorteo(e.target.value)}
                        min={new Date(Date.now() + 60000).toISOString().slice(0, 16)}
                        className="admin-input"
                      />
                      {fechaSorteo && (
                        <p className="admin-fecha-preview">
                          📅 Sorteo programado para:{" "}
                          <strong>
                            {new Date(fechaSorteo).toLocaleString("es-CO", {
                              timeZone: "America/Bogota",
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </strong>
                        </p>
                      )}
                      {selectedRifa.fecha_sorteo && (
                        <button
                          type="button"
                          className="admin-btn-borrar-fecha"
                          onClick={() => { setBorrarFecha(true); setFechaSorteo(""); }}
                        >
                          🗑️ Eliminar fecha del sorteo
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="admin-fecha-borrar-aviso">
                      <p>⚠️ La fecha del sorteo será eliminada al guardar.</p>
                      <button
                        type="button"
                        className="admin-btn-cancelar-borrado"
                        onClick={() => {
                          setBorrarFecha(false);
                          setFechaSorteo(isoToLocal(selectedRifa.fecha_sorteo));
                        }}
                      >
                        ↩️ Cancelar eliminación
                      </button>
                    </div>
                  )}
                  <p className="admin-help-text">
                    Si no modificas este campo, la fecha actual se conserva.
                  </p>
                </div>
              </div>

              {/* ── IMÁGENES ── */}
              <div className="admin-seccion">
                <h3 className="admin-seccion-titulo">🖼️ Imágenes</h3>

                {selectedRifa.imagen_url && (
                  <div className="admin-imagen-actual">
                    <p className="admin-help-text">Imagen de portada actual:</p>
                    <img
                      src={selectedRifa.imagen_url}
                      alt="Portada actual"
                      className="admin-imagen-preview"
                    />
                  </div>
                )}
                <label className="admin-label">Nueva imagen de portada <span className="admin-opcional">(Opcional)</span></label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImagen(e.target.files[0])}
                  className="admin-input admin-file-input"
                />

                {selectedRifa.imagen_boleta_url && (
                  <div className="admin-imagen-actual">
                    <p className="admin-help-text">Imagen de boleto actual:</p>
                    <img
                      src={selectedRifa.imagen_boleta_url}
                      alt="Boleto actual"
                      className="admin-imagen-preview"
                    />
                  </div>
                )}
                <label className="admin-label">
                  Nueva imagen de boleto (fondo PDF) <span className="admin-opcional">(Opcional)</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImagenBoleta(e.target.files[0])}
                  className="admin-input admin-file-input"
                />
                <p className="admin-help-text">
                  Se imprime de fondo en cada boleto del PDF. Si no se cambia, se conserva la actual.
                </p>
              </div>

              {/* ── SORTEO ── */}
              <div className="admin-seccion">
                <h3 className="admin-seccion-titulo">🎰 Información del Sorteo</h3>

                <div className="admin-fila-2">
                  <div>
                    <label className="admin-label">Lotería de referencia</label>
                    <input
                      type="text"
                      placeholder="Ej: Lotería de Bogotá"
                      value={loteriaReferencia}
                      onChange={(e) => setLoteriaReferencia(e.target.value)}
                      className="admin-input"
                    />
                  </div>
                  <div>
                    <label className="admin-label">Valor total de premios (COP)</label>
                    <input
                      type="number"
                      placeholder="Ej: 15000000"
                      value={valorPremios}
                      onChange={(e) => setValorPremios(e.target.value)}
                      min="0"
                      className="admin-input"
                    />
                  </div>
                </div>

                <label className="admin-label">Descripción de los premios</label>
                <textarea
                  placeholder="Ej: Moto AKT 125cc + $5,000,000 en efectivo"
                  value={descripcionPremios}
                  onChange={(e) => setDescripcionPremios(e.target.value)}
                  className="admin-input admin-textarea"
                  rows="2"
                />

                <label className="admin-toggle-label">
                  <input
                    type="checkbox"
                    checked={esPagaderoPortador}
                    onChange={(e) => setEsPagaderoPortador(e.target.checked)}
                    className="admin-checkbox"
                  />
                  Premio pagadero al portador del boleto físico
                </label>
              </div>

              {/* ── COLJUEGOS ── */}
              <div className="admin-seccion admin-seccion-legal">
                <h3 className="admin-seccion-titulo">⚖️ Información Legal Coljuegos</h3>

                <div className="admin-fila-2">
                  <div>
                    <label className="admin-label">Número de resolución</label>
                    <input
                      type="text"
                      placeholder="Ej: 2024-COL-001"
                      value={numeroResolucion}
                      onChange={(e) => setNumeroResolucion(e.target.value)}
                      className="admin-input"
                    />
                  </div>
                  <div>
                    <label className="admin-label">Fecha de autorización</label>
                    <input
                      type="date"
                      value={fechaAutorizacion}
                      onChange={(e) => setFechaAutorizacion(e.target.value)}
                      className="admin-input"
                    />
                  </div>
                </div>

                <label className="admin-label">Término de caducidad</label>
                <input
                  type="text"
                  placeholder="Ej: 30 días hábiles"
                  value={terminoCaducidad}
                  onChange={(e) => setTerminoCaducidad(e.target.value)}
                  className="admin-input"
                />

                <div className="admin-fila-2">
                  <div>
                    <label className="admin-label">Nombre del responsable</label>
                    <input
                      type="text"
                      placeholder="Ej: Carlos López"
                      value={responsableNombre}
                      onChange={(e) => setResponsableNombre(e.target.value)}
                      className="admin-input"
                    />
                  </div>
                  <div>
                    <label className="admin-label">NIT o cédula del responsable</label>
                    <input
                      type="text"
                      placeholder="Ej: 80123456"
                      value={responsableId}
                      onChange={(e) => setResponsableId(e.target.value)}
                      className="admin-input"
                    />
                  </div>
                </div>

                <label className="admin-label">Domicilio del responsable</label>
                <input
                  type="text"
                  placeholder="Ej: Cra 10 #20-30, Bogotá"
                  value={responsableDomicilio}
                  onChange={(e) => setResponsableDomicilio(e.target.value)}
                  className="admin-input"
                />
              </div>

              {/* ── PAQUETES PROMOCIONALES ── */}
              <div className="admin-promociones-section">
                <div className="admin-promociones-header">
                  <label className="admin-label">
                    <input
                      type="checkbox"
                      checked={usarPromociones}
                      onChange={(e) => setUsarPromociones(e.target.checked)}
                      className="admin-checkbox"
                    />
                    🎁 Activar Paquetes Promocionales
                  </label>
                  <p className="admin-help-text">
                    Configura promociones para incentivar compras. Ej: "Compra 15 y obtén 1 gratis"
                  </p>
                </div>

                {usarPromociones && (
                  <div className="admin-paquetes-grid">
                    {paquetes.map((p, i) => (
                      <div key={i} className="admin-paquete-box">
                        <h4>📦 Paquete {i + 1}</h4>
                        <div className="admin-paquete-inputs">
                          <div className="admin-input-group">
                            <label>Cantidad de compra</label>
                            <input
                              type="number"
                              placeholder={String(15 + i * 10)}
                              value={p.cantidad_compra}
                              onChange={(e) => handlePaquete(i, "cantidad_compra", e.target.value)}
                              min="1"
                              className="admin-input-small"
                            />
                          </div>
                          <div className="admin-input-group">
                            <label>Números gratis</label>
                            <input
                              type="number"
                              placeholder={String(i + 1)}
                              value={p.numeros_gratis}
                              onChange={(e) => handlePaquete(i, "numeros_gratis", e.target.value)}
                              min="1"
                              className="admin-input-small"
                            />
                          </div>
                        </div>
                        {p.cantidad_compra && p.numeros_gratis && (
                          <p className="admin-paquete-preview">
                            Compra {p.cantidad_compra} → Obtén {p.numeros_gratis} gratis
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button type="submit" disabled={loading} className="admin-button">
                {loading ? "🔄 Guardando..." : "💾 Guardar Cambios"}
              </button>
            </form>

            {message && (
              <div className={`admin-message ${message.includes("✅") ? "success" : "error"}`}>
                {message}
              </div>
            )}
          </>
        ) : (
          <div className="admin-placeholder">
            <h2>Selecciona una rifa para editar</h2>
            <p>Elige una rifa del panel lateral para comenzar a editarla</p>
          </div>
        )}
      </div>
    </div>
  );
}