import React, { useState, useEffect } from "react";
import { API_URL } from "../api";
import "../styles/admin.css";

export default function EditarRifa() {
  const [rifas, setRifas] = useState([]);
  const [selectedRifa, setSelectedRifa] = useState(null);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [cantidadNumeros, setCantidadNumeros] = useState(0);
  const [precioUnitario, setPrecioUnitario] = useState("1000");
  const [cantidadMinima, setCantidadMinima] = useState("5");
  const [imagen, setImagen] = useState(null);
  
  // ✅ NUEVO: Estados para paquetes promocionales
  const [usarPromociones, setUsarPromociones] = useState(false);
  const [paquete1, setPaquete1] = useState({ cantidad_compra: "", numeros_gratis: "" });
  const [paquete2, setPaquete2] = useState({ cantidad_compra: "", numeros_gratis: "" });
  const [paquete3, setPaquete3] = useState({ cantidad_compra: "", numeros_gratis: "" });
  
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchRifas();
  }, []);

  const fetchRifas = async () => {
    try {
      const res = await fetch(`${API_URL}/rifas/`);
      const data = await res.json();
      if (data.success) {
        setRifas(data.rifas);
      } else {
        setMessage("❌ Error al cargar las rifas");
      }
    } catch (err) {
      console.error("Error cargando rifas:", err);
      setMessage("❌ Error de conexión al cargar rifas");
    }
  };

  const handleSelect = (rifa) => {
    setSelectedRifa(rifa);
    setTitulo(rifa.titulo);
    setDescripcion(rifa.descripcion);
    setCantidadNumeros(rifa.cantidad_numeros || 0);
    setPrecioUnitario(rifa.precio_unitario?.toString() || "1000");
    setCantidadMinima(rifa.cantidad_minima?.toString() || "5");
    setImagen(null);
    setMessage("");
    
    // ✅ NUEVO: Cargar paquetes promocionales existentes
    if (rifa.paquetes_promocion) {
      setUsarPromociones(true);
      
      setPaquete1({
        cantidad_compra: rifa.paquetes_promocion.paquete1?.cantidad_compra?.toString() || "",
        numeros_gratis: rifa.paquetes_promocion.paquete1?.numeros_gratis?.toString() || ""
      });
      
      setPaquete2({
        cantidad_compra: rifa.paquetes_promocion.paquete2?.cantidad_compra?.toString() || "",
        numeros_gratis: rifa.paquetes_promocion.paquete2?.numeros_gratis?.toString() || ""
      });
      
      setPaquete3({
        cantidad_compra: rifa.paquetes_promocion.paquete3?.cantidad_compra?.toString() || "",
        numeros_gratis: rifa.paquetes_promocion.paquete3?.numeros_gratis?.toString() || ""
      });
    } else {
      setUsarPromociones(false);
      setPaquete1({ cantidad_compra: "", numeros_gratis: "" });
      setPaquete2({ cantidad_compra: "", numeros_gratis: "" });
      setPaquete3({ cantidad_compra: "", numeros_gratis: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRifa) return;
    setMessage("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("titulo", titulo);
      formData.append("descripcion", descripcion);
      formData.append("cantidad_numeros", cantidadNumeros.toString());
      formData.append("precio_unitario", precioUnitario);
      formData.append("cantidad_minima", cantidadMinima);
      
      if (imagen) {
        formData.append("imagen", imagen);
      }

      // ✅ NUEVO: Agregar paquetes promocionales
      if (usarPromociones) {
        const paquetesPromocion = {};
        
        if (paquete1.cantidad_compra && paquete1.numeros_gratis) {
          const cantidadCompra = parseInt(paquete1.cantidad_compra);
          const numerosGratis = parseInt(paquete1.numeros_gratis);
          if (cantidadCompra > 0 && numerosGratis > 0) {
            paquetesPromocion.paquete1 = { cantidad_compra: cantidadCompra, numeros_gratis: numerosGratis };
          }
        }
        
        if (paquete2.cantidad_compra && paquete2.numeros_gratis) {
          const cantidadCompra = parseInt(paquete2.cantidad_compra);
          const numerosGratis = parseInt(paquete2.numeros_gratis);
          if (cantidadCompra > 0 && numerosGratis > 0) {
            paquetesPromocion.paquete2 = { cantidad_compra: cantidadCompra, numeros_gratis: numerosGratis };
          }
        }
        
        if (paquete3.cantidad_compra && paquete3.numeros_gratis) {
          const cantidadCompra = parseInt(paquete3.cantidad_compra);
          const numerosGratis = parseInt(paquete3.numeros_gratis);
          if (cantidadCompra > 0 && numerosGratis > 0) {
            paquetesPromocion.paquete3 = { cantidad_compra: cantidadCompra, numeros_gratis: numerosGratis };
          }
        }
        
        if (Object.keys(paquetesPromocion).length > 0) {
          formData.append("paquetes_promocion", JSON.stringify(paquetesPromocion));
        } else {
          formData.append("paquetes_promocion", "null");
        }
      } else {
        // Eliminar promociones si se desactivan
        formData.append("paquetes_promocion", "null");
      }

      const res = await fetch(`${API_URL}/rifas/editar/${selectedRifa.id}`, {
        method: "PUT",
        headers: { 
          Authorization: `Bearer ${token}` 
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(`❌ ${data.message || `Error ${res.status}`}`);
        if (res.status === 401) {
          localStorage.removeItem("token");
        }
        return;
      }

      if (data.success) {
        setMessage("✅ Rifa editada con éxito");
        setSelectedRifa(data.rifa);
        fetchRifas();
      } else {
        setMessage("❌ " + (data.message || "Error al editar rifa"));
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-sidebar-layout">
      <div className="admin-sidebar">
        <h2 className="admin-sidebar-title">Rifas Disponibles</h2>
        {rifas.map((rifa) => (
          <div
            key={rifa.id}
            className={`admin-rifa-item ${selectedRifa?.id === rifa.id ? 'selected' : ''}`}
            onClick={() => handleSelect(rifa)}
          >
            <div className="admin-rifa-title">{rifa.titulo}</div>
            <div className="admin-rifa-stats">
              <span>🎯 {rifa.cantidad_numeros} nums</span>
              <span>💰 ${rifa.precio_unitario || 1000}</span>
              <span>📊 {rifa.porcentaje}%</span>
              {rifa.paquetes_promocion && <span>🎁 Promo</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="admin-main-content">
        {selectedRifa ? (
          <>
            <h1 className="admin-form-title">✏️ Editar Rifa</h1>
            <form onSubmit={handleSubmit} className="admin-form">
              <label className="admin-label">Título</label>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
                className="admin-input"
              />

              <label className="admin-label">Descripción</label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                required
                className="admin-input admin-textarea"
              />

              <label className="admin-label">Cantidad de Números (solo lectura)</label>
              <input
                type="number"
                value={cantidadNumeros}
                readOnly
                className="admin-input"
                style={{ backgroundColor: '#f8f9fa', color: '#6c757d', cursor: 'not-allowed' }}
              />

              <label className="admin-label">Precio Unitario ($)</label>
              <input
                type="number"
                value={precioUnitario}
                onChange={(e) => setPrecioUnitario(e.target.value)}
                min="100"
                required
                className="admin-input"
              />

              <label className="admin-label">Cantidad Mínima</label>
              <input
                type="number"
                value={cantidadMinima}
                onChange={(e) => setCantidadMinima(e.target.value)}
                min="1"
                required
                className="admin-input"
              />

              <label className="admin-label">Nueva Imagen (opcional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImagen(e.target.files[0])}
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
                {loading ? "🔄 Editando..." : "💾 Guardar Cambios"}
              </button>
            </form>

            {message && (
              <div className={`admin-message ${message.includes("✅") ? "success" : "error"}`}>
                {message}
              </div>
            )}
          </>
        ) : (
          <div className="admin-placeholder">
            <h2>Selecciona una rifa para editar</h2>
            <p>Elige una rifa del panel lateral para comenzar a editarla</p>
          </div>
        )}
      </div>
    </div>
  );
}
