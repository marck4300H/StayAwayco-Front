import React from "react";

export default function TermsAndConditions({ onAccept }) {
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-6 md:p-10 text-gray-800">
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold">Términos y Condiciones</h1>
        <p className="mt-2 text-sm text-gray-600">Última actualización: {new Date().toLocaleDateString()}</p>
      </header>

      <article className="space-y-6 text-sm md:text-base leading-relaxed">
        <section>
          <h2 className="font-medium">1. Aceptación de los Términos</h2>
          <p className="mt-2 text-gray-700">
            Al acceder y utilizar esta plataforma de inversiones, el usuario declara haber leído, comprendido y aceptado estos términos y condiciones. Si no está de acuerdo con alguna disposición, debe abstenerse de usar la plataforma.
          </p>
        </section>

        <section>
          <h2 className="font-medium">2. Definiciones</h2>
          <p className="mt-2 text-gray-700">
            <strong>Plataforma:</strong> El sistema digital que ofrece productos y servicios de inversión.
            <br />
            <strong>Usuario:</strong> Persona natural o jurídica que accede o utiliza la plataforma.
            <br />
            <strong>Inversión:</strong> Cualquier aporte económico realizado por el usuario dentro de la plataforma.
          </p>
        </section>

        <section>
          <h2 className="font-medium">3. Registro y Cuenta</h2>
          <p className="mt-2 text-gray-700">
            Para acceder a las funcionalidades de la plataforma, el usuario debe registrarse con información veraz, completa y actualizada. El usuario es responsable por la confidencialidad de sus credenciales y por todas las actividades en su cuenta.
          </p>
        </section>

        <section>
          <h2 className="font-medium">4. Naturaleza de las Inversiones</h2>
          <p className="mt-2 text-gray-700">
            Toda inversión conlleva riesgos y variabilidad. La plataforma no garantiza rendimientos ni resultados específicos. El usuario reconoce la posibilidad de pérdidas totales o parciales del capital y actúa bajo su propia responsabilidad.
          </p>
        </section>

        <section>
          <h2 className="font-medium">5. Operación y Disponibilidad</h2>
          <p className="mt-2 text-gray-700">
            La empresa podrá modificar, limitar o suspender funciones por mantenimiento, mejoras o cumplimiento normativo. Los tiempos de procesamiento pueden variar por factores técnicos.
          </p>
        </section>

        <section>
          <h2 className="font-medium">6. Obligaciones del Usuario</h2>
          <p className="mt-2 text-gray-700">
            El usuario se compromete a usar la plataforma de forma legal y ética. Está prohibido realizar fraudes, crear cuentas múltiples con fines ilícitos o manipular el servicio.
          </p>
        </section>

        <section>
          <h2 className="font-medium">7. Limitación de Responsabilidad</h2>
          <p className="mt-2 text-gray-700">
            La plataforma no será responsable por fallas técnicas, decisiones de inversión del usuario ni pérdidas económicas derivadas de inversiones realizadas en la plataforma.
          </p>
        </section>

        <section>
          <h2 className="font-medium">8. Pagos y Retiros</h2>
          <p className="mt-2 text-gray-700">
            Los aportes deben provenir de métodos de pago autorizados y a nombre del usuario. Los retiros están sujetos a procesos de verificación y tiempos administrativos para prevenir fraude.
          </p>
        </section>

        <section>
          <h2 className="font-medium">9. Protección de Datos</h2>
          <p className="mt-2 text-gray-700">
            La plataforma procesa datos personales conforme a la legislación aplicable. Se implementan medidas técnicas y organizativas razonables, sin garantizar protección absoluta frente a riesgos informáticos.
          </p>
        </section>

        <section>
          <h2 className="font-medium">10. Propiedad Intelectual</h2>
          <p className="mt-2 text-gray-700">
            Todos los contenidos y software de la plataforma son propiedad de la empresa. Queda prohibida su reproducción o uso no autorizado.
          </p>
        </section>

        <section>
          <h2 className="font-medium">11. Modificaciones</h2>
          <p className="mt-2 text-gray-700">
            La empresa puede actualizar estos términos en cualquier momento. El uso continuado de la plataforma implica la aceptación de las modificaciones.
          </p>
        </section>

        <section>
          <h2 className="font-medium">12. Terminación</h2>
          <p className="mt-2 text-gray-700">
            La plataforma podrá suspender o cancelar cuentas que incumplan los términos, muestren actividad sospechosa o representen riesgos de seguridad. El usuario podrá solicitar el cierre de su cuenta en cualquier momento.
          </p>
        </section>

        <section>
          <h2 className="font-medium">13. Ley Aplicable</h2>
          <p className="mt-2 text-gray-700">
            Estos términos se rigen por la ley del país donde opera la plataforma y cualquier controversia será dirimida ante las autoridades competentes.
          </p>
        </section>
      </article>

      
    </div>
  );
}
