import React from "react";
import { Link, Outlet } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Menú lateral */}
      <nav style={navStyle}>
        <h2 style={{ color: "#fff", marginBottom: "20px" }}>Panel Admin</h2>
        <Link to="crear" style={linkStyle}>Crear Rifa</Link>
        <Link to="editar" style={linkStyle}>Editar Rifa</Link>
        <Link to="eliminar" style={linkStyle}>Eliminar Rifa</Link>
      </nav>

      {/* Contenido dinámico */}
      <main style={{ flex: 1, padding: "20px" }}>
        <Outlet />
      </main>
    </div>
  );
}

const navStyle = {
  width: "220px",
  backgroundColor: "#00a8ff",
  display: "flex",
  flexDirection: "column",
  padding: "20px",
};

const linkStyle = {
  color: "#fff",
  textDecoration: "none",
  marginBottom: "10px",
  fontWeight: "bold",
};
