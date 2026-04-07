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
  const [verPassword, setVerPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      console.log("🔐 Intentando login como administrador...");
      const adminRes = await fetch(`${API_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.correo_electronico,
          password: formData.password,
        }),
      });

      const adminData = await adminRes.json();

      if (adminData.success && adminData.token) {
        console.log("✅ Login exitoso como administrador");
        localStorage.setItem("token", adminData.token);
        localStorage.setItem("userType", "admin");
        setMessage("Inicio de sesión como administrador exitoso ✅");
        setTimeout(() => navigate("/admin/dashboard"), 1000);
        return;
      }

      console.log("🔐 Intentando login como usuario normal...");
      const userRes = await fetch(`${API_URL}/usuarios/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const userData = await userRes.json();

      if (userData.success) {
        console.log("✅ Login exitoso como usuario normal");
        localStorage.setItem("token", userData.token);
        localStorage.setItem("userType", "user");
        setMessage("Inicio de sesión exitoso ✅");
        setTimeout(() => navigate("/"), 1000);
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
            <div className="login-password-wrapper">
              <input
                type={verPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Ingresa tu contraseña"
                required
                disabled={loading}
              />
              <button
                type="button"
                className="login-eye-btn"
                onClick={() => setVerPassword((prev) => !prev)}
                tabIndex={-1}
                aria-label={verPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {verPassword ? (
                  /* Ojo abierto — ver */
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                ) : (
                  /* Ojo tachado — ocultar */
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {message && (
            <div className={`login-message ${message.includes("✅") ? "success" : "error"}`}>
              {message}
            </div>
          )}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "🔄 Verificando..." : "Ingresar"}
          </button>
        </form>

        <p className="login-forgot-text">
          ¿Olvidaste tu contraseña?{" "}
          <span className="login-forgot-link" onClick={() => navigate("/forgot-password")}>
            Recupérala aquí
          </span>
        </p>
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