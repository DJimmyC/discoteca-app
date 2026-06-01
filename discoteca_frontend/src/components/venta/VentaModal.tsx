import {
  useMemo,
  useState,
} from "react";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  CreditCard,
  DollarSign,
  ReceiptText,
  X,
} from "lucide-react";

import Swal from "sweetalert2";

import {
  createVenta,
} from "@/api/VentaApi";

import {
  createManyDetalleVenta,
} from "@/api/DetalleVentaApi";

import {
  updateComanda,
} from "@/api/ComandaApi";

import type {
  MetodoPago,
} from "@/types/VentaType";

import type {
  ComandaConDetalleType,
} from "@/types/ComandaType";

type CajaOption = {
  _id: string;
  nombre?: string | null;
  descripcion?: string | null;
};

type VentaModalProps = {
  open: boolean;
  onClose: () => void;
  comanda: ComandaConDetalleType | null;
  cajas: CajaOption[];
  idPerfil: string;
  idSucursal: string;
  creadoPor: string;
  onSuccess?: () => void;
};

export default function VentaModal({
  open,
  onClose,
  comanda,
  cajas,
  idPerfil,
  idSucursal,
  creadoPor,
  onSuccess,
}: VentaModalProps) {

  const queryClient = useQueryClient();

  const [
    idCaja,
    setIdCaja,
  ] = useState("");

  const [
    metodoPago,
    setMetodoPago,
  ] = useState<MetodoPago>("efectivo");



  const [
    observacion,
    setObservacion,
  ] = useState("");

  const subtotal = useMemo(() => {

    if (!comanda) {
      return 0;
    }

    return comanda.total || 0;

  }, [comanda]);

  const total =
    subtotal 

  const {
    mutate: registrarVenta,
    isPending,
  } = useMutation({

    mutationFn: async () => {

      if (!comanda?._id) {
        throw new Error(
          "No se encontró la comanda"
        );
      }

      if (!idCaja) {
        throw new Error(
          "Debe seleccionar una caja"
        );
      }

      if (comanda.detalles.length === 0) {
        throw new Error(
          "La comanda no tiene productos"
        );
      }

      

      /*
        1. Crear venta
      */
      const responseVenta =
        await createVenta({

          idComanda:
            comanda._id,

          idCaja,

          idPerfil,

          idSucursal,

          subtotal,

        

          metodoPago,

          estado:
            "pagado",

          observacion:
            observacion || comanda.observacion || "Sin observación",

          creadoPor,

        });

      /*
        El backend debe devolver:
        {
          message: "Venta registrada",
          venta: { _id: "..." }
        }
      */
      const idVentaCreada =
        responseVenta?.venta?._id;

      if (!idVentaCreada) {
        throw new Error(
          "No se recibió el ID de la venta creada"
        );
      }

      /*
        2. Crear detalles de venta
      */
      const detallesVenta =
        comanda.detalles.map((detalle) => ({

          idVenta:
            idVentaCreada,

          idProducto:
            detalle.producto?._id || "",

          cantidad:
            detalle.cantidad,

          precioUnitario:
            detalle.precioUnitario,

          subtotal:
            detalle.subtotal,

          creadoPor,

        }));

      await createManyDetalleVenta(
        detallesVenta
      );

      /*
        3. Cambiar comanda a impreso
      */
      await updateComanda({

        comandaId:
          comanda._id,

        formData: {
          estado:
            "impreso",

          actualizadoPor:
            creadoPor,
        },

      });

      return responseVenta;

    },

    onSuccess: () => {

      Swal.fire({
        icon: "success",
        title: "Venta registrada",
        text: "La venta y sus detalles fueron creados correctamente",
      });

      queryClient.invalidateQueries({
        queryKey: [
          "comandas-con-detalles",
          idPerfil,
        ],
      });

      onSuccess?.();
      onClose();

    },

    onError: (error) => {

      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error instanceof Error
            ? error.message
            : "Error al registrar la venta",
      });

    },

  });

  if (!open || !comanda) {
    return null;
  }

  return (

    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">

      <div className="w-full max-w-3xl overflow-hidden rounded-3xl border border-fuchsia-500/20 bg-slate-950 text-white shadow-2xl">

        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 p-6">

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-fuchsia-600/20">

              <ReceiptText className="h-7 w-7 text-fuchsia-400" />

            </div>

            <div>

              <h2 className="text-2xl font-black text-white">
                Confirmar venta
              </h2>

              <p className="text-sm text-slate-400">
                Comanda:{" "}
                <span className="font-bold text-fuchsia-400">
                  {comanda.numeroComanda || "Sin número"}
                </span>
              </p>

            </div>

          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="rounded-xl bg-slate-800 p-2 text-slate-300 hover:bg-slate-700 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>

        </div>

        {/* BODY */}
        <div className="grid gap-6 p-6 lg:grid-cols-[1fr_300px]">

          {/* FORM */}
          <div className="space-y-5">

            <div>

              <label className="mb-2 block text-sm font-bold text-slate-300">
                Caja que recibe el pago
              </label>

              <select
                value={idCaja}
                onChange={(e) =>
                  setIdCaja(e.target.value)
                }
                className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-fuchsia-500"
              >
                <option value="">
                  Seleccione una caja
                </option>

                {cajas.map((caja) => (
                  <option
                    key={caja._id}
                    value={caja._id}
                  >
                    {caja.nombre ||
                      caja.descripcion ||
                      `Caja ${caja._id}`}
                  </option>
                ))}
              </select>

            </div>

            <div>

              <label className="mb-2 block text-sm font-bold text-slate-300">
                Método de pago
              </label>

              <select
                value={metodoPago}
                onChange={(e) =>
                  setMetodoPago(
                    e.target.value as MetodoPago
                  )
                }
                className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-fuchsia-500"
              >
                <option value="efectivo">
                  Efectivo
                </option>

                <option value="qr">
                  QR
                </option>

                <option value="tarjeta">
                  Tarjeta
                </option>

                <option value="transferencia">
                  Transferencia
                </option>

                <option value="mixto">
                  Mixto
                </option>
              </select>

            </div>

          

            <div>

              <label className="mb-2 block text-sm font-bold text-slate-300">
                Observación
              </label>

              <textarea
                value={observacion}
                onChange={(e) =>
                  setObservacion(e.target.value)
                }
                placeholder="Ej: pago completo, cliente frecuente..."
                rows={3}
                className="w-full resize-none rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-fuchsia-500"
              />

            </div>

          </div>

          {/* RESUMEN */}
          <div className="rounded-3xl border border-slate-700 bg-slate-900 p-5">

            <div className="mb-5 flex items-center gap-3">

              <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-400">

                <DollarSign className="h-6 w-6" />

              </div>

              <div>

                <p className="text-sm text-slate-400">
                  Resumen de pago
                </p>

                <h3 className="text-lg font-black">
                  Venta
                </h3>

              </div>

            </div>

            <div className="space-y-3 text-sm">

              <div className="flex justify-between text-slate-300">

                <span>
                  Subtotal
                </span>

                <span className="font-bold">
                  Bs. {subtotal.toFixed(2)}
                </span>

              </div>

              

              <div className="border-t border-slate-700 pt-3">

                <div className="flex justify-between">

                  <span className="text-lg font-black">
                    Total
                  </span>

                  <span className="text-2xl font-black text-fuchsia-400">
                    Bs. {total.toFixed(2)}
                  </span>

                </div>

              </div>

            </div>

            <div className="mt-6 rounded-2xl bg-slate-950 p-4">

              <p className="mb-2 text-sm font-bold text-slate-400">
                Productos
              </p>

              <div className="max-h-40 space-y-2 overflow-y-auto pr-1">

                {comanda.detalles.map((detalle) => (

                  <div
                    key={detalle._id}
                    className="flex justify-between gap-3 text-sm"
                  >

                    <span className="line-clamp-1 text-slate-300">
                      {detalle.producto?.nombre ||
                        "Producto"}
                    </span>

                    <span className="font-bold text-slate-400">
                      x{detalle.cantidad}
                    </span>

                  </div>

                ))}

              </div>

            </div>

          </div>

        </div>

        {/* FOOTER */}
        <div className="flex flex-col gap-3 border-t border-slate-800 p-6 sm:flex-row sm:justify-end">

          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="rounded-2xl bg-slate-800 px-5 py-3 font-black text-white transition hover:bg-slate-700 disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={() =>
              registrarVenta()
            }
            disabled={isPending}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 font-black text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-700"
          >
            <CreditCard className="h-5 w-5" />

            {isPending
              ? "Registrando..."
              : "Registrar venta e imprimir"}
          </button>

        </div>

      </div>

    </div>

  );

}