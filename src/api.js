export const API_URL = "https://api.stayaway.com.co/api"; // o el dominio de tu backend

export const loginAdmin = async (email, password) => {
  const res = await fetch(`${API_URL}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};
