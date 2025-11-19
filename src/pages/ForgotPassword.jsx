import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_URL } from "../api";
import "../styles/forgot-password.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [step, setStep] = useState(1); // 1: Solicitar, 2: Instrucciones
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/usuarios/recuperar-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage("✅ Si el email existe, recibirás instrucciones para restablecer tu contraseña.");
        setStep(2);
      } else {
        setMessage("❌ " + (data.message || "Error al procesar la solicitud"));
      }
    } catch (err) {
      console.error("❌ Error:", err);
      setMessage("❌ Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <div className="forgot-password-header">
          <h1>🔐 Recuperar Contraseña</h1>
          <p>Te enviaremos un enlace para restablecer tu contraseña</p>
        </div>

        {step === 1 && (
          <form onSubmit={handleSubmit} className="forgot-password-form">
            <div className="form-group">
              <label htmlFor="email">Correo Electrónico</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ingresa tu correo electrónico"
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
              disabled={loading || !email}
            >
              {loading ? "🔄 Enviando..." : "Enviar Instrucciones"}
            </button>

            <div className="back-to-login">
              <Link to="/login">← Volver al inicio de sesión</Link>
            </div>
          </form>
        )}

        {step === 2 && (
          <div className="instructions-step">
            <div className="success-icon">✅</div>
            <h2>Revisa tu correo</h2>
            <p className="instructions-text">
              Hemos enviado un enlace de recuperación a <strong>{email}</strong>
            </p>
            <p className="instructions-detail">
              El enlace expirará en 1 hora por seguridad.
            </p>

            <div className="actions">
              <button 
                onClick={() => {
                  setStep(1);
                  setMessage("");
                  setEmail("");
                }}
                className="secondary-btn"
              >
                Intentar con otro email
              </button>
              <Link to="/login" className="primary-btn">
                Volver al Login
              </Link>
            </div>

            <div className="check-spam">
              <p>💡 <strong>¿No encuentras el correo?</strong></p>
              <ul>
                <li>Revisa tu carpeta de spam o correo no deseado</li>
                <li>Verifica que escribiste correctamente tu email</li>
                <li>Espera unos minutos, puede tardar en llegar</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}