import { useAuth } from "../../Context/AuthContext";

export default function AuthLayout() {
  const { setUsuario } = useAuth();

  // 👉 cuando hagas login exitoso
  const handleLoginSuccess = (userData: any) => {
    setUsuario(userData); // Guardas el usuario en contexto
  };

  return (
    <div>
      {/* aquí tu layout de login/registro */}
    </div>
  );
}
