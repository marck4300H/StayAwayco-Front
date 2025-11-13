import React, { useState } from "react";

export default function CrearRifa() {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState(null);
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
      formData.append("imagen", imagen);

      const res = await fetch("https://api.stayaway.com.co/api/rifas/crear", {
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
        {message && <p style={{ marginTop: 20, color: message.includes("✅") ? "green" : "red", fontWeight: "bold" }}>{message}</p>}
      </div>
    </div>
  );
}

const containerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  minHeight: "100vh",
  backgroundColor: "#f5f6fa",
  paddingTop: "50px",
  fontFamily: "Arial, sans-serif",
};

const cardStyle = {
  background: "#fff",
  padding: "40px 50px",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  width: "100%",
  maxWidth: "600px",
  textAlign: "center",
};

const titleStyle = { color: "#2f3640", marginBottom: "20px" };

const inputStyle = {
  width: "100%",
  padding: "12px",
  margin: "8px 0",
  border: "1px solid #dcdde1",
  borderRadius: "8px",
  fontSize: "14px",
};

const buttonStyle = {
  color: "#fff",
  border: "none",
  padding: "12px 20px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
  width: "100%",
  marginTop: "10px",
};
