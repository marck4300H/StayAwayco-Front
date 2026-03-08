import React, { useState } from "react";
import { API_URL } from "../api";
import "../styles/admin.css";

export default function CrearRifa() {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState(null);
  const [cantidadNumeros, setCantidadNumeros] = useState("10000");
  const [precioUnitario, setPrecioUnitario] = useState("1000");
  const [cantidadMinima, setCantidadMinima] = useState("5");
  
  // ✅ NUEVO: Estados para paquetes promocionales
  const [usarPromociones, setUsarPromociones] = useState(false);
  const [paquete1, setPaquete1] = useState({ cantidad_compra: "", numeros_gratis: "" });
  const [paquete2, setPaquete2] = useState({ cantidad_compra: "", numeros_gratis: "" });
  const [paquete3, setPaquete3] = useState({ cantidad_compra: "", numeros_gratis: "" });
  
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!imagen) {
      setMessage("⚠️ Selecciona una imagen.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("❌ No hay sesión activa.");
        return;
      }

      const formData = new FormData();
      formData.append("titulo", titulo);
      formData.append("descripcion", descripcion);
      formData.append("cantidad_numeros", cantidadNumeros);
      formData.append("precio_unitario", precioUnitario);
      formData.append("cantidad_minima", cantidadMinima);
      formData.append("imagen", imagen);

      // ✅ NUEVO: Agregar paquetes promocionales si están activados
      if (usarPromociones) {
        const paquetesPromocion = {};
        
        // Validar y agregar paquete 1
        if (paquete1.cantidad_compra && paquete1.numeros_gratis) {
          const cantidadCompra = parseInt(paquete1.cantidad_compra);
          const numerosGratis = parseInt(paquete1.numeros_gratis);
          
          if (cantidadCompra > 0 && numerosGratis > 0) {
            paquetesPromocion.paquete1 = {
              cantidad_compra: cantidadCompra,
              numeros_gratis: numerosGratis
            };
          }
        }
        
        // Validar y agregar paquete 2
        if (paquete2.cantidad_compra && paquete2.numeros_gratis) {
          const cantidadCompra = parseInt(paquete2.cantidad_compra);
          const numerosGratis = parseInt(paquete2.numeros_gratis);
          
          if (cantidadCompra > 0 && numerosGratis > 0) {
            paquetesPromocion.paquete2 = {
              cantidad_compra: cantidadCompra,
              numeros_gratis: numerosGratis
            };
          }
        }
        
        // Validar y agregar paquete 3
        if (paquete3.cantidad_compra && paquete3.numeros_gratis) {
          const cantidadCompra = parseInt(paquete3.cantidad_compra);
          const numerosGratis = parseInt(paquete3.numeros_gratis);
          
          if (cantidadCompra > 0 && numerosGratis > 0) {
            paquetesPromocion.paquete3 = {
              cantidad_compra: cantidadCompra,
              numeros_gratis: numerosGratis
            };
          }
        }
        
        // Solo enviar si hay al menos un paquete configurado
        if (Object.keys(paquetesPromocion).length > 0) {
          formData.append("paquetes_promocion", JSON.stringify(paquetesPromocion));
          console.log("📦 Paquetes promocionales:", paquetesPromocion);
        }
      }

      console.log("📤 Enviando datos para crear rifa...");
      const res = await fetch(`${API_URL}/rifas/crear`, {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${token}` 
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("❌ Error del servidor:", data);
        setMessage(`❌ ${data.message || `Error ${res.status}: No se pudo crear la rifa`}`);
        if (res.status === 401) {
          localStorage.removeItem("token");
        }
        return;
      }

      if (data.success) {
        setMessage("✅ Rifa creada con éxito");
        // Limpiar formulario
        setTitulo("");
        setDescripcion("");
        setImagen(null);
        setCantidadNumeros("10000");
        setPrecioUnitario("1000");
        setCantidadMinima("5");
        setUsarPromociones(false);
        setPaquete1({ cantidad_compra: "", numeros_gratis: "" });
        setPaquete2({ cantidad_compra: "", numeros_gratis: "" });
        setPaquete3({ cantidad_compra: "", numeros_gratis: "" });
        document.querySelector('input[type="file"]').value = "";
      } else {
        setMessage(`❌ Error: ${data.message || "No se pudo crear la rifa"}`);
      }
    } catch (err) {
      console.error("❌ Error de conexión:", err);
      setMessage("❌ Error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-form-container">
      <h1 className="admin-form-title">🎟️ Crear Rifa</h1>
      <p className="admin-form-subtitle">
        Crea una nueva rifa con todos los detalles necesarios para que los usuarios puedan participar.
      </p>

      <form onSubmit={handleSubmit} className="admin-form">
        <label className="admin-label">Título de la rifa</label>
        <input
          type="text"
          placeholder="Ej: Kawazaki Z1000 Edition 2024"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
          className="admin-input"
        />

        <label className="admin-label">Descripción</label>
        <textarea
          placeholder="Describe los detalles de la rifa, premios, condiciones, etc."
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
          className="admin-input admin-textarea"
        />

        <label className="admin-label">Cantidad de números</label>
        <select
          value={cantidadNumeros}
          onChange={(e) => setCantidadNumeros(e.target.value)}
          className="admin-input admin-select"
        >
          <option value="10000">10.000 números (0-9999)</option>
          <option value="100000">100.000 números (0-99999)</option>
        </select>

        <label className="admin-label">Precio unitario ($)</label>
        <input
          type="number"
          placeholder="1000"
          value={precioUnitario}
          onChange={(e) => setPrecioUnitario(e.target.value)}
          min="100"
          required
          className="admin-input"
        />

        <label className="admin-label">Cantidad mínima de compra</label>
        <input
          type="number"
          placeholder="5"
          value={cantidadMinima}
          onChange={(e) => setCantidadMinima(e.target.value)}
          min="1"
          required
          className="admin-input"
        />

        <label className="admin-label">Imagen de la rifa</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImagen(e.target.files[0])}
          required
          className="admin-input admin-file-input"
        />

        {/* ✅ NUEVO: Sección de Paquetes Promocionales */}
        <div className="admin-promociones-section">
          <div className="admin-promociones-header">
            <label className="admin-label">
              <input
                type="checkbox"
                checked={usarPromociones}
                onChange={(e) => setUsarPromociones(e.target.checked)}
                className="admin-checkbox"
              />
              🎁 Activar Paquetes Promocionales (Opcional)
            </label>
            <p className="admin-help-text">
              Configura promociones para incentivar compras. Ejemplo: "Compra 15 números y obtén 1 gratis"
            </p>
          </div>

          {usarPromociones && (
            <div className="admin-paquetes-grid">
              {/* Paquete 1 */}
              <div className="admin-paquete-box">
                <h4>📦 Paquete 1</h4>
                <div className="admin-paquete-inputs">
                  <div className="admin-input-group">
                    <label>Cantidad de compra</label>
                    <input
                      type="number"
                      placeholder="15"
                      value={paquete1.cantidad_compra}
                      onChange={(e) => setPaquete1({...paquete1, cantidad_compra: e.target.value})}
                      min="1"
                      className="admin-input-small"
                    />
                  </div>
                  <div className="admin-input-group">
                    <label>Números gratis</label>
                    <input
                      type="number"
                      placeholder="1"
                      value={paquete1.numeros_gratis}
                      onChange={(e) => setPaquete1({...paquete1, numeros_gratis: e.target.value})}
                      min="1"
                      className="admin-input-small"
                    />
                  </div>
                </div>
                {paquete1.cantidad_compra && paquete1.numeros_gratis && (
                  <p className="admin-paquete-preview">
                    Vista previa: Compra {paquete1.cantidad_compra} → Obtén {paquete1.numeros_gratis} gratis
                  </p>
                )}
              </div>

              {/* Paquete 2 */}
              <div className="admin-paquete-box">
                <h4>📦 Paquete 2</h4>
                <div className="admin-paquete-inputs">
                  <div className="admin-input-group">
                    <label>Cantidad de compra</label>
                    <input
                      type="number"
                      placeholder="25"
                      value={paquete2.cantidad_compra}
                      onChange={(e) => setPaquete2({...paquete2, cantidad_compra: e.target.value})}
                      min="1"
                      className="admin-input-small"
                    />
                  </div>
                  <div className="admin-input-group">
                    <label>Números gratis</label>
                    <input
                      type="number"
                      placeholder="2"
                      value={paquete2.numeros_gratis}
                      onChange={(e) => setPaquete2({...paquete2, numeros_gratis: e.target.value})}
                      min="1"
                      className="admin-input-small"
                    />
                  </div>
                </div>
                {paquete2.cantidad_compra && paquete2.numeros_gratis && (
                  <p className="admin-paquete-preview">
                    Vista previa: Compra {paquete2.cantidad_compra} → Obtén {paquete2.numeros_gratis} gratis
                  </p>
                )}
              </div>

              {/* Paquete 3 */}
              <div className="admin-paquete-box">
                <h4>📦 Paquete 3</h4>
                <div className="admin-paquete-inputs">
                  <div className="admin-input-group">
                    <label>Cantidad de compra</label>
                    <input
                      type="number"
                      placeholder="40"
                      value={paquete3.cantidad_compra}
                      onChange={(e) => setPaquete3({...paquete3, cantidad_compra: e.target.value})}
                      min="1"
                      className="admin-input-small"
                    />
                  </div>
                  <div className="admin-input-group">
                    <label>Números gratis</label>
                    <input
                      type="number"
                      placeholder="3"
                      value={paquete3.numeros_gratis}
                      onChange={(e) => setPaquete3({...paquete3, numeros_gratis: e.target.value})}
                      min="1"
                      className="admin-input-small"
                    />
                  </div>
                </div>
                {paquete3.cantidad_compra && paquete3.numeros_gratis && (
                  <p className="admin-paquete-preview">
                    Vista previa: Compra {paquete3.cantidad_compra} → Obtén {paquete3.numeros_gratis} gratis
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="admin-button"
        >
          {loading ? "🔄 Creando Rifa..." : "🎯 Crear Rifa"}
        </button>
      </form>
      
      {message && (
        <div className={`admin-message ${message.includes("✅") ? "success" : "error"}`}>
          {message}
        </div>
      )}
    </div>
  );
}