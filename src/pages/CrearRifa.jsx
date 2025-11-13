import React, { useState } from "react";
import { API_URL } from "../api";

export default function CrearRifa() {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState(null);
  const [cantidadNumeros, setCantidadNumeros] = useState("10000");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!imagen) return setMessage("⚠️ Selecciona una imagen.");

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) return setMessage("❌ No hay sesión activa.");

      const formData = new FormData();
      formData.append("titulo", titulo);
      formData.append("descripcion", descripcion);
      formData.append("cantidad_numeros", cantidadNumeros);
      formData.append("imagen", imagen);

      const res = await fetch(`${API_URL}/rifas/crear`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        let errorMsg = `Error ${res.status}`;
        try {
          const data = await res.json();
          errorMsg += `: ${data.message || "Error desconocido"}`;
        } catch {
          const text = await res.text();
          errorMsg += `: ${text}`;
        }
        if (res.status === 401) localStorage.removeItem("token");
        setMessage(`❌ ${errorMsg}`);
        return;
      }

      const data = await res.json();
      if (data.success) {
        setMessage("✅ Rifa creada con éxito");
        setTitulo("");
        setDescripcion("");
        setImagen(null);
        setCantidadNumeros("10000");
      } else setMessage("❌ Error: " + (data.message || "No se pudo crear la rifa"));
    } catch (err) {
      console.error(err);
      setMessage("❌ Error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>🎟️ Crear Rifa</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            style={inputStyle}
          />
          <textarea
            placeholder="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
            style={{ ...inputStyle, height: "120px", resize: "none" }}
          />
          
          <select
            value={cantidadNumeros}
            onChange={(e) => setCantidadNumeros(e.target.value)}
            style={inputStyle}
          >
            <option value="10000">10.000 números</option>
            <option value="100000">100.000 números</option>
          </select>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImagen(e.target.files[0])}
            required
            style={{ ...inputStyle, padding: "6px" }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{ ...buttonStyle, backgroundColor: loading ? "#aaa" : "#00a8ff" }}
          >
            {loading ? "Creando..." : "Crear Rifa"}
          </button>
        </form>
        {message && (
          <p
            style={{
              marginTop: 20,
              color: message.includes("✅") ? "green" : "red",
              fontWeight: "bold",
            }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

// 🎨 estilos (mismos que ya tenías)
const containerStyle = { /* ... */ };
const cardStyle = { /* ... */ };
const titleStyle = { /* ... */ };
const inputStyle = { /* ... */ };
const buttonStyle = { /* ... */ };
