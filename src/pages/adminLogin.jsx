import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Importa useNavigate
import { loginAdmin } from "../api"; // asegúrate de que apunte correctamente a tu función API

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // ✅ Hook de navegación

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await loginAdmin(email, password);
      console.log("🔐 Respuesta del backend:", response);

      if (response.success && response.token) {
        // ✅ Guardar token en localStorage
        localStorage.setItem("token", response.token);
        console.log("✅ Token guardado:", response.token);

        setMessage("Inicio de sesión exitoso ✅");

        // Redirigir al dashboard después de 1 segundo
        setTimeout(() => {
          navigate("/admin/dashboard"); // ✅ Redirección segura
        }, 1000);
      } else {
        setMessage(response.message || "Credenciales incorrectas ❌");
      }
    } catch (error) {
      console.error("❌ Error al conectar con el servidor:", error);
      setMessage("Error al conectar con el servidor ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Login del Administrador</h1>

      <form
        onSubmit={handleSubmit}
        style={{ display: "inline-block", marginTop: "20px" }}
      >
        <div>
          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: "10px", width: "250px", margin: "5px" }}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: "10px", width: "250px", margin: "5px" }}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 20px",
            marginTop: "10px",
            cursor: loading ? "not-allowed" : "pointer",
            background: "#333",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
          }}
        >
          {loading ? "Verificando..." : "Ingresar"}
        </button>
      </form>

      {message && <p style={{ marginTop: "15px" }}>{message}</p>}
    </div>
  );
}
