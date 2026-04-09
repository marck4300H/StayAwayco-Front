import React, { useState } from "react";
import "../styles/registro.css";
import { API_URL } from "../api";

const Registro = () => {
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    correo_electronico: "",
    telefono: "",
    password: "",
    confirmarPassword: "",
  });

  const [verPassword, setVerPassword] = useState(false);
  const [verConfirmar, setVerConfirmar] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { password, confirmarPassword } = formData;

    if (password !== confirmarPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/usuarios/registrar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombres: formData.nombres,
          apellidos: formData.apellidos,
          correo_electronico: formData.correo_electronico,
          telefono: formData.telefono,
          password: formData.password,
        }),
      });

      const data = await res.json();
      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userType", "user");
        alert("¡Registro exitoso! Has sido logueado automáticamente.");
        window.location.href = "/";
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error al registrar usuario.");
    }
  };

  // SVG ojito abierto
  const IconoOjoAbierto = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );

  // SVG ojito tachado
  const IconoOjoCerrado = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Crear Cuenta</h2>
        <p className="register-subtitle">Solo necesitamos unos datos básicos para empezar</p>

        <form className="register-form" onSubmit={handleSubmit}>

          <div className="register-field">
            <label>Nombre *</label>
            <input
              type="text"
              name="nombres"
              placeholder="Ingresa tu nombre"
              value={formData.nombres}
              onChange={handleChange}
              required
            />
          </div>

          <div className="register-field">
            <label>Apellido *</label>
            <input
              type="text"
              name="apellidos"
              placeholder="Ingresa tu apellido"
              value={formData.apellidos}
              onChange={handleChange}
              required
            />
          </div>

          <div className="register-field">
            <label>Correo electrónico *</label>
            <input
              type="email"
              name="correo_electronico"
              placeholder="Ingresa tu correo"
              value={formData.correo_electronico}
              onChange={handleChange}
              required
            />
          </div>

          <div className="register-field">
            <label>Teléfono</label>
            <input
              type="text"
              name="telefono"
              placeholder="Ingresa tu número de teléfono (opcional)"
              value={formData.telefono}
              onChange={handleChange}
            />
          </div>

          {/* ── Contraseña ── */}
          <div className="register-field">
            <label>Contraseña *</label>
            <div className="register-password-wrapper">
              <input
                type={verPassword ? "text" : "password"}
                name="password"
                placeholder="Crea una contraseña"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="register-eye-btn"
                onClick={() => setVerPassword((prev) => !prev)}
                tabIndex={-1}
                aria-label={verPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {verPassword ? <IconoOjoAbierto /> : <IconoOjoCerrado />}
              </button>
            </div>
          </div>

          {/* ── Confirmar contraseña ── */}
          <div className="register-field">
            <label>Confirmar Contraseña *</label>
            <div className="register-password-wrapper">
              <input
                type={verConfirmar ? "text" : "password"}
                name="confirmarPassword"
                placeholder="Confirma tu contraseña"
                value={formData.confirmarPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="register-eye-btn"
                onClick={() => setVerConfirmar((prev) => !prev)}
                tabIndex={-1}
                aria-label={verConfirmar ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {verConfirmar ? <IconoOjoAbierto /> : <IconoOjoCerrado />}
              </button>
            </div>
          </div>

          <button className="register-button" type="submit">
            Registrarse
          </button>

        </form>
      </div>
    </div>
  );
};

export default Registro;