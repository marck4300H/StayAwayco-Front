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
        // ✅ Guardar token automáticamente
        localStorage.setItem("token", data.token);
        localStorage.setItem("userType", "user");
        
        alert("¡Registro exitoso! Has sido logueado automáticamente.");
        window.location.href = "/"; // Redirigir al home
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error al registrar usuario.");
    }
  };

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

          <div className="register-field">
            <label>Contraseña *</label>
            <input
              type="password"
              name="password"
              placeholder="Crea una contraseña"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="register-field">
            <label>Confirmar Contraseña *</label>
            <input
              type="password"
              name="confirmarPassword"
              placeholder="Confirma tu contraseña"
              value={formData.confirmarPassword}
              onChange={handleChange}
              required
            />
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