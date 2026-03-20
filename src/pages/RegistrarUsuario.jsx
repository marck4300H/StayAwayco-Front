import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registrarUsuarioManual } from "../api";
import "../styles/registrarUsuario.css";

const TIPOS_DOCUMENTO = ["CC", "CE", "TI", "PA"];

const camposIniciales = {
  nombres: "",
  apellidos: "",
  correo_electronico: "",
  numero_documento: "",
  tipo_documento: "CC",
  telefono: "",
  ciudad: "",
  departamento: "",
  direccion: "",
  enviar_correo: true,
};

export default function RegistrarUsuario() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState(camposIniciales);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resultado, setResultado] = useState(null);
  const [copiado, setCopiado] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResultado(null);
    setLoading(true);

    try {
      const res = await registrarUsuarioManual(form, token);
      if (res.success) {
        setResultado(res.data);
        setForm(camposIniciales);
      } else {
        setError(res.message || "Error al registrar el usuario.");
      }
    } catch {
      setError("Error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  const copiarPassword = () => {
    navigator.clipboard.writeText(resultado.credenciales.password_temporal);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const irAAsignar = () => {
    navigate("/admin/dashboard/asignar-numeros", {
      state: { documento_prellenado: resultado.usuario.numero_documento },
    });
  };

  const registrarOtro = () => {
    setResultado(null);
    setError("");
  };

  // ── PANTALLA DE RESULTADO ──
  if (resultado) {
    const { usuario, correo_enviado, credenciales } = resultado;
    const mostrarPassword = !correo_enviado && credenciales?.password_temporal;

    return (
      <div className="ru-resultado">
        <div className="ru-resultado-icon">✅</div>
        <h2 className="ru-resultado-titulo">Usuario registrado exitosamente</h2>
        <p className="ru-resultado-nombre">
          {usuario.nombres} {usuario.apellidos}
        </p>

        <div className="ru-resultado-datos">
          <div className="ru-dato">
            <span className="ru-dato-label">Correo</span>
            <span className="ru-dato-valor">{usuario.correo_electronico}</span>
          </div>
          <div className="ru-dato">
            <span className="ru-dato-label">Documento</span>
            <span className="ru-dato-valor">
              {usuario.tipo_documento} {usuario.numero_documento}
            </span>
          </div>
          {usuario.telefono && (
            <div className="ru-dato">
              <span className="ru-dato-label">Teléfono</span>
              <span className="ru-dato-valor">{usuario.telefono}</span>
            </div>
          )}
          {usuario.ciudad && (
            <div className="ru-dato">
              <span className="ru-dato-label">Ciudad</span>
              <span className="ru-dato-valor">
                {usuario.ciudad}{usuario.departamento ? `, ${usuario.departamento}` : ""}
              </span>
            </div>
          )}
        </div>

        {correo_enviado && (
          <div className="ru-alerta ru-alerta-ok">
            📧 Se envió un correo de bienvenida con las credenciales al usuario.
          </div>
        )}

        {mostrarPassword && (
          <div className="ru-alerta ru-alerta-warn">
            <p>
              ⚠️ <strong>El correo no pudo enviarse.</strong> Comparte manualmente
              esta contraseña temporal. <strong>No se podrá recuperar después.</strong>
            </p>
            <div className="ru-password-box">
              <code className="ru-password-text">
                {credenciales.password_temporal}
              </code>
              <button className="ru-btn-copiar" onClick={copiarPassword}>
                {copiado ? "✅ Copiado" : "📋 Copiar"}
              </button>
            </div>
          </div>
        )}

        <div className="ru-resultado-acciones">
          <button className="ru-btn-primario" onClick={irAAsignar}>
            🎯 Asignar números a este usuario
          </button>
          <button className="ru-btn-secundario" onClick={registrarOtro}>
            + Registrar otro usuario
          </button>
        </div>
      </div>
    );
  }

  // ── FORMULARIO ──
  return (
    <div className="ru-container">
      <div className="ru-header">
        <h2 className="ru-titulo">📋 Registrar Usuario Manual</h2>
        <p className="ru-subtitulo">
          Para clientes que pagan por WhatsApp o efectivo.
        </p>
      </div>

      {error && <div className="ru-error">{error}</div>}

      <form className="ru-form" onSubmit={handleSubmit}>

        {/* ── OBLIGATORIOS ── */}
        <div className="ru-seccion">
          <h3 className="ru-seccion-titulo">Datos obligatorios</h3>

          <div className="ru-fila-2">
            <div className="ru-campo">
              <label>Nombres *</label>
              <input
                type="text"
                name="nombres"
                value={form.nombres}
                onChange={handleChange}
                placeholder="Ej: Juan Carlos"
                required
              />
            </div>
            <div className="ru-campo">
              <label>Apellidos *</label>
              <input
                type="text"
                name="apellidos"
                value={form.apellidos}
                onChange={handleChange}
                placeholder="Ej: Pérez García"
                required
              />
            </div>
          </div>

          <div className="ru-campo">
            <label>Correo electrónico *</label>
            <input
              type="email"
              name="correo_electronico"
              value={form.correo_electronico}
              onChange={handleChange}
              placeholder="juan@ejemplo.com"
              required
            />
          </div>

          <div className="ru-fila-2">
            <div className="ru-campo">
              <label>Tipo de documento *</label>
              <select
                name="tipo_documento"
                value={form.tipo_documento}
                onChange={handleChange}
                required
              >
                {TIPOS_DOCUMENTO.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="ru-campo">
              <label>Número de documento *</label>
              <input
                type="text"
                name="numero_documento"
                value={form.numero_documento}
                onChange={handleChange}
                placeholder="Ej: 1234567890"
                required
              />
            </div>
          </div>
        </div>

        {/* ── OPCIONALES ── */}
        <div className="ru-seccion ru-seccion-opcional">
          <h3 className="ru-seccion-titulo">Datos opcionales</h3>

          <div className="ru-fila-2">
            <div className="ru-campo">
              <label>Teléfono</label>
              <input
                type="text"
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                placeholder="Ej: 3001234567"
              />
            </div>
            <div className="ru-campo">
              <label>Ciudad</label>
              <input
                type="text"
                name="ciudad"
                value={form.ciudad}
                onChange={handleChange}
                placeholder="Ej: Cali"
              />
            </div>
          </div>

          <div className="ru-fila-2">
            <div className="ru-campo">
              <label>Departamento</label>
              <input
                type="text"
                name="departamento"
                value={form.departamento}
                onChange={handleChange}
                placeholder="Ej: Valle del Cauca"
              />
            </div>
            <div className="ru-campo">
              <label>Dirección</label>
              <input
                type="text"
                name="direccion"
                value={form.direccion}
                onChange={handleChange}
                placeholder="Ej: Calle 5 # 10-20"
              />
            </div>
          </div>
        </div>

        {/* ── TOGGLE CORREO ── */}
        <div className="ru-toggle-row">
          <label className="ru-toggle">
            <input
              type="checkbox"
              name="enviar_correo"
              checked={form.enviar_correo}
              onChange={handleChange}
            />
            <span className="ru-toggle-slider" />
          </label>
          <div className="ru-toggle-info">
            <span className="ru-toggle-label">
              {form.enviar_correo
                ? "📧 Enviar correo de bienvenida al usuario"
                : "📵 No enviar correo (compartir contraseña manualmente)"}
            </span>
            <span className="ru-toggle-hint">
              {form.enviar_correo
                ? "El usuario recibirá su contraseña por correo."
                : "La contraseña temporal se mostrará aquí para compartirla por WhatsApp."}
            </span>
          </div>
        </div>

        <button type="submit" className="ru-btn-submit" disabled={loading}>
          {loading ? "Registrando..." : "Registrar Usuario"}
        </button>
      </form>
    </div>
  );
}
