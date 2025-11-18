import React, { useState } from "react";
import { API_URL } from "../api";
import "../styles/admin.css";

export default function CrearRifa() {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState(null);
  const [cantidadNumeros, setCantidadNumeros] = useState("10000");
  const [precioUnitario, setPrecioUnitario] = useState("1000");
  const [cantidadMinima, setCantidadMinima] = useState("5");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!imagen) {
      setMessage("⚠️ Selecciona una imagen.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("❌ No hay sesión activa.");
        return;
      }

      const formData = new FormData();
      formData.append("titulo", titulo);
      formData.append("descripcion", descripcion);
      formData.append("cantidad_numeros", cantidadNumeros);
      formData.append("precio_unitario", precioUnitario);
      formData.append("cantidad_minima", cantidadMinima);
      formData.append("imagen", imagen);

      console.log("📤 Enviando datos para crear rifa...");
      const res = await fetch(`${API_URL}/rifas/crear`, {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${token}` 
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("❌ Error del servidor:", data);
        setMessage(`❌ ${data.message || `Error ${res.status}: No se pudo crear la rifa`}`);
        if (res.status === 401) {
          localStorage.removeItem("token");
        }
        return;
      }

      if (data.success) {
        setMessage("✅ Rifa creada con éxito");
        setTitulo("");
        setDescripcion("");
        setImagen(null);
        setCantidadNumeros("10000");
        setPrecioUnitario("1000");
        setCantidadMinima("5");
        // Limpiar input de archivo
        document.querySelector('input[type="file"]').value = "";
      } else {
        setMessage(`❌ Error: ${data.message || "No se pudo crear la rifa"}`);
      }
    } catch (err) {
      console.error("❌ Error de conexión:", err);
      setMessage("❌ Error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-form-container">
      <h1 className="admin-form-title">🎟️ Crear Rifa</h1>
      <p className="admin-form-subtitle">
        Crea una nueva rifa con todos los detalles necesarios para que los usuarios puedan participar.
      </p>

      <form onSubmit={handleSubmit} className="admin-form">
        <label className="admin-label">Título de la rifa</label>
        <input
          type="text"
          placeholder="Ej: Kawazaki Z1000 Edition 2024"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
          className="admin-input"
        />

        <label className="admin-label">Descripción</label>
        <textarea
          placeholder="Describe los detalles de la rifa, premios, condiciones, etc."
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
          className="admin-input admin-textarea"
        />

        <label className="admin-label">Cantidad de números</label>
        <select
          value={cantidadNumeros}
          onChange={(e) => setCantidadNumeros(e.target.value)}
          className="admin-input admin-select"
        >
          <option value="10000">10.000 números (0-9999)</option>
          <option value="100000">100.000 números (0-99999)</option>
        </select>

        <label className="admin-label">Precio unitario ($)</label>
        <input
          type="number"
          placeholder="1000"
          value={precioUnitario}
          onChange={(e) => setPrecioUnitario(e.target.value)}
          min="100"
          required
          className="admin-input"
        />

        <label className="admin-label">Cantidad mínima de compra</label>
        <input
          type="number"
          placeholder="5"
          value={cantidadMinima}
          onChange={(e) => setCantidadMinima(e.target.value)}
          min="1"
          required
          className="admin-input"
        />

        <label className="admin-label">Imagen de la rifa</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImagen(e.target.files[0])}
          required
          className="admin-input admin-file-input"
        />

        <button
          type="submit"
          disabled={loading}
          className="admin-button"
        >
          {loading ? "🔄 Creando Rifa..." : "🎯 Crear Rifa"}
        </button>
      </form>
      
      {message && (
        <div className={`admin-message ${message.includes("✅") ? "success" : "error"}`}>
          {message}
        </div>
      )}
    </div>
  );
}