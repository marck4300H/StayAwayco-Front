import React, { useState } from "react";

export default function AdminDashboard() {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!imagen) {
      setMessage("⚠️ Selecciona una imagen antes de continuar.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("❌ No hay sesión activa. Por favor, inicia sesión nuevamente.");
        return;
      }

      const formData = new FormData();
      formData.append("titulo", titulo);
      formData.append("descripcion", descripcion);
      formData.append("imagen", imagen);

      console.log("🧩 Token usado en fetch:", token);

      const res = await fetch("https://api.stayaway.com.co/api/rifas/crear", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

        if (res.status === 401) {
          setMessage("⚠️ Tu sesión ha expirado. Vuelve a iniciar sesión.");
          localStorage.removeItem("token");
        } else {
          setMessage(`❌ ${errorMsg}`);
        }
        return;
      }

      const data = await res.json();

      if (data.success) {
        setMessage("✅ Rifa creada con éxito");
        setTitulo("");
        setDescripcion("");
        setImagen(null);
      } else {
        setMessage("❌ Error: " + (data.message || "No se pudo crear la rifa"));
      }
    } catch (err) {
      console.error("Error al crear rifa:", err);
      setMessage("❌ Ocurrió un error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f6fa",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "30px 40px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          width: "400px",
          textAlign: "center",
        }}
      >
        <h1 style={{ color: "#2f3640", marginBottom: "20px" }}>🎟️ Crear Rifa</h1>

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
            style={{ ...inputStyle, height: "100px", resize: "none" }}
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
            style={{
              backgroundColor: loading ? "#aaa" : "#00a8ff",
              color: "#fff",
              border: "none",
              padding: "10px 20px",
              borderRadius: "8px",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: "bold",
              width: "100%",
              marginTop: "10px",
            }}
          >
            {loading ? "Creando..." : "Crear Rifa"}
          </button>
        </form>

        {message && (
          <p
            style={{
              marginTop: "20px",
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

const inputStyle = {
  width: "100%",
  padding: "10px",
  margin: "8px 0",
  border: "1px solid #dcdde1",
  borderRadius: "8px",
  fontSize: "14px",
};
