import React, { useEffect, useState } from "react";
import { API_URL } from "../api";
import { useNavigate } from "react-router-dom";
import "../styles/perfil.css";
import jsPDF from "jspdf";

const NUMEROS_VISIBLES = 20;

// ─────────────────────────────────────────────
// Generador de PDF (igual al del backend)
// ─────────────────────────────────────────────
const generarPDFNumeros = (usuario, nombreRifa, numerosUsuario) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });

      const PW = 595; // ancho A4 en pt
      const colorAzulOscuro  = [10,  54,  157];
      const colorAzulMedio   = [68,  114, 202];
      const colorAzulClaro   = [146, 180, 244];
      const colorFondoSuave  = [240, 244, 255];
      const colorBorde       = [207, 222, 231];
      const colorFondoGris   = [245, 247, 251];
      const colorTextoOscuro = [45,  45,  45];
      const colorTextoGris   = [90,  99,  112];

      const fill = (r, g, b) => doc.setFillColor(r, g, b);
      const textColor = (r, g, b) => doc.setTextColor(r, g, b);
      const strokeColor = (r, g, b) => doc.setDrawColor(r, g, b);

      // ── ENCABEZADO ──
      fill(...colorAzulOscuro);
      doc.rect(0, 0, PW, 150, "F");

      fill(...colorAzulMedio);
      doc.rect(0, 120, PW, 30, "F");

      textColor(255, 255, 255);
      doc.setFontSize(32);
      doc.setFont("helvetica", "bold");
      doc.text("StayAway Rifas", PW / 2, 70, { align: "center" });

      doc.setFontSize(17);
      doc.setFont("helvetica", "normal");
      doc.text(nombreRifa, PW / 2, 105, { align: "center", maxWidth: 495 });

      doc.setFontSize(10);
      doc.text(
        `Generado el ${new Date().toLocaleDateString("es-CO", {
          year: "numeric", month: "long", day: "numeric",
          hour: "2-digit", minute: "2-digit",
        })}`,
        PW / 2, 138, { align: "center" }
      );

      // ── DATOS DEL USUARIO ──
      let currentY = 180;

      textColor(...colorAzulOscuro);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Información del Participante", 50, currentY);

      fill(...colorAzulMedio);
      doc.rect(50, currentY + 22, 495, 3, "F");

      currentY += 38;

      // Caja usuario
      fill(...colorFondoGris);
      strokeColor(...colorBorde);
      doc.setLineWidth(1.5);
      doc.rect(50, currentY, 495, 120, "FD");

      fill(...colorAzulOscuro);
      doc.rect(50, currentY, 5, 120, "F");

      const datosUsuario = [
        { label: "Nombre Completo:", valor: `${usuario.nombres} ${usuario.apellidos}` },
        { label: "Documento:",       valor: `${usuario.tipo_documento || "CC"} ${usuario.numero_documento}` },
        { label: "Correo:",          valor: usuario.correo_electronico },
        { label: "Teléfono:",        valor: usuario.telefono || "No registrado" },
      ];

      datosUsuario.forEach((dato, i) => {
        const yPos = currentY + 20 + i * 21;
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        textColor(...colorTextoGris);
        doc.text(dato.label, 70, yPos);
        doc.setFont("helvetica", "normal");
        textColor(...colorTextoOscuro);
        doc.text(dato.valor, 220, yPos);
      });

      currentY += 135;

      // ── TUS NÚMEROS ──
      textColor(...colorAzulOscuro);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Tus Números de la Suerte", 50, currentY);

      fill(...colorAzulMedio);
      doc.rect(50, currentY + 22, 495, 3, "F");

      currentY += 38;

      // Badge contador
      fill(...colorFondoSuave);
      doc.rect(50, currentY, 495, 30, "F");
      textColor(...colorAzulOscuro);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(
        `Total de números adquiridos: ${numerosUsuario.length}`,
        PW / 2, currentY + 19, { align: "center" }
      );

      currentY += 46;

      // ── GRID DE NÚMEROS (8 por fila) ──
      const numerosPerRow      = 8;
      const boxWidth           = 56;
      const boxHeight          = 45;
      const horizontalSpacing  = 6;
      const verticalSpacing    = 10;
      const startX = 50;
      let x = startX;
      let y = currentY;

      numerosUsuario.forEach((numero, index) => {
        if (index > 0 && index % numerosPerRow === 0) {
          x = startX;
          y += boxHeight + verticalSpacing;

          if (y > 700) {
            doc.addPage();
            y = 50;

            fill(...colorAzulOscuro);
            doc.rect(0, 0, PW, 45, "F");
            textColor(255, 255, 255);
            doc.setFontSize(13);
            doc.setFont("helvetica", "bold");
            doc.text(
              "StayAway Rifas — Tus Números (continuación)",
              PW / 2, 27, { align: "center" }
            );
            y = 65;
          }
        }

        // Caja del número
        fill(...colorFondoSuave);
        strokeColor(...colorAzulMedio);
        doc.setLineWidth(1.5);
        doc.rect(x, y, boxWidth, boxHeight, "FD");

        fill(...colorAzulOscuro);
        doc.rect(x, y, boxWidth, 6, "F");

        textColor(...colorAzulOscuro);
        doc.setFontSize(15);
        doc.setFont("helvetica", "bold");
        doc.text(`#${numero}`, x + boxWidth / 2, y + 30, { align: "center" });

        x += boxWidth + horizontalSpacing;
      });

      // ── FOOTER ──
      // Siempre en la última página al fondo
      const lastPageY = 750;
      strokeColor(...colorAzulMedio);
      doc.setLineWidth(2);
      doc.line(50, lastPageY, 545, lastPageY);

      fill(...colorAzulOscuro);
      doc.rect(0, lastPageY + 5, PW, 90, "F");

      textColor(255, 255, 255);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("StayAway Rifas", PW / 2, lastPageY + 20, { align: "center" });

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text("Todos los derechos reservados © 2026", PW / 2, lastPageY + 36, { align: "center" });
      doc.text(
        "Guarda este documento como comprobante de tu participación",
        PW / 2, lastPageY + 50, { align: "center" }
      );

      // Descarga
      doc.save(`boletos-${nombreRifa.replace(/\s+/g, "-")}.pdf`);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

