import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSucursalById, getSucursal } from "@/api/SucursalApi";
import  MenuListDashboard from '@/components/MenuListDashboard'
import Swal from "sweetalert2";
import {
  Building2,
  Briefcase,
  Package,
  Users,
  Boxes,
  MapPin,
} from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardView() {
  const queryClient = useQueryClient();

    const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["sucursal"],
    queryFn: getSucursal,
  });

  const { mutate } = useMutation({
    mutationFn: deleteSucursalById,
    onError: async (error: any) => {
      await Swal.fire({
        icon: "error",
        title: error.message,
        timer: 2000,
        showConfirmButton: false,
      });
      queryClient.invalidateQueries({ queryKey: ["sucursal"] });
    },
    onSuccess: async (data: any) => {
      await Swal.fire({
        icon: "success",
        title: data,
        timer: 2000,
        showConfirmButton: false,
      });
      queryClient.invalidateQueries({ queryKey: ["sucursal"] });
    },
  });

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-fuchsia-600"></div>
      </div>
    );
 return (
    <div className="h-screen flex bg-gray-50 overflow-hidden">

      {/* SIDEBAR */}
      <MenuListDashboard />

      {/* CONTENIDO */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-xl shadow p-5 mb-6"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Gestión de Sucursales
          </h1>

          <p className="text-gray-500 mt-1">
            Administra fácilmente tus sucursales, productos y personal
          </p>
            <button
                type="button"
                onClick={() =>
                  navigate(
                    `/sucursal/create`
                  )
                }
                title="Nueva solicitud"
                aria-label="Nueva solicitud"
                className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-600 text-3xl font-black text-white shadow-lg shadow-purple-500/20 transition hover:bg-purple-700"
              >
                +
              </button>
        </motion.div>


        {/* GRID DE SUCURSALES */}
        {data?.length ? (
          <motion.div
            layout
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {data.map((sucursal: any) => (
              <motion.div
                key={sucursal._id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.02 }}
                className="relative bg-white rounded-2xl shadow-md hover:shadow-lg border border-gray-100 p-6 transition-all"
              >

                {/* MENÚ OPCIONES */}
                <Menu as="div" className="absolute top-3 right-3">
                  <Menu.Button className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition">
                    <EllipsisVerticalIcon className="h-6 w-6" />
                  </Menu.Button>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white rounded-xl shadow-lg ring-1 ring-gray-200 focus:outline-none">

                      <Menu.Item>
                        <Link
                          to={`/sucursal/${sucursal._id}`}
                          className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 rounded-t-xl"
                        >
                          Ver detalles
                        </Link>
                      </Menu.Item>

                      <Menu.Item>
                        <Link
                          to={`/sucursal/${sucursal._id}/edit`}
                          className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                        >
                          Editar
                        </Link>
                      </Menu.Item>

                      <Menu.Item>
                        <button
                          type="button"
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-xl"
                          onClick={() => mutate(sucursal._id)}
                        >
                          Eliminar
                        </button>
                      </Menu.Item>

                    </Menu.Items>
                  </Transition>
                </Menu>

                {/* CONTENIDO */}
                <div className="flex flex-col gap-3">

                  <h2 className="text-2xl font-bold text-gray-800">
                    {sucursal.nombreSucursal}
                  </h2>

                  <p className="flex items-center text-gray-500 text-sm">
                    <MapPin size={16} className="mr-2 text-fuchsia-600" />
                    {sucursal.ubicacionSucursal}
                  </p>

                  <div className="mt-2 border-t border-gray-200 pt-3">
                    <p className="text-sm text-gray-500">
                      Creado por:{" "}
                      <span className="font-semibold text-gray-700">
                        {sucursal.us_creado}
                      </span>
                    </p>
                  </div>

                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="text-center py-20 bg-white shadow-inner rounded-xl"
          >
            <p className="text-gray-500 text-lg">
              No hay sucursales aún.{" "}
              <Link
                to="/sucursal/create"
                className="text-fuchsia-600 font-semibold hover:underline"
              >
                Crear Sucursal
              </Link>
            </p>
          </motion.div>

        )}

      </main>
    </div>
  )
}