import {
  useMemo,
  useState,
} from "react";

import {
  Navigate,
  useParams,
} from "react-router-dom";

import {
  useQuery,
} from "@tanstack/react-query";

import {
  AlertTriangle,
  BarChart3,
  CalendarDays,
  Download,
  LoaderCircle,
  PackageSearch,
  Printer,
  RefreshCcw,
  RotateCcw,
  Trophy,
  TrendingUp,
} from "lucide-react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import MenuList from "@/components/MenuList";

import {
  getProductosMasVendidos,
} from "@/api/ReporteApi";

import type {
  ProductoMasVendidoItem,
  ProductosMasVendidosSucursal,
} from "@/types/ReporteType";

/* =====================================================
   FORMATEADORES
===================================================== */

const formatoMoneda =
  new Intl.NumberFormat(
    "es-BO",
    {
      style:
        "currency",
      currency:
        "BOB",
      minimumFractionDigits:
        2,
    }
  );

const formatoNumero =
  new Intl.NumberFormat(
    "es-BO"
  );

function convertirNumero(
  valor:
    | number
    | string
    | null
    | undefined
): number {
  const numero =
    Number(valor);

  return Number.isFinite(
    numero
  )
    ? numero
    : 0;
}

function mostrarMoneda(
  valor:
    | number
    | string
    | null
    | undefined
): string {
  return formatoMoneda.format(
    convertirNumero(
      valor
    )
  );
}

function mostrarNumero(
  valor:
    | number
    | string
    | null
    | undefined
): string {
  return formatoNumero.format(
    convertirNumero(
      valor
    )
  );
}

function formatearFecha(
  fecha?: string
): string {
  if (!fecha) {
    return "Sin fecha";
  }

  return new Date(
    `${fecha}T00:00:00`
  ).toLocaleDateString(
    "es-BO"
  );
}

function formatearFechaHora(): string {
  return new Date()
    .toLocaleString(
      "es-BO"
    );
}

function nombreArchivoSeguro(
  texto: string
): string {
  return texto
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .replace(
      /[^a-zA-Z0-9-_]/g,
      "_"
    )
    .replace(
      /_+/g,
      "_"
    );
}

/* =====================================================
   TOOLTIP
===================================================== */

type TooltipProductoProps = {
  active?: boolean;

  payload?: Array<{
    payload?: {
      nombre?: string;
      cantidadVendida?: number;
      totalVendido?: number;
    };
  }>;
};

function TooltipProducto({
  active,
  payload,
}: TooltipProductoProps) {
  if (
    !active ||
    !payload?.length
  ) {
    return null;
  }

  const item =
    payload[0]
      ?.payload;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-lg">
      <p className="font-semibold text-gray-900">
        {item?.nombre}
      </p>

      <p className="mt-1 text-sm text-gray-600">
        Cantidad:{" "}
        {mostrarNumero(
          item
            ?.cantidadVendida
        )}
      </p>

      <p className="mt-1 text-sm text-gray-600">
        Total:{" "}
        {mostrarMoneda(
          item
            ?.totalVendido
        )}
      </p>
    </div>
  );
}

/* =====================================================
   SKELETON
===================================================== */

function VistaSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-20 rounded-2xl bg-white" />

      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({
          length: 3,
        }).map(
          (
            _,
            index
          ) => (
            <div
              key={
                index
              }
              className="h-32 rounded-2xl bg-white"
            />
          )
        )}
      </div>

      <div className="h-[380px] rounded-2xl bg-white" />

      <div className="h-[420px] rounded-2xl bg-white" />
    </div>
  );
}

/* =====================================================
   VISTA PRINCIPAL
===================================================== */

