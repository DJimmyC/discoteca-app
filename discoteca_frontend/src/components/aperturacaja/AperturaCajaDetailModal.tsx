// src/components/aperturacaja/AperturaCajaDetailModal.tsx

import {
  Fragment,
} from "react";

import {
  Dialog,
  Transition,
} from "@headlessui/react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  useQuery,
} from "@tanstack/react-query";

import {
  toast,
} from "react-toastify";

import {

  Banknote,
  CalendarDays,
  Clock3,
  FileText,
  ShieldCheck,
  User2,
  X,

} from "lucide-react";

import {
  getAperturaCajaById,
} from "@/api/AperturaCajaApi";

export default function AperturaCajaDetailModal() {

  const navigate =
    useNavigate();

  const location =
    useLocation();

  const queryParams =
    new URLSearchParams(
      location.search
    );

  const aperturaCajaId =
    queryParams.get(
      "detail"
    )!;

  const show =
    !!aperturaCajaId;

  const currentPath =
    location.pathname;

  /* =========================
      GET APERTURA
  ========================= */

  const {

    data,

    isError,

    error,

  } = useQuery({

    queryKey: [

      "aperturaCaja",

      aperturaCajaId,

    ],

    queryFn: () =>
      getAperturaCajaById(
        aperturaCajaId
      ),

    enabled:
      !!aperturaCajaId,

    retry: false,

  });

  /* =========================
      ERROR
  ========================= */

  if (isError) {

    toast.error(

      (error as Error)
        .message,

      {

        toastId:
          "error",

      }

    );

    navigate(
      currentPath
    );

  }

  /* =========================
      CLOSE
  ========================= */

  const closeModal = () => {

    const params =
      new URLSearchParams(
        location.search
      );

    params.delete(
      "detail"
    );

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
                    max-w-4xl
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

                        <Banknote className="h-8 w-8" />

                      </div>

                      <div>

                        <Dialog.Title
                          as="h3"
                          className="
                            text-3xl
                            font-black
                            text-slate-800
                          "
                        >

                          Apertura Caja

                        </Dialog.Title>

                        <p className="mt-1 text-slate-500">

                          Información detallada de la apertura

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

                    {/* PERFIL */}
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
                        Perfil
                      </p>

                      <div className="flex items-center gap-2">

                        <User2 className="h-4 w-4 text-fuchsia-600" />

                        <p className="font-semibold text-slate-800">

                          {

                            typeof data.idPerfil === "string"

                              ? data.idPerfil

                              : `${data.idPerfil?.nombres || ""} ${data.idPerfil?.apellidos || ""}`

                          }

                        </p>

                      </div>

                    </div>

                    {/* CAJA */}
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
                        Caja
                      </p>

                      <p
                        className="
                          text-lg
                          font-semibold
                          text-slate-800
                        "
                      >

                        {

                          typeof data.idCaja === "string"

                            ? data.idCaja

                            : data.idCaja?.nombre

                        }

                      </p>

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
                        Fecha
                      </p>

                      <div className="flex items-center gap-2">

                        <CalendarDays className="h-4 w-4 text-fuchsia-600" />

                        <p className="font-semibold text-slate-800">

                          {data.fecha}

                        </p>

                      </div>

                    </div>

                    {/* HORA */}
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
                        Hora Apertura
                      </p>

                      <div className="flex items-center gap-2">

                        <Clock3 className="h-4 w-4 text-fuchsia-600" />

                        <p className="font-semibold text-slate-800">

                          {data.horaApertura}

                        </p>

                      </div>

                    </div>

                    {/* MONTO */}
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
                        Monto Inicial
                      </p>

                      <div className="flex items-center gap-2">

                        <Banknote className="h-4 w-4 text-fuchsia-600" />

                        <p className="font-semibold text-emerald-600">

                          Bs. {data.montoInicial}

                        </p>

                      </div>

                    </div>

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

                  </div>

                  {/* OBSERVACION */}
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
                      Observación
                    </p>

                    <div className="flex items-start gap-3">

                      <FileText className="mt-1 h-5 w-5 text-fuchsia-600" />

                      <p className="text-slate-700">

                        {data.observacion ||
                          "Sin observaciones"}

                      </p>

                    </div>

                  </div>

                  {/* AUDITORIA */}
                  <div className="mt-6 grid gap-6 md:grid-cols-2">

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

                        <ShieldCheck className="h-4 w-4 text-fuchsia-600" />

                        <p className="font-semibold text-slate-800">

                          {data.creadoPor ||
                            "Sin registro"}

                        </p>

                      </div>

                    </div>

                    {/* FECHA CREACION */}
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

                        <CalendarDays className="h-4 w-4 text-fuchsia-600" />

                        <p className="font-semibold text-slate-800">

                          {

                            data.fechaCreacion

                              ? new Date(
                                  data.fechaCreacion
                                ).toLocaleString()

                              : "Sin registro"

                          }

                        </p>

                      </div>

                    </div>

                  </div>

                </Dialog.Panel>

              </Transition.Child>

            </div>

          </div>

        </Dialog>

      </Transition>

    );

}