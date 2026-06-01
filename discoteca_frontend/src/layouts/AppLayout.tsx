import { Outlet, Link, Navigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";



function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">(
    (localStorage.getItem("theme") as "light" | "dark") || "light"
  );

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);


}

function SearchBar() {
  const [q, setQ] = useState("");
  const location = useLocation();
  useEffect(() => setQ(""), [location.pathname]); // limpiar al navegar

  return (
    <div className="relative w-full max-w-md">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar…"
        className="w-full rounded-xl border border-gray-200 bg-white/80 px-4 py-2.5 pl-10 text-sm outline-none ring-1 ring-transparent transition placeholder:text-gray-400 focus:border-fuchsia-300 focus:ring-fuchsia-200 dark:border-gray-700 dark:bg-gray-900/60 dark:text-gray-100 dark:placeholder:text-gray-400"
      />
      <span className="pointer-events-none absolute left-3 top-2.5 text-gray-400">🔎</span>
    </div>
  );
}

function UserMenu({ name, id }: { name: string; id: string }) {
  const initials = useMemo(
    () =>
      name
        .split(" ")
        .map((n) => n.charAt(0))
        .slice(0, 2)
        .join("")
        .toUpperCase() || "US",
    [name]
  );


  return (
    <div className="relative group">
      <button className="flex items-center gap-3 rounded-xl border border-transparent bg-white/80 px-3 py-2 text-sm font-medium text-gray-700 backdrop-blur transition hover:border-gray-200 hover:bg-white dark:bg-gray-900/60 dark:text-gray-100 dark:hover:border-gray-700">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-fuchsia-600 text-white text-xs font-bold">

        </span>
        <div className="hidden text-left sm:block">
          <div className="leading-4"></div>
          <div className="text-[11px] text-gray-400">{name.slice(0, 6)}…</div>
        </div>
        <span className="text-gray-400">▾</span>
      </button>

      {/* dropdown */}
      <div className="invisible absolute right-0 z-20 mt-2 w-56 translate-y-2 rounded-xl border border-gray-100 bg-white p-2 opacity-0 shadow-xl transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 dark:border-gray-800 dark:bg-gray-900">
        <Link
          to={`/perfil/`}
          className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          Mi perfil
        </Link>

         <Link
          to={`/mesero`}
          className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          Mesero
        </Link>
       
       
        <Link
          to="/auth/login"
          className="block rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          Cerrar sesión
        </Link>
      </div>
    </div>
  );
}

// ————— Layout principal —————
export default function AppLayout() {
  const { data, isError, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 p-6 dark:from-gray-950 dark:to-gray-900">
        <HeaderSkeleton />
        <main className="mx-auto max-w-screen-2xl mt-8">

        </main>
      </div>
    );
  }
  if (isError) {
    return <Navigate to="/auth/login" />;
  }

  if (!data && !isLoading) {
    return <Navigate to="/auth/login" />;
  }

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/40 bg-white/70 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/70">
        <div className="mx-auto flex max-w-screen-2xl items-center justify-between gap-4 px-4 py-3">
          {/* Izquierda: Logo + Home */}
          <div className="flex items-center gap-3">
            <Link to="/" className="group inline-flex items-center gap-2">
              {/* Logo pequeño */}
              <img
                src="/icono.png"
                alt="logotico discoteca"
                className="h-8 w-auto rounded-md object-contain transition group-hover:scale-[1.02]"
              />
              <span className="hidden text-lg font-bold tracking-tight text-gray-800 group-hover:text-fuchsia-700 sm:block dark:text-white">
                Discoteca Manager
              </span>
            </Link>
          </div>

          {/* Centro: acciones rápidas */}
          <div className="hidden flex-1 items-center justify-center gap-3 md:flex">
            <SearchBar />

            
          </div>
          

          {/* Derecha: menú usuario (o NavMenu si prefieres) */}
          <div className="flex items-center gap-3">
            <div className="md:hidden">

            </div>
            {/* <UserMenu name={data.nombre} id={data._id} /> */}
            <UserMenu name={data?.nombres || "usuario"} id={data?._id!} />
          </div>
        </div>
      </header>

      {/* Contenido */}
      <main className="mx-auto max-w-screen-2xl px-4 py-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-4 py-6 text-center text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
        © {new Date().getFullYear()} Discoteca Manager — Todos los derechos reservados.
      </footer>

      {/* Toasts */}
      <ToastContainer pauseOnHover={false} pauseOnFocusLoss={false} />
    </>
  );
}

function HeaderSkeleton() {
  return (
    <div className="sticky top-0 z-40 border-b border-white/40 bg-white/70 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/70">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between gap-4 px-4 py-3">
        <div className="h-8 w-36 rounded bg-gray-200/60 dark:bg-gray-700/50" />
        <div className="hidden flex-1 items-center justify-center gap-3 md:flex">
          <div className="h-10 w-full max-w-md rounded-xl bg-gray-200/60 dark:bg-gray-700/50" />
          <div className="h-10 w-32 rounded-xl bg-gray-200/60 dark:bg-gray-700/50" />
          <div className="h-10 w-40 rounded-xl bg-gray-200/60 dark:bg-gray-700/50" />
        </div>
        <div className="h-10 w-28 rounded-xl bg-gray-200/60 dark:bg-gray-700/50" />
      </div>
    </div>
  );
}
