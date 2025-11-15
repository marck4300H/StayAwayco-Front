import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import { API_URL } from "../api";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    correo_electronico: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage(""); // Limpiar mensajes al escribir
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // ✅ PRIMERO: Intentar login como administrador
      console.log("🔐 Intentando login como administrador...");
      const adminRes = await fetch(`${API_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.correo_electronico,
          password: formData.password
        }),
      });

      const adminData = await adminRes.json();
      
      if (adminData.success && adminData.token) {
        // ✅ Es un administrador
        console.log("✅ Login exitoso como administrador");
        localStorage.setItem("token", adminData.token);
        localStorage.setItem("userType", "admin"); // Marcar como admin
        
        setMessage("Inicio de sesión como administrador exitoso ✅");
        
        // Redirigir al dashboard del admin después de 1 segundo
        setTimeout(() => {
          navigate("/admin/dashboard");
        }, 1000);
        return;
      }

      // ✅ SI NO ES ADMIN: Intentar login como usuario normal
      console.log("🔐 Intentando login como usuario normal...");
      const userRes = await fetch(`${API_URL}/usuarios/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const userData = await userRes.json();
      
      if (userData.success) {
        // ✅ Es un usuario normal
        console.log("✅ Login exitoso como usuario normal");
        localStorage.setItem("token", userData.token);
        localStorage.setItem("userType", "user"); // Marcar como usuario
        
        setMessage("Inicio de sesión exitoso ✅");
        
        // Redirigir al home después de 1 segundo
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        setMessage(userData.message || "Credenciales incorrectas");
      }

    } catch (err) {
      console.error("❌ Error en login:", err);
      setMessage("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Iniciar Sesión</h2>
        
        
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label className="label-blanco">Correo electrónico</label>
            <input
              type="email"
              name="correo_electronico"
              value={formData.correo_electronico}
              onChange={handleChange}
              placeholder="Ingresa tu correo"
              required
              disabled={loading}
            />
          </div>
          <div className="login-field">
            <label className="label-blanco">Contraseña</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Ingresa tu contraseña"
              required
              disabled={loading}
            />
          </div>
          
          {message && (
            <div className={`login-message ${message.includes('✅') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}
          
          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? "🔄 Verificando..." : "Ingresar"}
          </button>
        </form>

        <p className="login-register-text">
          ¿No tienes cuenta?{" "}
          <span 
            className="login-register-link" 
            onClick={() => !loading && navigate("/registro")}
          >
            Regístrate
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;