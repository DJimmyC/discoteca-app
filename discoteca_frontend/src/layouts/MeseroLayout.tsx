import {
  useEffect,
  useState,
} from "react";

import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  ClipboardList,
  Home,
  LogOut,
  Menu,
  ReceiptText,
  UserRound,
  X,
} from "lucide-react";

import {
  useQuery,
} from "@tanstack/react-query";

import {
  getSucursalById,
} from "@/api/SucursalApi";

import {
  useAuth,
} from "@/hooks/useAuth";

export default function MeseroLayout() {

  const navigate =
    useNavigate();

  const location =
    useLocation();

  const {
    data: perfil,
  } = useAuth();

  /* =========================
      MENU MOVIL
  ========================= */

  const [
    menuAbierto,
    setMenuAbierto,
  ] = useState(false);

  /* =========================
      ID SUCURSAL
  ========================= */

  const sucursalId =
    typeof perfil?.idSucursal === "object"
      ? perfil.idSucursal?._id
      : perfil?.idSucursal;

  /* =========================
      OBTENER SUCURSAL
  ========================= */

  const {
    data: sucursal,
    isLoading,
  } = useQuery({

    queryKey: [
      "sucursal",
      sucursalId,
    ],

    queryFn: () =>
      getSucursalById(
        sucursalId!
      ),

    enabled:
      !!sucursalId,

  });

  /* =========================
      CERRAR MENU AL CAMBIAR RUTA
  ========================= */

  useEffect(() => {

    setMenuAbierto(false);

  }, [
    location.pathname,
  ]);

  /* =========================
      BLOQUEAR SCROLL
      CUANDO EL MENU ESTA ABIERTO
  ========================= */

  useEffect(() => {

    if (menuAbierto) {

      document.body.style.overflow =
        "hidden";

    } else {

      document.body.style.overflow =
        "";

    }

    return () => {

      document.body.style.overflow =
        "";

    };

  }, [
    menuAbierto,
  ]);

  /* =========================
      CERRAR SESION
  ========================= */

  const cerrarSesion = () => {

    localStorage.removeItem(
      "AUTH_TOKEN"
    );

    localStorage.removeItem(
      "USER"
    );

    navigate(
      "/auth/login"
    );

  };

  /* =========================
      CLASE DE ENLACES
  ========================= */

  const navLinkClass = (
    isActive: boolean,
    activeColor:
      "fuchsia" | "cyan" = "cyan"
  ) => {

    const activeClasses =
      activeColor === "fuchsia"
        ? "bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-500/30"
        : "bg-cyan-500 text-white shadow-lg shadow-cyan-500/30";

    return `
      flex
      items-center
      gap-3
      rounded-2xl
      px-4
      py-3
      font-semibold
      transition-all
      duration-200
      ${
        isActive
          ? activeClasses
          : "text-gray-300 hover:bg-white/5 hover:text-white"
      }
    `;

  };

  /* =========================
      LOADING
  ========================= */

  if (isLoading) {

    return (

      <div className="flex min-h-screen items-center justify-center bg-[#070B14]">

        <div className="h-16 w-16 animate-spin rounded-full border-4 border-slate-700 border-b-fuchsia-600" />

      </div>

    );

  }

  return (

    <div className="min-h-screen bg-[#070B14] text-white lg:flex">

      {/* =========================
          FONDO OSCURO MOVIL
      ========================= */}

      {menuAbierto && (

        <button
          type="button"
          aria-label="Cerrar menú"
          onClick={() =>
            setMenuAbierto(false)
          }
          className="
            fixed
            inset-0
            z-40
            bg-black/70
            backdrop-blur-sm
            lg:hidden
          "
        />

      )}

      {/* =========================
          SIDEBAR
      ========================= */}

      <aside
        className={`
          fixed
          inset-y-0
          left-0
          z-50
          flex
          w-[85%]
          max-w-72
          flex-col
          border-r
          border-fuchsia-500/20
          bg-[#0B1120]
          shadow-2xl
          transition-transform
          duration-300
          ease-in-out

          lg:static
          lg:z-auto
          lg:min-h-screen
          lg:w-72
          lg:max-w-none
          lg:translate-x-0
          lg:shadow-none

          ${
            menuAbierto
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >

        {/* =========================
            LOGO
        ========================= */}

        <div className="border-b border-fuchsia-500/20 bg-[#0B1120]/80 px-5 py-5">

          <div className="flex items-center justify-between gap-3">

            <div className="flex min-w-0 items-center gap-3">

              <div
                className="
                  flex
                  h-14
                  w-14
                  min-w-14
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-fuchsia-500/30
                  bg-fuchsia-500/10
                  shadow-[0_0_25px_rgba(217,70,239,0.35)]
                "
              >

                <ClipboardList className="h-7 w-7 text-fuchsia-400" />

              </div>

              <div className="min-w-0">

                <h1
                  className="
                    truncate
                    text-2xl
                    font-black
                    leading-none
                    tracking-wide
                    text-fuchsia-400
                  "
                >
                  {perfil?.nombres ||
                    "Mesero"}
                </h1>

                <p
                  className="
                    mt-2
                    text-[10px]
                    uppercase
                    tracking-[4px]
                    text-slate-400
                  "
                >
                  Discoteca
                </p>

              </div>

            </div>

            {/* CERRAR MENU EN MOVIL */}

            <button
              type="button"
              aria-label="Cerrar menú"
              onClick={() =>
                setMenuAbierto(false)
              }
              className="
                rounded-xl
                border
                border-slate-700
                bg-slate-900
                p-2
                text-slate-300
                transition
                hover:border-fuchsia-500
                hover:text-white
                lg:hidden
              "
            >
              <X className="h-5 w-5" />
            </button>

          </div>

        </div>

        {/* =========================
            MENU
        ========================= */}

        <nav className="flex-1 space-y-3 overflow-y-auto p-4">

          <NavLink
            to="/mesero"
            end
            className={({
              isActive,
            }) =>
              navLinkClass(
                isActive,
                "fuchsia"
              )
            }
          >
            <Home size={20} />

            <span>
              Inicio
            </span>
          </NavLink>

          <NavLink
            to="/mesero/comandas"
            className={({
              isActive,
            }) =>
              navLinkClass(
                isActive
              )
            }
          >
            <ClipboardList size={20} />

            <span>
              Comandas
            </span>
          </NavLink>

          <NavLink
            to="/mesero/ventas"
            className={({
              isActive,
            }) =>
              navLinkClass(
                isActive
              )
            }
          >
            <ReceiptText size={20} />

            <span>
              Ventas
            </span>
          </NavLink>

          <NavLink
            to="/mesero/perfil"
            className={({
              isActive,
            }) =>
              navLinkClass(
                isActive
              )
            }
          >
            <UserRound size={20} />

            <span>
              Mi Perfil
            </span>
          </NavLink>

        </nav>

        {/* =========================
            FOOTER
        ========================= */}

        <div className="border-t border-fuchsia-500/20 p-4">

          <button
            type="button"
            onClick={cerrarSesion}
            className="
              flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-2xl
              bg-red-500
              py-3
              font-semibold
              transition-all
              hover:bg-red-600
            "
          >
            <LogOut size={18} />

            Cerrar sesión
          </button>

        </div>

      </aside>

      {/* =========================
          CONTENIDO PRINCIPAL
      ========================= */}

      <main className="min-w-0 flex-1 overflow-x-hidden">

        {/* =========================
            HEADER
        ========================= */}

        <header
          className="
            sticky
            top-0
            z-30
            border-b
            border-fuchsia-500/20
            bg-[#0B1120]/95
            px-4
            py-3
            backdrop-blur-md

            sm:px-6
            lg:min-h-20
            lg:px-8
            lg:py-4
          "
        >

          <div className="flex items-center justify-between gap-3">

            {/* IZQUIERDA */}

            <div className="flex min-w-0 items-center gap-3">

              {/* BOTON MENU MOVIL */}

              <button
                type="button"
                aria-label="Abrir menú"
                onClick={() =>
                  setMenuAbierto(true)
                }
                className="
                  flex
                  h-11
                  w-11
                  min-w-11
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-fuchsia-500/30
                  bg-fuchsia-500/10
                  text-fuchsia-400
                  transition
                  hover:bg-fuchsia-500/20
                  lg:hidden
                "
              >
                <Menu className="h-6 w-6" />
              </button>

              <div className="min-w-0">

                <div className="flex min-w-0 items-center gap-2 lg:gap-3">

                  <h2
                    className="
                      hidden
                      text-lg
                      font-bold
                      text-white
                      sm:block
                      lg:text-2xl
                    "
                  >
                    Panel Mesero
                  </h2>

                  <span className="hidden text-xl font-light text-gray-600 sm:block">
                    /
                  </span>

                  <h1
                    className="
                      truncate
                      text-lg
                      font-black
                      tracking-wide
                      text-fuchsia-400
                      drop-shadow-[0_0_12px_rgba(217,70,239,0.7)]

                      sm:text-xl
                      lg:text-3xl
                    "
                  >
                    {sucursal?.nombreSucursal ||
                      "Sucursal"}
                  </h1>

                </div>

                <p className="mt-1 hidden text-sm text-gray-400 sm:block">
                  Gestión de comandas y pedidos
                </p>

              </div>

            </div>

            {/* DERECHA */}

            <div className="flex min-w-0 items-center gap-2 sm:gap-3">

              {/* PERFIL COMPACTO MOVIL */}

              <div
                className="
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-cyan-500/60
                  bg-[#0c0718]
                  p-1.5
                  shadow-[0_0_15px_#06b6d433]

                  sm:hidden
                "
              >

                <div
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-lg
                    bg-fuchsia-600
                    text-sm
                    font-black
                  "
                >
                  {perfil?.nombres
                    ?.charAt(0)
                    .toUpperCase() || "M"}
                </div>

              </div>

              {/* PERFIL COMPLETO TABLET/DESKTOP */}

              <div
                className="
                  hidden
                  items-center
                  gap-3
                  rounded-2xl
                  border
                  border-cyan-500
                  bg-[#0c0718]
                  px-3
                  py-2
                  shadow-[0_0_20px_#06b6d455]

                  sm:flex
                  lg:px-5
                  lg:py-3
                "
              >

                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    bg-fuchsia-600
                    font-black

                    lg:h-12
                    lg:w-12
                    lg:text-lg
                  "
                >
                  {perfil?.nombres
                    ?.charAt(0)
                    .toUpperCase() || "M"}
                </div>

                <div className="min-w-0">

                  <p className="text-xs text-slate-400">
                    Mesero
                  </p>

                  <p className="max-w-32 truncate font-bold lg:max-w-48">
                    {perfil?.nombres ||
                      "Usuario"}
                  </p>

                </div>

              </div>

            </div>

          </div>

        </header>

        {/* =========================
            RUTAS
        ========================= */}

        <div
          className="
            p-3
            sm:p-4
            md:p-6
          "
        >
          <Outlet />
        </div>

      </main>

    </div>

  );

}