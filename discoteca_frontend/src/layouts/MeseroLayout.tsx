import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
    ShoppingCart,
    ClipboardList,
    Home,
    LogOut,
    Menu,
} from "lucide-react";
import { getSucursal, getSucursalById } from "@/api/SucursalApi";
import { useAuth } from "@/hooks/useAuth";
import { getPerfilUsuarioById } from "@/api/PerfilUsuarioApi";
import { useQuery } from "@tanstack/react-query";



export default function MeseroLayout() {

    const navigate = useNavigate();

    const { data: perfil } = useAuth();

   


    const sucursalId= 
            typeof perfil?.idSucursal =="object"
            ? perfil.idSucursal?._id
            : perfil?.idSucursal
    const { data: sucursal, isLoading } = useQuery({
        queryKey: [
            "sucural",
            sucursalId
        ],
        queryFn: () =>
            getSucursalById(
                sucursalId
            ),
        enabled:
            !!sucursalId

    })
    

    const cerrarSesion = () => {

        localStorage.removeItem("AUTH_TOKEN");

        navigate("/auth/login");
    };
    if (isLoading) {

        return (

            <div className="flex h-screen items-center justify-center bg-slate-50">

                <div className="h-16 w-16 animate-spin rounded-full border-b-4 border-fuchsia-600"></div>

            </div>

        );

    }

    return (

        <div className="min-h-screen bg-[#070B14] text-white flex">

            {/* SIDEBAR */}
            <aside className="w-72 bg-[#0B1120] border-r border-fuchsia-500/20 flex flex-col">

                {/* LOGO */}
                <div className="h-24 px-6 border-b border-fuchsia-500/20 bg-[#0B1120]/80">

                    <div className="h-full flex items-center gap-4">

                        {/* ICONO */}
                        <div
                            className="
        flex
        h-16
        w-16
        min-w-[64px]
        items-center
        justify-center
        rounded-3xl
        border
        border-fuchsia-500/30
        bg-fuchsia-500/10
        shadow-[0_0_25px_rgba(217,70,239,0.35)]
      "
                        >

                            <ClipboardList
                                className="h-8 w-8 text-fuchsia-400"
                            />

                        </div>

                        {/* TEXTO */}
                        <div className="flex flex-col justify-center">

                            <h1
                                className="
          text-4xl
          font-black
          leading-none
          tracking-wide
          text-fuchsia-400
        "
                            >
                                {perfil?.nombres}
                            </h1>

                            <p
                                className="
          mt-1
          text-xs
          uppercase
          tracking-[6px]
          text-slate-400
        "
                            >
                                Discoteca
                            </p>

                        </div>

                    </div>

                </div>

                {/* MENU */}
                <nav className="flex-1 p-4 space-y-3">

                    <NavLink
                        to="/mesero"
                        end
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 ${isActive
                                ? "bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-500/30"
                                : "hover:bg-white/5 text-gray-300"
                            }`
                        }
                    >
                        <Home size={20} />
                        Inicio
                    </NavLink>

                    <NavLink
                        to="/mesero/comandas"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 ${isActive
                                ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/30"
                                : "hover:bg-white/5 text-gray-300"
                            }`
                        }
                    >
                        <ClipboardList size={20} />
                        Comandas
                    </NavLink>
                     <NavLink
                        to="/mesero/ventas"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 ${isActive
                                ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/30"
                                : "hover:bg-white/5 text-gray-300"
                            }`
                        }
                    >
                        <ClipboardList size={20} />
                        Ventas
                    </NavLink>
                        <NavLink
                        to="/mesero/perfil"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 ${isActive
                                ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/30"
                                : "hover:bg-white/5 text-gray-300"
                            }`
                        }
                    >
                        <ClipboardList size={20} />
                        Mi Perfil
                    </NavLink>

                  

                </nav>

                {/* FOOTER */}
                <div className="p-4 border-t border-fuchsia-500/20">

                    <button
                        onClick={cerrarSesion}
                        className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 transition-all py-3 rounded-2xl font-semibold"
                    >
                        <LogOut size={18} />
                        Cerrar Sesión
                    </button>

                </div>

            </aside>

            {/* CONTENIDO */}
            <main className="flex-1 overflow-y-auto">

                {/* HEADER */}
                <header className="h-20 border-b border-fuchsia-500/20 bg-[#0B1120]/80 backdrop-blur-md px-8 flex items-center justify-between">

                    <div>

                        <div className="flex items-center gap-3 flex-wrap">

                            <h2 className="text-2xl font-bold text-white">
                                Panel Mesero
                            </h2>

                            <span className="text-gray-500 text-2xl font-light">
                                /
                            </span>

                            <h1
                                className="
        text-3xl
        font-black
        tracking-wide
        text-fuchsia-400
        drop-shadow-[0_0_12px_rgba(217,70,239,0.7)]
      "
                            >
                                {sucursal?.nombreSucursal}
                            </h1>

                        </div>

                        <p className="text-sm text-gray-400 mt-1">
                            Gestión de comandas y pedidos
                        </p>

                    </div>

                    <div className="flex items-center gap-3">

                        <div className="w-11 h-11 rounded-full bg-fuchsia-600 flex items-center justify-center font-bold text-lg">

                            D

                        </div>
                        {/* INFO */}
                        <div className="flex items-center gap-4">



                            <div
                                className="
                  flex
                  items-center
                  gap-3
                  rounded-2xl
                  border
                  border-cyan-500
                  bg-[#0c0718]
                  px-5
                  py-3
                  shadow-[0_0_20px_#06b6d455]
                "
                            >

                                <img
                                    src="https://i.pravatar.cc/100"
                                    alt="mesero"
                                    className="
                    h-12
                    w-12
                    rounded-full
                    object-cover
                  "
                                />

                                <div>

                                    <p className="text-xs text-slate-400">

                                        Mesero

                                    </p>

                                    <p className="font-bold">

                                        {perfil?.nombres}

                                    </p>

                                </div>

                            </div>

                        </div>


                    </div>

                </header>

                {/* RENDERIZA LAS RUTAS */}
                <div className="p-6">

                    <Outlet />

                </div>

            </main>

        </div>
    );
}