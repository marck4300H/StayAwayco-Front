import React, { useState } from "react";
import "../styles/terminos.css";

const secciones = [
  {
    id: "aceptacion",
    icono: "📋",
    titulo: "1. Aceptación de Términos",
    contenido: `Al acceder, navegar o realizar cualquier compra a través de la plataforma StayAway Rifas, el usuario —en adelante "Participante"— declara haber leído, comprendido y aceptado en su totalidad los presentes Términos y Condiciones, así como la Política de Privacidad vigente.

Si el Participante no está de acuerdo con alguna de estas disposiciones, deberá abstenerse de utilizar la plataforma y sus servicios.

StayAway Rifas se reserva el derecho de modificar unilateralmente estos Términos y Condiciones en cualquier momento y sin previo aviso, mediante la actualización del presente documento. El uso continuado de la plataforma después de cualquier modificación constituye la aceptación de dichos cambios.`,
  },
  {
    id: "autorizacion",
    icono: "⚖️",
    titulo: "2. Autorización Legal de los Sorteos",
    contenido: `Todos los sorteos y rifas realizados a través de StayAway Rifas cuentan con la debida autorización de las entidades competentes. Dicha autorización puede ser otorgada por:

• Coljuegos (Empresa Industrial y Comercial del Estado)
• Alcaldías municipales correspondientes
• Gobernaciones departamentales según el alcance territorial del sorteo

Los números de resolución, fechas de autorización y entidad autorizante de cada rifa son publicados en la plataforma y en nuestras redes sociales oficiales. El Participante puede verificar en cualquier momento la legitimidad de cada sorteo a través de dichos medios.

StayAway Rifas garantiza que ningún sorteo se realiza sin contar previamente con la autorización legal correspondiente de la entidad reguladora aplicable según la normativa colombiana vigente.`,
  },
  {
    id: "participacion",
    icono: "🎟️",
    titulo: "3. Participación y Elegibilidad",
    contenido: `Para participar en cualquier rifa organizada por StayAway Rifas se requiere:

• Ser mayor de edad (18 años cumplidos) conforme a la legislación colombiana vigente.
• Registrar un documento de identidad válido y vigente al momento de la compra.
• Proporcionar información veraz, completa y actualizada en el proceso de registro.

StayAway Rifas NO instiga, promueve ni invita a menores de edad a participar en ningún sorteo. Tampoco fomenta conductas de juego compulsivo o adictivo. Los sorteos son juegos de azar y, por su naturaleza, no garantizan que todos los participantes obtengan un premio. Participar implica aceptar libremente este riesgo.

La plataforma se reserva el derecho de cancelar la participación de cualquier usuario que proporcione información falsa o que incumpla los presentes términos.`,
  },
  {
    id: "premios",
    icono: "🏆",
    titulo: "4. Entrega de Premios",
    contenido: `4.1 Identificación del ganador
El premio será entregado exclusivamente a la persona cuyo documento de identidad haya sido registrado al momento de la compra del boleto ganador. Esta es la única forma válida de acreditar la titularidad del premio.

4.2 Reclamación por terceros
En caso de que el ganador no pueda reclamar personalmente su premio, podrá autorizar a un tercero mediante documento escrito debidamente firmado por el titular del documento registrado, acompañado de copia de su documento de identidad. Sin este requisito, StayAway Rifas no está obligado a entregar el premio a ninguna persona diferente al titular.

4.3 Plazo de entrega
Los premios serán entregados dentro de los cinco (5) días hábiles siguientes a la fecha y hora de publicación oficial del resultado de la lotería de referencia. Pasado este plazo sin que el ganador se haya comunicado, StayAway Rifas realizará el contacto a través de los datos registrados en la plataforma.

4.4 Premios condicionados (licencia o pase de conducción)
Cuando entre los premios se ofrezca un pase o licencia de conducción, este beneficio aplica únicamente si el titular del documento ganador NO posee dicho documento al momento de reclamar el premio. StayAway Rifas no está obligado a otorgar este premio ni a brindar compensación económica equivalente si el ganador ya cuenta con el pase o licencia vigente, salvo que expresamente se haya comunicado lo contrario en nuestras redes sociales o en la promoción correspondiente.`,
  },
  {
    id: "promociones",
    icono: "🎁",
    titulo: "5. Promociones y Beneficios",
    contenido: `Las promociones, descuentos y beneficios adicionales ofrecidos por StayAway Rifas son habilitados según criterio propio y comunicados a través de nuestras redes sociales oficiales y/o en la plataforma.

StayAway Rifas se reserva el derecho de:

• Modificar, suspender o cancelar cualquier promoción en cualquier momento y sin previo aviso.
• Establecer condiciones particulares para cada promoción, las cuales serán comunicadas en el momento de su publicación.
• Limitar la aplicación de promociones a determinados usuarios, rifas o períodos de tiempo.

Las promociones publicadas en canales no oficiales de StayAway Rifas no tienen validez. El Participante debe verificar siempre la autenticidad de cualquier oferta a través de nuestros canales oficiales.`,
  },
  {
    id: "soporte",
    icono: "🛠️",
    titulo: "6. Soporte y Resolución de Inconvenientes",
    contenido: `Cualquier inconveniente, reclamación o solicitud presentada al equipo de soporte de StayAway Rifas será atendida en un plazo máximo de treinta (30) días hábiles contados desde la fecha de radicación formal de la solicitud.

El Participante acepta que:

• No tendrá derecho a exigir una resolución inmediata de su caso.
• Deberá proporcionar toda la información y evidencia necesaria para el análisis de su solicitud.
• La decisión adoptada por StayAway Rifas dentro del plazo establecido será comunicada a través del correo electrónico registrado.

Para presentar una solicitud de soporte, el Participante debe utilizar exclusivamente los canales oficiales habilitados por StayAway Rifas. Solicitudes realizadas por medios no oficiales no generan obligación de respuesta dentro del plazo señalado.`,
  },
  {
    id: "privacidad",
    icono: "🔒",
    titulo: "7. Política de Privacidad y Tratamiento de Datos",
    contenido: `De conformidad con la Ley 1581 de 2012 y el artículo 15 de la Constitución Política de Colombia, StayAway Rifas adopta las siguientes políticas de tratamiento de datos personales:

7.1 Datos recopilados
Los datos personales proporcionados por el Participante (nombre, documento de identidad, correo electrónico, teléfono, ciudad) serán utilizados exclusivamente para:

• Registro y verificación de identidad en los sorteos
• Contacto en caso de resultar ganador
• Envío de comunicaciones relacionadas con la plataforma
• Cumplimiento de obligaciones legales ante entidades reguladoras

7.2 Confidencialidad
StayAway Rifas no venderá, alquilará ni cederá los datos personales del Participante a terceros sin su consentimiento expreso, salvo requerimiento de autoridad competente.

7.3 Derechos del titular
El Participante podrá ejercer en cualquier momento sus derechos de acceso, corrección, supresión y portabilidad de sus datos personales a través de los canales de soporte oficiales de la plataforma.`,
  },
  {
    id: "propiedad",
    icono: "©️",
    titulo: "8. Propiedad Intelectual",
    contenido: `StayAway Rifas es titular de todos los derechos de propiedad intelectual e industrial sobre la plataforma, incluyendo sin limitarse a: diseño gráfico, logotipos, textos, imágenes, software y bases de datos.

Queda expresamente prohibido:

• Reproducir, distribuir o modificar cualquier contenido de la plataforma sin autorización escrita previa.
• Usar el nombre, logotipo o identidad visual de StayAway Rifas para fines comerciales sin autorización.
• Realizar ingeniería inversa o cualquier proceso que permita obtener el código fuente de la plataforma.

El incumplimiento de estas disposiciones podrá dar lugar a acciones legales conforme a la normativa colombiana e internacional sobre propiedad intelectual.`,
  },
  {
    id: "prohibiciones",
    icono: "🚫",
    titulo: "9. Conductas Prohibidas",
    contenido: `El Participante se obliga a no realizar ninguna de las siguientes conductas en la plataforma:

• Proporcionar información falsa, fraudulenta o que suplante la identidad de terceros.
• Intentar manipular, alterar o interferir con el funcionamiento de la plataforma o sus sorteos.
• Publicar, transmitir o distribuir contenido ilícito, ofensivo, difamatorio o que vulnere derechos de terceros.
• Utilizar mecanismos automatizados, bots o scripts para interactuar con la plataforma.
• Participar en nombre de menores de edad o personas que no hayan prestado su consentimiento.

El incumplimiento de cualquiera de estas prohibiciones faculta a StayAway Rifas para suspender o cancelar definitivamente la cuenta del usuario sin derecho a reembolso, y a ejercer las acciones legales correspondientes.`,
  },
  {
    id: "jurisdiccion",
    icono: "🏛️",
    titulo: "10. Ley Aplicable y Jurisdicción",
    contenido: `Los presentes Términos y Condiciones se rigen íntegramente por las leyes de la República de Colombia, en especial:

• Ley 643 de 2001 — Régimen propio del monopolio rentístico de juegos de suerte y azar
• Ley 1581 de 2012 — Protección de datos personales
• Ley 1480 de 2011 — Estatuto del consumidor
• Normativa de Coljuegos y demás entidades reguladoras competentes

Cualquier controversia derivada de la interpretación o aplicación de estos términos será resuelta por los jueces competentes de la República de Colombia, con domicilio principal en la ciudad donde opere StayAway Rifas.

Si alguna cláusula de los presentes Términos fuera declarada nula o inaplicable por autoridad competente, las demás disposiciones conservarán plena vigencia y efecto obligatorio.`,
  },
];

