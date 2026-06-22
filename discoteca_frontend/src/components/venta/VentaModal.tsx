// src/components/venta/VentaModal.tsx

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  Banknote,
  CreditCard,
  LoaderCircle,
  Printer,
  ReceiptText,
  Smartphone,
  X,
} from "lucide-react";

import Swal from "sweetalert2";

import {
  createVenta,
} from "@/api/VentaApi";

import {
  createDetalleVenta,
} from "@/api/DetalleVentaApi";

import {
  createMovimiento,
} from "@/api/MovimientoApi";

import {
  updateComanda,
} from "@/api/ComandaApi";

import {
  getAperturasActivasBySucursal,
} from "@/api/AperturaCajaApi";

import type {
  ComandaConDetalleType,
  DetalleDentroComandaType,
} from "@/types/ComandaType";

import type {
  DetalleVentaForm,
} from "@/types/DetalleVentaType";

import type {
  MetodoPagoVenta,
  VentaForm,
} from "@/types/VentaType";

import type {
  MovimientoForm,
} from "@/types/MovimientoType";

import type {
  AperturaCajaActivaType,
} from "@/types/AperturaCajaType";

/* =========================
    TIPO CAJA
========================= */

type CajaOption = {
  _id: string;
  nombre?: string | null;
  descripcion?: string | null;
  estado?: boolean;
};

/* =========================
    PROPS
========================= */

type VentaModalProps = {
  open: boolean;
  onClose: () => void;
  comanda: ComandaConDetalleType | null;

  /*
    Se deja opcional para no romper el componente padre,
    pero este modal ya NO usa todas las cajas.
    Ahora usa aperturas activas.
  */
  cajas?: CajaOption[];

  idPerfil: string;
  idSucursal: string;
  creadoPor: string;
  onSuccess?: () => void;
};

/* =========================
    DETALLE PREPARADO
========================= */

type DetallePreparado = {
  idProducto: string;
  idInventario: string;
  idAlmacen: string;
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
  costoUnitario: number;
  subtotal: number;
};

/* =========================
    CAJA ABIERTA OPTION
========================= */

type CajaAbiertaOption = {
  _id: string;
  nombre: string;
  descripcion?: string;
  idAperturaCaja: string;
  fechaApertura: string;
  montoInicial: number;
};

/* =========================
    HELPERS
========================= */

function obtenerIdRelacion(
  relacion:
    | string
    | Record<string, unknown>
    | null
    | undefined
): string {
  if (
    typeof relacion === "string"
  ) {
    return relacion;
  }

  if (
    relacion &&
    typeof relacion === "object" &&
    "_id" in relacion
  ) {
    const id =
      relacion._id;

    return typeof id === "string"
      ? id
      : "";
  }

  return "";
}

function obtenerTextoRelacion(
  relacion: any,
  campos: string[] = [
    "nombre",
    "descripcion",
  ]
): string {
  if (!relacion) {
    return "";
  }

  if (
    typeof relacion === "string"
  ) {
    return relacion;
  }

  for (const campo of campos) {
    if (
      relacion[campo]
    ) {
      return String(
        relacion[campo]
      );
    }
  }

  return String(
    relacion._id || ""
  );
}

function formatoMoneda(
  valor: number
): string {
  return `Bs. ${Number(valor || 0).toFixed(2)}`;
}

function formatoFecha(
  fecha?: string | Date | null
): string {
  if (!fecha) {
    return "-";
  }

  return new Intl.DateTimeFormat(
    "es-BO",
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  ).format(
    new Date(fecha)
  );
}

function obtenerProducto(
  detalle: DetalleDentroComandaType
) {
  const detalleAny =
    detalle as any;

  if (
    detalleAny.producto &&
    typeof detalleAny.producto === "object"
  ) {
    return detalleAny.producto;
  }

  if (
    detalleAny.idProducto &&
    typeof detalleAny.idProducto === "object"
  ) {
    return detalleAny.idProducto;
  }

  return null;
}

