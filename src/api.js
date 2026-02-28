export const API_URL = "https://api.stayaway.com.co/api";

// ========== AUTENTICACIÓN ==========
export const loginAdmin = async (email, password) => {
  const res = await fetch(`${API_URL}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};

// ========== ASIGNACIÓN MANUAL DE NÚMEROS ==========
export const asignarNumerosManual = async (datos, token) => {
  const res = await fetch(`${API_URL}/admin/asignar-numeros`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(datos),
  });
  return res.json();
};
