import React, { useEffect, useState } from "react";
import { API_URL } from "../api";
import { useNavigate } from "react-router-dom";
import "../styles/perfil.css";

const Perfil = () => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

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
          setUsuario(data.usuario);
        }

        setCargando(false);
      } catch (error) {
        console.error("Error al cargar perfil:", error);
        setCargando(false);
      }
    };

    fetchPerfil();
  }, []);

  const handleEliminar = async () => {
    if (!confirm("¿Seguro que deseas eliminar tu cuenta? Esta acción es irreversible.")) {
      return;
    }

    try {
      const res = await fetch(`${API_URL}/usuarios/eliminar`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        alert("Error eliminando tu cuenta.");
      }
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  };

  if (cargando) return <div className="perfil-cargando">Cargando perfil...</div>;
  if (!usuario) return <div className="perfil-error">Error cargando datos.</div>;

  return (
    <div className="perfil-container">
      <h2 className="perfil-titulo">Mi Perfil</h2>

      {/* BOTONES */}
      <div className="perfil-botones">
        <button className="btn-editar" onClick={() => navigate("/editarPerfil")}>
          Editar perfil
        </button>

        <button className="btn-eliminar" onClick={handleEliminar}>
          Eliminar cuenta
        </button>
      </div>

      {/* DATOS DEL USUARIO */}
      <div className="perfil-card">
        <h3>Datos personales</h3>

        <p><strong>Nombre:</strong> {usuario.nombres} {usuario.apellidos}</p>
        <p><strong>Documento:</strong> {usuario.tipo_documento} {usuario.numero_documento}</p>
        <p><strong>Correo:</strong> {usuario.correo_electronico}</p>
        <p><strong>Teléfono:</strong> {usuario.telefono || "No registrado"}</p>
        <p><strong>Dirección:</strong> {usuario.direccion || "No registrada"}</p>
        <p><strong>Ciudad:</strong> {usuario.ciudad || "No registrada"}</p>
        <p><strong>Departamento:</strong> {usuario.departamento || "No registrado"}</p>
      </div>

      {/* NÚMEROS COMPRADOS */}
      <div className="perfil-card">
        <h3>Mis números comprados</h3>

        {usuario.numeros_comprados?.length === 0 && (
          <p className="no-numeros">No has comprado ningún número todavía. ¡Participa en una rifa!</p>
        )}

        {usuario.numeros_comprados?.length > 0 && (
          <div className="numeros-grid">
            {usuario.numeros_comprados.map((num, index) => (
              <div key={index} className="numero-item">
                {num}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Perfil;