function obtenerInventario(
  detalle: DetalleDentroComandaType
) {
  const detalleAny =
    detalle as any;

  if (
    detalleAny.idInventario &&
    typeof detalleAny.idInventario === "object"
  ) {
    return detalleAny.idInventario;
  }

  return null;
}

function obtenerDetallesComanda(
  comanda: ComandaConDetalleType | null
): DetalleDentroComandaType[] {
  if (!comanda) {
    return [];
  }

  const comandaAny =
    comanda as any;

  return (
    comandaAny.detalles ||
    comandaAny.detalleComandas ||
    comandaAny.detallesComanda ||
    comandaAny.productos ||
    []
  );
}

function obtenerIdComanda(
  comanda: ComandaConDetalleType | null
): string {
  if (!comanda) {
    return "";
  }

  const comandaAny =
    comanda as any;

  return String(
    comandaAny._id ||
    comandaAny.id ||
    ""
  );
}

function obtenerNumeroComanda(
  comanda: ComandaConDetalleType | null
): string {
  if (!comanda) {
    return "-";
  }

  const comandaAny =
    comanda as any;

  return String(
    comandaAny.numeroComanda ||
    comandaAny.numero ||
    "-"
  );
}

function obtenerNombreCaja(
  caja: CajaAbiertaOption | undefined
): string {
  if (!caja) {
    return "Caja";
  }

  return (
    caja.nombre ||
    caja.descripcion ||
    "Caja"
  );
}

