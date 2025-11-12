import React, { useState } from "react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Aquí luego conectarás con tu backend (/api/admin/login)
    if (email === "admin@demo.com" && password === "123456") {
      setMessage("Inicio de sesión exitoso ✅");
      // Aquí redirigimos al dashboard:
      setTimeout(() => (window.location.href = "/admin/dashboard"), 1000);
    } else {
      setMessage("Credenciales incorrectas ❌");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Login del Administrador</h1>
      <form onSubmit={handleSubmit} style={{ display: "inline-block", marginTop: "20px" }}>
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
          style={{
            padding: "10px 20px",
            marginTop: "10px",
            cursor: "pointer",
            background: "#333",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Ingresar
        </button>
      </form>
      {message && <p style={{ marginTop: "15px" }}>{message}</p>}
    </div>
  );
}
