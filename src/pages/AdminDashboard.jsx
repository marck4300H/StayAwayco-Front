import React from "react";

export default function AdminDashboard() {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Panel del Administrador 🧩</h1>
      <p>Ruta: /admin/dashboard</p>
      <p>Aquí podrás gestionar rifas, imágenes y números.</p>
      <button
        onClick={() => (window.location.href = "/")}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          background: "#555",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Volver al Inicio
      </button>
    </div>
  );
}
