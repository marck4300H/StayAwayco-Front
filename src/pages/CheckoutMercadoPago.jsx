import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { API_URL } from "../api";
import "../styles/checkout.css";

const departamentosColombia = [
  "Amazonas","Antioquia","Arauca","Atlántico","Bolívar","Boyacá","Caldas","Caquetá","Casanare",
  "Cauca","Cesar","Chocó","Córdoba","Cundinamarca","Guainía","Guaviare","Huila","La Guajira",
  "Magdalena","Meta","Nariño","Norte de Santander","Putumayo","Quindío","Risaralda",
  "San Andrés y Providencia","Santander","Sucre","Tolima","Valle del Cauca","Vaupés","Vichada"
];

const municipiosPorDepartamento = {
  Amazonas: ["Leticia", "Puerto Nariño"],
  Antioquia: ["Abejorral","Abriaquí","Alejandría","Amagá","Amalfi","Andes","Angelópolis","Angostura","Anorí","Anzá","Apartadó","Arboletes","Argelia","Armenia","Barbosa","Bello","Belmira","Betania","Betulia","Briceño","Buriticá","Cáceres","Caicedo","Caldas","Campamento","Cañasgordas","Caracolí","Caramanta","Carepa","Carolina","Caucasia","Chigorodó","Cisneros","Ciudad Bolívar","Cocorná","Concepción","Concordia","Copacabana","Dabeiba","Donmatías","Ebéjico","El Bagre","El Carmen de Viboral","El Santuario","Entrerríos","Envigado","Fredonia","Frontino","Giraldo","Girardota","Gómez Plata","Granada","Guadalupe","Guarne","Guatapé","Heliconia","Hispania","Itagüí","Ituango","Jardín","Jericó","La Ceja","La Estrella","La Pintada","La Unión","Liborina","Maceo","Marinilla","Medellín","Montebello","Murindó","Mutatá","Nariño","Necoclí","Nechí","Olaya","Peñol","Peque","Pueblorrico","Puerto Berrío","Puerto Nare","Puerto Triunfo","Remedios","Rionegro","Sabanalarga","Sabaneta","Salgar","San Andrés de Cuerquía","San Carlos","San Francisco","San Jerónimo","San José de la Montaña","San Juan de Urabá","San Luis","San Pedro de los Milagros","San Pedro de Urabá","San Rafael","San Roque","San Vicente Ferrer","Santa Bárbara","Santa Fe de Antioquia","Santa Rosa de Osos","Santo Domingo","Segovia","Sonsón","Sopetrán","Támesis","Tarazá","Tarso","Titiribí","Toledo","Turbo","Uramita","Urrao","Valdivia","Valparaíso","Vegachí","Venecia","Vigía del Fuerte","Yalí","Yarumal","Yolombó","Yondó","Zaragoza"],
  Arauca: ["Arauca","Arauquita","Cravo Norte","Fortul","Puerto Rondón","Saravena","Tame"],
  Atlántico: ["Baranoa","Barranquilla","Campo de la Cruz","Candelaria","Galapa","Juan de Acosta","Luruaco","Malambo","Manatí","Palmar de Varela","Piojó","Polonuevo","Ponedera","Puerto Colombia","Repelón","Sabanagrande","Sabanalarga","Santa Lucía","Santo Tomás","Soledad","Suan","Tubará","Usiacurí"],
  Bolívar: ["Achí","Altos del Rosario","Arenal","Arjona","Arroyohondo","Barranco de Loba","Calamar","Cantagallo","Cartagena","Cicuco","Clemencia","Córdoba","El Carmen de Bolívar","El Guamo","El Peñón","Hatillo de Loba","Magangué","Mahates","Margarita","María La Baja","Montecristo","Mompós","Morales","Norosí","Pinillos","Regidor","Río Viejo","San Cristóbal","San Estanislao","San Fernando","San Jacinto","San Jacinto del Cauca","San Juan Nepomuceno","San Martín de Loba","San Pablo","Santa Catalina","Santa Rosa","Santa Rosa del Sur","Simití","Soplaviento","Talaigua Nuevo","Tiquisio","Turbaco","Turbaná","Villanueva","Zambrano"],
  Boyacá: ["Almeida","Aquitania","Arcabuco","Belén","Berbeo","Betéitiva","Boavita","Boyacá","Briceño","Buenavista","Busbanzá","Caldas","Campohermoso","Cerinza","Chinavita","Chiquinquirá","Chiscas","Chita","Chitaraque","Chivatá","Chíquiza","Chivor","Ciénega","Cómbita","Coper","Corrales","Covarachía","Cubará","Cucaita","Cuítiva","Duitama","El Cocuy","El Espino","Firavitoba","Floresta","Gachantivá","Gámeza","Garagoa","Guacamayas","Guateque","Guayatá","Güicán","Iza","Jenesano","Jericó","Labranzagrande","La Capilla","La Victoria","Macanal","Maripí","Miraflores","Mongua","Monguí","Moniquirá","Motavita","Muzo","Nobsa","Nuevo Colón","Oicatá","Otanche","Pachavita","Páez","Paipa","Pajarito","Panqueba","Pauna","Paya","Paz de Río","Pesca","Pisba","Puerto Boyacá","Quípama","Ramiriquí","Ráquira","Rondón","Saboyá","Sáchica","Samacá","San Eduardo","San José de Pare","San Luis de Gaceno","San Mateo","San Miguel de Sema","San Pablo de Borbur","Santana","Santa María","Santa Rosa de Viterbo","Santa Sofía","Sativanorte","Sativasur","Siachoque","Soatá","Socha","Socotá","Sogamoso","Somondoco","Sora","Soracá","Sotaquirá","Susacón","Sutamarchán","Sutatenza","Tasco","Tenza","Tibaná","Tibasosa","Tinjacá","Tipacoque","Toca","Togüí","Tópaga","Tota","Tunja","Tununguá","Turmequé","Tuta","Tutazá","Umbita","Ventaquemada","Villa de Leyva","Viracachá","Zetaquira"],
  Caldas: ["Aguadas","Anserma","Aranzazu","Belalcázar","Chinchiná","Filadelfia","La Dorada","La Merced","Manizales","Manzanares","Marmato","Marquetalia","Marulanda","Neira","Norcasia","Pácora","Palestina","Pensilvania","Riosucio","Risaralda","Salamina","Samaná","San José","Supía","Victoria","Villamaría","Viterbo"],
  Caquetá: ["Albania","Belén de los Andaquíes","Cartagena del Chairá","Curillo","El Doncello","El Paujíl","Florencia","La Montañita","Milán","Morelia","Puerto Rico","San José del Fragua","San Vicente del Caguán","Solano","Solita","Valparaíso"],
  Casanare: ["Aguazul","Chámeza","Hato Corozal","La Salina","Maní","Monterrey","Nunchía","Orocué","Paz de Ariporo","Pore","Recetor","Sabanalarga","Sácama","San Luis de Palenque","Támara","Tauramena","Trinidad","Villanueva","Yopal"],
  Cauca: ["Almaguer","Argelia","Balboa","Bolívar","Buenos Aires","Cajibío","Caldono","Caloto","Corinto","El Tambo","Florencia","Guachené","Guapi","Inzá","Jambaló","La Sierra","La Vega","López de Micay","Mercaderes","Miranda","Morales","Padilla","Páez","Patía","Piamonte","Piendamó","Popayán","Puerto Tejada","Puracé","Rosas","San Sebastián","Santa Rosa","Santander de Quilichao","Silvia","Sotará","Suárez","Sucre","Timbío","Timbiquí","Toribío","Totoró","Villa Rica"],
  Cesar: ["Aguachica","Agustín Codazzi","Astrea","Becerril","Bosconia","Chimichagua","Chiriguaná","Curumaní","El Copey","El Paso","Gamarra","González","La Gloria","La Jagua de Ibirico","Manaure Balcón del Cesar","Pailitas","Pelaya","Pueblo Bello","Río de Oro","La Paz","San Alberto","San Diego","San Martín","Tamalameque","Valledupar"],
  Chocó: ["Acandí","Alto Baudó","Atrato","Bagadó","Bahía Solano","Bajo Baudó","Belén de Bajirá","Bojayá","Cantón de San Pablo","Carmen del Darién","Cértegui","Condoto","El Carmen de Atrato","El Litoral del San Juan","Istmina","Juradó","Lloró","Medio Atrato","Medio Baudó","Medio San Juan","Nóvita","Nuquí","Quibdó","Río Iró","Río Quito","Riosucio","San José del Palmar","Sipí","Tadó","Unguía","Unión Panamericana"],
  Córdoba: ["Ayapel","Buenavista","Canalete","Cereté","Chimá","Chinú","Ciénaga de Oro","Cotorra","La Apartada","Lorica","Los Córdobas","Momil","Montelíbano","Montería","Moñitos","Planeta Rica","Pueblo Nuevo","Puerto Escondido","Puerto Libertador","Purísima","Sahagún","San Andrés de Sotavento","San Antero","San Bernardo del Viento","San Carlos","San José de Uré","San Pelayo","Tierralta","Tuchín","Valencia"],
  Cundinamarca: ["Agua de Dios","Albán","Anapoima","Anolaima","Apulo","Arbeláez","Beltrán","Bituima","Bojacá","Bogotá","Cabrera","Cachipay","Cajicá","Caparrapí","Cáqueza","Carmen de Carupa","Chaguaní","Chía","Chipaque","Choachí","Chocontá","Cogua","Cota","Cucunubá","El Colegio","El Peñón","El Rosal","Facatativá","Fomeque","Fosca","Funza","Fúquene","Fusagasugá","Gachalá","Gachancipá","Gachetá","Gama","Girardot","Granada","Guachetá","Guaduas","Guasca","Guataquí","Guatavita","Guayabal de Síquima","Guayabetal","Gutiérrez","Jerusalén","Junín","La Calera","La Mesa","La Palma","La Peña","La Vega","Lenguazaque","Machetá","Madrid","Manta","Medina","Mosquera","Nariño","Nemocón","Nilo","Nimaima","Nocaima","Pacho","Paime","Pandi","Paratebueno","Pasca","Puerto Salgar","Pulí","Quebradanegra","Quetame","Quipile","Ricaurte","San Antonio del Tequendama","San Bernardo","San Cayetano","San Francisco","San Juan de Río Seco","Sasaima","Sesquilé","Sibaté","Silvania","Simijaca","Soacha","Sopó","Subachoque","Suesca","Supatá","Susa","Sutatausa","Tabio","Tausa","Tena","Tenjo","Tibacuy","Tibirita","Tocaima","Tocancipá","Topaipí","Ubalá","Ubaque","Ubaté","Une","Útica","Venecia","Vergara","Vianí","Villagómez","Villapinzón","Villeta","Viotá","Yacopí","Zipacón","Zipaquirá"],
  Guainía: ["Inírida","Barranco Minas","Mapiripana","San Felipe","Puerto Colombia","La Guadalupe","Cacahual","Pana Pana","Morichal"],
  Guaviare: ["Calamar","El Retorno","Miraflores","San José del Guaviare"],
  Huila: ["Acevedo","Agrado","Aipe","Algeciras","Altamira","Baraya","Campoalegre","Colombia","Elías","Garzón","Gigante","Guadalupe","Hobo","Íquira","Isnos","La Argentina","La Plata","Nátaga","Neiva","Oporapa","Paicol","Palermo","Palestina","Pital","Pitalito","Rivera","Saladoblanco","San Agustín","Santa María","Suaza","Tarqui","Tello","Teruel","Tesalia","Timaná","Villavieja","Yaguará"],
  "La Guajira": ["Albania","Barrancas","Dibulla","Distracción","El Molino","Fonseca","Hatonuevo","La Jagua del Pilar","Maicao","Manaure","Riohacha","San Juan del Cesar","Uribia","Urumita","Villanueva"],
  Magdalena: ["Algarrobo","Aracataca","Ariguaní","Cerro de San Antonio","Chibolo","Ciénaga","Concordia","El Banco","El Piñón","El Retén","Fundación","Guamal","Nueva Granada","Pedraza","Pijiño del Carmen","Pivijay","Plato","Puebloviejo","Remolino","Sabanas de San Ángel","Salamina","San Sebastián de Buenavista","San Zenón","Santa Ana","Santa Bárbara de Pinto","Santa Marta","Sitionuevo","Tenerife","Zapayán","Zona Bananera"],
  Meta: ["Acacías","Barranca de Upía","Cabuyaro","Castilla la Nueva","Cubarral","Cumaral","El Calvario","El Castillo","El Dorado","Fuente de Oro","Granada","Guamal","Mapiripán","Mesetas","La Macarena","Uribe","Lejanías","Puerto Concordia","Puerto Gaitán","Puerto López","Puerto Lleras","Puerto Rico","Restrepo","San Carlos de Guaroa","San Juan de Arama","San Juanito","San Martín","Villavicencio","Vista Hermosa"],
  Nariño: ["Albán","Aldana","Ancuyá","Arboleda","Barbacoas","Belén","Buesaco","Colón","Consacá","Contadero","Córdoba","Cuaspud","Cumbal","Cumbitara","Chachagüí","El Charco","El Peñol","El Rosario","El Tablón de Gómez","El Tambo","Funes","Guachucal","Guaitarilla","Gualmatán","Iles","Imués","Ipiales","La Cruz","La Florida","La Llanada","La Tola","La Unión","Leiva","Linares","Los Andes","Magüí","Mallama","Mosquera","Nariño","Olaya Herrera","Ospina","Francisco Pizarro","Policarpa","Potosí","Providencia","Puerres","Pupiales","Ricaurte","Roberto Payán","Samaniego","Sandoná","San Bernardo","San Lorenzo","San Pablo","San Pedro de Cartago","Santa Bárbara","Sapuyes","Taminango","Tangua","Tumaco","Túquerres","Yacuanquer"],
  "Norte de Santander": ["Abrego","Arboledas","Bochalema","Bucarasica","Cácota","Cáchira","Chinácota","Chitagá","Convención","Cúcuta","Cucutilla","Durania","El Carmen","El Tarra","El Zulia","Gramalote","Hacarí","Herrán","Labateca","La Esperanza","La Playa","Los Patios","Lourdes","Mutiscua","Ocaña","Pamplona","Pamplonita","Puerto Santander","Ragonvalia","Salazar","San Calixto","San Cayetano","Santiago","Sardinata","Silos","Teorama","Tibú","Toledo","Villa Caro","Villa del Rosario"],
  Putumayo: ["Colón","Mocoa","Orito","Puerto Asís","Puerto Caicedo","Puerto Guzmán","Leguízamo","Sibundoy","San Francisco","San Miguel","Santiago","Valle del Guamuez","Villagarzón"],
  Quindío: ["Armenia","Buenavista","Calarcá","Circasia","Córdoba","Filandia","Génova","La Tebaida","Montenegro","Pijao","Quimbaya","Salento"],
  Risaralda: ["Apía","Balboa","Belén de Umbría","Dosquebradas","Guática","La Celia","La Virginia","Marsella","Mistrató","Pereira","Pueblo Rico","Quinchía","Santa Rosa de Cabal","Santuario"],
  "San Andrés y Providencia": ["Providencia","San Andrés"],
  Santander: ["Aguada","Albania","Aratoca","Barbosa","Barichara","Barrancabermeja","Betulia","Bolívar","Bucaramanga","Cabrera","California","Capitanejo","Carcasí","Cepitá","Cerrito","Charalá","Charta","Chima","Chipatá","Cimitarra","Concepción","Confines","Contratación","Coromoro","Curití","El Carmen de Chucurí","El Guacamayo","El Peñón","El Playón","Encino","Enciso","Florián","Floridablanca","Galán","Gámbita","Girón","Guaca","Guadalupe","Guapotá","Guavatá","Güepsa","Hato","Jesús María","Jordán","La Belleza","Landázuri","La Paz","Lebrija","Los Santos","Macaravita","Málaga","Matanza","Mogotes","Molagavita","Ocamonte","Oiba","Onzaga","Palmar","Palmas del Socorro","Páramo","Piedecuesta","Pinchote","Puente Nacional","Puerto Parra","Puerto Wilches","Rionegro","Sabana de Torres","San Andrés","San Benito","San Gil","San Joaquín","San José de Miranda","San Miguel","San Vicente de Chucurí","Santa Bárbara","Santa Helena del Opón","Simacota","Socorro","Suaita","Sucre","Suratá","Tona","Valle de San José","Vélez","Vetas","Villanueva","Zapatoca"],
  Sucre: ["Buenavista","Caimito","Chalán","Colosó","Corozal","Coveñas","El Roble","Galeras","Guaranda","La Unión","Los Palmitos","Majagual","Morroa","Ovejas","Palmito","Sampués","San Benito Abad","San Juan de Betulia","San Marcos","San Onofre","San Pedro","Sincé","Sincelejo","Sucre","Santiago de Tolú","Tolú Viejo"],
  Tolima: ["Alpujarra","Alvarado","Ambalema","Anzoátegui","Armero","Ataco","Cajamarca","Carmen de Apicalá","Casabianca","Chaparral","Coello","Coyaima","Cunday","Dolores","Espinal","Falan","Flandes","Fresno","Guamo","Herveo","Honda","Ibagué","Icononzo","Lérida","Líbano","Mariquita","Melgar","Murillo","Natagaima","Ortega","Palocabildo","Piedras","Planadas","Prado","Purificación","Rioblanco","Roncesvalles","Rovira","Saldaña","San Antonio","San Luis","Santa Isabel","Suárez","Valle de San Juan","Venadillo","Villahermosa","Villarrica"],
  "Valle del Cauca": ["Alcalá","Andalucía","Ansermanuevo","Argelia","Bolívar","Buenaventura","Buga","Bugalagrande","Caicedonia","Cali","Calima","Candelaria","Cartago","Dagua","El Águila","El Cairo","El Cerrito","El Dovio","Florida","Ginebra","Guacarí","Jamundí","La Cumbre","La Unión","La Victoria","Obando","Palmira","Pradera","Restrepo","Riofrío","Roldanillo","San Pedro","Sevilla","Toro","Trujillo","Tuluá","Ulloa","Versalles","Vijes","Yotoco","Yumbo","Zarzal"],
  Vaupés: ["Carurú","Mitú","Pacoa","Papunaua","Taraira","Yavaraté"],
  Vichada: ["Cumaribo","La Primavera","Puerto Carreño","Santa Rosalía"]
};

