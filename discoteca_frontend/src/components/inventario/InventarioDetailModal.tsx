// src/components/inventario/InventarioDetailModal.tsx

import { Fragment } from "react";

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

  Boxes,
  DollarSign,
  Package,
  Warehouse,
  X,

} from "lucide-react";

import {
  getInventarioById,
} from "@/api/InventarioApi";

export default function InventarioDetailModal() {

  const navigate =
    useNavigate();

  const location =
    useLocation();

  const queryParams =
    new URLSearchParams(
      location.search
    );

  const inventarioId =
    queryParams.get("detail")!;

  const show =
    !!inventarioId;

  const currentPath =
    location.pathname;

  /* =========================
      GET INVENTARIO
  ========================= */

  const {
    data,
    isError,
    error,
  } = useQuery({

    queryKey: [

      "inventario",

      inventarioId,

    ],

    queryFn: () =>
      getInventarioById(
        inventarioId
      ),

    enabled:
      !!inventarioId,

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
        toastId: "error",
      }
    );

    navigate(currentPath);

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

                        <Boxes className="h-8 w-8" />

                      </div>

                      <div>

                        <Dialog.Title
                          as="h3"
                          className="text-3xl font-black text-slate-800"
                        >

                          Inventario

                        </Dialog.Title>

                        <p className="mt-1 text-slate-500">

                          Información detallada del inventario

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

                    {/* PRODUCTO */}
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
                        Producto
                      </p>

                      <div className="flex items-center gap-3">

                        <Package className="h-5 w-5 text-fuchsia-600" />

                        <div>

                          <p className="font-semibold text-slate-800">

                            {

                              typeof data.idProducto === "string"

                                ? data.idProducto

                                : data.idProducto?.nombre

                            }

                          </p>

                          <p className="text-sm text-slate-500">

                            {

                              typeof data.idProducto === "string"

                                ? ""

                                : data.idProducto?.marca || "Sin marca"

                            }

                          </p>

                        </div>

                      </div>

                    </div>

                    {/* ALMACEN */}
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
                        Almacén
                      </p>

                      <div className="flex items-center gap-3">

                        <Warehouse className="h-5 w-5 text-fuchsia-600" />

                        <div>

                          <p className="font-semibold text-slate-800">

                            {

                              typeof data.idAlmacen === "string"

                                ? data.idAlmacen

                                : data.idAlmacen?.nombre

                            }

                          </p>

                          <p className="text-sm text-slate-500">

                            {

                              typeof data.idAlmacen === "string"

                                ? ""

                                : data.idAlmacen?.nombre

                            }

                          </p>

                        </div>

                      </div>

                    </div>

                    {/* CANTIDAD */}
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
                        Cantidad
                      </p>

                      <p className="text-2xl font-black text-slate-800">

                        {data.cantidad}

                      </p>

                    </div>

                    {/* STOCK */}
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
                        Stock Mínimo
                      </p>

                      <p className="text-2xl font-black text-slate-800">

                        {data.stockMinimo}

                      </p>

                    </div>

                  </div>

                  {/* PRECIOS */}
                  <div className="mt-6 grid gap-6 md:grid-cols-2">

                    {/* COSTO */}
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
                        Costo Unitario
                      </p>

                      <div className="flex items-center gap-2">

                        <DollarSign className="h-5 w-5 text-emerald-600" />

                        <p className="text-2xl font-black text-emerald-600">

                          Bs. {data.costoUnitario}

                        </p>

                      </div>

                    </div>

                    {/* PRECIO */}
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
                        Precio Venta
                      </p>

                      <div className="flex items-center gap-2">

                        <DollarSign className="h-5 w-5 text-fuchsia-600" />

                        <p className="text-2xl font-black text-fuchsia-600">

                          Bs. {data.precioVenta}

                        </p>

                      </div>

                    </div>

                  </div>

                  {/* ESTADO */}
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
                      Estado
                    </p>

                    {data.estado ? (

                      <span
                        className="
                          rounded-full
                          bg-emerald-100
                          px-4
                          py-2
                          text-sm
                          font-semibold
                          text-emerald-700
                        "
                      >
                        Inventario Activo
                      </span>

                    ) : (

                      <span
                        className="
                          rounded-full
                          bg-red-100
                          px-4
                          py-2
                          text-sm
                          font-semibold
                          text-red-700
                        "
                      >
                        Inventario Inactivo
                      </span>

                    )}

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