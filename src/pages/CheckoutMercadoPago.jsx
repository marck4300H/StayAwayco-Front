import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { API_URL } from "../api";
import "../styles/checkout.css";

export default function CheckoutMercadoPago() {
  const navigate = useNavigate();
  const location = useLocation();
  const rifa = location.state?.rifa;
  const cantidad = location.state?.cantidad || 5;

  // ✅ CORREGIDO: Usar precio unitario y cantidad mínima DINÁMICOS de la rifa
  const precioUnitario = rifa?.precio_unitario || 1000;
  const cantidadMinima = rifa?.cantidad_minima || 5;

  const [usuario, setUsuario] = useState({
    nombres: "",
    apellidos: "",
    correo_electronico: "",
    telefono: "",
    tipo_documento: "CC",
    numero_documento: "",
    direccion: "",
    ciudad: "",
    departamento: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    setUsuario({
      ...usuario,
      [e.target.name]: e.target.value
    });
  };

  const validarFormulario = () => {
    if (!usuario.nombres.trim()) {
      setError("El nombre es obligatorio");
      return false;
    }
    if (!usuario.apellidos.trim()) {
      setError("Los apellidos son obligatorios");
      return false;
    }
    if (!usuario.correo_electronico.trim() || !/\S+@\S+\.\S+/.test(usuario.correo_electronico)) {
      setError("Ingresa un correo electrónico válido");
      return false;
    }
    if (!usuario.numero_documento.trim()) {
      setError("El número de documento es obligatorio");
      return false;
    }

    // ✅ VALIDAR CANTIDAD MÍNIMA DINÁMICA DE LA RIFA
    if (cantidad < cantidadMinima) {
      setError(`La cantidad mínima para esta rifa es ${cantidadMinima} números`);
      return false;
    }

    return true;
  };

  const handlePagar = async () => {
    setError("");
    
    if (!validarFormulario()) {
      return;
    }

    try {
      setLoading(true);
      
      // ✅ CALCULAR TOTAL CON PRECIO UNITARIO DINÁMICO
      const total = cantidad * precioUnitario;
      
      console.log("📤 Enviando datos al backend:", {
        rifaId: rifa.id,
        cantidad: cantidad,
        precioUnitario: precioUnitario,
        cantidadMinima: cantidadMinima,
        total: total,
        usuario: usuario
      });

      const response = await fetch(`${API_URL}/pagos/crear-orden`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          rifaId: rifa.id,
          cantidad: cantidad,
          usuario: usuario,
          returnUrl: `${window.location.origin}/pago-exitoso`,
          cancelUrl: `${window.location.origin}/pago-fallido`
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al crear la orden de pago");
      }

      if (data.success && data.init_point) {
        // ✅ Redirigir a Mercado Pago
        console.log("🔗 Redirigiendo a Mercado Pago:", data.init_point);
        console.log("📦 Datos de la transacción:", data.transaccion);
        
        // Guardar referencia en sessionStorage para usar después
        sessionStorage.setItem('ultimaTransaccion', JSON.stringify({
          referencia: data.transaccion.referencia,
          rifaId: rifa.id,
          rifaTitulo: rifa.titulo,
          cantidad: cantidad,
          total: total,
          precioUnitario: precioUnitario,
          cantidadMinima: cantidadMinima
        }));

        window.location.href = data.init_point;
      } else {
        throw new Error("No se pudo generar el link de pago");
      }

    } catch (err) {
      console.error("❌ Error en el pago:", err);
      setError(err.message || "Error al procesar el pago");
    } finally {
      setLoading(false);
    }
  };

  if (!rifa) {
    return (
      <div className="checkout-container">
        <div className="error-message">
          No se ha seleccionado ninguna rifa.
        </div>
        <button onClick={() => navigate("/")} className="btn-volver">
          Volver al inicio
        </button>
      </div>
    );
  }

  // ✅ CALCULAR TOTAL CON PRECIO UNITARIO DINÁMICO
  const total = cantidad * precioUnitario;

  return (
    <div className="checkout-container">
      <h1>Finalizar Compra</h1>
      
      {error && <div className="error-message">{error}</div>}

      <div className="checkout-layout">
        {/* Información de la compra */}
        <div className="compra-info">
          <h2>Resumen de Compra</h2>
          <div className="rifa-card-checkout">
            <img src={rifa.imagen_url} alt={rifa.titulo} />
            <div className="rifa-details">
              <h3>{rifa.titulo}</h3>
              <p>{rifa.descripcion}</p>
              <div className="compra-details">
                <p><strong>Cantidad:</strong> {cantidad} números</p>
                <p><strong>Precio unitario:</strong> ${precioUnitario.toLocaleString()}</p>
                <p><strong>Cantidad mínima:</strong> {cantidadMinima} números</p>
                <p className="total"><strong>Total:</strong> ${total.toLocaleString()}</p>
                {cantidad < cantidadMinima && (
                  <p className="advertencia-minima">
                    ⚠️ La cantidad mínima para esta rifa es {cantidadMinima} números
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Botón para modificar cantidad */}
          <div className="modificar-cantidad">
            <button 
              onClick={() => navigate(-1)}
              className="btn-modificar"
            >
            Modificar Cantidad
            </button>
          </div>
        </div>

        {/* Formulario de datos */}
        <div className="formulario-datos">
          <h2>Datos Personales</h2>
          <p className="form-info">* Campos obligatorios</p>
          
          <div className="form-grid">
            <div className="form-group">
              <label>Nombres *</label>
              <input
                type="text"
                name="nombres"
                value={usuario.nombres}
                onChange={handleInputChange}
                required
                placeholder="Juan Carlos"
              />
            </div>

            <div className="form-group">
              <label>Apellidos *</label>
              <input
                type="text"
                name="apellidos"
                value={usuario.apellidos}
                onChange={handleInputChange}
                required
                placeholder="Pérez Gómez"
              />
            </div>

            <div className="form-group">
              <label>Correo Electrónico *</label>
              <input
                type="email"
                name="correo_electronico"
                value={usuario.correo_electronico}
                onChange={handleInputChange}
                required
                placeholder="tu@email.com"
              />
            </div>

            <div className="form-group">
              <label>Teléfono</label>
              <input
                type="tel"
                name="telefono"
                value={usuario.telefono}
                onChange={handleInputChange}
                placeholder="3001234567"
              />
            </div>

            <div className="form-group">
              <label>Tipo de Documento *</label>
              <select
                name="tipo_documento"
                value={usuario.tipo_documento}
                onChange={handleInputChange}
                required
              >
                <option value="CC">Cédula de Ciudadanía</option>
                <option value="CE">Cédula de Extranjería</option>
                <option value="TI">Tarjeta de Identidad</option>
                <option value="PA">Pasaporte</option>
              </select>
            </div>

            <div className="form-group">
              <label>Número de Documento *</label>
              <input
                type="text"
                name="numero_documento"
                value={usuario.numero_documento}
                onChange={handleInputChange}
                required
                placeholder="1234567890"
              />
            </div>

            <div className="form-group full-width">
              <label>Dirección</label>
              <input
                type="text"
                name="direccion"
                value={usuario.direccion}
                onChange={handleInputChange}
                placeholder="Cra 123 #45-67"
              />
            </div>

            <div className="form-group">
              <label>Ciudad</label>
              <input
                type="text"
                name="ciudad"
                value={usuario.ciudad}
                onChange={handleInputChange}
                placeholder="Bogotá"
              />
            </div>

            <div className="form-group">
              <label>Departamento</label>
              <input
                type="text"
                name="departamento"
                value={usuario.departamento}
                onChange={handleInputChange}
                placeholder="Cundinamarca"
              />
            </div>
          </div>

          <div className="acciones-checkout">
            <button 
              onClick={handlePagar}
              disabled={loading || cantidad < cantidadMinima}
              className="btn-pagar"
            >
              {loading ? "Procesando..." : `Pagar $${total.toLocaleString()}`}
            </button>
            
            <button 
              onClick={() => navigate(-1)}
              disabled={loading}
              className="btn-cancelar"
            >
              Cancelar
            </button>
          </div>

          <div className="security-info">
            <p>🔒 Pago 100% seguro procesado por Mercado Pago</p>
            <small>Tu información está protegida con encriptación SSL</small>
          </div>
        </div>
      </div>
    </div>
  );
}