export default function CheckoutMercadoPago() {
  const navigate = useNavigate();
  const location = useLocation();
  const rifa = location.state?.rifa;
  const cantidad = location.state?.cantidad || 5;

  const precioUnitario = rifa?.precio_unitario || 1000;
  const cantidadMinima = rifa?.cantidad_minima || 5;

  const getPaqueteAplicado = (cant) => {
    if (!rifa?.paquetes_promocion) return null;
    let paquete = null;
    ["paquete1", "paquete2", "paquete3"].forEach((key) => {
      const p = rifa.paquetes_promocion[key];
      if (p && p.cantidad_compra === cant && p.numeros_gratis > 0) {
        paquete = p;
      }
    });
    return paquete;
  };
  const paqueteAplicado = getPaqueteAplicado(cantidad);

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
      setError(`La cantidad mínima para esta actividad es ${cantidadMinima} calcas`);
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
      console.log("📥 Respuesta del servidor:", data);

      if (!response.ok) {
        console.error("❌ Error del servidor:", data);
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
          No se ha seleccionado ninguna actividad.
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
                <p><strong>Cantidad:</strong> {cantidad} calcas</p>
                <p><strong>Precio unitario:</strong> ${precioUnitario.toLocaleString()}</p>
                {paqueteAplicado && (
                  <p style={{ color: "#2e7d32", backgroundColor: "#e8f5e9", padding: "4px 8px", borderRadius: "4px", display: "inline-block", margin: "4px 0" }}>
                    🎁 <strong>Incluye {paqueteAplicado.numeros_gratis} calcas gratis</strong>
                  </p>
                )}
                <p className="total"><strong>Total:</strong> ${total.toLocaleString()}</p>
                {cantidad < cantidadMinima && (
                  <p className="advertencia-minima">
                    ⚠️ La cantidad mínima para esta actividad es {cantidadMinima} calcas
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
                <option value="PAS">Pasaporte</option>
                <option value="NIT">NIT</option>
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
