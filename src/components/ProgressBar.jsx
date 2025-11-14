export default function ProgressBar({ porcentaje }) {
  if (typeof porcentaje !== "number") return null;

  const value = Math.min(Math.max(porcentaje, 0), 100);

  return (
    <div
      className="w-full bg-gray-700 rounded-full h-6 mt-2 overflow-hidden"
      role="progressbar"
      aria-label="Progreso de la rifa"
      aria-valuenow={value}
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{
          width: `${value}%`,
          backgroundColor: "#16a34a",
        }}
      />
    </div>
  );
}