export default function ProductoMasVendidoPorSucursalView() {
  const {
    sucursalId,
  } =
    useParams<{
      sucursalId:
        string;
    }>();

  const [
    fechaDesde,
    setFechaDesde,
  ] =
    useState("");

  const [
    fechaHasta,
    setFechaHasta,
  ] =
    useState("");

  const [
    limite,
    setLimite,
  ] =
    useState(10);

  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: [
      "productos-mas-vendidos-sucursal",
      sucursalId,
      fechaDesde,
      fechaHasta,
      limite,
    ],

    queryFn: () =>
      getProductosMasVendidos({
        idSucursal:
          sucursalId,

        fechaDesde:
          fechaDesde ||
          undefined,

        fechaHasta:
          fechaHasta ||
          undefined,

        limite,
      }),

    enabled:
      Boolean(
        sucursalId
      ),

    staleTime:
      1000 *
      60 *
      2,

    refetchOnWindowFocus:
      false,
  });

  const sucursal:
    ProductosMasVendidosSucursal | null =
      useMemo(
        () => {
          if (
            !data ||
            !sucursalId
          ) {
            return null;
          }

          return (
            data.sucursales.find(
              (
                item
              ) =>
                item.idSucursal ===
                sucursalId
            ) ??
            data.sucursales[0] ??
            null
          );
        },
        [
          data,
          sucursalId,
        ]
      );

  const productos:
    ProductoMasVendidoItem[] =
      sucursal
        ?.productosMasVendidos ??
      [];

  const productoMasVendido =
    sucursal
      ?.productoMasVendido ??
    productos[0] ??
    null;

  const totalUnidades =
    useMemo(
      () =>
        productos.reduce(
          (
            acumulado,
            producto
          ) =>
            acumulado +
            convertirNumero(
              producto
                .cantidadVendida
            ),
          0
        ),
      [
        productos,
      ]
    );

  const totalVendido =
    useMemo(
      () =>
        productos.reduce(
          (
            acumulado,
            producto
          ) =>
            acumulado +
            convertirNumero(
              producto
                .totalVendido
            ),
          0
        ),
      [
        productos,
      ]
    );

  const utilidadTotal =
    useMemo(
      () =>
        productos.reduce(
          (
            acumulado,
            producto
          ) =>
            acumulado +
            convertirNumero(
              producto
                .utilidad
            ),
          0
        ),
      [
        productos,
      ]
    );

  const datosGrafica =
    useMemo(
      () =>
        productos.map(
          (
            producto
          ) => ({
            nombre:
              producto.nombre,
            cantidadVendida:
              producto
                .cantidadVendida,
            totalVendido:
              producto
                .totalVendido,
          })
        ),
      [
        productos,
      ]
    );

  const limpiarFiltros =
    () => {
      setFechaDesde("");
      setFechaHasta("");
      setLimite(10);
    };

  /* =====================================================
     PDF
  ===================================================== */

  const generarPDF = (
    modo:
      | "descargar"
      | "imprimir"
  ) => {
    if (
      !sucursal
    ) {
      return;
    }

    const documento =
      new jsPDF({
        orientation:
          "landscape",
        unit:
          "mm",
        format:
          "a4",
      });

    const anchoPagina =
      documento.internal.pageSize.getWidth();

    documento.setFillColor(
      17,
      24,
      39
    );

    documento.rect(
      0,
      0,
      anchoPagina,
      32,
      "F"
    );

    documento.setTextColor(
      255,
      255,
      255
    );

    documento.setFont(
      "helvetica",
      "bold"
    );

    documento.setFontSize(
      17
    );

    documento.text(
      "PRODUCTOS MÁS VENDIDOS POR SUCURSAL",
      14,
      14
    );

    documento.setFontSize(
      10
    );

    documento.setFont(
      "helvetica",
      "normal"
    );

    documento.text(
      sucursal
        .nombreSucursal,
      14,
      22
    );

    documento.text(
      `Periodo: ${
        fechaDesde
          ? formatearFecha(
              fechaDesde
            )
          : "Inicio"
      } al ${
        fechaHasta
          ? formatearFecha(
              fechaHasta
            )
          : "Actual"
      }`,
      anchoPagina -
        14,
      14,
      {
        align:
          "right",
      }
    );

    documento.text(
      `Generado: ${formatearFechaHora()}`,
      anchoPagina -
        14,
      22,
      {
        align:
          "right",
      }
    );

    documento.setTextColor(
      31,
      41,
      55
    );

    documento.setFont(
      "helvetica",
      "bold"
    );

    documento.setFontSize(
      11
    );

    documento.text(
      "Resumen",
      14,
      43
    );

    autoTable(
      documento,
      {
        startY:
          48,

        head: [[
          "Indicador",
          "Resultado",
        ]],

        body: [
          [
            "Producto más vendido",
            productoMasVendido
              ?.nombre ??
              "Sin datos",
          ],
          [
            "Cantidad del producto líder",
            mostrarNumero(
              productoMasVendido
                ?.cantidadVendida
            ),
          ],
          [
            "Total de unidades",
            mostrarNumero(
              totalUnidades
            ),
          ],
          [
            "Total vendido",
            mostrarMoneda(
              totalVendido
            ),
          ],
          [
            "Utilidad estimada",
            mostrarMoneda(
              utilidadTotal
            ),
          ],
        ],

        theme:
          "grid",

        headStyles: {
          fillColor: [
            31,
            41,
            55,
          ],
        },

        styles: {
          fontSize:
            9,
        },
      }
    );

    const finalResumen =
      (
        documento as jsPDF & {
          lastAutoTable?: {
            finalY:
              number;
          };
        }
      ).lastAutoTable
        ?.finalY ??
      90;

    documento.text(
      "Detalle de productos",
      14,
      finalResumen +
        11
    );

    autoTable(
      documento,
      {
        startY:
          finalResumen +
          16,

        head: [[
          "#",
          "Producto",
          "Marca",
          "Cantidad",
          "Ventas",
          "Total vendido",
          "Costo",
          "Utilidad",
          "Precio promedio",
        ]],

        body:
          productos.map(
            (
              producto,
              index
            ) => [
              index +
                1,
              producto
                .nombre,
              producto
                .marca ||
                "-",
              mostrarNumero(
                producto
                  .cantidadVendida
              ),
              mostrarNumero(
                producto
                  .cantidadVentas
              ),
              mostrarMoneda(
                producto
                  .totalVendido
              ),
              mostrarMoneda(
                producto
                  .costoTotal
              ),
              mostrarMoneda(
                producto
                  .utilidad
              ),
              mostrarMoneda(
                producto
                  .precioPromedio
              ),
            ]
          ),

        theme:
          "striped",

        headStyles: {
          fillColor: [
            17,
            24,
            39,
          ],
        },

        styles: {
          fontSize:
            8,
        },
      }
    );

    const nombreArchivo =
      nombreArchivoSeguro(
        `productos_mas_vendidos_${sucursal.nombreSucursal}_${fechaDesde || "inicio"}_${fechaHasta || "actual"}`
      );

    if (
      modo ===
      "imprimir"
    ) {
      const url =
        documento.output(
          "bloburl"
        );

      window.open(
        url,
        "_blank",
        "noopener,noreferrer"
      );

      return;
    }

    documento.save(
      `${nombreArchivo}.pdf`
    );
  };

  /* =====================================================
     ESTADOS
  ===================================================== */

  if (
    !sucursalId
  ) {
    return (
      <Navigate
        to="/404"
        replace
      />
    );
  }

  if (
    isLoading
  ) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <MenuList />

        <main className="min-w-0 flex-1 p-4 pt-20 sm:p-6 md:pt-6">
          <VistaSkeleton />
        </main>
      </div>
    );
  }

  if (
    isError
  ) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <MenuList />

        <main className="min-w-0 flex-1 p-4 pt-20 sm:p-6 md:pt-6">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <div className="flex gap-3">
              <AlertTriangle className="mt-0.5 text-red-600" />

              <div>
                <h1 className="font-bold text-red-800">
                  No se pudo cargar el reporte
                </h1>

                <p className="mt-1 text-sm text-red-700">
                  {error instanceof
                  Error
                    ? error.message
                    : "Ocurrió un error inesperado."}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    refetch()
                  }
                  className="mt-4 rounded-xl bg-red-700 px-4 py-2 text-sm font-semibold text-white"
                >
                  Reintentar
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <MenuList />

      <main className="min-w-0 flex-1 overflow-x-hidden">
        <section className="space-y-6 p-4 pt-20 sm:p-6 md:pt-6">
          {/* HEADER */}

          <header className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-900 text-white">
                <Trophy size={24} />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  Productos más vendidos
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  {sucursal
                    ?.nombreSucursal ??
                    "Sucursal seleccionada"}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() =>
                  generarPDF(
                    "descargar"
                  )
                }
                disabled={
                  !sucursal ||
                  isFetching
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
              >
                <Download size={17} />
                Exportar PDF
              </button>

              <button
                type="button"
                onClick={() =>
                  generarPDF(
                    "imprimir"
                  )
                }
                disabled={
                  !sucursal ||
                  isFetching
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 disabled:opacity-50"
              >
                <Printer size={17} />
                Imprimir
              </button>

              <button
                type="button"
                onClick={() =>
                  refetch()
                }
                disabled={
                  isFetching
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 disabled:opacity-50"
              >
                <RefreshCcw
                  size={17}
                  className={
                    isFetching
                      ? "animate-spin"
                      : ""
                  }
                />
                Actualizar
              </button>
            </div>
          </header>

          {/* FILTROS */}

          <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                <CalendarDays size={20} />
              </div>

              <div>
                <h2 className="font-bold text-gray-900">
                  Filtros
                </h2>

                <p className="text-sm text-gray-500">
                  Define el periodo y la cantidad de productos.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-[1fr_1fr_180px_auto]">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Fecha inicial
                </label>

                <input
                  type="date"
                  value={
                    fechaDesde
                  }
                  onChange={(
                    event
                  ) =>
                    setFechaDesde(
                      event
                        .target
                        .value
                    )
                  }
                  max={
                    fechaHasta ||
                    undefined
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Fecha final
                </label>

                <input
                  type="date"
                  value={
                    fechaHasta
                  }
                  onChange={(
                    event
                  ) =>
                    setFechaHasta(
                      event
                        .target
                        .value
                    )
                  }
                  min={
                    fechaDesde ||
                    undefined
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Límite
                </label>

                <select
                  value={
                    limite
                  }
                  onChange={(
                    event
                  ) =>
                    setLimite(
                      Number(
                        event
                          .target
                          .value
                      )
                    )
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900"
                >
                  <option value={5}>
                    Top 5
                  </option>

                  <option value={10}>
                    Top 10
                  </option>

                  <option value={20}>
                    Top 20
                  </option>

                  <option value={50}>
                    Top 50
                  </option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={
                    limpiarFiltros
                  }
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 xl:w-auto"
                >
                  <RotateCcw size={17} />
                  Limpiar
                </button>
              </div>
            </div>
          </article>

          {/* RESUMEN */}

          <div className="grid gap-4 md:grid-cols-3">
            <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    Producto líder
                  </p>

                  <p className="mt-2 text-xl font-bold text-gray-900">
                    {productoMasVendido
                      ?.nombre ??
                      "Sin ventas"}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    {mostrarNumero(
                      productoMasVendido
                        ?.cantidadVendida
                    )}{" "}
                    unidades
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                  <Trophy size={21} />
                </div>
              </div>
            </article>

            <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    Unidades vendidas
                  </p>

                  <p className="mt-2 text-3xl font-bold text-gray-900">
                    {mostrarNumero(
                      totalUnidades
                    )}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                  <PackageSearch size={21} />
                </div>
              </div>
            </article>

            <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    Total vendido
                  </p>

                  <p className="mt-2 text-3xl font-bold text-emerald-700">
                    {mostrarMoneda(
                      totalVendido
                    )}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Utilidad:{" "}
                    {mostrarMoneda(
                      utilidadTotal
                    )}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <TrendingUp size={21} />
                </div>
              </div>
            </article>
          </div>

          {/* GRÁFICA */}

          <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                <BarChart3 size={20} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Cantidad vendida por producto
                </h2>

                <p className="text-sm text-gray-500">
                  Comparación de los productos con mayor salida.
                </p>
              </div>
            </div>

            {productos.length >
            0 ? (
              <div className="mt-5 h-[360px] w-full">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <BarChart
                    data={
                      datosGrafica
                    }
                    margin={{
                      top: 15,
                      right: 10,
                      left: 0,
                      bottom: 80,
                    }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                    />

                    <XAxis
                      dataKey="nombre"
                      angle={-35}
                      textAnchor="end"
                      interval={0}
                      height={95}
                      tickLine={false}
                      axisLine={false}
                    />

                    <YAxis
                      tickLine={false}
                      axisLine={false}
                    />

                    <Tooltip
                      content={
                        <TooltipProducto />
                      }
                    />

                    <Bar
                      dataKey="cantidadVendida"
                      fill="#111827"
                      radius={[
                        8,
                        8,
                        0,
                        0,
                      ]}
                      maxBarSize={55}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="mt-5 flex h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-300">
                <PackageSearch className="text-gray-300" size={38} />

                <p className="mt-3 font-semibold text-gray-600">
                  Sin productos vendidos
                </p>
              </div>
            )}
          </article>

          {/* TABLA */}

          <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 p-5">
              <h2 className="text-lg font-bold text-gray-900">
                Ranking de productos
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Detalle económico de los productos más vendidos.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-[1050px] w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      "#",
                      "Producto",
                      "Marca",
                      "Cantidad",
                      "Ventas",
                      "Total vendido",
                      "Costo",
                      "Utilidad",
                      "Precio promedio",
                    ].map(
                      (
                        titulo
                      ) => (
                        <th
                          key={
                            titulo
                          }
                          className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500"
                        >
                          {titulo}
                        </th>
                      )
                    )}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {productos.map(
                    (
                      producto,
                      index
                    ) => (
                      <tr
                        key={
                          producto
                            .idProducto
                        }
                        className="hover:bg-gray-50"
                      >
                        <td className="px-5 py-4 font-bold text-gray-500">
                          {index +
                            1}
                        </td>

                        <td className="px-5 py-4">
                          <p className="font-semibold text-gray-900">
                            {
                              producto
                                .nombre
                            }
                          </p>

                          {producto
                            .descripcion && (
                            <p className="mt-1 max-w-xs truncate text-xs text-gray-500">
                              {
                                producto
                                  .descripcion
                              }
                            </p>
                          )}
                        </td>

                        <td className="px-5 py-4 text-gray-600">
                          {producto
                            .marca ||
                            "-"}
                        </td>

                        <td className="px-5 py-4 font-bold text-gray-900">
                          {mostrarNumero(
                            producto
                              .cantidadVendida
                          )}
                        </td>

                        <td className="px-5 py-4 text-gray-600">
                          {mostrarNumero(
                            producto
                              .cantidadVentas
                          )}
                        </td>

                        <td className="px-5 py-4 font-semibold text-emerald-700">
                          {mostrarMoneda(
                            producto
                              .totalVendido
                          )}
                        </td>

                        <td className="px-5 py-4 text-gray-600">
                          {mostrarMoneda(
                            producto
                              .costoTotal
                          )}
                        </td>

                        <td className="px-5 py-4 font-semibold text-blue-700">
                          {mostrarMoneda(
                            producto
                              .utilidad
                          )}
                        </td>

                        <td className="px-5 py-4 text-gray-600">
                          {mostrarMoneda(
                            producto
                              .precioPromedio
                          )}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </article>

          {isFetching && (
            <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white shadow-xl">
              <LoaderCircle
                size={18}
                className="animate-spin"
              />

              Actualizando reporte...
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
