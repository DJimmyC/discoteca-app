import {
  type ElementType,
  useMemo,
  useState,
} from "react";

import { useParams } from "react-router-dom";

import { useQuery } from "@tanstack/react-query";

import {
  AlertTriangle,
  Boxes,
  CircleDollarSign,
  Download,
  FileBarChart,
  Filter,
  Layers3,
  LoaderCircle,
  Package,
  Percent,
  Printer,
  RefreshCcw,
  RotateCcw,
  Search,
  TrendingUp,
  Warehouse,
} from "lucide-react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import MenuList from "@/components/MenuList";

import {
  getReporteValorInventario,
} from "@/api/ReporteApi";

/* =====================================================
   FORMATEADORES
===================================================== */

const formatoMoneda = new Intl.NumberFormat("es-BO", {
  style: "currency",
  currency: "BOB",
  minimumFractionDigits: 2,
});

const formatoNumero = new Intl.NumberFormat("es-BO");

function convertirNumero(
  valor: number | string | null | undefined
): number {
  const numero = Number(valor);

  return Number.isFinite(numero)
    ? numero
    : 0;
}

function mostrarMoneda(
  valor: number | string | null | undefined
): string {
  return formatoMoneda.format(
    convertirNumero(valor)
  );
}

function mostrarNumero(
  valor: number | string | null | undefined
): string {
  return formatoNumero.format(
    convertirNumero(valor)
  );
}

function mostrarPorcentaje(
  valor: number | string | null | undefined
): string {
  return `${convertirNumero(valor).toFixed(2)}%`;
}

function formatearFechaHoraActual(): string {
  return new Date().toLocaleString("es-BO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function limpiarNombreArchivo(
  texto: string
): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9-_]/g, "_")
    .replace(/_+/g, "_");
}

function recortarTexto(
  texto: string,
  limite = 18
): string {
  if (!texto || texto.length <= limite) {
    return texto;
  }

  return `${texto.slice(0, limite)}...`;
}

/* =====================================================
   TIPOS AUXILIARES
===================================================== */

type VarianteTarjeta =
  | "normal"
  | "principal"
  | "positivo"
  | "advertencia"
  | "informativo";

type TarjetaIndicadorProps = {
  titulo: string;
  valor: string;
  descripcion: string;
  icono: ElementType;
  variante?: VarianteTarjeta;
};

type ValorInventarioItem = {
  idAlmacen: string;
  nombreAlmacen: string;
  tipoAlmacen?: string;

  cantidadProductos: number;
  unidadesDisponibles: number;

  valorCosto: number;
  valorVenta: number;
  gananciaPotencial: number;
  margenPotencial: number;
};

type ValorInventarioGrafica = ValorInventarioItem & {
  nombreCorto: string;
  color: string;
  porcentajeValor: number;
};

type TooltipAlmacenProps = {
  active?: boolean;
  payload?: Array<{
    value?: number;
    dataKey?: string;
    payload?: ValorInventarioGrafica;
  }>;
};

type TooltipParticipacionProps = {
  active?: boolean;
  payload?: Array<{
    value?: number;
    payload?: ValorInventarioGrafica;
  }>;
};

/* =====================================================
   TARJETA DE INDICADOR
===================================================== */

function TarjetaIndicador({
  titulo,
  valor,
  descripcion,
  icono: Icono,
  variante = "normal",
}: TarjetaIndicadorProps) {
  const estilos = {
    normal: {
      borde: "border-gray-200",
      icono: "bg-gray-100 text-gray-700",
      valor: "text-gray-900",
    },

    principal: {
      borde: "border-gray-900",
      icono: "bg-gray-900 text-white",
      valor: "text-gray-900",
    },

    positivo: {
      borde: "border-emerald-200",
      icono: "bg-emerald-100 text-emerald-700",
      valor: "text-emerald-700",
    },

    advertencia: {
      borde: "border-amber-200",
      icono: "bg-amber-100 text-amber-700",
      valor: "text-amber-700",
    },

    informativo: {
      borde: "border-blue-200",
      icono: "bg-blue-100 text-blue-700",
      valor: "text-blue-700",
    },
  };

  const estilo = estilos[variante];

  return (
    <article
      className={`
        rounded-2xl border bg-white p-5
        shadow-sm transition duration-200
        hover:-translate-y-0.5 hover:shadow-md
        ${estilo.borde}
      `}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-500">
            {titulo}
          </p>

          <p
            className={`
              mt-3 break-words text-2xl
              font-bold sm:text-3xl
              ${estilo.valor}
            `}
          >
            {valor}
          </p>

          <p className="mt-2 text-xs leading-5 text-gray-500">
            {descripcion}
          </p>
        </div>

        <div
          className={`
            flex h-11 w-11 shrink-0
            items-center justify-center rounded-xl
            ${estilo.icono}
          `}
        >
          <Icono size={21} />
        </div>
      </div>
    </article>
  );
}

/* =====================================================
   TOOLTIP DE BARRAS
===================================================== */

