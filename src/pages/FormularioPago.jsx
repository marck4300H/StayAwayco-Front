import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { API_URL } from "../api";
import "../styles/formularioPago.css";

export default function FormularioPago() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Datos que vienen desde Comprar.jsx
  const { rifa, cantidad, valorTotal } = location.state || {};
  
  const [formData, setFormData] = useState({
    tipo_documento: "",
    numero_documento: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    departamento: "",
    nombre_completo: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (!rifa || !cantidad) {
      navigate("/comprar");
      return;
    }

    cargarDatosUsuario();
  }, []);

  const cargarDatosUsuario = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/usuarios/perfil`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const data = await res.json();
      if (data.success) {
        setUserData(data.usuario);
        setFormData(prev => ({
          ...prev,
          tipo_documento: data.usuario.tipo_documento || "",
          numero_documento: data.usuario.numero_documento || "",
          telefono: data.usuario.telefono || "",
          direccion: data.usuario.direccion || "",
          ciudad: data.usuario.ciudad || "",
          departamento: data.usuario.departamento || "",
          nombre_completo: `${data.usuario.nombres} ${data.usuario.apellidos}`,
          email: data.usuario.correo_electronico || ""
        }));
      }
    } catch (error) {
      console.error("Error cargando datos usuario:", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      
      // ✅ 1. ACTUALIZAR DATOS DEL USUARIO EN LA BD
      const updateRes = await fetch(`${API_URL}/usuarios/editar`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          tipo_documento: formData.tipo_documento,
          numero_documento: formData.numero_documento,
          telefono: formData.telefono,
          direccion: formData.direccion,
          ciudad: formData.ciudad,
          departamento: formData.departamento
        })
      });

      const updateData = await updateRes.json();
      
      if (!updateData.success) {
        throw new Error(updateData.message || "Error actualizando datos");
      }

      // ✅ 2. CREAR SESIÓN SMART CHECKOUT
      const pagoRes = await fetch(`${API_URL}/pagos/crear`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          rifaId: rifa.id,
          cantidad: cantidad,
          valorTotal: valorTotal
        })
      });

      const pagoData = await pagoRes.json();

      if (!pagoData.success) {
        throw new Error(pagoData.message || "Error creando sesión de pago");
      }

      // ✅ 3. INICIALIZAR SMART CHECKOUT EN EL FRONTEND
      inicializarSmartCheckout(pagoData.sessionData);

    } catch (err) {
      console.error("Error en formulario pago:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  // ✅ INICIALIZAR SMART CHECKOUT
  const inicializarSmartCheckout = (sessionData) => {
    // ✅ CARGAR SCRIPT DE EPAYCO DINÁMICAMENTE
    if (window.ePayco) {
      abrirCheckout(sessionData);
    } else {
      const script = document.createElement('script');
      script.src = 'https://checkout.epayco.co/checkout-v2.js';
      script.onload = () => {
        abrirCheckout(sessionData);
      };
      script.onerror = () => {
        setError("Error al cargar el sistema de pagos");
        setLoading(false);
      };
      document.head.appendChild(script);
    }
  };

  const abrirCheckout = (sessionData) => {
    try {
      console.log("🎯 Inicializando Smart Checkout...");
      
      const checkout = window.ePayco.checkout.configure({
        sessionId: sessionData.sessionId,
        type: "onepage",
        test: process.env.NODE_ENV === 'development'
      });

      // ✅ EVENT HANDLERS
      checkout.onCreated(() => {
        console.log("✅ Transacción creada en ePayco");
      });

      checkout.onErrors((errors) => {
        console.error("❌ Error en checkout:", errors);
        setError("Error en el proceso de pago. Por favor intenta nuevamente.");
        setLoading(false);
      });

      checkout.onClosed(() => {
        console.log("🔒 Checkout cerrado");
        // Redirigir a página de confirmación
        navigate("/confirmacion-pago", { 
          state: { referencia: sessionData.referencia } 
        });
      });

      // ✅ ABRIR CHECKOUT
      checkout.open();
      
    } catch (error) {
      console.error("❌ Error inicializando checkout:", error);
      setError("Error al inicializar el sistema de pagos");
      setLoading(false);
    }
  };

  if (!rifa || !cantidad) {
    return (
      <div className="pago-container">
        <p>Error: No se encontraron datos de compra.</p>
        <button onClick={() => navigate("/")}>Volver al inicio</button>
      </div>
    );
  }

  return (
    <div className="pago-container">
      <div className="pago-header">
        <h1>🎯 Finalizar Compra</h1>
        <p>Completa tus datos para procesar el pago</p>
      </div>

      <div className="pago-layout">
        {/* Resumen de compra */}
        <div className="resumen-compra">
          <h3>Resumen de tu compra</h3>
          <div className="resumen-item">
            <strong>Rifa:</strong> {rifa.titulo}
          </div>
          <div className="resumen-item">
            <strong>Cantidad de números:</strong> {cantidad}
          </div>
          <div className="resumen-item">
            <strong>Valor total:</strong> ${valorTotal.toLocaleString()}
          </div>
          <div className="resumen-nota">
            <small>💡 Serás redirigido a ePayco para completar el pago de forma segura</small>
          </div>
        </div>

        {/* Formulario de datos */}
        <form onSubmit={handleSubmit} className="formulario-pago">
          <h3>Tus datos para la facturación</h3>
          
          {error && <div className="error-message">{error}</div>}

          <div className="form-grid">
            <div className="form-group">
              <label>Tipo de Documento *</label>
              <select 
                name="tipo_documento" 
                value={formData.tipo_documento}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccionar</option>
                <option value="CC">Cédula de Ciudadanía</option>
                <option value="CE">Cédula de Extranjería</option>
                <option value="TI">Tarjeta de Identidad</option>
                <option value="PAS">Pasaporte</option>
              </select>
            </div>

            <div className="form-group">
              <label>Número de Documento *</label>
              <input
                type="text"
                name="numero_documento"
                value={formData.numero_documento}
                onChange={handleInputChange}
                placeholder="Ej: 123456789"
                required
              />
            </div>

            <div className="form-group">
              <label>Teléfono *</label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                placeholder="Ej: 3001234567"
                required
              />
            </div>

            <div className="form-group full-width">
              <label>Dirección *</label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleInputChange}
                placeholder="Dirección completa"
                required
              />
            </div>

            <div className="form-group">
              <label>Ciudad *</label>
              <input
                type="text"
                name="ciudad"
                value={formData.ciudad}
                onChange={handleInputChange}
                placeholder="Ej: Bogotá"
                required
              />
            </div>

            <div className="form-group">
              <label>Departamento *</label>
              <input
                type="text"
                name="departamento"
                value={formData.departamento}
                onChange={handleInputChange}
                placeholder="Ej: Cundinamarca"
                required
              />
            </div>
          </div>

          <div className="pago-actions">
            <button 
              type="button" 
              className="btn-cancel"
              onClick={() => navigate("/comprar", { state: { rifa } })}
            >
              ← Volver
            </button>
            <button 
              type="submit" 
              className="btn-pagar"
              disabled={loading}
            >
              {loading ? "🔄 Procesando..." : `💳 Pagar $${valorTotal.toLocaleString()}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}