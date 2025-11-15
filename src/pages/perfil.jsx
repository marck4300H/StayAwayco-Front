import React, { useEffect, useState } from "react";
import { API_URL } from "../api";
import { useNavigate } from "react-router-dom";
import "../styles/perfil.css";

const Perfil = () => {
  const [usuario, setUsuario] = useState(null);
  const [numerosPorRifa, setNumerosPorRifa] = useState({});
  const [cargando, setCargando] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        // ✅ Obtener datos del usuario
        const res = await fetch(`${API_URL}/usuarios/perfil`, {
          method: "GET",
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });
        
        if (!res.ok) {
          throw new Error(`Error HTTP en perfil: ${res.status}`);
        }
        
        const data = await res.json();

        if (!data.success) {
          console.error("Error en respuesta de perfil:", data.message);
          setCargando(false);
          return;
        }

        setUsuario(data.usuario);

        // ✅ Obtener números comprados - URL ACTUALIZADA
        const numerosRes = await fetch(
          `${API_URL}/comprar/usuario`, // ← Cambiado: ya no necesita cédula en URL
          {
            method: "GET",
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
          }
        );
        
        if (!numerosRes.ok) {
          console.error(`❌ Error en compras: ${numerosRes.status} ${numerosRes.statusText}`);
          setNumerosPorRifa({});
          setCargando(false);
          return;
        }
        
        const numerosData = await numerosRes.json();
        
        console.log("✅ Datos de compras recibidos:", numerosData);

        if (!numerosData.success) {
          console.error("Error en datos de compras:", numerosData.message);
          setNumerosPorRifa({});
          setCargando(false);
          return;
        }

        // ✅ AGRUPAR NÚMEROS POR RIFA
        const agrupado = {};

        (numerosData.numeros || []).forEach((item) => {
          const rifaNombre = item.titulo_rifa || "Rifa desconocida";
          
          if (!agrupado[rifaNombre]) {
            agrupado[rifaNombre] = {
              numeros: []
            };
          }
          agrupado[rifaNombre].numeros.push(Number(item.numero));
        });

        // ✅ ORDENAR LOS NÚMEROS DENTRO DE CADA RIFA
        Object.keys(agrupado).forEach(rifaNombre => {
          agrupado[rifaNombre].numeros.sort((a, b) => a - b);
        });

        console.log("📊 Números agrupados por rifa:", agrupado);
        setNumerosPorRifa(agrupado);
        setCargando(false);
      } catch (error) {
        console.error("❌ Error al cargar perfil:", error);
        setCargando(false);
      }
    };

    if (token) {
      fetchPerfil();
    } else {
      setCargando(false);
      navigate("/login");
    }
  }, [token, navigate]);

  const handleEliminar = async () => {
    if (!confirm("¿Seguro que deseas eliminar tu cuenta? Esta acción es irreversible.")) return;
    try {
      const res = await fetch(`${API_URL}/usuarios/eliminar`, {
        method: "DELETE",
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      const data = await res.json();
      if (data.success) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        alert("Error eliminando tu cuenta: " + (data.message || "Error desconocido"));
      }
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      alert("Error de conexión al eliminar cuenta");
    }
  };

  const formatearNumero = (numero) => {
    if (numero >= 0 && numero <= 9999) {
      return numero.toString().padStart(4, '0');
    }
    return numero.toString().padStart(5, '0');
  };

  if (cargando) return <div className="perfil-cargando">Cargando perfil...</div>;
  if (!usuario) return <div className="perfil-error">Error cargando datos del usuario.</div>;

  return (
    <div className="perfil-container">
      <h2 className="perfil-titulo">Mi Perfil</h2>

      <div className="perfil-card">
        <h3>Datos personales</h3>
        <p><strong>Nombre:</strong> {usuario.nombres} {usuario.apellidos}</p>
        <p><strong>Documento:</strong> {usuario.tipo_documento} {usuario.numero_documento}</p>
        <p><strong>Correo:</strong> {usuario.correo_electronico}</p>
        <p><strong>Teléfono:</strong> {usuario.telefono || "No registrado"}</p>
        <p><strong>Dirección:</strong> {usuario.direccion || "No registrada"}</p>
        <p><strong>Ciudad:</strong> {usuario.ciudad || "No registrada"}</p>
        <p><strong>Departamento:</strong> {usuario.departamento || "No registrado"}</p>

        <div className="perfil-botones">
          <button className="btn-editar" onClick={() => navigate("/editarPerfil")}>Editar perfil</button>
          <button className="btn-eliminar" onClick={handleEliminar}>Eliminar cuenta</button>
        </div>
      </div>

      <div className="perfil-card">
        <h3>Mis números comprados</h3>

        {Object.keys(numerosPorRifa).length === 0 ? (
          <p className="no-numeros">No has comprado ningún número todavía. ¡Participa en una rifa!</p>
        ) : (
          Object.entries(numerosPorRifa).map(([nombreRifa, datosRifa], index) => (
            <div key={index} className="rifa-grupo">
              <h4 className="rifa-nombre">🎯 {nombreRifa}</h4>
              <p className="rifa-info">
                <strong>Números comprados: {datosRifa.numeros.length}</strong>
              </p>
              <div className="numeros-grid">
                {datosRifa.numeros.map((numero, i) => (
                  <div key={i} className="numero-item">
                    #{formatearNumero(numero)}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Perfil;