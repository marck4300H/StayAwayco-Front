import React from "react";
import "../styles/login.css";

const Login = () => {
  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Iniciar Sesión</h2>

        <form className="login-form">
          <div className="login-field">
            <label className="label-blanco">Correo electrónico</label>
            <input type="email" placeholder="Ingresa tu correo" />
          </div>

          <div className="login-field">
            <label className="label-blanco">Contraseña</label>
            <input type="password" placeholder="Ingresa tu contraseña" />
          </div>

          <button type="submit" className="login-button">
            ingresar
          </button>
        </form>

        <p className="login-register-text">
          ¿No tienes cuenta?{" "}
          <span className="login-register-link">Regístrate</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
