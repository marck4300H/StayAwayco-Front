import React, { useState, useEffect } from "react";

export default function EditarRifa() {
  const [rifas, setRifas] = useState([]);
  const [selectedRifa, setSelectedRifa] = useState(null);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("https://api.stayaway.com.co/api/rifas/listar")
      .then(res => res.json())
      .then(data => {
        if (data.success) setRifas(data.rifas);
      });
  }, []);

  const handleSelect = (rifa) => {
    setSelectedRifa(rifa);
    setTitulo(rifa.titulo);
    setDescripcion(rifa.descripcion);
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
      if (imagen) formData.append("imagen", imagen);

      const res = await fetch(`https://api.stayaway.com.co/api/rifas/editar/${selectedRifa.id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setMessage("✅ Rifa editada con éxito");
        setSelectedRifa(data.rifa);
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
    <div style={containerStyle}>
      <div style={sidebarStyle}>
        <h2 style={{ color: "#fff", marginBottom: "20px" }}>Rifas disponibles</h2>
        {rifas.map(rifa => (
          <div
            key={rifa.id}
            style={{
              padding: "10px",
              marginBottom: "8px",
              cursor: "pointer",
              backgroundColor: selectedRifa?.id === rifa.id ? "#1e90ff" : "#2f3640",
              color: "#fff",
              borderRadius: "6px",
              fontWeight: "bold",
            }}
            onClick={() => handleSelect(rifa)}
          >
            {rifa.titulo}
          </div>
        ))}
      </div>

      <div style={formContainerStyle}>
        {selectedRifa ? (
          <>
            <h1 style={{ color: "#2f3640" }}>✏️ Editar Rifa</h1>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
                style={inputStyle}
              />
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                required
                style={{ ...inputStyle, height: "120px", resize: "none" }}
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImagen(e.target.files[0])}
                style={{ ...inputStyle, padding: "8px" }}
              />
              <button
                type="submit"
                disabled={loading}
                style={{ ...buttonStyle, backgroundColor: loading ? "#aaa" : "#1e90ff" }}
              >
                {loading ? "Editando..." : "Editar Rifa"}
              </button>
            </form>
            {message && (
              <p style={{
                marginTop: 20,
                color: message.includes("✅") ? "#27ae60" : "#c0392b",
                fontWeight: "bold",
                fontSize: "16px"
              }}>{message}</p>
            )}
          </>
        ) : (
          <p style={{ color: "#2f3640", fontSize: "16px" }}>Selecciona una rifa para editar.</p>
        )}
      </div>
    </div>
  );
}

const containerStyle = {
  display: "flex",
  minHeight: "100vh",
  backgroundColor: "#f0f2f5",
  fontFamily: "Arial, sans-serif",
};

const sidebarStyle = {
  width: "250px",
  backgroundColor: "#2f3640",
  padding: "20px",
  boxShadow: "2px 0 6px rgba(0,0,0,0.1)",
};

const formContainerStyle = {
  flex: 1,
  padding: "40px",
  display: "flex",
  flexDirection: "column",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  margin: "8px 0",
  border: "1px solid #ccc",
  borderRadius: "8px",
  fontSize: "16px",
  color: "#2f3640",
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
