import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { API_URL } from "../api";
import "../styles/comprar.css";

export default function Comprar() {
  const navigate = useNavigate();
  const location = useLocation();
  const rifa = location.state?.rifa;

  const [cantidad, setCantidad] = useState(5); // ✅ Valor por defecto 5
  const [numerosComprados, setNumerosComprados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const paquetes = [15, 25, 40];

  const handleCantidadChange = (e) => {
    const value = parseInt(e.target.value);
    // ✅ Validar que sea al menos 5
    if (!isNaN(value) && value >= 5) {
      setCantidad(value);
    } else if (value < 5) {
      setError("La cantidad mínima es 5 números.");
    }
  };

  const handlePaqueteClick = (valor) => {
    setCantidad(valor);
    setError(""); // Limpiar error al seleccionar paquete
  };

  const handleComprar = async () => {
    setError("");
    setSuccess("");
    setNumerosComprados([]);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Debes iniciar sesión para comprar números.");
      navigate("/login");
      return;
    }

    // ✅ Validación en frontend también
    if (cantidad < 5) {
      setError("La cantidad mínima es 5 números.");
      return;
    }

    if (cantidad > (rifa.disponibles || 0)) {
      setError(`Solo hay ${rifa.disponibles} números disponibles.`);
      return;
    }

    try {
      setLoading(true);

      console.log("🔐 Token enviado:", token ? "Sí" : "No");

      const res = await fetch(`${API_URL}/comprar/crear/${rifa.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cantidad }),
      });

      console.log("📤 Respuesta del servidor:", res.status);

      if (!res.ok) {
        // Si es error 401, redirigir al login
        if (res.status === 401) {
          localStorage.removeItem("token");
          setError("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
          navigate("/login");
          return;
        }
        
        const errorData = await res.json();
        setError(errorData.message || "Ocurrió un error en la compra.");
        return;
      }

      const data = await res.json();

      if (data.success) {
        setNumerosComprados(data.numeros || []);
        setSuccess(data.message || "¡Compra exitosa! Se te han asignado números aleatorios.");
        setError("");
      } else {
        setError(data.message || "Ocurrió un error en la compra.");
      }
    } catch (err) {
      console.error("Error en compra:", err);
      setError("Error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  if (!rifa) {
    return (
      <div className="comprar-container">
        <p>No se ha seleccionado ninguna rifa.</p>
        <button onClick={() => navigate(-1)}>Volver</button>
      </div>
    );
  }

  return (
    <div className="comprar-container">
      <h1>Comprar Números de Rifa</h1>
      <p>La cantidad <strong>mínima</strong> a comprar es <strong>5 números</strong>.</p>
      <p><strong>🎲 Los números se asignan aleatoriamente</strong></p>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      {loading && <div className="loading-message">Procesando compra y asignando números aleatorios...</div>}

      <div className="comprar-layout">
        <div className="rifa-info">
          <img src={rifa.imagen_url} alt={rifa.titulo} className="rifa-img" />
          <h2 className="rifa-title">{rifa.titulo}</h2>
          <p className="rifa-desc">{rifa.descripcion}</p>
          <div className="rifa-stats">
            <p><strong>Números disponibles:</strong> {rifa.disponibles || 0}</p>
            <p><strong>Números vendidos:</strong> {rifa.vendidos || 0}</p>
            <p><strong>Total números:</strong> {rifa.cantidad_numeros || 0}</p>
          </div>
        </div>

        <div className="compra-section">
          <div className="cantidad-section">
            <label>Cantidad de números <small>(mínimo 5)</small>:</label>
            <input
              type="number"
              value={cantidad}
              onChange={handleCantidadChange}
              min="5"
              max={rifa.disponibles || 100}
              disabled={loading}
            />
          </div >

          <div className="ofertas-container">
            <div class="oferta-box">
              <h3>🔥 15 Tickets</h3>
              <p>Producto destacado</p>
              <span class="precio">Precio: $15.000</span>
              <button class="btn-comprar">Seleccionar</button>
            </div>

            <div class="oferta-box">
              <h3>🔥 25 Tickets</h3>
              <p>Producto destacado </p>
              <span class="precio">Precio: $25.000</span>
              <button class="btn-comprar">Seleccionar</button>
            </div>

            <div class="oferta-box">
              <h3>🔥 35 Tickets</h3>
              <p>Producto destacado </p>
              <span class="precio">Precio: $35.000</span>
              <button class="btn-comprar">Seleccionar</button>
            </div>
          </div>



          <div className="paquetes-section">
            
            <p>Paquetes recomendados:</p>
            <div className="paquetes-buttons">
              

              {paquetes.map((p) => (
                <button
                  key={p}
                  className={`paquete-btn ${cantidad === p ? 'active' : ''}`}
                  onClick={() => handlePaqueteClick(p)}
                  disabled={loading}
                >
                  {p} números
                </button>
              ))}
            </div>
          </div>

          <div className="acciones">
            <button 
              className="btn-comprar" 
              onClick={handleComprar} 
              disabled={loading || cantidad < 5 || cantidad > (rifa.disponibles || 0)}
            >
              {loading ? "Procesando..." : `Comprar ${cantidad} números`}
            </button>
            <button className="btn-cancel" onClick={() => navigate(-1)} disabled={loading}>
              Cancelar
            </button>
          </div>

          {numerosComprados.length > 0 && (
            <div className="numeros-resultado">
              <h3>🎉 ¡Compra Exitosa!</h3>
              <p><strong>Se te han asignado {numerosComprados.length} números aleatorios:</strong></p>
              <div className="numeros-grid">
                {numerosComprados.map((numero, index) => (
                  <span key={index} className="numero-comprado">
                    #{numero.toString().padStart(5, '0')}
                  </span>
                ))}
              </div>
              <p className="info-aleatorio">
                <small>💡 Los números se asignan aleatoriamente del total disponible</small>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}