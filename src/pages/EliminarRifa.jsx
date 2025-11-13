import React, { useState, useEffect } from "react";

export default function EliminarRifa() {
  const [rifas, setRifas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchRifas();
  }, []);

  const fetchRifas = async () => {
    const res = await fetch("https://api.stayaway.com.co/api/rifas/listar");
    const data = await res.json();
    if (data.success) setRifas(data.rifas);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta rifa?")) return;
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`https://api.stayaway.com.co/api/rifas/eliminar/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setMessage("✅ Rifa eliminada con éxito");
        fetchRifas();
      } else {
        setMessage("❌ " + (data.message || "Error al eliminar"));
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ color: "#2f3640", marginBottom: "20px" }}>🗑️ Eliminar Rifa</h1>
      {rifas.map(rifa => (
        <div key={rifa.id} style={rifaStyle}>
          <span style={{ color: "#2f3640", fontWeight: "bold" }}>{rifa.titulo}</span>
          <button
            onClick={() => handleDelete(rifa.id)}
            disabled={loading}
            style={{ ...buttonStyle, backgroundColor: loading ? "#aaa" : "#e74c3c" }}
          >
            Eliminar
          </button>
        </div>
      ))}
      {message && <p style={{ marginTop: 20, color: message.includes("✅") ? "#27ae60" : "#c0392b", fontWeight: "bold", fontSize: "16px" }}>{message}</p>}
    </div>
  );
}

const containerStyle = {
  minHeight: "100vh",
  padding: "40px",
  backgroundColor: "#f0f2f5",
  fontFamily: "Arial, sans-serif",
};

const rifaStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: "#fff",
  padding: "14px 20px",
  marginBottom: "12px",
  borderRadius: "8px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
};

const buttonStyle = {
  color: "#fff",
  border: "none",
  padding: "10px 18px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "14px",
};