// ─────────────────────────────────────────────
// COMPONENTE PERFIL
// ─────────────────────────────────────────────
const Perfil = () => {
  const [usuario, setUsuario] = useState(null);
  const [numerosPorRifa, setNumerosPorRifa] = useState({});
  const [cargando, setCargando] = useState(true);
  const [expandido, setExpandido] = useState({});       // { [nombreRifa]: true/false }
  const [descargando, setDescargando] = useState({});   // { [nombreRifa]: true/false }
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const res = await fetch(`${API_URL}/usuarios/perfil`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error(`Error HTTP en perfil: ${res.status}`);
        const data = await res.json();

        if (!data.success) {
          console.error("Error en respuesta de perfil:", data.message);
          setCargando(false);
          return;
        }

        setUsuario(data.usuario);

        const numerosRes = await fetch(`${API_URL}/usuarios/numeros`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!numerosRes.ok) {
          console.error(`❌ Error en números: ${numerosRes.status}`);
          setNumerosPorRifa({});
          setCargando(false);
          return;
        }

        const numerosData = await numerosRes.json();

        if (!numerosData.success) {
          console.error("Error en datos de números:", numerosData.message);
          setNumerosPorRifa({});
          setCargando(false);
          return;
        }

        // Agrupar y ordenar números por rifa manteniendo los ceros (strings)
        const agrupado = {};
        (numerosData.numeros || []).forEach((item) => {
          const rifaNombre = item.titulo_rifa || "Rifa desconocida";
          if (!agrupado[rifaNombre]) agrupado[rifaNombre] = { numeros: [] };
          // Guardar como string para preservar los ceros (ej: "00005")
          agrupado[rifaNombre].numeros.push(String(item.numero));
        });

        Object.keys(agrupado).forEach((rifaNombre) => {
          // Ordenar numéricamente pero conservando el formato string
          agrupado[rifaNombre].numeros.sort((a, b) => Number(a) - Number(b));
        });

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
          "Content-Type": "application/json",
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



  const toggleExpandido = (nombreRifa) => {
    setExpandido((prev) => ({ ...prev, [nombreRifa]: !prev[nombreRifa] }));
  };

  const handleDescargarPDF = async (nombreRifa, numeros) => {
    setDescargando((prev) => ({ ...prev, [nombreRifa]: true }));
    try {
      // Los números ya vienen formateados en String desde la agrupación
      await generarPDFNumeros(usuario, nombreRifa, numeros);
    } catch (err) {
      console.error("Error generando PDF:", err);
      alert("Ocurrió un error al generar el PDF. Intenta de nuevo.");
    } finally {
      setDescargando((prev) => ({ ...prev, [nombreRifa]: false }));
    }
  };

  if (cargando) return <div className="perfil-cargando">Cargando perfil...</div>;
  if (!usuario) return <div className="perfil-error">Error cargando datos del usuario.</div>;

  return (
    <div className="perfil-container">
      <h2 className="perfil-titulo">Mi Perfil</h2>

      {/* ── DATOS PERSONALES ── */}
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
          <button className="btn-editar" onClick={() => navigate("/editarPerfil")}>
            Editar perfil
          </button>
          <button className="btn-eliminar" onClick={handleEliminar}>
            Eliminar cuenta
          </button>
        </div>
      </div>

      {/* ── MIS NÚMEROS ── */}
      <div className="perfil-card">
        <h3>Mis números comprados</h3>

        {Object.keys(numerosPorRifa).length === 0 ? (
          <p className="no-numeros">
            No has comprado ningún número todavía. ¡Participa en una rifa!
          </p>
        ) : (
          Object.entries(numerosPorRifa).map(([nombreRifa, datosRifa], index) => {
            const total = datosRifa.numeros.length;
            const estaExpandido = expandido[nombreRifa] || false;
            const numerosVisibles = estaExpandido
              ? datosRifa.numeros
              : datosRifa.numeros.slice(0, NUMEROS_VISIBLES);
            const hayMas = total > NUMEROS_VISIBLES;

            return (
              <div key={index} className="rifa-grupo">
                <div className="rifa-grupo-header">
                  <h4 className="rifa-nombre">🎯 {nombreRifa}</h4>
                  {/* Botón descargar PDF */}
                  <button
                    className="btn-descargar-pdf"
                    onClick={() => handleDescargarPDF(nombreRifa, datosRifa.numeros)}
                    disabled={descargando[nombreRifa]}
                    title="Descargar todos mis números en PDF"
                  >
                    {descargando[nombreRifa] ? "⏳ Generando..." : "📄 Descargar PDF"}
                  </button>
                </div>

                <p className="rifa-info">
                  <strong>Números comprados: {total}</strong>
                  {!estaExpandido && hayMas && (
                    <span className="rifa-info-ocultos">
                      {" "}— mostrando {NUMEROS_VISIBLES} de {total}
                    </span>
                  )}
                </p>

                {/* Grid de números */}
                <div className="numeros-grid">
                  {numerosVisibles.map((numero, i) => (
                    <div key={i} className="numero-item">
                      #{numero}
                    </div>
                  ))}
                </div>

                {/* Botón ver todos / colapsar */}
                {hayMas && (
                  <button
                    className="btn-ver-todos"
                    onClick={() => toggleExpandido(nombreRifa)}
                  >
                    {estaExpandido
                      ? "▲ Ver menos"
                      : `▼ Ver todos los números (${total})`}
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Perfil;