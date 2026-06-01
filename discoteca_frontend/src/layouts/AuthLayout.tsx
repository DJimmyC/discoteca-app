import { Outlet, Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Logo from "@/components/Logo";

export default function AuthLayout() {
  return (
    <>
      {/* Fondo con degradado suave */}
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-fuchsia-900">
        {/* Header con logo */}
        <header className="px-4 pt-8">
          <div className="mx-auto flex max-w-xl items-center justify-center">
            <Link to="/" className="inline-flex items-center gap-2">
              {/* Si tu <Logo /> acepta className, puedes pasar w-28. Si no, deja el wrapper para controlar el tamaño. */}
              <div className="w-28">
                <Logo />
              </div>
            </Link>
          </div>
        </header>

        {/* Contenido (rutas de auth) */}
        <main className="px-4 py-10">
          <div className="mx-auto w-full max-w-xl">
            {/* El Outlet renderiza el formulario (login/registro), que ya tiene su propia tarjeta */}
            <Outlet />
          </div>
        </main>

        {/* Footer minimal */}
        <footer className="pb-8 pt-4">
          <p className="text-center text-sm text-slate-300/80">
            © {new Date().getFullYear()} Discoteca Manager. Todos los derechos reservados.
          </p>
        </footer>
      </div>

      {/* Toasts globales */}
      <ToastContainer
        pauseOnHover={false}
        pauseOnFocusLoss={false}
        position="top-right"
        newestOnTop
        theme="colored"
      />
    </>
  );
}
