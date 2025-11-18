import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { API_URL } from "../api";
import "../styles/comprar.css";

export default function Comprar() {
  const navigate = useNavigate();
  const location = useLocation();
  const rifa = location.state?.rifa;

  // ✅ USAR CANTIDAD MÍNIMA DINÁMICA DE LA RIFA
  const [cantidad, setCantidad] = useState(rifa?.cantidad_minima || 5);
  const [numerosComprados, setNumerosComprados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ✅ PAQUETES DINÁMICOS CON PRECIOS CALCULADOS SEGÚN LA RIFA
  const precioUnitario = rifa?.precio_unitario || 1000;
  const cantidadMinima = rifa?.cantidad_minima || 5;
  
  const paquetes = [
    { cantidad: Math.max(cantidadMinima, 15), precio: Math.max(cantidadMinima, 15) * precioUnitario, destacado: true },
    { cantidad: Math.max(cantidadMinima, 25), precio: Math.max(cantidadMinima, 25) * precioUnitario, destacado: true },
    { cantidad: Math.max(cantidadMinima, 40), precio: Math.max(cantidadMinima, 40) * precioUnitario, destacado: true }
  ];

  const handleCantidadChange = (e) => {
    const value = parseInt(e.target.value);
    // ✅ Validar que sea al menos la cantidad mínima de la rifa
    if (!isNaN(value) && value >= cantidadMinima) {
      setCantidad(value);
    } else if (value < cantidadMinima) {
      setError(`La cantidad mínima es ${cantidadMinima} números.`);
    }
  };

  const handlePaqueteClick = (cantidadPaquete) => {
    setCantidad(cantidadPaquete);
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

    // ✅ Validación con cantidad mínima dinámica
    if (cantidad < cantidadMinima) {
      setError(`La cantidad mínima es ${cantidadMinima} números.`);
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

  const total = cantidad * precioUnitario;

  return (
    <div className="comprar-container">
      <h1>Comprar Números de Rifa</h1>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      {loading && <div className="loading-message">Procesando compra y asignando números aleatorios...</div>}

      <div className="comprar-layout">
        <div className="rifa-info">
          <img src={rifa.imagen_url} alt={rifa.titulo} className="rifa-img" />
          <h2 className="rifa-title">{rifa.titulo}</h2>
          <p className="rifa-desc">{rifa.descripcion}</p>
          <div className="rifa-precio-info">
            <p><strong>Precio unitario:</strong> ${precioUnitario.toLocaleString()}</p>
            <p><strong>Cantidad mínima:</strong> {cantidadMinima} números</p>
          </div>
        </div>

        <div className="compra-section">
          <div className="cantidad-section">
            <label>Cantidad de números <small>(mínimo {cantidadMinima})</small>:</label>
            <input
              type="number"
              value={cantidad}
              onChange={handleCantidadChange}
              min={cantidadMinima}
              max={rifa.disponibles || 100}
              disabled={loading}
            />
          </div>

          {/* ✅ OFERTAS DINÁMICAS CON PRECIOS CALCULADOS */}
          <div className="ofertas-container">
            {paquetes.map((paquete, index) => (
              <div 
                key={index} 
                className={`oferta-box ${cantidad === paquete.cantidad ? 'active' : ''} ${
                  paquete.destacado ? 'destacado' : ''
                }`}
              >
                {paquete.destacado && <div className="badge-destacado">🔥 POPULAR</div>}
                <h3>{paquete.cantidad} Tickets</h3>
                <p>{paquete.destacado ? 'Mejor valor' : 'Buena opción'}</p>
                <span className="precio">Precio: ${paquete.precio.toLocaleString()}</span>
                <button 
                  className={`btn-oferta ${cantidad === paquete.cantidad ? 'selected' : ''}`}
                  onClick={() => handlePaqueteClick(paquete.cantidad)}
                  disabled={loading || paquete.cantidad > (rifa.disponibles || 0)}
                >
                  {cantidad === paquete.cantidad ? '✓ Seleccionado' : 'Seleccionar'}
                </button>
              </div>
            ))}
          </div>

          <div className="acciones">
            <button 
              className="btn-comprar" 
              onClick={() => navigate("/checkout", { 
                state: { rifa, cantidad } 
              })}
              disabled={loading || cantidad < cantidadMinima || cantidad > (rifa.disponibles || 0)}
            >
              {loading ? "Procesando..." : `Continuar al Pago - $${total.toLocaleString()}`}
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}