function TooltipAlmacen({
  active,
  payload,
}: TooltipAlmacenProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const item = payload[0]?.payload;

  return (
    <div className="max-w-xs rounded-xl border border-gray-200 bg-white p-3 shadow-lg">
      <p className="text-sm font-semibold text-gray-900">
        {item?.nombreAlmacen}
      </p>

      {item?.tipoAlmacen && (
        <p className="mt-1 text-xs text-gray-500">
          {item.tipoAlmacen}
        </p>
      )}

      <div className="mt-2 space-y-1">
        <p className="text-sm text-gray-600">
          Valor al costo:{" "}
          <strong>
            {mostrarMoneda(item?.valorCosto)}
          </strong>
        </p>

        <p className="text-sm text-gray-600">
          Valor de venta:{" "}
          <strong>
            {mostrarMoneda(item?.valorVenta)}
          </strong>
        </p>

        <p className="text-sm text-emerald-700">
          Ganancia potencial:{" "}
          <strong>
            {mostrarMoneda(
              item?.gananciaPotencial
            )}
          </strong>
        </p>
      </div>
    </div>
  );
}

/* =====================================================
   TOOLTIP DE TORTA
===================================================== */

function TooltipParticipacion({
  active,
  payload,
}: TooltipParticipacionProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const item = payload[0]?.payload;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-lg">
      <p className="text-sm font-semibold text-gray-900">
        {item?.nombreAlmacen}
      </p>

      <p className="mt-1 text-sm text-gray-600">
        {mostrarMoneda(item?.valorCosto)}
      </p>

      <p className="mt-1 text-xs text-gray-500">
        Participación:{" "}
        {mostrarPorcentaje(
          item?.porcentajeValor
        )}
      </p>
    </div>
  );
}

/* =====================================================
   SKELETON
===================================================== */

function ReporteValorInventarioSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div>
        <div className="h-8 w-80 max-w-full rounded bg-gray-200" />
        <div className="mt-3 h-4 w-96 max-w-full rounded bg-gray-100" />
      </div>

      <div className="h-36 rounded-2xl border bg-white" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({
          length: 4,
        }).map((_, index) => (
          <div
            key={index}
            className="h-40 rounded-2xl border bg-white"
          />
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <div className="h-[420px] rounded-2xl border bg-white" />
        <div className="h-[420px] rounded-2xl border bg-white" />
      </div>

      <div className="h-[420px] rounded-2xl border bg-white" />
    </div>
  );
}

/* =====================================================
   VISTA PRINCIPAL
===================================================== */

export default function ReporteValorInventarioView() {
  const { sucursalId } = useParams<{
    sucursalId: string;
  }>();

  const [busqueda, setBusqueda] =
    useState("");

  const [
    almacenSeleccionado,
    setAlmacenSeleccionado,
  ] = useState("");

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: [
      "reporte-valor-inventario",
      sucursalId,
    ],

    queryFn: () =>
      getReporteValorInventario({
        idSucursal: sucursalId,
      }),

    enabled: Boolean(sucursalId),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });

  /*
   * La vista acepta dos formas posibles:
   *
   * 1. data.data = resumen por almacén
   * 2. data.almacenes = resumen por almacén
   */
