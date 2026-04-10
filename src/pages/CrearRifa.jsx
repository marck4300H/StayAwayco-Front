import React, { useState } from "react";
import { API_URL } from "../api";
import "../styles/admin.css";

const ESTADO_OPCIONES = ["activa", "inactiva", "finalizada"];
const TIPO_DOC_OPCIONES = ["CC", "CE", "TI", "PA", "NIT"];

const estadoInicial = {
  // Básicos
  titulo: "",
  descripcion: "",
  cantidadNumeros: "100000",
  precioUnitario: "1000",
  cantidadMinima: "5",
  fechaSorteo: "",
  estado: "activa",

  // Imágenes
  imagen: null,
  imagenBoleta: null,

  // Sorteo
  loteriaReferencia: "",
  valorPremios: "",
  descripcionPremios: "",
  esPagaderoPortador: false,

  // Coljuegos
  numeroResolucion: "",
  fechaAutorizacion: "",
  terminoCaducidad: "",
  responsableNombre: "",
  responsableId: "",
  responsableDomicilio: "",
};

export default function CrearRifa() {
  const [form, setForm] = useState(estadoInicial);
  const [usarPromociones, setUsarPromociones] = useState(false);
  const [paquetes, setPaquetes] = useState([
    { cantidad_compra: "", numeros_gratis: "" },
    { cantidad_compra: "", numeros_gratis: "" },
    { cantidad_compra: "", numeros_gratis: "" },
  ]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);



  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    } else if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
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
    setMessage("");

    if (!form.imagen) {
      setMessage("⚠️ Selecciona una imagen de portada.");
      return;
    }

    if (form.fechaSorteo) {
      if (new Date(form.fechaSorteo) <= new Date()) {
        setMessage("❌ La fecha del sorteo debe ser una fecha futura.");
        return;
      }
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("❌ No hay sesión activa.");
        return;
      }

      const formData = new FormData();

      // Básicos
      formData.append("titulo", form.titulo);
      formData.append("descripcion", form.descripcion);
      formData.append("cantidad_numeros", form.cantidadNumeros);
      formData.append("precio_unitario", form.precioUnitario);
      formData.append("cantidad_minima", form.cantidadMinima);
      formData.append("estado", form.estado);
      formData.append("imagen_url", form.imagen);

      if (form.imagenBoleta) {
        formData.append("imagen_boleta_url", form.imagenBoleta);
      }
      if (form.fechaSorteo) {
        // Enviar el valor del input datetime-local directamente (ej: "2026-05-20T20:00")
        // El backend lo interpretará como hora colombiana (UTC-5)
        formData.append("fecha_sorteo", form.fechaSorteo);
      }

      // Sorteo
      if (form.loteriaReferencia) formData.append("loteria_referencia", form.loteriaReferencia);
      if (form.valorPremios) formData.append("valor_premios", form.valorPremios);
      if (form.descripcionPremios) formData.append("descripcion_premios", form.descripcionPremios);
      formData.append("es_pagadero_portador", form.esPagaderoPortador);

      // Coljuegos
      if (form.numeroResolucion) formData.append("numero_resolucion", form.numeroResolucion);
      if (form.fechaAutorizacion) formData.append("fecha_autorizacion", form.fechaAutorizacion);
      if (form.terminoCaducidad) formData.append("termino_caducidad", form.terminoCaducidad);
      if (form.responsableNombre) formData.append("responsable_nombre", form.responsableNombre);
      if (form.responsableId) formData.append("responsable_id", form.responsableId);
      if (form.responsableDomicilio) formData.append("responsable_domicilio", form.responsableDomicilio);

      // Paquetes promocionales
      if (usarPromociones) {
        const paquetesPromocion = {};
        paquetes.forEach((p, i) => {
          const c = parseInt(p.cantidad_compra);
          const g = parseInt(p.numeros_gratis);
          if (c > 0 && g > 0) {
            paquetesPromocion[`paquete${i + 1}`] = { cantidad_compra: c, numeros_gratis: g };
          }
        });
        if (Object.keys(paquetesPromocion).length > 0) {
          formData.append("paquetes_promocion", JSON.stringify(paquetesPromocion));
        }
      }

      const res = await fetch(`${API_URL}/rifas/crear`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(`❌ ${data.message || `Error ${res.status}: No se pudo crear la rifa`}`);
        if (res.status === 401) localStorage.removeItem("token");
        return;
      }

      if (data.success) {
        setMessage("✅ Rifa creada con éxito");
        setForm(estadoInicial);
        setUsarPromociones(false);
        setPaquetes([
          { cantidad_compra: "", numeros_gratis: "" },
          { cantidad_compra: "", numeros_gratis: "" },
          { cantidad_compra: "", numeros_gratis: "" },
        ]);
        // Limpiar inputs de archivo
        document.querySelectorAll('input[type="file"]').forEach((el) => (el.value = ""));
      } else {
        setMessage(`❌ Error: ${data.message || "No se pudo crear la rifa"}`);
      }
    } catch (err) {
      console.error("❌ Error de conexión:", err);
      setMessage("❌ Error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-form-container">
      <h1 className="admin-form-title">🎟️ Crear Rifa</h1>
      <p className="admin-form-subtitle">
        Crea una nueva rifa con todos los detalles necesarios para que los usuarios puedan participar.
      </p>

      <form onSubmit={handleSubmit} className="admin-form">

        {/* ── SECCIÓN 1: DATOS BÁSICOS ── */}
        <div className="admin-seccion">
          <h3 className="admin-seccion-titulo">📋 Datos Básicos</h3>

          <label className="admin-label">Título de la rifa *</label>
          <input
            type="text"
            name="titulo"
            placeholder="Ej: Kawasaki Z1000 Edition 2026"
            value={form.titulo}
            onChange={handleChange}
            required
            className="admin-input"
          />

          <label className="admin-label">Descripción *</label>
          <textarea
            name="descripcion"
            placeholder="Describe los detalles de la rifa, premios, condiciones, etc."
            value={form.descripcion}
            onChange={handleChange}
            required
            className="admin-input admin-textarea"
          />

          <div className="admin-fila-2">
            <div>
              <label className="admin-label">Cantidad de números *</label>
              <select
                name="cantidadNumeros"
                value={form.cantidadNumeros}
                onChange={handleChange}
                className="admin-input admin-select"
              >
                <option value="10000">10.000 números (0–9999)</option>
                <option value="100000">100.000 números (0–99999)</option>
              </select>
            </div>
            <div>
              <label className="admin-label">Estado</label>
              <select
                name="estado"
                value={form.estado}
                onChange={handleChange}
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
              <label className="admin-label">Precio unitario (COP) *</label>
              <input
                type="number"
                name="precioUnitario"
                placeholder="1000"
                value={form.precioUnitario}
                onChange={handleChange}
                min="100"
                required
                className="admin-input"
              />
            </div>
            <div>
              <label className="admin-label">Cantidad mínima de compra *</label>
              <input
                type="number"
                name="cantidadMinima"
                placeholder="5"
                value={form.cantidadMinima}
                onChange={handleChange}
                min="1"
                required
                className="admin-input"
              />
            </div>
          </div>

          <div className="admin-fecha-section">
            <label className="admin-label">📅 Fecha y Hora del Sorteo (Opcional)</label>
            <input
              type="datetime-local"
              name="fechaSorteo"
              value={form.fechaSorteo}
              onChange={handleChange}
              min={new Date(Date.now() + 60000).toISOString().slice(0, 16)}
              className="admin-input"
            />
            <p className="admin-help-text">
              Si no defines una fecha, la rifa quedará sin fecha programada.
            </p>
            {form.fechaSorteo && (
              <p className="admin-fecha-preview">
                📅 Sorteo programado para:{" "}
                <strong>
                  {new Date(form.fechaSorteo).toLocaleString("es-CO", {
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
          </div>
        </div>

        {/* ── SECCIÓN 2: IMÁGENES ── */}
        <div className="admin-seccion">
          <h3 className="admin-seccion-titulo">🖼️ Imágenes</h3>

          <label className="admin-label">Imagen de portada *</label>
          <input
            type="file"
            name="imagen"
            accept="image/*"
            onChange={handleChange}
            required
            className="admin-input admin-file-input"
          />
          <p className="admin-help-text">Imagen principal que verán los usuarios en la lista de rifas.</p>

          <label className="admin-label">Imagen de boleto (para fondo del PDF) <span className="admin-opcional">(Opcional)</span></label>
          <input
            type="file"
            name="imagenBoleta"
            accept="image/*"
            onChange={handleChange}
            className="admin-input admin-file-input"
          />
          <p className="admin-help-text">
            Se imprime de fondo en cada boleto del PDF. Si no se sube, el boleto se genera con fondo blanco.
          </p>
        </div>

        {/* ── SECCIÓN 3: INFORMACIÓN DEL SORTEO ── */}
        <div className="admin-seccion">
          <h3 className="admin-seccion-titulo">🎰 Información del Sorteo</h3>

          <div className="admin-fila-2">
            <div>
              <label className="admin-label">Lotería de referencia</label>
              <input
                type="text"
                name="loteriaReferencia"
                placeholder="Ej: Lotería de Bogotá"
                value={form.loteriaReferencia}
                onChange={handleChange}
                className="admin-input"
              />
            </div>
            <div>
              <label className="admin-label">Valor total de premios (COP)</label>
              <input
                type="number"
                name="valorPremios"
                placeholder="Ej: 15000000"
                value={form.valorPremios}
                onChange={handleChange}
                min="0"
                className="admin-input"
              />
            </div>
          </div>

          <label className="admin-label">Descripción de los premios</label>
          <textarea
            name="descripcionPremios"
            placeholder="Ej: Moto AKT 125cc + $5,000,000 en efectivo"
            value={form.descripcionPremios}
            onChange={handleChange}
            className="admin-input admin-textarea"
            rows="2"
          />

          <label className="admin-toggle-label">
            <input
              type="checkbox"
              name="esPagaderoPortador"
              checked={form.esPagaderoPortador}
              onChange={handleChange}
              className="admin-checkbox"
            />
            Premio pagadero al portador del boleto físico
          </label>
        </div>

        {/* ── SECCIÓN 4: DATOS COLJUEGOS ── */}
        <div className="admin-seccion admin-seccion-legal">
          <h3 className="admin-seccion-titulo">⚖️ Información Legal Coljuegos</h3>
          <p className="admin-help-text" style={{ marginBottom: "14px" }}>
            Requerida para el pie del boleto impreso. Se puede completar después editando la rifa.
          </p>

          <div className="admin-fila-2">
            <div>
              <label className="admin-label">Número de resolución</label>
              <input
                type="text"
                name="numeroResolucion"
                placeholder="Ej: 2024-COL-001"
                value={form.numeroResolucion}
                onChange={handleChange}
                className="admin-input"
              />
            </div>
            <div>
              <label className="admin-label">Fecha de autorización</label>
              <input
                type="date"
                name="fechaAutorizacion"
                value={form.fechaAutorizacion}
                onChange={handleChange}
                className="admin-input"
              />
            </div>
          </div>

          <label className="admin-label">Término de caducidad del premio</label>
          <input
            type="text"
            name="terminoCaducidad"
            placeholder="Ej: 30 días hábiles"
            value={form.terminoCaducidad}
            onChange={handleChange}
            className="admin-input"
          />

          <div className="admin-fila-2">
            <div>
              <label className="admin-label">Nombre del responsable</label>
              <input
                type="text"
                name="responsableNombre"
                placeholder="Ej: Carlos López"
                value={form.responsableNombre}
                onChange={handleChange}
                className="admin-input"
              />
            </div>
            <div>
              <label className="admin-label">NIT o cédula del responsable</label>
              <input
                type="text"
                name="responsableId"
                placeholder="Ej: 80123456"
                value={form.responsableId}
                onChange={handleChange}
                className="admin-input"
              />
            </div>
          </div>

          <label className="admin-label">Domicilio del responsable</label>
          <input
            type="text"
            name="responsableDomicilio"
            placeholder="Ej: Cra 10 #20-30, Bogotá"
            value={form.responsableDomicilio}
            onChange={handleChange}
            className="admin-input"
          />
        </div>

        {/* ── SECCIÓN 5: PAQUETES PROMOCIONALES ── */}
        <div className="admin-promociones-section">
          <div className="admin-promociones-header">
            <label className="admin-label">
              <input
                type="checkbox"
                checked={usarPromociones}
                onChange={(e) => setUsarPromociones(e.target.checked)}
                className="admin-checkbox"
              />
              🎁 Activar Paquetes Promocionales (Opcional)
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
          {loading ? "🔄 Creando Rifa..." : "🎯 Crear Rifa"}
        </button>
      </form>

      {message && (
        <div className={`admin-message ${message.includes("✅") ? "success" : "error"}`}>
          {message}
        </div>
      )}
    </div>
  );
}