export default function TerminosCondiciones() {
  const [seccionActiva, setSeccionActiva] = useState(null);

  const toggleSeccion = (id) => {
    setSeccionActiva((prev) => (prev === id ? null : id));
  };

  return (
    <div className="terminos-container">
      {/* ── ENCABEZADO ── */}
      <div className="terminos-hero">
        <div className="terminos-hero-inner">
          <div className="terminos-hero-badge">Documento Legal</div>
          <h1 className="terminos-hero-titulo">Términos y Condiciones</h1>
          <p className="terminos-hero-subtitulo">
            StayAway Rifas — Plataforma de sorteos autorizados en Colombia
          </p>
          <div className="terminos-hero-meta">
            <span>📅 Última actualización: Abril 2026</span>
            <span className="terminos-sep">•</span>
            <span>🇨🇴 Rige bajo legislación colombiana</span>
            <span className="terminos-sep">•</span>
            <span>⚖️ Ley 643 de 2001</span>
          </div>
        </div>
      </div>

      {/* ── AVISO IMPORTANTE ── */}
      <div className="terminos-aviso">
        <div className="terminos-aviso-inner">
          <span className="terminos-aviso-icono">⚠️</span>
          <p>
            Al participar en cualquier rifa de StayAway Rifas, el usuario declara ser{" "}
            <strong>mayor de 18 años</strong> y acepta en su totalidad los presentes
            términos. Los sorteos son <strong>juegos de azar</strong> — no garantizamos
            que todos los participantes obtengan un premio. Juega con responsabilidad.
          </p>
        </div>
      </div>

      {/* ── ÍNDICE DE NAVEGACIÓN ── */}
      <div className="terminos-indice-wrapper">
        <div className="terminos-indice">
          <p className="terminos-indice-titulo">Contenido</p>
          <ul>
            {secciones.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setSeccionActiva(s.id);
                    document
                      .getElementById(s.id)
                      ?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                >
                  {s.icono} {s.titulo}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── SECCIONES ACORDEÓN ── */}
      <div className="terminos-secciones">
        {secciones.map((s) => {
          const abierta = seccionActiva === s.id;
          return (
            <div
              key={s.id}
              id={s.id}
              className={`terminos-seccion ${abierta ? "abierta" : ""}`}
            >
              <button
                className="terminos-seccion-header"
                onClick={() => toggleSeccion(s.id)}
                aria-expanded={abierta}
              >
                <span className="terminos-seccion-icono">{s.icono}</span>
                <span className="terminos-seccion-titulo">{s.titulo}</span>
                <span className={`terminos-chevron ${abierta ? "girado" : ""}`}>
                  ▼
                </span>
              </button>

              <div className={`terminos-seccion-body ${abierta ? "visible" : ""}`}>
                <div className="terminos-seccion-contenido">
                  {s.contenido.split("\n").map((linea, i) =>
                    linea.trim() === "" ? (
                      <br key={i} />
                    ) : linea.startsWith("•") ? (
                      <p key={i} className="terminos-bullet">
                        {linea}
                      </p>
                    ) : linea.match(/^\d+\.\d+/) ? (
                      <p key={i} className="terminos-subseccion">
                        {linea}
                      </p>
                    ) : (
                      <p key={i}>{linea}</p>
                    )
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}