const almacenesReporte: ValorInventarioItem[] =
  data?.data ?? [];
  const almacenesDisponibles = useMemo(
    () =>
      almacenesReporte
        .map((item) => ({
          id: item.idAlmacen,
          nombre:
            item.nombreAlmacen ||
            "Almacén sin nombre",
        }))
        .sort((a, b) =>
          a.nombre.localeCompare(b.nombre)
        ),
    [almacenesReporte]
  );

  const almacenesFiltrados = useMemo(() => {
    const texto = busqueda
      .trim()
      .toLowerCase();

    return almacenesReporte.filter(
      (item) => {
        const coincideBusqueda =
          !texto ||
          item.nombreAlmacen
            ?.toLowerCase()
            .includes(texto) ||
          item.tipoAlmacen
            ?.toLowerCase()
            .includes(texto);

        const coincideAlmacen =
          !almacenSeleccionado ||
          item.idAlmacen ===
            almacenSeleccionado;

        return (
          coincideBusqueda &&
          coincideAlmacen
        );
      }
    );
  }, [
    almacenesReporte,
    busqueda,
    almacenSeleccionado,
  ]);

  /* =====================================================
     TOTALES
  ===================================================== */

  const totalAlmacenes =
    almacenesFiltrados.length;

  const totalProductos =
    almacenesFiltrados.reduce(
      (acumulado, item) =>
        acumulado +
        convertirNumero(
          item.cantidadProductos
        ),
      0
    );

  const totalUnidades =
    almacenesFiltrados.reduce(
      (acumulado, item) =>
        acumulado +
        convertirNumero(
          item.unidadesDisponibles
        ),
      0
    );

  const valorCostoTotal =
    almacenesFiltrados.reduce(
      (acumulado, item) =>
        acumulado +
        convertirNumero(
          item.valorCosto
        ),
      0
    );

  const valorVentaTotal =
    almacenesFiltrados.reduce(
      (acumulado, item) =>
        acumulado +
        convertirNumero(
          item.valorVenta
        ),
      0
    );

  const gananciaPotencialTotal =
    almacenesFiltrados.reduce(
      (acumulado, item) =>
        acumulado +
        convertirNumero(
          item.gananciaPotencial
        ),
      0
    );

  const margenPotencialTotal =
    valorVentaTotal > 0
      ? (gananciaPotencialTotal /
          valorVentaTotal) *
        100
      : 0;

  const almacenMayorValor =
    [...almacenesFiltrados].sort(
      (a, b) =>
        convertirNumero(b.valorCosto) -
        convertirNumero(a.valorCosto)
    )[0] ?? null;

  const porcentajeAlmacenMayor =
    almacenMayorValor &&
    valorCostoTotal > 0
      ? (convertirNumero(
          almacenMayorValor.valorCosto
        ) /
          valorCostoTotal) *
        100
      : 0;

  /* =====================================================
     DATOS PARA GRÁFICAS
  ===================================================== */

  const coloresGrafica = [
    "#111827",
    "#2563eb",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#ef4444",
    "#0891b2",
    "#db2777",
  ];

  const datosGrafica =
    useMemo<ValorInventarioGrafica[]>(
      () =>
        [...almacenesFiltrados]
          .sort(
            (a, b) =>
              convertirNumero(
                b.valorCosto
              ) -
              convertirNumero(
                a.valorCosto
              )
          )
          .map((item, index) => ({
            ...item,

            nombreCorto: recortarTexto(
              item.nombreAlmacen,
              18
            ),

            cantidadProductos:
              convertirNumero(
                item.cantidadProductos
              ),

            unidadesDisponibles:
              convertirNumero(
                item.unidadesDisponibles
              ),

            valorCosto:
              convertirNumero(
                item.valorCosto
              ),

            valorVenta:
              convertirNumero(
                item.valorVenta
              ),

            gananciaPotencial:
              convertirNumero(
                item.gananciaPotencial
              ),

            margenPotencial:
              convertirNumero(
                item.margenPotencial
              ),

            porcentajeValor:
              valorCostoTotal > 0
                ? (convertirNumero(
                    item.valorCosto
                  ) /
                    valorCostoTotal) *
                  100
                : 0,

            color:
              coloresGrafica[
                index %
                  coloresGrafica.length
              ],
          })),
      [
        almacenesFiltrados,
        valorCostoTotal,
      ]
    );

  const limpiarFiltros = () => {
    setBusqueda("");
    setAlmacenSeleccionado("");
  };

  /* =====================================================
     GENERACIÓN DE PDF
  ===================================================== */

  const generarReportePDF = (
    modo: "descargar" | "imprimir" = "descargar"
  ) => {
    if (
      !sucursalId ||
      almacenesFiltrados.length === 0
    ) {
      return;
    }

    const documento = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const anchoPagina =
      documento.internal.pageSize.getWidth();

    const altoPagina =
      documento.internal.pageSize.getHeight();

    const margenIzquierdo = 15;
    const margenDerecho = 15;

    /* ENCABEZADO */

    documento.setFillColor(
      17,
      24,
      39
    );

    documento.rect(
      0,
      0,
      anchoPagina,
      38,
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

    documento.setFontSize(18);

    documento.text(
      "VALOR DEL INVENTARIO",
      margenIzquierdo,
      15
    );

    documento.setFont(
      "helvetica",
      "normal"
    );

    documento.setFontSize(10);

    documento.text(
      "Reporte financiero de valoración por almacén",
      margenIzquierdo,
      23
    );

    documento.setFontSize(9);

    documento.text(
      `Sucursal ${sucursalId}`,
      anchoPagina - margenDerecho,
      13,
      {
        align: "right",
      }
    );

    documento.text(
      `Generado: ${formatearFechaHoraActual()}`,
      anchoPagina - margenDerecho,
      20,
      {
        align: "right",
      }
    );

    documento.text(
      `Almacenes mostrados: ${mostrarNumero(
        totalAlmacenes
      )}`,
      anchoPagina - margenDerecho,
      27,
      {
        align: "right",
      }
    );

    /* RESUMEN EJECUTIVO */

    documento.setTextColor(
      31,
      41,
      55
    );

    documento.setFont(
      "helvetica",
      "bold"
    );

    documento.setFontSize(11);

    documento.text(
      "Resumen ejecutivo",
      margenIzquierdo,
      48
    );

    autoTable(documento, {
      startY: 53,

      margin: {
        left: margenIzquierdo,
        right: margenDerecho,
      },

      head: [
        [
          "Almacenes",
          "Productos",
          "Unidades",
          "Valor al costo",
          "Valor de venta",
          "Ganancia potencial",
          "Margen",
        ],
      ],

      body: [
        [
          mostrarNumero(totalAlmacenes),
          mostrarNumero(totalProductos),
          mostrarNumero(totalUnidades),
          mostrarMoneda(valorCostoTotal),
          mostrarMoneda(valorVentaTotal),
          mostrarMoneda(
            gananciaPotencialTotal
          ),
          mostrarPorcentaje(
            margenPotencialTotal
          ),
        ],
      ],

      theme: "grid",

      styles: {
        font: "helvetica",
        fontSize: 8.5,
        cellPadding: 3,
        halign: "center",
        textColor: [31, 41, 55],
        lineColor: [229, 231, 235],
        lineWidth: 0.2,
      },

      headStyles: {
        fillColor: [55, 65, 81],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
    });

    const posicionResumen =
      (
        documento as jsPDF & {
          lastAutoTable?: {
            finalY: number;
          };
        }
      ).lastAutoTable?.finalY ?? 75;

    /* DETALLE POR ALMACÉN */

    documento.setFont(
      "helvetica",
      "bold"
    );

    documento.setFontSize(11);

    documento.text(
      "Valoración por almacén",
      margenIzquierdo,
      posicionResumen + 11
    );

    autoTable(documento, {
      startY:
        posicionResumen + 16,

      margin: {
        left: margenIzquierdo,
        right: margenDerecho,
      },

      head: [
        [
          "Almacén",
          "Tipo",
          "Productos",
          "Unidades",
          "Valor costo",
          "Valor venta",
          "Ganancia potencial",
          "Margen",
          "Participación",
        ],
      ],

      body: datosGrafica.map(
        (item) => [
          item.nombreAlmacen ||
            "Sin nombre",
          item.tipoAlmacen ||
            "Sin tipo",
          mostrarNumero(
            item.cantidadProductos
          ),
          mostrarNumero(
            item.unidadesDisponibles
          ),
          mostrarMoneda(
            item.valorCosto
          ),
          mostrarMoneda(
            item.valorVenta
          ),
          mostrarMoneda(
            item.gananciaPotencial
          ),
          mostrarPorcentaje(
            item.margenPotencial
          ),
          mostrarPorcentaje(
            item.porcentajeValor
          ),
        ]
      ),

      foot: [
        [
          "TOTAL",
          "-",
          mostrarNumero(
            totalProductos
          ),
          mostrarNumero(
            totalUnidades
          ),
          mostrarMoneda(
            valorCostoTotal
          ),
          mostrarMoneda(
            valorVentaTotal
          ),
          mostrarMoneda(
            gananciaPotencialTotal
          ),
          mostrarPorcentaje(
            margenPotencialTotal
          ),
          "100%",
        ],
      ],

      theme: "grid",

      styles: {
        font: "helvetica",
        fontSize: 7.5,
        cellPadding: 2.5,
        textColor: [31, 41, 55],
        lineColor: [209, 213, 219],
        overflow: "linebreak",
      },

      headStyles: {
        fillColor: [17, 24, 39],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        halign: "center",
      },

      footStyles: {
        fillColor: [17, 24, 39],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },

      columnStyles: {
        0: {
          cellWidth: 41,
        },
        1: {
          cellWidth: 28,
        },
        2: {
          cellWidth: 23,
          halign: "center",
        },
        3: {
          cellWidth: 23,
          halign: "center",
        },
        4: {
          cellWidth: 33,
          halign: "right",
        },
        5: {
          cellWidth: 33,
          halign: "right",
        },
        6: {
          cellWidth: 34,
          halign: "right",
        },
        7: {
          cellWidth: 24,
          halign: "right",
        },
        8: {
          cellWidth: 25,
          halign: "right",
        },
      },

      didParseCell: (hookData) => {
        if (
          hookData.section !== "body"
        ) {
          return;
        }

        if (hookData.row.index === 0) {
          hookData.cell.styles.fillColor = [
            239,
            246,
            255,
          ];

          hookData.cell.styles.fontStyle =
            "bold";
        }

        if (hookData.column.index === 6) {
          hookData.cell.styles.textColor = [
            4,
            120,
            87,
          ];

          hookData.cell.styles.fontStyle =
            "bold";
        }
      },
    });

    /* INTERPRETACIÓN */

    const posicionTabla =
      (
        documento as jsPDF & {
          lastAutoTable?: {
            finalY: number;
          };
        }
      ).lastAutoTable?.finalY ?? 155;

    let posicionInterpretacion =
      posicionTabla + 11;

    if (
      posicionInterpretacion >
      altoPagina - 45
    ) {
      documento.addPage();
      posicionInterpretacion = 20;
    }

    documento.setFont(
      "helvetica",
      "bold"
    );

    documento.setFontSize(11);
    documento.setTextColor(
      31,
      41,
      55
    );

    documento.text(
      "Interpretación financiera",
      margenIzquierdo,
      posicionInterpretacion
    );

    const interpretaciones: string[] = [];

    interpretaciones.push(
      `El inventario de la sucursal tiene un valor al costo de ${mostrarMoneda(
        valorCostoTotal
      )}.`
    );

    interpretaciones.push(
      `El valor potencial de venta asciende a ${mostrarMoneda(
        valorVentaTotal
      )}, generando una ganancia potencial estimada de ${mostrarMoneda(
        gananciaPotencialTotal
      )}.`
    );

    interpretaciones.push(
      `El margen potencial acumulado es de ${mostrarPorcentaje(
        margenPotencialTotal
      )}.`
    );

    if (almacenMayorValor) {
      interpretaciones.push(
        `${almacenMayorValor.nombreAlmacen} concentra el mayor valor del inventario, representando el ${mostrarPorcentaje(
          porcentajeAlmacenMayor
        )} del valor total al costo.`
      );
    }

    if (porcentajeAlmacenMayor > 60) {
      interpretaciones.push(
        "Existe una alta concentración del inventario en un solo almacén. Se recomienda evaluar la distribución física y operativa de las existencias."
      );
    }

    documento.setFont(
      "helvetica",
      "normal"
    );

    documento.setFontSize(9.5);

    let posicionTexto =
      posicionInterpretacion + 7;

    interpretaciones.forEach(
      (interpretacion, index) => {
        const lineas =
          documento.splitTextToSize(
            `${index + 1}. ${interpretacion}`,
            anchoPagina -
              margenIzquierdo -
              margenDerecho -
              4
          );

        documento.text(
          lineas,
          margenIzquierdo + 2,
          posicionTexto
        );

        posicionTexto +=
          lineas.length * 5 + 2;
      }
    );

    /* PIE DE PÁGINA */

    const totalPaginas =
      documento.getNumberOfPages();

    for (
      let pagina = 1;
      pagina <= totalPaginas;
      pagina++
    ) {
      documento.setPage(pagina);

      documento.setDrawColor(
        229,
        231,
        235
      );

      documento.line(
        margenIzquierdo,
        altoPagina - 14,
        anchoPagina - margenDerecho,
        altoPagina - 14
      );

      documento.setFont(
        "helvetica",
        "normal"
      );

      documento.setFontSize(8);

      documento.setTextColor(
        107,
        114,
        128
      );

      documento.text(
        "Documento generado automáticamente por el Sistema de Gestión de Discoteca.",
        margenIzquierdo,
        altoPagina - 8
      );

      documento.text(
        `Página ${pagina} de ${totalPaginas}`,
        anchoPagina - margenDerecho,
        altoPagina - 8,
        {
          align: "right",
        }
      );
    }

    const nombreArchivo =
      limpiarNombreArchivo(
        `valor_inventario_${sucursalId}`
      );

    if (modo === "imprimir") {
      const urlPDF =
        documento.output("bloburl");

      window.open(
        urlPDF,
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

  if (!sucursalId) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <MenuList />

        <main className="min-w-0 flex-1 p-4 pt-20 sm:p-6 sm:pt-20 md:pt-6">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle
                size={22}
                className="mt-0.5 text-red-600"
              />

              <div>
                <h1 className="font-bold text-red-800">
                  Sucursal no encontrada
                </h1>

                <p className="mt-1 text-sm text-red-700">
                  No se encontró el ID de la sucursal en la ruta.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <MenuList />

        <main className="min-w-0 flex-1 p-4 pt-20 sm:p-6 sm:pt-20 md:pt-6">
          <ReporteValorInventarioSkeleton />
        </main>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <MenuList />

        <main className="min-w-0 flex-1 p-4 pt-20 sm:p-6 sm:pt-20 md:pt-6">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-700">
                <AlertTriangle size={22} />
              </div>

              <div className="flex-1">
                <h1 className="text-lg font-bold text-red-800">
                  No se pudo cargar el valor del inventario
                </h1>

                <p className="mt-2 text-sm text-red-700">
                  {error instanceof Error
                    ? error.message
                    : "Ocurrió un error al consultar el reporte."}
                </p>

                <button
                  type="button"
                  onClick={() => refetch()}
                  className="
                    mt-4 rounded-lg bg-red-700
                    px-4 py-2 text-sm font-semibold
                    text-white transition hover:bg-red-800
                  "
                >
                  Intentar nuevamente
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
        <section className="space-y-7 p-4 pt-20 sm:p-6 sm:pt-20 md:pt-6">
          {/* ENCABEZADO */}

          <header className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-3">
              <div
                className="
                  flex h-12 w-12 shrink-0
                  items-center justify-center
                  rounded-2xl bg-gray-900 text-white
                "
              >
                <CircleDollarSign size={24} />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  Valor del inventario
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Valoración financiera del inventario por almacén de la sucursal.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 xl:flex xl:items-center">
              <button
                type="button"
                onClick={() =>
                  generarReportePDF(
                    "descargar"
                  )
                }
                disabled={
                  isFetching ||
                  almacenesFiltrados.length === 0
                }
                className="
                  inline-flex items-center justify-center gap-2
                  rounded-xl bg-gray-900 px-4 py-2.5
                  text-sm font-semibold text-white shadow-sm
                  transition hover:bg-black
                  disabled:cursor-not-allowed disabled:opacity-50
                "
              >
                <Download size={17} />
                Descargar PDF
              </button>

              <button
                type="button"
                onClick={() =>
                  generarReportePDF(
                    "imprimir"
                  )
                }
                disabled={
                  isFetching ||
                  almacenesFiltrados.length === 0
                }
                className="
                  inline-flex items-center justify-center gap-2
                  rounded-xl border border-gray-900 bg-white
                  px-4 py-2.5 text-sm font-semibold
                  text-gray-900 shadow-sm transition
                  hover:bg-gray-100
                  disabled:cursor-not-allowed disabled:opacity-50
                "
              >
                <Printer size={17} />
                Imprimir
              </button>

              <button
                type="button"
                onClick={() => refetch()}
                disabled={isFetching}
                className="
                  inline-flex items-center justify-center gap-2
                  rounded-xl border border-gray-300 bg-white
                  px-4 py-2.5 text-sm font-semibold
                  text-gray-700 shadow-sm transition
                  hover:bg-gray-50
                  disabled:cursor-not-allowed disabled:opacity-60
                "
              >
                <RefreshCcw
                  size={17}
                  className={
                    isFetching
                      ? "animate-spin"
                      : ""
                  }
                />

                {isFetching
                  ? "Actualizando..."
                  : "Actualizar"}
              </button>
            </div>
          </header>

          {/* FILTROS */}

          <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                <Filter size={20} />
              </div>

              <div>
                <h2 className="font-bold text-gray-900">
                  Filtros del reporte
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Busca o selecciona un almacén para revisar su valoración.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1.5fr_1fr_auto]">
              <div>
                <label
                  htmlFor="busquedaValor"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Buscar almacén
                </label>

                <div className="relative">
                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="busquedaValor"
                    type="text"
                    value={busqueda}
                    onChange={(event) =>
                      setBusqueda(
                        event.target.value
                      )
                    }
                    placeholder="Nombre o tipo de almacén..."
                    className="
                      w-full rounded-xl border border-gray-300
                      bg-white py-3 pl-11 pr-4 text-sm
                      text-gray-700 outline-none transition
                      focus:border-gray-900
                      focus:ring-2 focus:ring-gray-900/10
                    "
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="almacenValor"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Almacén
                </label>

                <select
                  id="almacenValor"
                  value={almacenSeleccionado}
                  onChange={(event) =>
                    setAlmacenSeleccionado(
                      event.target.value
                    )
                  }
                  className="
                    w-full rounded-xl border border-gray-300
                    bg-white px-4 py-3 text-sm text-gray-700
                    outline-none transition focus:border-gray-900
                    focus:ring-2 focus:ring-gray-900/10
                  "
                >
                  <option value="">
                    Todos los almacenes
                  </option>

                  {almacenesDisponibles.map(
                    (almacen) => (
                      <option
                        key={almacen.id}
                        value={almacen.id}
                      >
                        {almacen.nombre}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={limpiarFiltros}
                  disabled={
                    !busqueda &&
                    !almacenSeleccionado
                  }
                  className="
                    inline-flex w-full items-center
                    justify-center gap-2 rounded-xl
                    border border-gray-300 bg-white
                    px-4 py-3 text-sm font-semibold
                    text-gray-700 transition hover:bg-gray-50
                    disabled:cursor-not-allowed
                    disabled:opacity-50 xl:w-auto
                  "
                >
                  <RotateCcw size={17} />
                  Limpiar
                </button>
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-600">
              Mostrando{" "}
              <strong>
                {mostrarNumero(
                  almacenesFiltrados.length
                )}
              </strong>{" "}
              de{" "}
              <strong>
                {mostrarNumero(
                  almacenesReporte.length
                )}
              </strong>{" "}
              almacenes.
            </div>
          </article>

          {/* TARJETAS */}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <TarjetaIndicador
              titulo="Valor al costo"
              valor={mostrarMoneda(
                valorCostoTotal
              )}
              descripcion="Capital invertido actualmente en el inventario."
              icono={CircleDollarSign}
              variante="principal"
            />

            <TarjetaIndicador
              titulo="Valor potencial de venta"
              valor={mostrarMoneda(
                valorVentaTotal
              )}
              descripcion="Ingreso estimado si se vende todo el inventario."
              icono={TrendingUp}
              variante="informativo"
            />

            <TarjetaIndicador
              titulo="Ganancia potencial"
              valor={mostrarMoneda(
                gananciaPotencialTotal
              )}
              descripcion="Diferencia estimada entre valor de venta y costo."
              icono={TrendingUp}
              variante="positivo"
            />

            <TarjetaIndicador
              titulo="Margen potencial"
              valor={mostrarPorcentaje(
                margenPotencialTotal
              )}
              descripcion="Porcentaje estimado de ganancia sobre las ventas."
              icono={Percent}
              variante={
                margenPotencialTotal >= 20
                  ? "positivo"
                  : "advertencia"
              }
            />
          </div>

          {/* RESUMEN OPERATIVO */}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <TarjetaIndicador
              titulo="Almacenes"
              valor={mostrarNumero(
                totalAlmacenes
              )}
              descripcion="Almacenes considerados en el reporte."
              icono={Warehouse}
              variante="normal"
            />

            <TarjetaIndicador
              titulo="Productos registrados"
              valor={mostrarNumero(
                totalProductos
              )}
              descripcion="Cantidad de productos distintos contabilizados."
              icono={Package}
              variante="normal"
            />

            <TarjetaIndicador
              titulo="Unidades disponibles"
              valor={mostrarNumero(
                totalUnidades
              )}
              descripcion="Total de unidades almacenadas."
              icono={Boxes}
              variante="normal"
            />
          </div>

          {/* ALMACÉN DESTACADO */}

          {almacenMayorValor && (
            <article className="overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-sm">
              <div
                className="
                  flex flex-col gap-5 bg-gradient-to-r
                  from-blue-50 to-white p-5
                  md:flex-row md:items-center
                  md:justify-between
                "
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                    <Warehouse size={27} />
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-blue-700">
                      Almacén con mayor valor
                    </p>

                    <h2 className="mt-1 text-xl font-bold text-gray-900">
                      {
                        almacenMayorValor.nombreAlmacen
                      }
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      {almacenMayorValor.tipoAlmacen ||
                        "Sin tipo registrado"}
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl bg-white px-4 py-3 shadow-sm">
                    <p className="text-xs text-gray-500">
                      Valor al costo
                    </p>

                    <p className="mt-1 text-lg font-bold text-gray-900">
                      {mostrarMoneda(
                        almacenMayorValor.valorCosto
                      )}
                    </p>
                  </div>

                  <div className="rounded-xl bg-white px-4 py-3 shadow-sm">
                    <p className="text-xs text-gray-500">
                      Ganancia potencial
                    </p>

                    <p className="mt-1 text-lg font-bold text-emerald-700">
                      {mostrarMoneda(
                        almacenMayorValor.gananciaPotencial
                      )}
                    </p>
                  </div>

                  <div className="rounded-xl bg-white px-4 py-3 shadow-sm">
                    <p className="text-xs text-gray-500">
                      Participación
                    </p>

                    <p className="mt-1 text-lg font-bold text-blue-700">
                      {mostrarPorcentaje(
                        porcentajeAlmacenMayor
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          )}

          {/* GRÁFICAS */}

          <div className="grid gap-5 xl:grid-cols-2">
            <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Valor por almacén
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Comparación entre costo, venta y ganancia potencial.
                </p>
              </div>

              {datosGrafica.length > 0 ? (
                <div className="mt-5 h-[380px] w-full">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <BarChart
                      data={datosGrafica}
                      margin={{
                        top: 10,
                        right: 10,
                        left: 0,
                        bottom: 30,
                      }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                      />

                      <XAxis
                        dataKey="nombreCorto"
                        tickLine={false}
                        axisLine={false}
                        interval={0}
                        angle={-15}
                        textAnchor="end"
                        height={60}
                        tick={{
                          fontSize: 11,
                        }}
                      />

                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        width={85}
                        tickFormatter={(valor) =>
                          `Bs ${formatoNumero.format(
                            convertirNumero(valor)
                          )}`
                        }
                      />

                      <Tooltip
                        content={
                          <TooltipAlmacen />
                        }
                      />

                      <Legend />

                      <Bar
                        dataKey="valorCosto"
                        name="Valor costo"
                        fill="#2563eb"
                        radius={[6, 6, 0, 0]}
                        maxBarSize={45}
                      />

                      <Bar
                        dataKey="valorVenta"
                        name="Valor venta"
                        fill="#111827"
                        radius={[6, 6, 0, 0]}
                        maxBarSize={45}
                      />

                      <Bar
                        dataKey="gananciaPotencial"
                        name="Ganancia potencial"
                        fill="#10b981"
                        radius={[6, 6, 0, 0]}
                        maxBarSize={45}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="mt-5 flex h-[350px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-300">
                  <Layers3
                    size={40}
                    className="text-gray-300"
                  />

                  <p className="mt-3 font-semibold text-gray-600">
                    Sin valores para graficar
                  </p>
                </div>
              )}
            </article>

            <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Distribución del valor al costo
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Participación de cada almacén en el valor total.
                </p>
              </div>

              {valorCostoTotal > 0 ? (
                <div className="relative mt-4 h-[360px] w-full">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <PieChart>
                      <Pie
                        data={datosGrafica}
                        dataKey="valorCosto"
                        nameKey="nombreAlmacen"
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={104}
                        paddingAngle={3}
                      >
                        {datosGrafica.map(
                          (item) => (
                            <Cell
                              key={item.idAlmacen}
                              fill={item.color}
                            />
                          )
                        )}
                      </Pie>

                      <Tooltip
                        content={
                          <TooltipParticipacion />
                        }
                      />

                      <Legend
                        formatter={(valor) =>
                          recortarTexto(
                            String(valor),
                            24
                          )
                        }
                      />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-xl font-bold text-gray-900">
                        {mostrarMoneda(
                          valorCostoTotal
                        )}
                      </p>

                      <p className="text-xs text-gray-500">
                        Valor total
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-5 flex h-[350px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-300">
                  <CircleDollarSign
                    size={40}
                    className="text-gray-300"
                  />

                  <p className="mt-3 font-semibold text-gray-600">
                    Sin valoración disponible
                  </p>
                </div>
              )}
            </article>
          </div>

          {/* TABLA */}

          <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                  <FileBarChart size={20} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Valoración detallada por almacén
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Inventario, valor al costo, valor de venta y rentabilidad estimada.
                  </p>
                </div>
              </div>
            </div>

            {datosGrafica.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-[1100px] w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                        Almacén
                      </th>

                      <th className="px-5 py-4 text-center text-xs font-bold uppercase tracking-wide text-gray-500">
                        Productos
                      </th>

                      <th className="px-5 py-4 text-center text-xs font-bold uppercase tracking-wide text-gray-500">
                        Unidades
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-gray-500">
                        Valor costo
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-gray-500">
                        Valor venta
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-gray-500">
                        Ganancia potencial
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-gray-500">
                        Margen
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-gray-500">
                        Participación
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {datosGrafica.map(
                      (item, index) => (
                        <tr
                          key={
                            item.idAlmacen ||
                            index
                          }
                          className="transition hover:bg-gray-50"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white"
                                style={{
                                  backgroundColor:
                                    item.color,
                                }}
                              >
                                <Warehouse size={19} />
                              </div>

                              <div>
                                <p className="font-semibold text-gray-900">
                                  {item.nombreAlmacen ||
                                    "Sin nombre"}
                                </p>

                                <p className="mt-1 text-sm text-gray-500">
                                  {item.tipoAlmacen ||
                                    "Sin tipo"}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-4 text-center font-bold text-gray-900">
                            {mostrarNumero(
                              item.cantidadProductos
                            )}
                          </td>

                          <td className="px-5 py-4 text-center font-bold text-gray-900">
                            {mostrarNumero(
                              item.unidadesDisponibles
                            )}
                          </td>

                          <td className="px-5 py-4 text-right font-semibold text-blue-700">
                            {mostrarMoneda(
                              item.valorCosto
                            )}
                          </td>

                          <td className="px-5 py-4 text-right font-semibold text-gray-900">
                            {mostrarMoneda(
                              item.valorVenta
                            )}
                          </td>

                          <td className="px-5 py-4 text-right font-bold text-emerald-700">
                            {mostrarMoneda(
                              item.gananciaPotencial
                            )}
                          </td>

                          <td className="px-5 py-4 text-right">
                            <span
                              className={`
                                inline-flex rounded-full
                                px-3 py-1 text-xs font-semibold
                                ${
                                  item.margenPotencial >= 30
                                    ? "bg-emerald-100 text-emerald-700"
                                    : item.margenPotencial >= 15
                                      ? "bg-amber-100 text-amber-700"
                                      : "bg-red-100 text-red-700"
                                }
                              `}
                            >
                              {mostrarPorcentaje(
                                item.margenPotencial
                              )}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-right">
                            <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                              {mostrarPorcentaje(
                                item.porcentajeValor
                              )}
                            </span>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>

                  <tfoot className="bg-gray-900 text-white">
                    <tr>
                      <td className="px-5 py-4 font-bold">
                        Total
                      </td>

                      <td className="px-5 py-4 text-center font-bold">
                        {mostrarNumero(
                          totalProductos
                        )}
                      </td>

                      <td className="px-5 py-4 text-center font-bold">
                        {mostrarNumero(
                          totalUnidades
                        )}
                      </td>

                      <td className="px-5 py-4 text-right font-bold text-blue-300">
                        {mostrarMoneda(
                          valorCostoTotal
                        )}
                      </td>

                      <td className="px-5 py-4 text-right font-bold">
                        {mostrarMoneda(
                          valorVentaTotal
                        )}
                      </td>

                      <td className="px-5 py-4 text-right font-bold text-emerald-400">
                        {mostrarMoneda(
                          gananciaPotencialTotal
                        )}
                      </td>

                      <td className="px-5 py-4 text-right font-bold text-emerald-400">
                        {mostrarPorcentaje(
                          margenPotencialTotal
                        )}
                      </td>

                      <td className="px-5 py-4 text-right font-bold">
                        100%
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ) : (
              <div className="flex min-h-80 flex-col items-center justify-center p-8 text-center">
                <Layers3
                  size={44}
                  className="text-gray-300"
                />

                <p className="mt-4 font-semibold text-gray-600">
                  No se encontraron almacenes
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Modifica los filtros o actualiza el reporte.
                </p>
              </div>
            )}
          </article>

          {isFetching && (
            <div
              className="
                fixed bottom-5 right-5 z-50
                flex items-center gap-3 rounded-xl
                bg-gray-900 px-4 py-3
                text-sm font-semibold text-white shadow-xl
              "
            >
              <LoaderCircle
                size={18}
                className="animate-spin"
              />

              Actualizando valoración...
            </div>
          )}
        </section>
      </main>
    </div>
  );
}