import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  deleteRolById,
  getRoles,
} from "@/api/RolApi";

import MenuListDashboard from "@/components/MenuListDashboard";
import RolDetailModal from "@/components/rol/RolDetailModal";

import Swal from "sweetalert2";

import {
  ShieldCheck,
  Pencil,
  Trash2,
  Search,
  Eye
} from "lucide-react";

import { motion } from "framer-motion";

export default function RolDetailView() {

  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");

  /* =========================
      GET ROLES
  ========================= */
  const { data, isLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
  });

  /* =========================
      FILTRAR
  ========================= */
  const filteredRoles = useMemo(() => {

    if (!data) return [];

    return data.filter((rol) =>
      rol.nombre
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  }, [data, search]);

  /* =========================
      DELETE
  ========================= */
  const { mutate } = useMutation({

    mutationFn: deleteRolById,

    onError: async (error: any) => {

      await Swal.fire({
        icon: "error",
        title: error.message,
        timer: 2000,
        showConfirmButton: false,
      });

      queryClient.invalidateQueries({
        queryKey: ["roles"],
      });

    },

    onSuccess: async (data: any) => {

      await Swal.fire({
        icon: "success",
        title: data,
        timer: 2000,
        showConfirmButton: false,
      });

      queryClient.invalidateQueries({
        queryKey: ["roles"],
      });

    },

  });

  /* =========================
      LOADING
  ========================= */
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="h-16 w-16 animate-spin rounded-full border-b-4 border-fuchsia-600"></div>
      </div>
    );
  }

  return (

    <div className="flex h-screen overflow-hidden bg-slate-50">

      {/* SIDEBAR */}
      <MenuListDashboard />

      {/* CONTENIDO */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
        >

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <h1 className="text-3xl font-black text-slate-800">
                Gestión de Roles
              </h1>

              <p className="mt-2 text-slate-500">
                Administra los roles del sistema
              </p>

            </div>

            <Link
              to="/rol/create"
              className="
                rounded-2xl
                bg-gradient-to-r
                from-fuchsia-600
                to-purple-600
                px-5
                py-3
                text-sm
                font-semibold
                text-white
                shadow-lg
                transition
                hover:scale-105
              "
            >
              + Nuevo Rol
            </Link>

          </div>

        </motion.div>

        {/* RESUMEN */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
        >

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            {/* STATS */}
            <div className="flex flex-wrap gap-8">

              <div>
                <p className="text-xs uppercase text-slate-500">
                  Total Roles
                </p>

                <p className="text-3xl font-black text-slate-800">
                  {data?.length || 0}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase text-slate-500">
                  Activos
                </p>

                <p className="text-3xl font-black text-emerald-600">
                  {
                    data?.filter((r) => r.estado)
                      .length
                  }
                </p>
              </div>

              <div>
                <p className="text-xs uppercase text-slate-500">
                  Inactivos
                </p>

                <p className="text-3xl font-black text-red-500">
                  {
                    data?.filter((r) => !r.estado)
                      .length
                  }
                </p>
              </div>

            </div>

            {/* BUSCADOR */}
            <div className="relative w-full max-w-md">

              <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />

              <input
                type="text"
                placeholder="Buscar rol..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="
                  w-full
                  rounded-2xl
                  border
                  border-slate-300
                  bg-white
                  py-3
                  pl-11
                  pr-4
                  text-sm
                  outline-none
                  ring-fuchsia-200
                  transition
                  focus:ring
                "
              />

            </div>

          </div>

        </motion.div>

        {/* TABLA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="
            overflow-hidden
            rounded-3xl
            border
            border-slate-200
            bg-white
            shadow-sm
          "
        >

          <div className="overflow-x-auto">

            <table className="min-w-full divide-y divide-slate-200">

              {/* HEAD */}
              <thead className="bg-slate-100">

                <tr>

                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">
                    Rol
                  </th>

                  <th className="px-6 py-4 text-center text-sm font-bold text-slate-700">
                    Ventas
                  </th>

                  <th className="px-6 py-4 text-center text-sm font-bold text-slate-700">
                    Egresos
                  </th>

                  <th className="px-6 py-4 text-center text-sm font-bold text-slate-700">
                    Inventario
                  </th>

                  <th className="px-6 py-4 text-center text-sm font-bold text-slate-700">
                    Reportes
                  </th>

                  <th className="px-6 py-4 text-center text-sm font-bold text-slate-700">
                    Usuarios
                  </th>

                  <th className="px-6 py-4 text-center text-sm font-bold text-slate-700">
                    Configuración
                  </th>

                  <th className="px-6 py-4 text-center text-sm font-bold text-slate-700">
                    Estado
                  </th>

                  <th className="px-6 py-4 text-center text-sm font-bold text-slate-700">
                    Acciones
                  </th>

                </tr>

              </thead>

              {/* BODY */}
              <tbody className="divide-y divide-slate-100 bg-white">

                {filteredRoles.map((rol) => {

                  const permisos = [
                    rol.ventas,
                    rol.egresos,
                    rol.inventario,
                    rol.reportes,
                    rol.usuarios,
                    rol.configuracion
                  ];

                  return (

                    <tr
                      key={rol._id}
                      className="transition hover:bg-slate-50"
                    >

                      {/* ROL */}
                      <td className="px-6 py-5">

                        <div className="flex items-center gap-4">

                          <div
                            className="
                              flex
                              h-12
                              w-12
                              items-center
                              justify-center
                              rounded-2xl
                              bg-gradient-to-br
                              from-fuchsia-500
                              to-purple-600
                              shadow-md
                            "
                          >

                            <ShieldCheck className="h-6 w-6 text-white" />

                          </div>

                          <div>

                            <h2 className="font-bold text-slate-800">
                              {rol.nombre}
                            </h2>

                            <p className="text-sm text-slate-500">
                              {rol.descripcion || "Sin descripción"}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* PERMISOS */}
                      {permisos.map((permiso, index) => (

                        <td
                          key={index}
                          className="px-6 py-5 text-center"
                        >

                          <div className="flex justify-center">

                            <div
                              className={`
                                h-4
                                w-4
                                rounded-full
                                shadow-sm
                                ${permiso
                                  ? "bg-emerald-500"
                                  : "bg-red-500"
                                }
                              `}
                            />

                          </div>

                        </td>

                      ))}

                      {/* ESTADO */}
                      <td className="px-6 py-5 text-center">

                        {rol.estado ? (
                          <span
                            className="
                              rounded-full
                              bg-emerald-100
                              px-3
                              py-1
                              text-xs
                              font-semibold
                              text-emerald-700
                            "
                          >
                            Activo
                          </span>
                        ) : (
                          <span
                            className="
                              rounded-full
                              bg-red-100
                              px-3
                              py-1
                              text-xs
                              font-semibold
                              text-red-700
                            "
                          >
                            Inactivo
                          </span>
                        )}

                      </td>

                      {/* ACCIONES */}
                      <td className="px-6 py-5">

                        <div className="flex items-center justify-center gap-3">

                          {/* VER */}
                          <Link
                            to={`?detail=${rol._id}`}
                            className="
    flex
    h-10
    w-10
    items-center
    justify-center
    rounded-xl
    bg-blue-100
    text-blue-600
    transition
    hover:scale-110
  "
                          >
                            <Eye className="h-5 w-5" />
                          </Link>

                          {/* EDITAR */}
                          <Link
                            to={`/rol/${rol._id}/edit`}
                            className="
                              flex
                              h-10
                              w-10
                              items-center
                              justify-center
                              rounded-xl
                              bg-amber-100
                              text-amber-600
                              transition
                              hover:scale-110
                            "
                          >
                            <Pencil className="h-5 w-5" />
                          </Link>

                          {/* ELIMINAR */}
                          <button
                            type="button"
                            className="
                              flex
                              h-10
                              w-10
                              items-center
                              justify-center
                              rounded-xl
                              bg-red-100
                              text-red-600
                              transition
                              hover:scale-110
                            "
                            onClick={() => {

                              Swal.fire({
                                title: "¿Eliminar rol?",
                                text: "Esta acción desactivará el rol",
                                icon: "warning",
                                showCancelButton: true,
                                confirmButtonColor: "#c026d3",
                                cancelButtonColor: "#64748b",
                                confirmButtonText: "Sí, eliminar",
                              }).then((result) => {

                                if (result.isConfirmed) {

                                  mutate({
                                    id: rol._id!,
                                    eliminadoPor: "admin"
                                  });

                                }

                              });

                            }}
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>

                        </div>

                      </td>

                    </tr>

                  );

                })}

              </tbody>

            </table>

          </div>

        </motion.div>

      </main>
      <RolDetailModal />
    </div>


  );

}