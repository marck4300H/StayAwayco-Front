import React from "react";
import { Link, Outlet } from "react-router-dom";
import "../styles/admin.css";

export default function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      {/* Menú lateral */}
      <nav className="admin-nav">
        <h2>Panel Administrador</h2>
        <Link to="crear" className="admin-nav-link">🎯 Crear Rifa</Link>
        <Link to="editar" className="admin-nav-link">✏️ Editar Rifa</Link>
        <Link to="eliminar" className="admin-nav-link">🗑️ Eliminar Rifa</Link>
      </nav>

      {/* Contenido dinámico */}
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}