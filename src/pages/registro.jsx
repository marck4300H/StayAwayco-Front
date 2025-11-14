import React, { useState } from "react";
import "../styles/registro.css";
import { API_URL } from "../api";

const Registro = () => {
  const [formData, setFormData] = useState({
    numero_documento: "",
    tipo_documento: "CC",
    nombres: "",
    apellidos: "",
    correo_electronico: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    departamento: "",
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
          numero_documento: formData.numero_documento,
          tipo_documento: formData.tipo_documento,
          nombres: formData.nombres,
          apellidos: formData.apellidos,
          correo_electronico: formData.correo_electronico,
          telefono: formData.telefono,
          direccion: formData.direccion,
          ciudad: formData.ciudad,
          departamento: formData.departamento,
          password: formData.password,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert("Usuario registrado correctamente. Ahora inicia sesión.");
        setFormData({
          numero_documento: "",
          tipo_documento: "CC",
          nombres: "",
          apellidos: "",
          correo_electronico: "",
          telefono: "",
          direccion: "",
          ciudad: "",
          departamento: "",
          password: "",
          confirmarPassword: "",
        });
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
        <form className="register-form" onSubmit={handleSubmit}>

          <div className="register-field">
            <label>Nombre</label>
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
            <label>Apellido</label>
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
            <label>Tipo de Documento</label>
            <select
              name="tipo_documento"
              placeholder="Selecciona tu tipo de documento"
              value={formData.tipo_documento}
              onChange={handleChange}
              required
              className="select-visible"
            >
              <option value="CC">Cédula de Ciudadanía (CC)</option>
              <option value="CE">Cédula de Extranjería (CE)</option>
              <option value="TI">Tarjeta de Identidad (TI)</option>
              <option value="PAS">Pasaporte (PAS)</option>
            </select>
          </div>

          <div className="register-field">
            <label>Número de Documento</label>
            <input
              type="text"
              name="numero_documento"
              placeholder="Ingresa tu número de documento"
              value={formData.numero_documento}
              onChange={handleChange}
              required
            />
          </div>
          

          <div className="register-field">
            <label>Correo electrónico</label>
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
              placeholder="Ingresa tu número de teléfono"
              value={formData.telefono}
              onChange={handleChange}
              required
            />
          </div>

          <div className="register-field">
            <label>Departamento</label>
            <input
              type="text"
              name="departamento"
              placeholder="Ingresa tu departamento"
              value={formData.departamento}
              onChange={handleChange}
              required
            />
          </div>

                    <div className="register-field">
            <label>Ciudad</label>
            <input
              type="text"
              name="ciudad"
              placeholder="Ingresa tu ciudad"
              value={formData.ciudad}
              onChange={handleChange}
              required
            />
          </div>

          <div className="register-field">
            <label>Dirección</label>
            <input
              type="text"
              name="direccion"
              placeholder="Ingresa tu dirección"
              value={formData.direccion}
              onChange={handleChange}
              required
            />
          </div>

          

          <div className="register-field">
            <label>Contraseña</label>
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
            <label>Confirmar Contraseña</label>
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
