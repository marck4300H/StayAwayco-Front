import React, { useEffect, useState } from "react";
import { API_URL } from "../api";
import { useNavigate } from "react-router-dom";
import "../styles/editarPerfil.css";

const EditarPerfil = () => {
  const [form, setForm] = useState({
    nombres: "",
    apellidos: "",
    tipo_documento: "",
    numero_documento: "",
    correo_electronico: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    departamento: "",
  });

  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const res = await fetch(`${API_URL}/usuarios/perfil`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (data.success) {
          setForm(data.usuario);
        }

        setCargando(false);
      } catch (error) {
        console.error("Error cargando perfil:", error);
        setCargando(false);
      }
    };

    fetchPerfil();
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGuardar = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/usuarios/editar`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        navigate("/perfil");
      } else {
        alert("Error actualizando el perfil");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (cargando) return <div className="perfil-cargando">Cargando...</div>;

  return (
    <div className="editar-container">
      <h2>Editar Perfil</h2>

      <form className="editar-form" onSubmit={handleGuardar}>
        <label>Nombres:</label>
        <input name="nombres" value={form.nombres} onChange={handleChange} required />

        <label>Apellidos:</label>
        <input name="apellidos" value={form.apellidos} onChange={handleChange} required />

        <label>Tipo Documento:</label>
        <input name="tipo_documento" value={form.tipo_documento} onChange={handleChange} required />

        <label>Número Documento:</label>
        <input name="numero_documento" value={form.numero_documento} onChange={handleChange} required />

        <label>Correo electrónico:</label>
        <input name="correo_electronico" value={form.correo_electronico} onChange={handleChange} required />

        <label>Teléfono:</label>
        <input name="telefono" value={form.telefono} onChange={handleChange} />

        <label>Dirección:</label>
        <input name="direccion" value={form.direccion} onChange={handleChange} />

        <label>Ciudad:</label>
        <input name="ciudad" value={form.ciudad} onChange={handleChange} />

        <label>Departamento:</label>
        <input name="departamento" value={form.departamento} onChange={handleChange} />

        <button type="submit" className="btn-guardar">Guardar cambios</button>
      </form>
    </div>
  );
};

export default EditarPerfil;