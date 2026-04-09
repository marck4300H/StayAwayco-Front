import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { API_URL } from "../api";
import "../styles/checkout.css";

const departamentosColombia = [
  "Amazonas",
  "Antioquia",
  "Arauca",
  "Atlántico",
  "Bolívar",
  "Boyacá",
  "Caldas",
  "Caquetá",
  "Casanare",
  "Cauca",
  "Cesar",
  "Chocó",
  "Córdoba",
  "Cundinamarca",
  "Guainía",
  "Guaviare",
  "Huila",
  "La Guajira",
  "Magdalena",
  "Meta",
  "Nariño",
  "Norte de Santander",
  "Putumayo",
  "Quindío",
  "Risaralda",
  "San Andrés y Providencia",
  "Santander",
  "Sucre",
  "Tolima",
  "Valle del Cauca",
  "Vaupés",
  "Vichada"
];

const municipiosPorDepartamento = {
  Amazonas: ["Leticia", "Puerto Nariño"],
  Antioquia: [
    "Medellín",
    "Bello",
    "Itagüí",
    "Envigado",
    "Sabaneta",
    "Rionegro",
    "La Ceja",
    "Apartadó",
    "Turbo",
    "Santa Fe de Antioquia"
  ],
  Arauca: ["Arauca", "Arauquita", "Saravena", "Tame"],
  Atlántico: [
    "Barranquilla",
    "Soledad",
    "Malambo",
    "Sabanalarga",
    "Galapa",
    "Puerto Colombia",
    "Baranoa",
    "Santo Tomás"
  ],
  Bolívar: [
    "Cartagena",
    "Magangué",
    "Turbaco",
    "Arjona",
    "El Carmen de Bolívar",
    "Mompós"
  ],
  Boyacá: [
    "Tunja",
    "Duitama",
    "Sogamoso",
    "Chiquinquirá",
    "Paipa",
    "Villa de Leyva"
  ],
  Caldas: ["Manizales", "La Dorada", "Chinchiná", "Villamaría", "Riosucio"],
  Caquetá: ["Florencia", "San Vicente del Caguán", "Morelia", "Belén de los Andaquíes"],
  Casanare: ["Yopal", "Aguazul", "Villanueva", "Monterrey", "Paz de Ariporo"],
  Cauca: ["Popayán", "Santander de Quilichao", "Puerto Tejada", "Patía", "Piendamó"],
  Cesar: ["Valledupar", "Aguachica", "Codazzi", "Bosconia", "Curumaní"],
  Chocó: ["Quibdó", "Istmina", "Condoto", "Tadó", "Bahía Solano"],
  Córdoba: ["Montería", "Cereté", "Lorica", "Sahagún", "Planeta Rica"],
  Cundinamarca: [
    "Bogotá",
    "Soacha",
    "Chía",
    "Zipaquirá",
    "Facatativá",
    "Mosquera",
    "Madrid",
    "Funza",
    "Fusagasugá",
    "Girardot",
    "Cajicá"
  ],
  Guainía: ["Inírida"],
  Guaviare: ["San José del Guaviare", "Calamar", "El Retorno"],
  Huila: ["Neiva", "Pitalito", "Garzón", "La Plata", "Campoalegre"],
  "La Guajira": ["Riohacha", "Maicao", "Uribia", "San Juan del Cesar", "Fonseca"],
  Magdalena: ["Santa Marta", "Ciénaga", "Fundación", "Aracataca", "El Banco"],
  Meta: ["Villavicencio", "Acacías", "Granada", "Puerto López", "Restrepo"],
  Nariño: ["Pasto", "Ipiales", "Tumaco", "Túquerres", "La Unión"],
  "Norte de Santander": ["Cúcuta", "Ocaña", "Villa del Rosario", "Los Patios", "Pamplona"],
  Putumayo: ["Mocoa", "Puerto Asís", "Orito", "Sibundoy", "Valle del Guamuez"],
  Quindío: ["Armenia", "Calarcá", "La Tebaida", "Montenegro", "Quimbaya"],
  Risaralda: ["Pereira", "Dosquebradas", "Santa Rosa de Cabal", "La Virginia"],
  "San Andrés y Providencia": ["San Andrés", "Providencia"],
  Santander: [
    "Bucaramanga",
    "Floridablanca",
    "Girón",
    "Piedecuesta",
    "Barrancabermeja",
    "San Gil",
    "Socorro"
  ],
  Sucre: ["Sincelejo", "Corozal", "Sampués", "San Marcos", "Tolú"],
  Tolima: ["Ibagué", "Espinal", "Melgar", "Honda", "Líbano"],
  "Valle del Cauca": [
    "Cali",
    "Palmira",
    "Buenaventura",
    "Tuluá",
    "Buga",
    "Cartago",
    "Jamundí",
    "Yumbo",
    "Candelaria"
  ],
  Vaupés: ["Mitú"],
  Vichada: ["Puerto Carreño"]
};

export default function CheckoutMercadoPago() {
  const navigate = useNavigate();
  const location = useLocation();
  const rifa = location.state?.rifa;
  const cantidad = location.state?.cantidad || 5;

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
    municipio: "",
    departamento: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setUsuario((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "departamento" ? { municipio: "" } : {})
    }));
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

    if (!usuario.departamento.trim()) {
      setError("El departamento es obligatorio");
      return false;
    }

    if (!usuario.municipio.trim()) {
      setError("El municipio es obligatorio");
      return false;
    }

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
        console.log("🔗 Redirigiendo a Mercado Pago:", data.init_point);
        console.log("📦 Datos de la transacción:", data.transaccion);

        sessionStorage.setItem(
          "ultimaTransaccion",
          JSON.stringify({
            referencia: data.transaccion.referencia,
            rifaId: rifa.id,
            rifaTitulo: rifa.titulo,
            cantidad: cantidad,
            total: total,
            precioUnitario: precioUnitario,
            cantidadMinima: cantidadMinima,
            correo: usuario.correo_electronico
          })
        );

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

  const total = cantidad * precioUnitario;
  const municipiosDisponibles =
    municipiosPorDepartamento[usuario.departamento] || [];

  return (
    <div className="checkout-container">
      <h1>Finalizar Compra</h1>

      {error && <div className="error-message">{error}</div>}

      <div className="checkout-layout">
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

          <div className="modificar-cantidad">
            <button
              onClick={() => navigate(-1)}
              className="btn-modificar"
            >
              Modificar Cantidad
            </button>
          </div>
        </div>

        <div className="formulario-datos">
          <h2>Datos Personales</h2>
          <p className="form-info">* Campos obligatorios</p>
          <p className="form-info-secundario">
            Si ya tienes cuenta, se actualizarán tus datos. Si no, tu cuenta se creará automáticamente.
          </p>

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
              <label>Departamento *</label>
              <select
                name="departamento"
                value={usuario.departamento}
                onChange={handleInputChange}
                required
              >
                <option value="">Selecciona un departamento</option>
                {departamentosColombia.map((departamento) => (
                  <option key={departamento} value={departamento}>
                    {departamento}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Municipio *</label>
              <select
                name="municipio"
                value={usuario.municipio}
                onChange={handleInputChange}
                required
                disabled={!usuario.departamento}
              >
                <option value="">
                  {usuario.departamento
                    ? "Selecciona un municipio"
                    : "Primero elige un departamento"}
                </option>
                {municipiosDisponibles.map((municipio) => (
                  <option key={municipio} value={municipio}>
                    {municipio}
                  </option>
                ))}
              </select>
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
