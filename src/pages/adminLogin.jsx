import { useState } from "react";
import { loginAdmin } from "../api";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await loginAdmin(email, password);

    if (res.token) {
      localStorage.setItem("adminToken", res.token);
      window.location.href = "/admin/dashboard";
    } else {
      setError(res.error || "Error al iniciar sesión");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-lg w-80">
        <h2 className="text-xl font-bold mb-4 text-center">Admin Login</h2>
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full mb-3 rounded"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full mb-3 rounded"
        />
        <button className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600">
          Ingresar
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;
