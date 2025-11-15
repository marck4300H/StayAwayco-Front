import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";

export default function AdminEstadisticas() {
  // Datos de ejemplo
  const ventasPorMes = [
    { mes: "Ene", ventas: 40 },
    { mes: "Feb", ventas: 55 },
    { mes: "Mar", ventas: 60 },
    { mes: "Abr", ventas: 80 },
    { mes: "May", ventas: 75 },
    { mes: "Jun", ventas: 90 },
  ];

  const ventasCategorias = [
    { categoria: "Básica", total: 120 },
    { categoria: "Premium", total: 80 },
    { categoria: "VIP", total: 30 },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h1>📊 Estadísticas de Ventas</h1>
      <p>Visualiza el rendimiento de las rifas en el tiempo.</p>

      {/* Gráfica de línea */}
      <div style={{ width: "100%", height: 300, marginTop: "30px" }}>
        <h2>Ventas por Mes</h2>
        <ResponsiveContainer>
          <LineChart data={ventasPorMes}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="ventas" stroke="#1e90ff" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfica de barras */}
      <div style={{ width: "100%", height: 300, marginTop: "50px" }}>
        <h2>Ventas por Categoría</h2>
        <ResponsiveContainer>
          <BarChart data={ventasCategorias}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="categoria" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#4caf50" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
