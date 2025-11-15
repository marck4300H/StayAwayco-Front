import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/Layout";
import Home from "../pages/Home";
import AdminDashboard from "../pages/AdminDashboard";
import CrearRifa from "../pages/CrearRifa";
import EditarRifa from "../pages/EditarRifa";
import EliminarRifa from "../pages/EliminarRifa";
import Login from "../pages/login";
import Registro from "../pages/registro";
import Perfil from "../pages/perfil";
import EditarPerfil from "../pages/EditarPerfil";
import Comprar from "../pages/Comprar";
import Menu from "../pages/Menu";
import FormularioPago from "../pages/FormularioPago"

export default function AppRoutes() {
  return (
    <Routes>
      {/* ✅ Rutas dentro del Layout (con navbar y footer) */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/editarPerfil" element={<EditarPerfil />} />
        <Route path="/comprar" element={<Comprar />} />
        <Route path="/formulario-pago" element={<FormularioPago />} />
      </Route>

      {/* ✅ Rutas de administrador (fuera del Layout) */}
      <Route path="/admin/dashboard" element={<AdminDashboard />}>
        {/* Rutas hijas del dashboard */}
        <Route path="menu" element={<Menu />} />
        <Route path="crear" element={<CrearRifa />} />
        <Route path="editar" element={<EditarRifa />} />
        <Route path="eliminar" element={<EliminarRifa />} />
      </Route>

      {/* ✅ Redirección por defecto */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}