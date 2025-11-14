import React, { useState, useEffect } from "react";
import { API_URL } from "../api";
import "../styles/admin.css";

export default function EliminarRifa() {
  const [rifas, setRifas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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

  const handleDelete = async (id, titulo) => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar la rifa "${titulo}"?\n\nEsta acción eliminará:\n• La rifa\n• Todos los números asociados\n• Los números comprados por usuarios\n\n¡Esta acción no se puede deshacer!`)) {
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/rifas/eliminar/${id}`, {
        method: "DELETE",
        headers: { 
          Authorization: `Bearer ${token}` 
        },
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
        setMessage("✅ Rifa y todos sus datos asociados eliminados con éxito");
        fetchRifas();
      } else {
        setMessage("❌ " + (data.message || "Error al eliminar la rifa"));
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-rifas-container">
      <h1 className="admin-form-title">🗑️ Eliminar Rifa</h1>
      <p className="admin-form-subtitle">
        Selecciona una rifa para eliminar. Esta acción eliminará la rifa, todos sus números 
        y los números comprados por usuarios.
      </p>

      {rifas.length === 0 ? (
        <div className="admin-placeholder">
          <p>No hay rifas disponibles para eliminar.</p>
        </div>
      ) : (
        rifas.map(rifa => (
          <div key={rifa.id} className="admin-rifa-card">
            <div className="admin-rifa-info">
              <div className="admin-rifa-name">{rifa.titulo}</div>
              <div className="admin-rifa-details">
                <span className="admin-rifa-detail">🎯 {rifa.cantidad_numeros} números totales</span>
                <span className="admin-rifa-detail">💰 {rifa.vendidos} vendidos</span>
                <span className="admin-rifa-detail">📊 {rifa.porcentaje}% completado</span>
              </div>
            </div>
            <button
              onClick={() => handleDelete(rifa.id, rifa.titulo)}
              disabled={loading}
              className="admin-delete-button"
            >
              {loading ? "🔄 Eliminando..." : "🗑️ Eliminar"}
            </button>
          </div>
        ))
      )}
      
      {message && (
        <div className={`admin-message ${message.includes("✅") ? "success" : "error"}`}>
          {message}
        </div>
      )}
    </div>
  );
}