function generarHtmlTicketVenta({
  comanda,
  detalles,
  caja,
  metodoPago,
  subtotal,
  descuento,
  total,
}: {
  comanda: ComandaConDetalleType | null;
  detalles: DetallePreparado[];
  caja?: CajaAbiertaOption;
  metodoPago: MetodoPagoVenta;
  subtotal: number;
  descuento: number;
  total: number;
}) {
  const filas =
    detalles
      .map(
        (detalle) => `
          <tr>
            <td>${detalle.nombreProducto}</td>
            <td style="text-align:center">${detalle.cantidad}</td>
            <td style="text-align:right">${detalle.precioUnitario.toFixed(2)}</td>
            <td style="text-align:right">${detalle.subtotal.toFixed(2)}</td>
          </tr>
        `
      )
      .join("");

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Ticket Venta</title>
        <style>
          @page {
            size: 80mm auto;
            margin: 4mm;
          }

          body {
            font-family: "Courier New", monospace;
            font-size: 11px;
            color: #000;
          }

          .center {
            text-align: center;
          }

          h1 {
            font-size: 15px;
            margin: 0;
          }

          p {
            margin: 2px 0;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 8px;
          }

          th {
            border-bottom: 1px dashed #000;
            padding-bottom: 4px;
            font-size: 10px;
          }

          td {
            padding: 3px 0;
            border-bottom: 1px dotted #aaa;
          }

          .total {
            margin-top: 8px;
            border-top: 1px dashed #000;
            padding-top: 6px;
          }

          .row {
            display: flex;
            justify-content: space-between;
          }

          .firma {
            margin-top: 30px;
            text-align: center;
            border-top: 1px solid #000;
            padding-top: 5px;
          }
        </style>
      </head>

      <body>
        <div class="center">
          <h1>TICKET DE VENTA</h1>
          <p>Comanda: ${obtenerNumeroComanda(comanda)}</p>
          <p>Caja: ${obtenerNombreCaja(caja)}</p>
          <p>Fecha: ${formatoFecha(new Date())}</p>
        </div>

        <table>
          <thead>
            <tr>
              <th>Prod.</th>
              <th>Cant</th>
              <th>P/U</th>
              <th>Subt.</th>
            </tr>
          </thead>

          <tbody>
            ${filas}
          </tbody>
        </table>

        <div class="total">
          <div class="row">
            <strong>Subtotal:</strong>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          <div class="row">
            <strong>Descuento:</strong>
            <span>${descuento.toFixed(2)}</span>
          </div>

          <div class="row">
            <strong>Total:</strong>
            <span>${total.toFixed(2)}</span>
          </div>

          <div class="row">
            <strong>Método:</strong>
            <span>${metodoPago.toUpperCase()}</span>
          </div>
        </div>

        <div class="firma">
          Firma / sello caja
        </div>
      </body>
    </html>
  `;
}

function imprimirTicket(
  html: string
) {
  const iframe =
    document.createElement(
      "iframe"
    );

  iframe.style.position =
    "fixed";

  iframe.style.right =
    "0";

  iframe.style.bottom =
    "0";

  iframe.style.width =
    "0";

  iframe.style.height =
    "0";

  iframe.style.border =
    "0";

  document.body.appendChild(
    iframe
  );

  const doc =
    iframe.contentWindow?.document;

  if (!doc) {
    return;
  }

  doc.open();
  doc.write(html);
  doc.close();

  iframe.onload = () => {
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();

    setTimeout(() => {
      document.body.removeChild(
        iframe
      );
    }, 1000);
  };
}

/* =========================
    COMPONENTE
========================= */

export default function VentaModal({
  open,
  onClose,
  comanda,
  idPerfil,
  idSucursal,
  creadoPor,
  onSuccess,
}: VentaModalProps) {
  const queryClient =
    useQueryClient();

  const [
    idCaja,
    setIdCaja,
  ] = useState("");

  const [
    metodoPago,
    setMetodoPago,
  ] =
    useState<MetodoPagoVenta>(
      "efectivo"
    );

  const [
    descuento,
    setDescuento,
  ] = useState(0);

  const [
    observacion,
    setObservacion,
  ] = useState("");

  /* =========================
      CONSULTAR APERTURAS ACTIVAS
  ========================= */

  const {
    data: aperturasActivas = [],
    isLoading: cargandoAperturasActivas,
    isFetching: actualizandoAperturasActivas,
  } = useQuery({
    queryKey: [
      "aperturas-activas-sucursal",
      idSucursal,
    ],

    queryFn: () =>
      getAperturasActivasBySucursal(
        idSucursal
      ),

    enabled:
      Boolean(open) &&
      Boolean(idSucursal),
  });

  /* =========================
      CAJAS ABIERTAS PARA SELECT
  ========================= */

  const cajasAbiertasOptions =
    useMemo(() => {
      return aperturasActivas
        .map(
          (
            apertura:
              AperturaCajaActivaType
          ) => {
            const caja =
              apertura.idCaja;

            if (!caja) {
              return null;
            }

            if (
              typeof caja ===
              "string"
            ) {
              return {
                _id:
                  caja,

                nombre:
                  "Caja abierta",

                descripcion:
                  "",

                idAperturaCaja:
                  String(
                    apertura._id || ""
                  ),

                fechaApertura:
                  apertura.fechaApertura,

                montoInicial:
                  apertura.montoInicial,
              };
            }

            return {
              _id:
                String(
                  caja._id
                ),

              nombre:
                caja.nombre ||
                caja.descripcion ||
                "Caja sin nombre",

              descripcion:
                caja.descripcion ||
                "",

              idAperturaCaja:
                String(
                  apertura._id || ""
                ),

              fechaApertura:
                apertura.fechaApertura,

              montoInicial:
                apertura.montoInicial,
            };
          }
        )
        .filter(Boolean) as CajaAbiertaOption[];
    }, [
      aperturasActivas,
    ]);

  /* =========================
      DETALLES PREPARADOS
  ========================= */

  const detallesPreparados =
    useMemo<DetallePreparado[]>(() => {
      const detalles =
        obtenerDetallesComanda(
          comanda
        );

      return detalles
        .map(
          (
            detalle:
              DetalleDentroComandaType
          ) => {
            const detalleAny =
              detalle as any;

            const producto =
              obtenerProducto(
                detalle
              );

            const inventario =
              obtenerInventario(
                detalle
              );

            const idProducto =
              obtenerIdRelacion(
                detalleAny.idProducto
              ) ||
              obtenerIdRelacion(
                detalleAny.producto
              ) ||
              obtenerIdRelacion(
                producto
              );

            const idInventario =
              obtenerIdRelacion(
                detalleAny.idInventario
              ) ||
              obtenerIdRelacion(
                inventario
              );

            const idAlmacen =
              obtenerIdRelacion(
                detalleAny.idAlmacen
              ) ||
              obtenerIdRelacion(
                inventario?.idAlmacen as any
              );

            const nombreProducto =
              producto?.nombre ||
              producto?.descripcion ||
              detalleAny.nombreProducto ||
              "Producto";

            const cantidad =
              Number(
                detalleAny.cantidad || 0
              );

            const precioUnitario =
              Number(
                detalleAny.precioUnitario ||
                detalleAny.precio_venta ||
                inventario?.precioVenta ||
                0
              );

            const costoUnitario =
              Number(
                detalleAny.costoUnitario ||
                inventario?.costoUnitario ||
                0
              );

            const subtotal =
              Number(
                detalleAny.subtotal ||
                cantidad *
                  precioUnitario
              );

            return {
              idProducto,
              idInventario,
              idAlmacen,
              nombreProducto,
              cantidad,
              precioUnitario,
              costoUnitario,
              subtotal,
            };
          }
        )
        .filter(
          (detalle) =>
            detalle.idProducto &&
            detalle.idInventario &&
            detalle.idAlmacen &&
            detalle.cantidad > 0
        );
    }, [
      comanda,
    ]);

  const subtotal =
    useMemo(() => {
      return detallesPreparados.reduce(
        (
          total,
          detalle
        ) =>
          total +
          Number(
            detalle.subtotal || 0
          ),
        0
      );
    }, [
      detallesPreparados,
    ]);

  const total =
    Math.max(
      subtotal -
        Number(
          descuento || 0
        ),
      0
    );

  const cajaSeleccionada =
    cajasAbiertasOptions.find(
      (caja) =>
        caja._id === idCaja
    );

  /* =========================
      RESET AL ABRIR
  ========================= */

  useEffect(() => {
    if (!open) {
      return;
    }

    setMetodoPago(
      "efectivo"
    );

    setDescuento(
      0
    );

    setObservacion(
      (comanda as any)
        ?.observacion || ""
    );
  }, [
    open,
    comanda,
  ]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const primeraCajaAbierta =
      cajasAbiertasOptions[0];

    setIdCaja(
      primeraCajaAbierta?._id ||
      ""
    );
  }, [
    open,
    cajasAbiertasOptions,
  ]);

  /* =========================
      MUTATION
  ========================= */

  const {
    mutate,
    isPending,
  } = useMutation({
    mutationFn:
      async () => {
        if (!comanda) {
          throw new Error(
            "No existe una comanda seleccionada"
          );
        }

        const idComanda =
          obtenerIdComanda(
            comanda
          );

        if (!idComanda) {
          throw new Error(
            "El ID de la comanda es obligatorio"
          );
        }

        if (!idCaja) {
          throw new Error(
            "Debe seleccionar una caja abierta"
          );
        }

        if (
          cajasAbiertasOptions.length ===
          0
        ) {
          throw new Error(
            "No existen cajas abiertas para esta sucursal"
          );
        }

        if (
          detallesPreparados.length ===
          0
        ) {
          throw new Error(
            "La comanda no tiene productos válidos para vender"
          );
        }

        if (
          descuento < 0 ||
          descuento > subtotal
        ) {
          throw new Error(
            "El descuento no puede ser negativo ni mayor al subtotal"
          );
        }

        const ventaPayload =
          {
            idComanda,
            idCaja,
            idPerfil,
            idSucursal,
            subtotal,
            descuento:
              Number(
                descuento || 0
              ),
            metodoPago,
            observacion,
            creadoPor,
          } as VentaForm;

        const ventaCreada =
          await createVenta(
            ventaPayload
          );

        const venta =
          (ventaCreada as any)
            .venta ||
          ventaCreada;

        const idVenta =
          String(
            venta?._id ||
            venta?.id ||
            ""
          );

        if (!idVenta) {
          throw new Error(
            "No se pudo obtener el ID de la venta creada"
          );
        }

        await Promise.all(
          detallesPreparados.map(
            async (detalle) => {
              const detalleVentaPayload =
                {
                  idVenta,
                  idProducto:
                    detalle.idProducto,
                  idInventario:
                    detalle.idInventario,
                  idAlmacen:
                    detalle.idAlmacen,
                  cantidad:
                    detalle.cantidad,
                  precioUnitario:
                    detalle.precioUnitario,
                  costoUnitario:
                    detalle.costoUnitario,
                  subtotal:
                    detalle.subtotal,
                  creadoPor,
                } as DetalleVentaForm;

              await createDetalleVenta(
                detalleVentaPayload
              );

              const movimientoPayload =
                {
                  idProducto:
                    detalle.idProducto,
                  idInventario:
                    detalle.idInventario,
                  idAlmacen:
                    detalle.idAlmacen,
                  idSucursal,
                  tipoMovimiento:
                    "salida",
                  motivo:
                    "venta",
                  cantidad:
                    detalle.cantidad,
                  costoUnitario:
                    detalle.costoUnitario,
                  precioUnitario:
                    detalle.precioUnitario,
                  referencia:
                    "Venta",
                  idReferencia:
                    idVenta,
                  observacion:
                    `Salida por venta de la comanda ${obtenerNumeroComanda(
                      comanda
                    )}`,
                  creadoPor,
                } as MovimientoForm;

              await createMovimiento(
                movimientoPayload
              );
            }
          )
        );

        await updateComanda({
          comandaId:
            idComanda,
          formData: {
            estado:
              "cerrado",
            fechaCierre:
              new Date()
                .toISOString(),
            actualizadoPor:
              creadoPor,
          },
        } as any);

        return {
          venta,
          idVenta,
        };
      },

    onSuccess:
      async () => {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: [
              "comandas",
            ],
          }),

          queryClient.invalidateQueries({
            queryKey: [
              "ventas",
            ],
          }),

          queryClient.invalidateQueries({
            queryKey: [
              "inventarios",
            ],
          }),

          queryClient.invalidateQueries({
            queryKey: [
              "movimientos",
            ],
          }),

          queryClient.invalidateQueries({
            queryKey: [
              "aperturas-activas-sucursal",
              idSucursal,
            ],
          }),
        ]);

        const htmlTicket =
          generarHtmlTicketVenta({
            comanda,
            detalles:
              detallesPreparados,
            caja:
              cajaSeleccionada,
            metodoPago,
            subtotal,
            descuento:
              Number(
                descuento || 0
              ),
            total,
          });

        imprimirTicket(
          htmlTicket
        );

        await Swal.fire({
          icon:
            "success",
          title:
            "Venta registrada",
          text:
            "La venta se registró correctamente y se envió a impresión.",
          confirmButtonColor:
            "#c026d3",
        });

        onSuccess?.();
        onClose();
      },

    onError:
      (error) => {
        Swal.fire({
          icon:
            "error",
          title:
            "Error al registrar venta",
          text:
            error instanceof Error
              ? error.message
              : "No se pudo registrar la venta",
          confirmButtonColor:
            "#c026d3",
        });
      },
  });

  /* =========================
      RENDER
  ========================= */

  if (!open) {
    return null;
  }

  const cargandoCajas =
    cargandoAperturasActivas ||
    actualizandoAperturasActivas;

  const puedeConfirmar =
    !isPending &&
    !cargandoCajas &&
    cajasAbiertasOptions.length > 0 &&
    Boolean(idCaja) &&
    detallesPreparados.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-6 backdrop-blur-sm">
      <div className="relative max-h-[95vh] w-full max-w-4xl overflow-hidden rounded-[2rem] border border-fuchsia-500/30 bg-slate-950 shadow-2xl shadow-fuchsia-950/40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(217,70,239,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(6,182,212,0.12),transparent_35%)]" />

        <div className="relative z-10 flex max-h-[95vh] flex-col">
          {/* HEADER */}
          <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-500/30">
                <ReceiptText className="h-7 w-7" />
              </div>

              <div>
                <h2 className="text-2xl font-black text-white">
                  Confirmar venta
                </h2>

                <p className="text-sm text-slate-400">
                  Comanda{" "}
                  <span className="font-bold text-fuchsia-300">
                    {obtenerNumeroComanda(
                      comanda
                    )}
                  </span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="rounded-2xl border border-slate-700 bg-slate-900 p-3 text-slate-300 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* BODY */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              {/* IZQUIERDA */}
              <section className="space-y-5">
                <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
                  <h3 className="mb-4 text-lg font-black text-white">
                    Productos de la comanda
                  </h3>

                  <div className="space-y-3">
                    {detallesPreparados.length === 0 ? (
                      <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
                        Esta comanda no tiene productos válidos para vender.
                      </div>
                    ) : (
                      detallesPreparados.map(
                        (
                          detalle,
                          index
                        ) => (
                          <div
                            key={`${detalle.idProducto}-${index}`}
                            className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3"
                          >
                            <div>
                              <p className="font-bold text-white">
                                {detalle.nombreProducto}
                              </p>

                              <p className="text-sm text-slate-500">
                                Cantidad: {detalle.cantidad} ×{" "}
                                {formatoMoneda(
                                  detalle.precioUnitario
                                )}
                              </p>
                            </div>

                            <p className="text-lg font-black text-fuchsia-300">
                              {formatoMoneda(
                                detalle.subtotal
                              )}
                            </p>
                          </div>
                        )
                      )
                    )}
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
                  <h3 className="mb-4 text-lg font-black text-white">
                    Observación
                  </h3>

                  <textarea
                    value={observacion}
                    onChange={(event) =>
                      setObservacion(
                        event.target.value
                      )
                    }
                    disabled={isPending}
                    rows={4}
                    placeholder="Observación de la venta..."
                    className="w-full resize-none rounded-2xl border border-slate-700 bg-slate-950 px-5 py-4 text-white outline-none transition placeholder:text-slate-600 focus:border-fuchsia-400 focus:ring-4 focus:ring-fuchsia-500/10 disabled:opacity-60"
                  />
                </div>
              </section>

              {/* DERECHA */}
              <section className="space-y-5">
                <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
                  <h3 className="mb-4 text-lg font-black text-white">
                    Datos de pago
                  </h3>

                  {/* CAJA */}
                  <div className="space-y-3">
                    <label className="text-sm font-black text-white">
                      Caja
                    </label>

                    {cargandoCajas ? (
                      <div className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-950 px-5 py-4 text-slate-400">
                        <LoaderCircle className="h-5 w-5 animate-spin text-fuchsia-400" />

                        <span>
                          Cargando cajas abiertas...
                        </span>
                      </div>
                    ) : cajasAbiertasOptions.length === 0 ? (
                      <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm font-bold text-red-300">
                        No hay cajas abiertas para esta sucursal. No se puede registrar la venta.
                      </div>
                    ) : (
                      <select
                        value={idCaja}
                        onChange={(event) =>
                          setIdCaja(
                            event.target.value
                          )
                        }
                        disabled={isPending}
                        className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-5 py-4 text-lg font-black text-white outline-none transition focus:border-fuchsia-400 focus:ring-4 focus:ring-fuchsia-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <option value="">
                          Selecciona una caja abierta
                        </option>

                        {cajasAbiertasOptions.map(
                          (caja) => (
                            <option
                              key={caja.idAperturaCaja}
                              value={caja._id}
                            >
                              {caja.nombre} — Apertura:{" "}
                              {new Date(
                                caja.fechaApertura
                              ).toLocaleString(
                                "es-BO"
                              )}
                            </option>
                          )
                        )}
                      </select>
                    )}

                    {idCaja && cajaSeleccionada && (
                      <p className="text-xs text-slate-400">
                        Apertura activa:{" "}
                        <span className="font-bold text-cyan-300">
                          {formatoFecha(
                            cajaSeleccionada.fechaApertura
                          )}
                        </span>
                      </p>
                    )}
                  </div>

                  {/* MÉTODO DE PAGO */}
                  <div className="mt-5 space-y-3">
                    <label className="text-sm font-black text-white">
                      Método de pago
                    </label>

                    <div className="grid grid-cols-2 gap-3">
                      <MetodoPagoButton
                        active={
                          metodoPago ===
                          "efectivo"
                        }
                        icon={<Banknote />}
                        label="Efectivo"
                        onClick={() =>
                          setMetodoPago(
                            "efectivo"
                          )
                        }
                      />

                      <MetodoPagoButton
                        active={
                          metodoPago ===
                          "qr"
                        }
                        icon={<Smartphone />}
                        label="QR"
                        onClick={() =>
                          setMetodoPago(
                            "qr"
                          )
                        }
                      />

                      <MetodoPagoButton
                        active={
                          metodoPago ===
                          "transferencia"
                        }
                        icon={<CreditCard />}
                        label="Transf."
                        onClick={() =>
                          setMetodoPago(
                            "transferencia"
                          )
                        }
                      />

                      <MetodoPagoButton
                        active={
                          metodoPago ===
                          "mixto"
                        }
                        icon={<ReceiptText />}
                        label="Mixto"
                        onClick={() =>
                          setMetodoPago(
                            "mixto"
                          )
                        }
                      />
                    </div>
                  </div>

                  {/* DESCUENTO */}
                  <div className="mt-5 space-y-3">
                    <label className="text-sm font-black text-white">
                      Descuento
                    </label>

                    <input
                      type="number"
                      min={0}
                      max={subtotal}
                      step="0.01"
                      value={descuento}
                      onChange={(event) =>
                        setDescuento(
                          Number(
                            event.target.value ||
                              0
                          )
                        )
                      }
                      disabled={isPending}
                      className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-5 py-4 text-lg font-black text-white outline-none transition focus:border-fuchsia-400 focus:ring-4 focus:ring-fuchsia-500/10 disabled:opacity-60"
                    />
                  </div>
                </div>

                {/* RESUMEN */}
                <div className="rounded-3xl border border-fuchsia-500/30 bg-fuchsia-500/10 p-5">
                  <h3 className="mb-4 text-lg font-black text-white">
                    Resumen
                  </h3>

                  <div className="space-y-3">
                    <ResumenRow
                      label="Subtotal"
                      value={formatoMoneda(
                        subtotal
                      )}
                    />

                    <ResumenRow
                      label="Descuento"
                      value={formatoMoneda(
                        Number(
                          descuento || 0
                        )
                      )}
                    />

                    <div className="border-t border-fuchsia-400/30 pt-3">
                      <ResumenRow
                        label="Total"
                        value={formatoMoneda(
                          total
                        )}
                        strong
                      />
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex flex-col gap-3 border-t border-slate-800 px-6 py-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="rounded-2xl border border-slate-700 bg-slate-900 px-6 py-4 font-black text-slate-300 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={() =>
                mutate()
              }
              disabled={!puedeConfirmar}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-cyan-500 px-6 py-4 font-black text-white shadow-lg shadow-fuchsia-500/20 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
            >
              {isPending ? (
                <>
                  <LoaderCircle className="h-5 w-5 animate-spin" />
                  Registrando...
                </>
              ) : (
                <>
                  <Printer className="h-5 w-5" />
                  Confirmar e imprimir
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================
    SUBCOMPONENTES
========================= */

function MetodoPagoButton({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-black transition ${
        active
          ? "border-fuchsia-400 bg-fuchsia-500/20 text-fuchsia-200"
          : "border-slate-700 bg-slate-950 text-slate-400 hover:border-slate-500 hover:text-white"
      }`}
    >
      <span className="h-5 w-5">
        {icon}
      </span>

      {label}
    </button>
  );
}

function ResumenRow({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span
        className={
          strong
            ? "text-lg font-black text-white"
            : "text-sm text-slate-300"
        }
      >
        {label}
      </span>

      <span
        className={
          strong
            ? "text-2xl font-black text-fuchsia-300"
            : "font-bold text-white"
        }
      >
        {value}
      </span>
    </div>
  );
}