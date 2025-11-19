import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { API_URL } from "../api";
import "../styles/reset-password.css";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");
  const [tokenValid, setTokenValid] = useState(true);

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setTokenValid(false);
      setMessage("❌ Enlace inválido o faltante");
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setMessage(""); // Limpiar mensajes al escribir
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Validaciones
    if (formData.password.length < 6) {
      setMessage("❌ La contraseña debe tener al menos 6 caracteres");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage("❌ Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/usuarios/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token,
          nuevaPassword: formData.password
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage("✅ Contraseña restablecida exitosamente");
        
        // Redirigir al login después de 2 segundos
        setTimeout(() => {
          navigate("/login", { 
            state: { message: "Tu contraseña ha sido restablecida. Ahora puedes iniciar sesión." }
          });
        }, 2000);
      } else {
        setMessage("❌ " + (data.message || "Error al restablecer la contraseña"));
        
        // Si el token es inválido, marcar como tal
        if (data.message?.includes('inválido') || data.message?.includes('expirado')) {
          setTokenValid(false);
        }
      }
    } catch (err) {
      console.error("❌ Error:", err);
      setMessage("❌ Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValid) {
    return (
      <div className="reset-password-container">
        <div className="reset-password-card error-state">
          <div className="error-icon">❌</div>
          <h1>Enlace Inválido</h1>
          <p>Este enlace de recuperación es inválido o ha expirado.</p>
          <p>Solicita un nuevo enlace de recuperación.</p>
          
          <div className="actions">
            <Link to="/forgot-password" className="primary-btn">
              Solicitar Nuevo Enlace
            </Link>
            <Link to="/login" className="secondary-btn">
              Volver al Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-password-container">
      <div className="reset-password-card">
        <div className="reset-password-header">
          <h1>🔑 Nueva Contraseña</h1>
          <p>Crea una nueva contraseña para tu cuenta</p>
        </div>

        <form onSubmit={handleSubmit} className="reset-password-form">
          <div className="form-group">
            <label htmlFor="password">Nueva Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Mínimo 6 caracteres"
              required
              disabled={loading}
              minLength="6"
            />
            <small>La contraseña debe tener al menos 6 caracteres</small>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Repite tu contraseña"
              required
              disabled={loading}
            />
          </div>

          {message && (
            <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}

          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading || !formData.password || !formData.confirmPassword}
          >
            {loading ? "🔄 Restableciendo..." : "Restablecer Contraseña"}
          </button>

          <div className="back-to-login">
            <Link to="/login">← Volver al inicio de sesión</Link>
          </div>
        </form>
      </div>
    </div>
  );
}