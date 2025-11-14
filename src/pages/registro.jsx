import React from "react";
import "../styles/registro.css";

const Registro = () => {
  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Crear Cuenta</h2>

        <form className="register-form">
          <div className="register-field">
            <label>Nombre</label>
            <input type="text" placeholder="Ingresa tu nombre" />
          </div>

          <div className="register-field">
            <label>Apellido</label>
            <input type="text" placeholder="Ingresa tu apellido" />
          </div>

          <div className="register-field">
            <label>Correo electrónico</label>
            <input type="email" placeholder="example@gmail.com" />
          </div>

          <div className="register-field">
            <label>Contraseña</label>
            <input type="password" placeholder="********" />
          </div>

          <div className="register-field">
            <label>Confirmar contraseña</label>
            <input type="password" placeholder="********" />
          </div>

          <button className="register-button">Registrarse</button>

          <p className="register-login-text">
            ¿Ya tienes una cuenta?{" "}
            <span className="register-login-link">Iniciar sesión</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Registro;
