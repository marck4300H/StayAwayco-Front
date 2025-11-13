import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../api";

export default function Home() {
  const [rifas, setRifas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRifas = async () => {
      try {
        const res = await fetch(`${API_URL}/rifas/listar`);
        if (!res.ok) throw new Error("Error al obtener las rifas");
        const data = await res.json();
        if (data.success) setRifas(data.rifas);
        else setError("No se pudieron cargar las rifas.");
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
        background: "linear-gradient(180deg, #0f172a, #1e293b)",
        fontFamily: "Poppins, sans-serif",
        padding: "40px 20px",
        color: "#e2e8f0",
      }}
    >
      <header style={{ textAlign: "center", marginBottom: "50px" }}>
        <h1
          style={{
            fontSize: "2.8rem",
            color: "#00c2ff",
            marginBottom: "10px",
            fontWeight: "700",
          }}
        >
          🎟️ StayAwayCo
        </h1>
        <p style={{ fontSize: "1.1rem", color: "#94a3b8" }}>
          Participa en rifas exclusivas y gana premios únicos.
        </p>
      </header>

      {loading && (
        <p
          style={{
            textAlign: "center",
            color: "#00c2ff",
            fontWeight: "bold",
          }}
        >
          Cargando rifas...
        </p>
      )}

      {error && (
        <p
          style={{
            textAlign: "center",
            color: "#f87171",
            fontWeight: "bold",
          }}
        >
          {error}
        </p>
      )}

      {!loading && !error && rifas.length === 0 && (
        <p style={{ textAlign: "center", color: "#94a3b8" }}>
          No hay rifas disponibles por el momento.
        </p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
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
              background: "#1e293b",
              borderRadius: "15px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.4)",
              overflow: "hidden",
              border: "1px solid #334155",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-6px)";
              e.currentTarget.style.boxShadow =
                "0 8px 25px rgba(0,194,255,0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 4px 15px rgba(0,0,0,0.4)";
            }}
          >
            <img
              src={rifa.imagen_url}
              alt={rifa.titulo}
              style={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
                borderBottom: "3px solid #00c2ff",
              }}
            />
            <div style={{ padding: "18px" }}>
              <h3
                style={{
                  color: "#ffffff",
                  marginBottom: "10px",
                  fontWeight: "600",
                  fontSize: "1.2rem",
                }}
              >
                {rifa.titulo}
              </h3>
              <p style={{ color: "#cbd5e1", fontSize: "0.95rem" }}>
                {rifa.descripcion}
              </p>
              <button
                style={{
                  marginTop: "15px",
                  width: "100%",
                  background: "#00c2ff",
                  color: "#0f172a",
                  fontWeight: "600",
                  padding: "10px 0",
                  borderRadius: "10px",
                  border: "none",
                  cursor: "pointer",
                  transition: "background 0.2s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#38e1ff")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#00c2ff")
                }
              >
                Ver más
              </button>
            </div>
          </div>
        ))}
      </div>

      <footer
        style={{
          textAlign: "center",
          marginTop: "60px",
          color: "#94a3b8",
          fontSize: "0.9rem",
        }}
      >
        <p>© {new Date().getFullYear()} StayAwayCo — Todos los derechos reservados</p>
        <Link
          to="/admin/login"
          style={{
            color: "#00c2ff",
            textDecoration: "none",
            fontWeight: "600",
            display: "block",
            marginTop: "10px",
          }}
        >
          Panel de administrador →
        </Link>
      </footer>
    </div>
  );
}
