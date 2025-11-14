import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import AdminLogin from "../pages/adminLogin";
import AdminDashboard from "../pages/AdminDashboard";
import CrearRifa from "../pages/CrearRifa";
import EditarRifa from "../pages/EditarRifa";
import EliminarRifa from "../pages/EliminarRifa";
import Login from "../pages/login";
import Registro from "../pages/registro";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Página principal */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      
      

      {/* Rutas del administrador */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />}>
        {/* Rutas hijas del dashboard */}
        <Route path="crear" element={<CrearRifa />} />
        <Route path="editar" element={<EditarRifa />} />
        <Route path="eliminar" element={<EliminarRifa />} />
      </Route>

      {/* Redirección por defecto */}
      {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
    </Routes>
  );
}
