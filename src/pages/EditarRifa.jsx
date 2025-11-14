import React, { useState, useEffect } from "react";
import { API_URL } from "../api";
import "../styles/admin.css";

export default function EditarRifa() {
  const [rifas, setRifas] = useState([]);
  const [selectedRifa, setSelectedRifa] = useState(null);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [cantidadNumeros, setCantidadNumeros] = useState(0);
  const [imagen, setImagen] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchRifas();
  }, []);

  const fetchRifas = async () => {
    try {
      const res = await fetch(`${API_URL}/rifas/`);
      const data = await res.json();
      if (data.success) {
        setRifas(data.rifas);
      } else {
        setMessage("❌ Error al cargar las rifas");
      }
    } catch (err) {
      console.error("Error cargando rifas:", err);
      setMessage("❌ Error de conexión al cargar rifas");
    }
  };

  const handleSelect = (rifa) => {
    setSelectedRifa(rifa);
    setTitulo(rifa.titulo);
    setDescripcion(rifa.descripcion);
    setCantidadNumeros(rifa.cantidad_numeros || 0);
    setImagen(null);
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRifa) return;
    setMessage("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("titulo", titulo);
      formData.append("descripcion", descripcion);
      formData.append("cantidad_numeros", cantidadNumeros.toString());
      
      if (imagen) {
        formData.append("imagen", imagen);
      }

      const res = await fetch(`${API_URL}/rifas/editar/${selectedRifa.id}`, {
        method: "PUT",
        headers: { 
          Authorization: `Bearer ${token}` 
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(`❌ ${data.message || `Error ${res.status}`}`);
        if (res.status === 401) {
          localStorage.removeItem("token");
        }
        return;
      }

      if (data.success) {
        setMessage("✅ Rifa editada con éxito");
        setSelectedRifa(data.rifa);
        fetchRifas(); // Actualizar la lista
      } else {
        setMessage("❌ " + (data.message || "Error al editar rifa"));
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-sidebar-layout">
      <div className="admin-sidebar">
        <h2 className="admin-sidebar-title">Rifas Disponibles</h2>
        {rifas.map((rifa) => (
          <div
            key={rifa.id}
            className={`admin-rifa-item ${selectedRifa?.id === rifa.id ? 'selected' : ''}`}
            onClick={() => handleSelect(rifa)}
          >
            <div className="admin-rifa-title">{rifa.titulo}</div>
            <div className="admin-rifa-stats">
              <span>🎯 {rifa.cantidad_numeros} nums</span>
              <span>💰 {rifa.vendidos} vendidos</span>
              <span>📊 {rifa.porcentaje}%</span>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-main-content">
        {selectedRifa ? (
          <>
            <h1 className="admin-form-title">✏️ Editar Rifa</h1>
            <form onSubmit={handleSubmit} className="admin-form">
              <label className="admin-label">Título</label>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
                className="admin-input"
              />

              <label className="admin-label">Descripción</label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                required
                className="admin-input admin-textarea"
              />

              <label className="admin-label">Cantidad de Números (solo lectura)</label>
              <input
                type="number"
                value={cantidadNumeros}
                readOnly
                className="admin-input"
                style={{ backgroundColor: '#f8f9fa', color: '#6c757d', cursor: 'not-allowed' }}
              />

              <label className="admin-label">Nueva Imagen (opcional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImagen(e.target.files[0])}
                className="admin-input admin-file-input"
              />

              <button
                type="submit"
                disabled={loading}
                className="admin-button"
              >
                {loading ? "🔄 Editando..." : "💾 Guardar Cambios"}
              </button>
            </form>

            {message && (
              <div className={`admin-message ${message.includes("✅") ? "success" : "error"}`}>
                {message}
              </div>
            )}
          </>
        ) : (
          <div className="admin-placeholder">
            <h2>Selecciona una rifa para editar</h2>
            <p>Elige una rifa del panel lateral para comenzar a editarla</p>
          </div>
        )}
      </div>
    </div>
  );
}