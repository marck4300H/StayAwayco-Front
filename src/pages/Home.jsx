import React, { useEffect, useState } from "react";

export default function Home() {
  const [rifas, setRifas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔄 Obtener rifas desde el backend
  useEffect(() => {
    const fetchRifas = async () => {
      try {
        const res = await fetch("https://api.stayaway.com.co/api/rifas/listar");
        if (!res.ok) throw new Error("Error al obtener las rifas");
        const data = await res.json();
        if (data.success) {
          setRifas(data.rifas);
        } else {
          setError("No se pudieron cargar las rifas.");
        }
      } catch (err) {
        console.error("❌ Error al cargar rifas:", err);
        setError("Error de conexión con el servidor.");
      } finally {
        setLoading(false);
      }
    };
    fetchRifas();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f0f9ff, #e0f7fa)",
        fontFamily: "Poppins, sans-serif",
        padding: "40px 20px",
      }}
    >
      <header style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1 style={{ fontSize: "2.5rem", color: "#0077b6", marginBottom: "10px" }}>
          🎟️ StayAwayCo
        </h1>
        <p style={{ fontSize: "1.1rem", color: "#555" }}>
          Participa en rifas increíbles. ¡Explora las disponibles abajo!
        </p>
      </header>

      {loading && (
        <p style={{ textAlign: "center", color: "#0077b6", fontWeight: "bold" }}>
          Cargando rifas...
        </p>
      )}

      {error && (
        <p style={{ textAlign: "center", color: "red", fontWeight: "bold" }}>
          {error}
        </p>
      )}

      {!loading && !error && rifas.length === 0 && (
        <p style={{ textAlign: "center", color: "#555" }}>
          No hay rifas disponibles por el momento.
        </p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "30px",
          justifyContent: "center",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {rifas.map((rifa) => (
          <div
            key={rifa.id}
            style={{
              background: "#fff",
              borderRadius: "15px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              overflow: "hidden",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.03)";
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)";
            }}
          >
            <img
              src={rifa.imagen_url}
              alt={rifa.titulo}
              style={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
                borderBottom: "2px solid #00b4d8",
              }}
            />
            <div style={{ padding: "15px" }}>
              <h3 style={{ color: "#023e8a", marginBottom: "10px" }}>
                {rifa.titulo}
              </h3>
              <p style={{ color: "#555", fontSize: "0.95rem" }}>
                {rifa.descripcion}
              </p>
            </div>
          </div>
        ))}
      </div>

      <footer
        style={{
          textAlign: "center",
          marginTop: "60px",
          color: "#777",
          fontSize: "0.9rem",
        }}
      >
        <p>
          © {new Date().getFullYear()} StayAwayCo — Todos los derechos reservados
        </p>
        <a
          href="/admin/login"
          style={{
            color: "#0077b6",
            textDecoration: "none",
            fontWeight: "bold",
            display: "block",
            marginTop: "10px",
          }}
        >
          Panel de administrador →
        </a>
      </footer>
    </div>
  );
}
