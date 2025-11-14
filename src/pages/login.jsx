import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import { API_URL } from "../api";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    correo_electronico: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/usuarios/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        // Guardar token en localStorage
        localStorage.setItem("token", data.token);

        alert("Inicio de sesión exitoso");
        // Redirigir a dashboard u otra ruta
        navigate("/");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error al iniciar sesión");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Iniciar Sesión</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label className="label-blanco">Correo electrónico</label>
            <input
              type="email"
              name="correo_electronico"
              value={formData.correo_electronico}
              onChange={handleChange}
              placeholder="Ingresa tu correo"
              required
            />
          </div>
          <div className="login-field">
            <label className="label-blanco">Contraseña</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Ingresa tu contraseña"
              required
            />
          </div>
          <button type="submit" className="login-button">
            Ingresar
          </button>
        </form>

        <p className="login-register-text">
          ¿No tienes cuenta?{" "}
          <span className="login-register-link" onClick={() => navigate("/registro")}>
            Regístrate
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
