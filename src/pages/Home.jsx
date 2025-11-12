import React from "react";

export default function Home() {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Bienvenido a StayAwayCo 🎟️</h1>
      <p>Esta es la página principal (ruta: /)</p>
      <p>
        Si eres administrador, entra directamente a{" "}
        <a href="/admin/login">/admin/login</a>
      </p>
    </div>
  );
}
