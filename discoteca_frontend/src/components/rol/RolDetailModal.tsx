import { Fragment } from "react/jsx-runtime";

import {
  Dialog,
  Transition,
} from "@headlessui/react";

import {
  useQuery,
} from "@tanstack/react-query";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import { toast } from "react-toastify";

import {
  getRolById,
} from "@/api/RolApi";

export default function RolDetailModal() {

  const navigate = useNavigate();

  const location = useLocation();

  const queryParams =
    new URLSearchParams(
      location.search
    );

  const rolId =
    queryParams.get("detail")!;

  const show = !!rolId;

  const currentPath =
    location.pathname;

  const {
    data,
    isError,
    error,
  } = useQuery({

    queryKey: ["rol", rolId],

    queryFn: () =>
      getRolById(rolId),

    enabled: !!rolId,

    retry: false,

  });

  if (isError) {

    toast.error(
      (error as Error).message,
      {
        toastId: "error",
      }
    );

    navigate(currentPath);

  }

  if (data)

    return (

      <Transition
        appear
        show={show}
        as={Fragment}
      >

        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => {

            const params =
              new URLSearchParams(
                location.search
              );

            params.delete("detail");

            navigate(
              `${location.pathname}?${params.toString()}`,
              {
                replace: true,
              }
            );

          }}
        >

          {/* BACKDROP */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >

            <div className="fixed inset-0 bg-black/60" />

          </Transition.Child>

          {/* MODAL */}
          <div className="fixed inset-0 overflow-y-auto">

            <div className="flex min-h-full items-center justify-center p-4 text-center">

              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >

                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-3xl bg-white p-10 text-left align-middle shadow-2xl transition-all">

                  {/* FECHAS */}
                  <div className="mb-6">

                   

                    {data.fechaActualizacion && (

                      <p className="text-sm text-slate-400">

                        Última modificación:{" "}

                        {new Date(
                          data.fechaActualizacion
                        ).toLocaleString()}

                      </p>

                    )}

                  </div>

                  {/* TITULO */}
                  <Dialog.Title
                    as="h3"
                    className="mb-6 text-4xl font-black text-slate-800"
                  >

                    {data.nombre}

                  </Dialog.Title>

                  {/* DESCRIPCION */}
                  <div className="mb-8">

                    <p className="mb-2 text-lg font-bold text-slate-500">
                      Descripción
                    </p>

                    <p className="text-slate-700">
                      {data.descripcion}
                    </p>

                  </div>

                  {/* ESTADO */}
                  <div className="mb-8">

                    <p className="mb-2 text-lg font-bold text-slate-500">
                      Estado
                    </p>

                    <div className="flex items-center gap-3">

                      <div
                        className={`h-4 w-4 rounded-full ${
                          data.estado
                            ? "bg-emerald-500"
                            : "bg-red-500"
                        }`}
                      />

                      <span className="font-semibold text-slate-700">

                        {data.estado
                          ? "Activo"
                          : "Inactivo"}

                      </span>

                    </div>

                  </div>

                  {/* PERMISOS */}
                  <div className="mb-8">

                    <p className="mb-4 text-lg font-bold text-slate-500">
                      Permisos
                    </p>

                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">

                      {[
                        {
                          name: "Ventas",
                          value: data.ventas,
                        },

                        {
                          name: "Egresos",
                          value: data.egresos,
                        },

                        {
                          name: "Inventario",
                          value: data.inventario,
                        },

                        {
                          name: "Reportes",
                          value: data.reportes,
                        },

                        {
                          name: "Usuarios",
                          value: data.usuarios,
                        },

                        {
                          name: "Configuración",
                          value: data.configuracion,
                        },

                      ].map((permiso) => (

                        <div
                          key={permiso.name}
                          className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4"
                        >

                          <div
                            className={`h-3 w-3 rounded-full ${
                              permiso.value
                                ? "bg-emerald-500"
                                : "bg-red-500"
                            }`}
                          />

                          <span className="font-medium text-slate-700">

                            {permiso.name}

                          </span>

                        </div>

                      ))}

                    </div>

                  </div>

                  {/* CREADO POR */}
                  <div>

                    <p className="mb-2 text-lg font-bold text-slate-500">
                      Usuario creador
                    </p>

                    <p className="text-slate-700">
                      {data.creadoPor}
                    </p>

                  </div>

                </Dialog.Panel>

              </Transition.Child>

            </div>

          </div>

        </Dialog>

      </Transition>

    );

}