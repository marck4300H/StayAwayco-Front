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

// ========== SORTEO DE RIFAS ==========
export const sortearRifa = async (datos, token) => {
  const res = await fetch(`${API_URL}/admin/sortear-rifa`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(datos),
  });
  
  // Retornar tanto la respuesta como el status para manejar errores
  const jsonData = await res.json();
  return {
    ...jsonData,
    status: res.status
  };
};

export const sorteoDesierto = async (datos, token) => {
  const res = await fetch(`${API_URL}/admin/sorteo-desierto`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(datos),
  });
  return res.json();
};

export const obtenerGanador = async (rifaId, token) => {
  const headers = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  const res = await fetch(`${API_URL}/admin/ganador/${rifaId}`, {
    method: "GET",
    headers: headers,
  });
  return res.json();
};
