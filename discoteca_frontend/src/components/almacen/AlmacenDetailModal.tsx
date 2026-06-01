// src/components/almacen/AlmacenDetailModal.tsx

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

import {
  toast,
} from "react-toastify";

import {

  Warehouse,

  Building2,

  MapPin,

  FileText,

  Package,

  Calendar,

  User,

  X,

} from "lucide-react";

import {
  getAlmacenById,
} from "@/api/AlmacenApi";

export default function AlmacenDetailModal() {

  const navigate =
    useNavigate();

  const location =
    useLocation();

  const queryParams =
    new URLSearchParams(
      location.search
    );

  const almacenId =
    queryParams.get("detail")!;

  const show =
    !!almacenId;

  const currentPath =
    location.pathname;

  /* =========================
      GET ALMACEN
  ========================= */

  const {
    data,
    isError,
    error,
  } = useQuery({

    queryKey: [

      "almacen",

      almacenId,

    ],

    queryFn: () =>
      getAlmacenById(
        almacenId
      ),

    enabled:
      !!almacenId,

    retry: false,

  });

  /* =========================
      ERROR
  ========================= */

  if (isError) {

    toast.error(
      (error as Error).message,
      {
        toastId: "error",
      }
    );

    navigate(currentPath);

  }

  /* =========================
      CLOSE MODAL
  ========================= */

  const closeModal = () => {

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

  };

  if (data)

    return (

      <Transition
        appear
        show={show}
        as={Fragment}
      >

        <Dialog
          as="div"
          className="relative z-50"
          onClose={closeModal}
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

            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />

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

                <Dialog.Panel
                  className="
                    w-full
                    max-w-5xl
                    transform
                    overflow-hidden
                    rounded-3xl
                    bg-white
                    p-8
                    text-left
                    align-middle
                    shadow-2xl
                    transition-all
                  "
                >

                  {/* HEADER */}
                  <div className="mb-8 flex items-start justify-between">

                    <div className="flex items-center gap-4">

                      <div
                        className="
                          flex
                          h-16
                          w-16
                          items-center
                          justify-center
                          rounded-2xl
                          bg-fuchsia-100
                          text-fuchsia-600
                        "
                      >

                        <Warehouse className="h-8 w-8" />

                      </div>

                      <div>

                        <Dialog.Title
                          as="h3"
                          className="text-3xl font-black text-slate-800"
                        >

                          {data.nombre}

                        </Dialog.Title>

                        <p className="mt-1 text-slate-500">
                          Información del almacén
                        </p>

                      </div>

                    </div>

                    {/* CLOSE */}
                    <button
                      type="button"
                      onClick={closeModal}
                      className="
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-2xl
                        bg-slate-100
                        text-slate-500
                        transition
                        hover:bg-red-100
                        hover:text-red-600
                      "
                    >

                      <X className="h-5 w-5" />

                    </button>

                  </div>

                  {/* GRID */}
                  <div className="grid gap-6 md:grid-cols-2">

                    {/* NOMBRE */}
                    <div
                      className="
                        rounded-2xl
                        border
                        border-slate-200
                        bg-slate-50
                        p-6
                      "
                    >

                      <p
                        className="
                          mb-2
                          text-sm
                          font-bold
                          uppercase
                          text-slate-500
                        "
                      >
                        Nombre
                      </p>

                      <div className="flex items-center gap-2">

                        <Warehouse className="h-4 w-4 text-fuchsia-600" />

                        <p
                          className="
                            text-lg
                            font-semibold
                            text-slate-800
                          "
                        >

                          {data.nombre}

                        </p>

                      </div>

                    </div>

                    {/* SUCURSAL */}
                    <div
                      className="
                        rounded-2xl
                        border
                        border-slate-200
                        bg-slate-50
                        p-6
                      "
                    >

                      <p
                        className="
                          mb-2
                          text-sm
                          font-bold
                          uppercase
                          text-slate-500
                        "
                      >
                        Sucursal
                      </p>

                      <div className="flex items-center gap-2">

                        <Building2 className="h-4 w-4 text-fuchsia-600" />

                        <p className="font-semibold text-slate-800">

                          {
                            typeof data.idSucursal === "string"

                              ? data.idSucursal

                              : data.idSucursal?.nombreSucursal
                          }

                        </p>

                      </div>

                    </div>

                    {/* TIPO */}
                    <div
                      className="
                        rounded-2xl
                        border
                        border-slate-200
                        bg-slate-50
                        p-6
                      "
                    >

                      <p
                        className="
                          mb-2
                          text-sm
                          font-bold
                          uppercase
                          text-slate-500
                        "
                      >
                        Tipo
                      </p>

                      <div className="flex items-center gap-2">

                        <Package className="h-4 w-4 text-fuchsia-600" />

                        <span
                          className="
                            rounded-full
                            bg-blue-100
                            px-3
                            py-1
                            text-xs
                            font-semibold
                            text-blue-700
                          "
                        >

                          {data.tipo}

                        </span>

                      </div>

                    </div>

                    {/* UBICACION */}
                    <div
                      className="
                        rounded-2xl
                        border
                        border-slate-200
                        bg-slate-50
                        p-6
                      "
                    >

                      <p
                        className="
                          mb-2
                          text-sm
                          font-bold
                          uppercase
                          text-slate-500
                        "
                      >
                        Ubicación
                      </p>

                      <div className="flex items-center gap-2">

                        <MapPin className="h-4 w-4 text-fuchsia-600" />

                        <p className="font-semibold text-slate-800">

                          {data.ubicacion ||
                            "Sin ubicación"}

                        </p>

                      </div>

                    </div>

                  </div>

                  {/* DESCRIPCION */}
                  <div
                    className="
                      mt-6
                      rounded-2xl
                      border
                      border-slate-200
                      bg-slate-50
                      p-6
                    "
                  >

                    <p
                      className="
                        mb-3
                        text-sm
                        font-bold
                        uppercase
                        text-slate-500
                      "
                    >
                      Descripción
                    </p>

                    <div className="flex items-start gap-2">

                      <FileText className="mt-1 h-4 w-4 text-fuchsia-600" />

                      <p className="text-slate-700">

                        {data.descripcion ||
                          "Sin descripción"}

                      </p>

                    </div>

                  </div>

                  {/* INFO */}
                  <div className="mt-6 grid gap-6 md:grid-cols-3">

                    {/* ESTADO */}
                    <div
                      className="
                        rounded-2xl
                        border
                        border-slate-200
                        bg-slate-50
                        p-6
                      "
                    >

                      <p
                        className="
                          mb-2
                          text-sm
                          font-bold
                          uppercase
                          text-slate-500
                        "
                      >
                        Estado
                      </p>

                      {data.estado ? (

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

                    </div>

                    {/* CREADO POR */}
                    <div
                      className="
                        rounded-2xl
                        border
                        border-slate-200
                        bg-slate-50
                        p-6
                      "
                    >

                      <p
                        className="
                          mb-2
                          text-sm
                          font-bold
                          uppercase
                          text-slate-500
                        "
                      >
                        Creado Por
                      </p>

                      <div className="flex items-center gap-2">

                        <User className="h-4 w-4 text-fuchsia-600" />

                        <p className="text-slate-700">

                          {data.creadoPor ||
                            "Sin usuario"}

                        </p>

                      </div>

                    </div>

                    {/* FECHA */}
                    <div
                      className="
                        rounded-2xl
                        border
                        border-slate-200
                        bg-slate-50
                        p-6
                      "
                    >

                      <p
                        className="
                          mb-2
                          text-sm
                          font-bold
                          uppercase
                          text-slate-500
                        "
                      >
                        Fecha Creación
                      </p>

                      <div className="flex items-center gap-2">

                        <Calendar className="h-4 w-4 text-fuchsia-600" />

                        <p className="text-slate-700">

                          {data.fechaCreacion

                            ? new Date(
                                data.fechaCreacion
                              ).toLocaleString()

                            : "Sin fecha"}

                        </p>

                      </div>

                    </div>

                  </div>

                  {/* FOOTER */}
                  <div className="mt-8 flex justify-end">

                    <button
                      type="button"
                      onClick={closeModal}
                      className="
                        rounded-2xl
                        bg-gradient-to-r
                        from-fuchsia-600
                        to-purple-600
                        px-6
                        py-3
                        text-sm
                        font-semibold
                        text-white
                        shadow-lg
                        transition
                        hover:scale-105
                      "
                    >

                      Cerrar

                    </button>

                  </div>

                </Dialog.Panel>

              </Transition.Child>

            </div>

          </div>

        </Dialog>

      </Transition>

    );

}