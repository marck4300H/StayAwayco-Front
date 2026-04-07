import jsPDF from "jspdf";

/**
 * generarPDFBoletos(usuario, rifa, numerosUsuario, totalNumerosReales?)
 *
 * usuario       → response.usuario
 * rifa          → response.rifas[n]
 * numerosUsuario → rifa.numeros  (ya vienen con padding correcto)
 * totalNumerosReales → rifa.cantidad (total que tiene el usuario)
 */
export async function generarPDFBoletos(usuario, rifa, numerosUsuario, totalNumerosReales) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const ANCHO = 210;
  const ALTO = 297;
  const MARGEN = 14;

  const colores = {
    azul: [10, 54, 157],
    azulClaro: [68, 114, 202],
    gris: [100, 116, 139],
    grisFondo: [248, 250, 255],
    negro: [30, 41, 59],
    blanco: [255, 255, 255],
    verde: [22, 163, 74],
    borde: [207, 222, 231],
  };

  const formatearFecha = (iso) => {
    if (!iso) return "Por confirmar";
    return new Date(iso).toLocaleString("es-CO", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatearPrecio = (valor) => {
    if (!valor && valor !== 0) return "—";
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(valor);
  };

  const cargarImagen = (url) => {
    return new Promise((resolve) => {
      if (!url) return resolve(null);
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        resolve({ dataUrl: canvas.toDataURL("image/jpeg", 0.85), width: img.width, height: img.height });
      };
      img.onerror = () => resolve(null);
      img.src = url;
    });
  };

  // ─────────────────────────────────────────────
  // PÁGINA 1 — PORTADA
  // ─────────────────────────────────────────────
  const imagenPortada = await cargarImagen(rifa.imagen_url);

  // Fondo degradado suave
  doc.setFillColor(...colores.grisFondo);
  doc.rect(0, 0, ANCHO, ALTO, "F");

  // Banda superior azul
  doc.setFillColor(...colores.azul);
  doc.rect(0, 0, ANCHO, 52, "F");

  // Logo / Marca
  doc.setTextColor(...colores.blanco);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("STAYAWAY RIFAS", MARGEN, 20);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("www.stayaway.com.co", MARGEN, 27);

  // Título rifa en banda
  doc.setFontSize(15);
  doc.setFont("helvetica", "bold");
  const tituloLines = doc.splitTextToSize(rifa.titulo, ANCHO - MARGEN * 2);
  doc.text(tituloLines, MARGEN, 40);

  // Imagen de portada
  let yActual = 60;
  if (imagenPortada) {
    const ratio = imagenPortada.height / imagenPortada.width;
    const imgW = ANCHO - MARGEN * 2;
    const imgH = Math.min(imgW * ratio, 75);
    doc.addImage(imagenPortada.dataUrl, "JPEG", MARGEN, yActual, imgW, imgH);
    yActual += imgH + 8;
  }

  // Tarjeta datos del usuario
  doc.setFillColor(...colores.blanco);
  doc.roundedRect(MARGEN, yActual, ANCHO - MARGEN * 2, 42, 4, 4, "F");
  doc.setDrawColor(...colores.borde);
  doc.setLineWidth(0.4);
  doc.roundedRect(MARGEN, yActual, ANCHO - MARGEN * 2, 42, 4, 4, "S");

  doc.setTextColor(...colores.azul);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("DATOS DEL PARTICIPANTE", MARGEN + 5, yActual + 7);

  doc.setTextColor(...colores.negro);
  doc.setFontSize(10);
  const nombreCompleto = `${usuario.nombres} ${usuario.apellidos}`;
  doc.text(nombreCompleto, MARGEN + 5, yActual + 15);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...colores.gris);
  doc.text(
    `${usuario.tipo_documento || "CC"} ${usuario.numero_documento}`,
    MARGEN + 5,
    yActual + 22
  );
  doc.text(usuario.correo_electronico, MARGEN + 5, yActual + 28);
  doc.text(
    `Tel: ${usuario.telefono || "—"}`,
    MARGEN + 5,
    yActual + 34
  );

  // Ciudad
  if (usuario.ciudad) {
    doc.text(`📍 ${usuario.ciudad}`, MARGEN + 90, yActual + 22);
  }

  yActual += 50;

  // Tarjeta datos de la rifa
  doc.setFillColor(...colores.blanco);
  doc.roundedRect(MARGEN, yActual, ANCHO - MARGEN * 2, 52, 4, 4, "F");
  doc.setDrawColor(...colores.borde);
  doc.roundedRect(MARGEN, yActual, ANCHO - MARGEN * 2, 52, 4, 4, "S");

  doc.setTextColor(...colores.azul);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("DETALLES DE LA RIFA", MARGEN + 5, yActual + 7);

  const col1X = MARGEN + 5;
  const col2X = MARGEN + 95;
  let yDatos = yActual + 15;

  const dato = (label, valor, x, y) => {
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...colores.gris);
    doc.text(label.toUpperCase(), x, y);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...colores.negro);
    doc.text(String(valor || "—"), x, y + 5);
  };

  dato("TOTAL BOLETOS ADQUIRIDOS", String(totalNumerosReales || numerosUsuario.length), col1X, yDatos);
  dato("VALOR POR BOLETO", formatearPrecio(rifa.precio_unitario), col2X, yDatos);
  yDatos += 14;
  dato("FECHA DEL SORTEO", formatearFecha(rifa.fecha_sorteo), col1X, yDatos);
  dato("PREMIO ESTIMADO", formatearPrecio(rifa.valor_premios), col2X, yDatos);
  yDatos += 14;
  dato("LOTERÍA DE REFERENCIA", rifa.loteria_referencia || "—", col1X, yDatos);
  if (rifa.descripcion_premios) {
    dato("PREMIOS", rifa.descripcion_premios, col2X, yDatos);
  }

  yActual += 60;

  // Info legal Coljuegos
  if (rifa.numero_resolucion || rifa.fecha_autorizacion) {
    doc.setFillColor(240, 244, 255);
    doc.roundedRect(MARGEN, yActual, ANCHO - MARGEN * 2, 28, 3, 3, "F");
    doc.setTextColor(...colores.azulClaro);
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    doc.text("⚖️ INFORMACIÓN LEGAL — COLJUEGOS", MARGEN + 5, yActual + 6);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...colores.gris);
    doc.setFontSize(7);

    const resolucion = `Res. N° ${rifa.numero_resolucion || "___"} — Autorización: ${rifa.fecha_autorizacion || "Por confirmar"}`;
    doc.text(resolucion, MARGEN + 5, yActual + 12);

    if (rifa.responsable_nombre) {
      const responsable = `Responsable: ${rifa.responsable_nombre}${rifa.responsable_id ? ` — ${rifa.responsable_id}` : ""}${rifa.responsable_domicilio ? ` — ${rifa.responsable_domicilio}` : ""}`;
      const respLines = doc.splitTextToSize(responsable, ANCHO - MARGEN * 2 - 10);
      doc.text(respLines, MARGEN + 5, yActual + 18);
    }

    const caducidad = `Término de caducidad: ${rifa.termino_caducidad || "30 días hábiles"}`;
    doc.text(caducidad, MARGEN + 5, yActual + 24);

    yActual += 35;
  }

  // Pie de portada
  doc.setFillColor(...colores.azul);
  doc.rect(0, ALTO - 14, ANCHO, 14, "F");
  doc.setTextColor(...colores.blanco);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Generado el ${new Date().toLocaleString("es-CO")} — StayAway S.A.S.`,
    ANCHO / 2,
    ALTO - 6,
    { align: "center" }
  );

  // ─────────────────────────────────────────────
  // PÁGINAS DE BOLETOS
  // ─────────────────────────────────────────────
  const imagenBoleta = await cargarImagen(rifa.imagen_boleta_url);

  // Layout: 2 boletos por fila, 4 filas = 8 por página
  const BOLETO_W = 88;
  const BOLETO_H = 52;
  const GAP_X = 6;
  const GAP_Y = 5;
  const COLS = 2;
  const FILAS = 4;
  const POR_PAGINA = COLS * FILAS;
  const START_X = [MARGEN, MARGEN + BOLETO_W + GAP_X];
  const START_Y_BASE = MARGEN;

  let boletoIndex = 0;
  const totalBoletos = numerosUsuario.length;

  while (boletoIndex < totalBoletos) {
    doc.addPage();

    // Fondo página
    doc.setFillColor(245, 247, 252);
    doc.rect(0, 0, ANCHO, ALTO, "F");

    // Mini encabezado
    doc.setFillColor(...colores.azul);
    doc.rect(0, 0, ANCHO, 10, "F");
    doc.setTextColor(...colores.blanco);
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.text(`STAYAWAY RIFAS — ${rifa.titulo}`, MARGEN, 6.5);
    doc.text(`${usuario.nombres} ${usuario.apellidos}`, ANCHO - MARGEN, 6.5, { align: "right" });

    for (let fila = 0; fila < FILAS; fila++) {
      for (let col = 0; col < COLS; col++) {
        if (boletoIndex >= totalBoletos) break;

        const numero = numerosUsuario[boletoIndex];
        const bX = START_X[col];
        const bY = START_Y_BASE + 12 + fila * (BOLETO_H + GAP_Y);

        // ── Fondo del boleto ──
        if (imagenBoleta) {
          doc.addImage(imagenBoleta.dataUrl, "JPEG", bX, bY, BOLETO_W, BOLETO_H);
          // Overlay semitransparente para legibilidad
          doc.setFillColor(255, 255, 255);
          doc.setGState(new doc.GState({ opacity: 0.55 }));
          doc.roundedRect(bX, bY, BOLETO_W, BOLETO_H, 3, 3, "F");
          doc.setGState(new doc.GState({ opacity: 1 }));
        } else {
          doc.setFillColor(...colores.blanco);
          doc.roundedRect(bX, bY, BOLETO_W, BOLETO_H, 3, 3, "F");
        }

        // Borde del boleto
        doc.setDrawColor(...colores.azulClaro);
        doc.setLineWidth(0.5);
        doc.roundedRect(bX, bY, BOLETO_W, BOLETO_H, 3, 3, "S");

        // Banda izquierda azul (stub)
        doc.setFillColor(...colores.azul);
        doc.roundedRect(bX, bY, 20, BOLETO_H, 3, 3, "F");
        doc.rect(bX + 17, bY, 3, BOLETO_H, "F"); // Cuadra el borde derecho del stub

        // Línea punteada de separación stub/cuerpo
        doc.setDrawColor(200, 210, 230);
        doc.setLineWidth(0.3);
        doc.setLineDashPattern([1, 1], 0);
        doc.line(bX + 20, bY + 2, bX + 20, bY + BOLETO_H - 2);
        doc.setLineDashPattern([], 0);

        // ── Número en stub ──
        doc.setTextColor(...colores.blanco);
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        // Rotar para escribir vertical en stub
        doc.saveGraphicsState();
        doc.setPage(doc.internal.getCurrentPageInfo().pageNumber);
        const stubCX = bX + 10;
        const stubCY = bY + BOLETO_H / 2;
        doc.text(numero, stubCX, stubCY, {
          angle: 90,
          align: "center",
        });
        doc.restoreGraphicsState();

        // ── Cuerpo del boleto (lado derecho) ──
        const cX = bX + 23; // Inicio del contenido tras stub

        // Título rifa
        doc.setTextColor(...colores.azul);
        doc.setFontSize(7.5);
        doc.setFont("helvetica", "bold");
        const tituloB = doc.splitTextToSize(rifa.titulo, BOLETO_W - 26);
        doc.text(tituloB[0], cX, bY + 8);

        // Número grande central
        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...colores.azul);
        doc.text(numero, cX, bY + 22);

        // Línea divisora
        doc.setDrawColor(...colores.borde);
        doc.setLineWidth(0.3);
        doc.line(cX, bY + 25, bX + BOLETO_W - 3, bY + 25);

        // Campos info boleto
        doc.setFontSize(6);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...colores.gris);

        let yInfo = bY + 29;

        // Valor venta al público
        doc.text("VALOR VENTA AL PÚBLICO", cX, yInfo);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...colores.negro);
        doc.text(formatearPrecio(rifa.precio_unitario), cX + 38, yInfo);

        yInfo += 5;
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...colores.gris);
        doc.text("ACTO ADMINISTRATIVO", cX, yInfo);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...colores.negro);
        const actoAdm = `Res. ${rifa.numero_resolucion || "___"} — ${rifa.fecha_autorizacion || "Por confirmar"}`;
        doc.text(doc.splitTextToSize(actoAdm, BOLETO_W - 27)[0], cX + 30, yInfo);

        yInfo += 5;
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...colores.gris);
        doc.text("LUGAR, HORA Y FECHA DEL SORTEO", cX, yInfo);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...colores.negro);
        const fechaStr = rifa.fecha_sorteo
          ? new Date(rifa.fecha_sorteo).toLocaleDateString("es-CO", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "Por confirmar";
        doc.text(fechaStr, cX, yInfo + 4);

        yInfo += 9;
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...colores.gris);
        doc.text("LOTERÍA DE REFERENCIA", cX, yInfo);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...colores.negro);
        doc.text(rifa.loteria_referencia || "—", cX + 33, yInfo);

        // Pie del boleto — datos responsable
        doc.setFillColor(240, 244, 255);
        doc.rect(bX + 21, bY + BOLETO_H - 10, BOLETO_W - 21, 10, "F");
        doc.setFontSize(5.5);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...colores.gris);

        const pieTexto = [
          `Caducidad: ${rifa.termino_caducidad || "30 días hábiles"}`,
          rifa.responsable_nombre
            ? `Resp: ${rifa.responsable_nombre}${rifa.responsable_id ? ` — ${rifa.responsable_id}` : ""}`
            : "StayAway S.A.S.",
        ].join("  |  ");

        const pieLines = doc.splitTextToSize(pieTexto, BOLETO_W - 24);
        doc.text(pieLines[0], cX, bY + BOLETO_H - 6.5);
        if (pieLines[1]) doc.text(pieLines[1], cX, bY + BOLETO_H - 3);

        // Nombre del participante pequeño
        doc.setFontSize(5);
        doc.setTextColor(...colores.azulClaro);
        doc.text(
          `${usuario.nombres} ${usuario.apellidos} — ${usuario.tipo_documento || "CC"} ${usuario.numero_documento}`,
          cX,
          bY + BOLETO_H - 0.5
        );

        boletoIndex++;
      }
    }

    // Pie de página
    doc.setFillColor(...colores.azul);
    doc.rect(0, ALTO - 10, ANCHO, 10, "F");
    doc.setTextColor(...colores.blanco);
    doc.setFontSize(6.5);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Página ${doc.internal.getCurrentPageInfo().pageNumber} — ${rifa.titulo} — ${usuario.nombres} ${usuario.apellidos}`,
      ANCHO / 2,
      ALTO - 4,
      { align: "center" }
    );
  }

  // ─────────────────────────────────────────────
  // GUARDAR
  // ─────────────────────────────────────────────
  const nombreArchivo = `boletos_${rifa.titulo.replace(/\s+/g, "_").toLowerCase()}_${usuario.numero_documento}.pdf`;
  doc.save(nombreArchivo);
}