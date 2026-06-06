import {
  type ElementType,
  useMemo,
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import {
  useQuery,
} from "@tanstack/react-query";

import {
  AlertTriangle,
  Banknote,
  CalendarDays,
  CircleDollarSign,
  CreditCard,
  Download,
  FileBarChart,
  Landmark,
  LoaderCircle,
  Printer,
  QrCode,
  ReceiptText,
  RefreshCcw,
  RotateCcw,
  Star,
  TrendingUp,
  WalletCards,
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
  getReporteVentasPorMetodoPago,
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

function formatearFechaDocumento(
  fecha?: string
): string {
  if (!fecha) {
    return "Sin fecha definida";
  }

  const fechaLocal = new Date(
    `${fecha}T00:00:00`
  );

  return fechaLocal.toLocaleDateString("es-BO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
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

function normalizarMetodoPago(
  metodo?: string
): string {
  if (!metodo) {
    return "Sin especificar";
  }

  return metodo
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (letra) =>
      letra.toUpperCase()
    );
}

function obtenerIconoMetodo(
  metodo?: string
): ElementType {
  const valor = metodo?.toLowerCase() ?? "";

  if (valor.includes("efectivo")) {
    return Banknote;
  }

  if (
    valor.includes("qr") ||
    valor.includes("codigo")
  ) {
    return QrCode;
  }

  if (
    valor.includes("tarjeta") ||
    valor.includes("debito") ||
    valor.includes("credito")
  ) {
    return CreditCard;
  }

  if (
    valor.includes("transferencia") ||
    valor.includes("banco")
  ) {
    return Landmark;
  }

  return WalletCards;
}

/* =====================================================
   TIPOS AUXILIARES
===================================================== */

type VarianteTarjeta =
  | "normal"
  | "principal"
  | "positivo"
  | "informativo"
  | "advertencia";

type TarjetaIndicadorProps = {
  titulo: string;
  valor: string;
  descripcion: string;
  icono: ElementType;
  variante?: VarianteTarjeta;
};

type MetodoPagoReporte = {
  metodoPago: string;
  cantidadVentas: number;
  totalVendido: number;
  promedio: number;
};

type MetodoPagoGrafica = MetodoPagoReporte & {
  nombre: string;
  color: string;
  porcentaje: number;
};

type TooltipMetodoPagoProps = {
  active?: boolean;
  payload?: Array<{
    value?: number;
    payload?: MetodoPagoGrafica;
  }>;
  tipo?: "moneda" | "cantidad";
};

/* =====================================================
   TARJETA INDICADOR
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
      icono:
        "bg-emerald-100 text-emerald-700",
      valor: "text-emerald-700",
    },

    informativo: {
      borde: "border-blue-200",
      icono: "bg-blue-100 text-blue-700",
      valor: "text-blue-700",
    },

    advertencia: {
      borde: "border-amber-200",
      icono:
        "bg-amber-100 text-amber-700",
      valor: "text-amber-700",
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
            items-center justify-center
            rounded-xl
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
   TOOLTIP
===================================================== */

function TooltipMetodoPago({
  active,
  payload,
  tipo = "moneda",
}: TooltipMetodoPagoProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const item = payload[0]?.payload;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-lg">
      <p className="text-sm font-semibold text-gray-900">
        {item?.nombre}
      </p>

      <p className="mt-1 text-sm text-gray-600">
        {tipo === "moneda"
          ? mostrarMoneda(payload[0]?.value)
          : `${mostrarNumero(
              payload[0]?.value
            )} ventas`}
      </p>

      <p className="mt-1 text-xs text-gray-500">
        Participación:{" "}
        {mostrarPorcentaje(item?.porcentaje)}
      </p>
    </div>
  );
}

/* =====================================================
   SKELETON
===================================================== */

function ReporteMetodosPagoSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div>
        <div className="h-8 w-80 max-w-full rounded bg-gray-200" />
        <div className="mt-3 h-4 w-96 max-w-full rounded bg-gray-100" />
      </div>

      <div className="h-32 rounded-2xl border bg-white" />

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

      <div className="h-[350px] rounded-2xl border bg-white" />
    </div>
  );
}

/* =====================================================
   VISTA PRINCIPAL
===================================================== */

export default function ReporteMetodosPagoView() {
  const { sucursalId } = useParams<{
    sucursalId: string;
  }>();

  const [fechaDesde, setFechaDesde] =
    useState("");

  const [fechaHasta, setFechaHasta] =
    useState("");

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: [
      "reporte-metodos-pago",
      sucursalId,
      fechaDesde,
      fechaHasta,
    ],

    queryFn: () =>
      getReporteVentasPorMetodoPago({
        idSucursal: sucursalId,
        fechaDesde:
          fechaDesde || undefined,
        fechaHasta:
          fechaHasta || undefined,
      }),

    enabled: Boolean(sucursalId),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });

  const limpiarFiltros = () => {
    setFechaDesde("");
    setFechaHasta("");
  };

  const metodos =
    (data?.data ?? []) as MetodoPagoReporte[];

  const metodosOrdenados = [...metodos].sort(
    (a, b) =>
      convertirNumero(b.totalVendido) -
      convertirNumero(a.totalVendido)
  );

  const totalVendido =
    metodosOrdenados.reduce(
      (acumulado, metodo) =>
        acumulado +
        convertirNumero(
          metodo.totalVendido
        ),
      0
    );

  const totalVentas =
    metodosOrdenados.reduce(
      (acumulado, metodo) =>
        acumulado +
        convertirNumero(
          metodo.cantidadVentas
        ),
      0
    );

  const promedioGeneral =
    totalVentas > 0
      ? totalVendido / totalVentas
      : 0;

  const metodoPrincipal =
    metodosOrdenados[0] ?? null;

  const porcentajePrincipal =
    metodoPrincipal && totalVendido > 0
      ? (convertirNumero(
          metodoPrincipal.totalVendido
        ) /
          totalVendido) *
        100
      : 0;

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

const datosGrafica = useMemo<MetodoPagoGrafica[]>(
  () =>
    metodosOrdenados.map((metodo, index) => ({
      metodoPago: metodo.metodoPago,

      nombre: normalizarMetodoPago(
        metodo.metodoPago
      ),

      cantidadVentas: convertirNumero(
        metodo.cantidadVentas
      ),

      totalVendido: convertirNumero(
        metodo.totalVendido
      ),

      promedio: convertirNumero(
        metodo.promedio
      ),

      porcentaje:
        totalVendido > 0
          ? (
              convertirNumero(
                metodo.totalVendido
              ) / totalVendido
            ) * 100
          : 0,

      color:
        coloresGrafica[
          index % coloresGrafica.length
        ],
    })),
  [metodosOrdenados, totalVendido]
);

  /* =====================================================
     GENERACIÓN PDF
  ===================================================== */

  const generarReportePDF = (
    modo:
      | "descargar"
      | "imprimir" =
      "descargar"
  ) => {
    if (
      !sucursalId ||
      metodosOrdenados.length === 0
    ) {
      return;
    }

    const documento = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const anchoPagina =
      documento.internal.pageSize.getWidth();

    const altoPagina =
      documento.internal.pageSize.getHeight();

    const margenIzquierdo = 15;
    const margenDerecho = 15;

    const nombreSucursal =
      `Sucursal ${sucursalId}`;

    const periodoDesde = fechaDesde
      ? formatearFechaDocumento(
          fechaDesde
        )
      : "Inicio de registros";

    const periodoHasta = fechaHasta
      ? formatearFechaDocumento(
          fechaHasta
        )
      : "Fecha actual";

    /* ENCABEZADO */

    documento.setFillColor(17, 24, 39);

    documento.rect(
      0,
      0,
      anchoPagina,
      40,
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
      "MÉTODOS DE PAGO",
      margenIzquierdo,
      16
    );

    documento.setFont(
      "helvetica",
      "normal"
    );

    documento.setFontSize(10);

    documento.text(
      "Reporte de recaudación por forma de pago",
      margenIzquierdo,
      23
    );

    documento.setFontSize(9);

    documento.text(
      nombreSucursal,
      anchoPagina - margenDerecho,
      14,
      {
        align: "right",
      }
    );

    documento.text(
      `Periodo: ${periodoDesde} al ${periodoHasta}`,
      anchoPagina - margenDerecho,
      21,
      {
        align: "right",
      }
    );

    documento.text(
      `Generado: ${formatearFechaHoraActual()}`,
      anchoPagina - margenDerecho,
      28,
      {
        align: "right",
      }
    );

    /* RESUMEN */

    documento.setTextColor(31, 41, 55);
    documento.setFont(
      "helvetica",
      "bold"
    );
    documento.setFontSize(11);

    documento.text(
      "Resumen ejecutivo",
      margenIzquierdo,
      51
    );

    autoTable(documento, {
      startY: 56,

      margin: {
        left: margenIzquierdo,
        right: margenDerecho,
      },

      head: [
        [
          "Indicador",
          "Resultado",
        ],
      ],

      body: [
        [
          "Métodos utilizados",
          mostrarNumero(
            metodosOrdenados.length
          ),
        ],
        [
          "Cantidad de ventas",
          mostrarNumero(totalVentas),
        ],
        [
          "Total recaudado",
          mostrarMoneda(totalVendido),
        ],
        [
          "Promedio por operación",
          mostrarMoneda(
            promedioGeneral
          ),
        ],
        [
          "Método principal",
          metodoPrincipal
            ? normalizarMetodoPago(
                metodoPrincipal.metodoPago
              )
            : "Sin información",
        ],
        [
          "Participación principal",
          mostrarPorcentaje(
            porcentajePrincipal
          ),
        ],
      ],

      theme: "grid",

      styles: {
        font: "helvetica",
        fontSize: 9,
        cellPadding: 3,
        textColor: [31, 41, 55],
        lineColor: [229, 231, 235],
        lineWidth: 0.2,
      },

      headStyles: {
        fillColor: [55, 65, 81],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },

      columnStyles: {
        0: {
          cellWidth: 100,
          fontStyle: "bold",
        },

        1: {
          halign: "right",
        },
      },
    });

    const posicionResumen =
      (
        documento as jsPDF & {
          lastAutoTable?: {
            finalY: number;
          };
        }
      ).lastAutoTable?.finalY ?? 100;

    /* DETALLE */

    documento.setFont(
      "helvetica",
      "bold"
    );

    documento.setFontSize(11);

    documento.text(
      "Detalle por método de pago",
      margenIzquierdo,
      posicionResumen + 11
    );

    autoTable(documento, {
      startY: posicionResumen + 16,

      margin: {
        left: margenIzquierdo,
        right: margenDerecho,
      },

      head: [
        [
          "Método",
          "Ventas",
          "Total recaudado",
          "Promedio",
          "Participación",
        ],
      ],

      body: datosGrafica.map(
        (metodo) => [
          metodo.nombre,
          mostrarNumero(
            metodo.cantidadVentas
          ),
          mostrarMoneda(
            metodo.totalVendido
          ),
          mostrarMoneda(
            metodo.promedio
          ),
          mostrarPorcentaje(
            metodo.porcentaje
          ),
        ]
      ),

      foot: [
        [
          "TOTAL",
          mostrarNumero(totalVentas),
          mostrarMoneda(totalVendido),
          mostrarMoneda(
            promedioGeneral
          ),
          "100%",
        ],
      ],

      theme: "grid",

      styles: {
        font: "helvetica",
        fontSize: 8.5,
        cellPadding: 3,
        textColor: [31, 41, 55],
        lineColor: [209, 213, 219],
        lineWidth: 0.2,
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
          cellWidth: 47,
          fontStyle: "bold",
        },

        1: {
          cellWidth: 25,
          halign: "center",
        },

        2: {
          cellWidth: 43,
          halign: "right",
        },

        3: {
          cellWidth: 38,
          halign: "right",
        },

        4: {
          cellWidth: 27,
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
          hookData.cell.styles.fillColor =
            [236, 253, 245];

          hookData.cell.styles.fontStyle =
            "bold";
        }

        if (
          hookData.column.index === 2
        ) {
          hookData.cell.styles.textColor =
            [4, 120, 87];

          hookData.cell.styles.fontStyle =
            "bold";
        }
      },
    });

    const posicionTabla =
      (
        documento as jsPDF & {
          lastAutoTable?: {
            finalY: number;
          };
        }
      ).lastAutoTable?.finalY ?? 180;

    /* INTERPRETACIÓN */

    let posicionInterpretacion =
      posicionTabla + 12;

    if (
      posicionInterpretacion >
      altoPagina - 65
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

    const interpretaciones: string[] =
      [];

    interpretaciones.push(
      `Durante el periodo se registraron ${mostrarNumero(
        totalVentas
      )} operaciones por un total de ${mostrarMoneda(
        totalVendido
      )}.`
    );

    if (metodoPrincipal) {
      interpretaciones.push(
        `${normalizarMetodoPago(
          metodoPrincipal.metodoPago
        )} es el método con mayor recaudación, representando el ${mostrarPorcentaje(
          porcentajePrincipal
        )} del total.`
      );
    }

    interpretaciones.push(
      `El promedio general por operación es de ${mostrarMoneda(
        promedioGeneral
      )}.`
    );

    const efectivo = datosGrafica.find(
      (item) =>
        item.metodoPago
          ?.toLowerCase()
          .includes("efectivo")
    );

    if (efectivo) {
      interpretaciones.push(
        `Las ventas en efectivo representan el ${mostrarPorcentaje(
          efectivo.porcentaje
        )} del total recaudado. Este importe debe coincidir con los controles y cierres de caja.`
      );
    }

    if (porcentajePrincipal > 70) {
      interpretaciones.push(
        "Existe una alta concentración en un solo método de pago. Se recomienda mantener disponibles métodos alternativos para reducir dependencia operativa."
      );
    }

    documento.setFont(
      "helvetica",
      "normal"
    );

    documento.setFontSize(9.5);

    let posicionTexto =
      posicionInterpretacion + 8;

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

    /* FIRMAS */

    if (
      posicionTexto >
      altoPagina - 45
    ) {
      documento.addPage();
      posicionTexto = 40;
    } else {
      posicionTexto += 16;
    }

    documento.setDrawColor(
      156,
      163,
      175
    );

    documento.line(
      margenIzquierdo,
      posicionTexto,
      margenIzquierdo + 70,
      posicionTexto
    );

    documento.line(
      anchoPagina -
        margenDerecho -
        70,
      posicionTexto,
      anchoPagina - margenDerecho,
      posicionTexto
    );

    documento.setFontSize(8.5);

    documento.setTextColor(
      75,
      85,
      99
    );

    documento.text(
      "Responsable de caja",
      margenIzquierdo + 35,
      posicionTexto + 5,
      {
        align: "center",
      }
    );

    documento.text(
      "Responsable administrativo",
      anchoPagina -
        margenDerecho -
        35,
      posicionTexto + 5,
      {
        align: "center",
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
        altoPagina - 15,
        anchoPagina - margenDerecho,
        altoPagina - 15
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
        altoPagina - 9
      );

      documento.text(
        `Página ${pagina} de ${totalPaginas}`,
        anchoPagina - margenDerecho,
        altoPagina - 9,
        {
          align: "right",
        }
      );
    }

    const nombreArchivo =
      limpiarNombreArchivo(
        `metodos_pago_${sucursalId}_${fechaDesde || "inicio"}_${fechaHasta || "actual"}`
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
          <ReporteMetodosPagoSkeleton />
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
                  No se pudo cargar el reporte de métodos de pago
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
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gray-900 text-white">
                <WalletCards size={24} />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  Métodos de pago
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Análisis de la recaudación según la forma de pago utilizada en la sucursal.
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
                  metodosOrdenados.length === 0
                }
                className="
                  inline-flex items-center
                  justify-center gap-2 rounded-xl
                  bg-gray-900 px-4 py-2.5
                  text-sm font-semibold text-white
                  shadow-sm transition hover:bg-black
                  disabled:cursor-not-allowed
                  disabled:opacity-50
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
                  metodosOrdenados.length === 0
                }
                className="
                  inline-flex items-center
                  justify-center gap-2 rounded-xl
                  border border-gray-900 bg-white
                  px-4 py-2.5 text-sm font-semibold
                  text-gray-900 shadow-sm transition
                  hover:bg-gray-100
                  disabled:cursor-not-allowed
                  disabled:opacity-50
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
                  inline-flex items-center
                  justify-center gap-2 rounded-xl
                  border border-gray-300 bg-white
                  px-4 py-2.5 text-sm font-semibold
                  text-gray-700 shadow-sm transition
                  hover:bg-gray-50
                  disabled:cursor-not-allowed
                  disabled:opacity-60
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
                <CalendarDays size={20} />
              </div>

              <div>
                <h2 className="font-bold text-gray-900">
                  Periodo del reporte
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Selecciona un rango de fechas para analizar los métodos de pago.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1fr_1fr_auto]">
              <div>
                <label
                  htmlFor="fechaDesde"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Fecha inicial
                </label>

                <input
                  id="fechaDesde"
                  type="date"
                  value={fechaDesde}
                  onChange={(event) =>
                    setFechaDesde(
                      event.target.value
                    )
                  }
                  max={
                    fechaHasta || undefined
                  }
                  className="
                    w-full rounded-xl border
                    border-gray-300 bg-white
                    px-4 py-3 text-sm text-gray-700
                    outline-none transition
                    focus:border-gray-900
                    focus:ring-2 focus:ring-gray-900/10
                  "
                />
              </div>

              <div>
                <label
                  htmlFor="fechaHasta"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Fecha final
                </label>

                <input
                  id="fechaHasta"
                  type="date"
                  value={fechaHasta}
                  onChange={(event) =>
                    setFechaHasta(
                      event.target.value
                    )
                  }
                  min={
                    fechaDesde || undefined
                  }
                  className="
                    w-full rounded-xl border
                    border-gray-300 bg-white
                    px-4 py-3 text-sm text-gray-700
                    outline-none transition
                    focus:border-gray-900
                    focus:ring-2 focus:ring-gray-900/10
                  "
                />
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={limpiarFiltros}
                  disabled={
                    !fechaDesde &&
                    !fechaHasta
                  }
                  className="
                    inline-flex w-full items-center
                    justify-center gap-2 rounded-xl
                    border border-gray-300 bg-white
                    px-4 py-3 text-sm font-semibold
                    text-gray-700 transition
                    hover:bg-gray-50
                    disabled:cursor-not-allowed
                    disabled:opacity-50 xl:w-auto
                  "
                >
                  <RotateCcw size={17} />
                  Limpiar
                </button>
              </div>
            </div>

            {(fechaDesde ||
              fechaHasta) && (
              <div className="mt-4 rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-600">
                Mostrando resultados
                {fechaDesde
                  ? ` desde ${formatearFechaDocumento(
                      fechaDesde
                    )}`
                  : ""}
                {fechaHasta
                  ? ` hasta ${formatearFechaDocumento(
                      fechaHasta
                    )}`
                  : ""}
                .
              </div>
            )}
          </article>

          {/* TARJETAS */}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <TarjetaIndicador
              titulo="Total recaudado"
              valor={mostrarMoneda(
                totalVendido
              )}
              descripcion="Monto total recibido mediante todos los métodos de pago."
              icono={CircleDollarSign}
              variante="principal"
            />

            <TarjetaIndicador
              titulo="Ventas realizadas"
              valor={mostrarNumero(
                totalVentas
              )}
              descripcion="Cantidad total de operaciones procesadas."
              icono={ReceiptText}
              variante="informativo"
            />

            <TarjetaIndicador
              titulo="Promedio por operación"
              valor={mostrarMoneda(
                promedioGeneral
              )}
              descripcion="Importe promedio recibido por cada venta."
              icono={TrendingUp}
              variante="positivo"
            />

            <TarjetaIndicador
              titulo="Método principal"
              valor={
                metodoPrincipal
                  ? normalizarMetodoPago(
                      metodoPrincipal.metodoPago
                    )
                  : "Sin datos"
              }
              descripcion={
                metodoPrincipal
                  ? `${mostrarPorcentaje(
                      porcentajePrincipal
                    )} de la recaudación total.`
                  : "No existen operaciones registradas."
              }
              icono={
                obtenerIconoMetodo(
                  metodoPrincipal?.metodoPago
                )
              }
              variante="advertencia"
            />
          </div>

          {/* MÉTODO DESTACADO */}

          {metodoPrincipal && (
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
                    {(() => {
                      const Icono =
                        obtenerIconoMetodo(
                          metodoPrincipal.metodoPago
                        );

                      return <Icono size={27} />;
                    })()}
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-blue-700">
                      Método con mayor recaudación
                    </p>

                    <h2 className="mt-1 text-xl font-bold text-gray-900">
                      {normalizarMetodoPago(
                        metodoPrincipal.metodoPago
                      )}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Método principal utilizado durante el periodo analizado.
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl bg-white px-4 py-3 shadow-sm">
                    <p className="text-xs text-gray-500">
                      Ventas
                    </p>

                    <p className="mt-1 text-lg font-bold text-gray-900">
                      {mostrarNumero(
                        metodoPrincipal.cantidadVentas
                      )}
                    </p>
                  </div>

                  <div className="rounded-xl bg-white px-4 py-3 shadow-sm">
                    <p className="text-xs text-gray-500">
                      Recaudación
                    </p>

                    <p className="mt-1 text-lg font-bold text-gray-900">
                      {mostrarMoneda(
                        metodoPrincipal.totalVendido
                      )}
                    </p>
                  </div>

                  <div className="rounded-xl bg-white px-4 py-3 shadow-sm">
                    <p className="text-xs text-gray-500">
                      Participación
                    </p>

                    <p className="mt-1 text-lg font-bold text-blue-700">
                      {mostrarPorcentaje(
                        porcentajePrincipal
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
                  Recaudación por método
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Comparación del monto recibido mediante cada forma de pago.
                </p>
              </div>

              <div className="mt-5 h-[350px] w-full">
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
                      bottom: 15,
                    }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                    />

                    <XAxis
                      dataKey="nombre"
                      tickLine={false}
                      axisLine={false}
                      interval={0}
                      angle={-15}
                      textAnchor="end"
                      height={55}
                      tick={{
                        fontSize: 11,
                      }}
                    />

                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      width={80}
                      tickFormatter={(valor) =>
                        `Bs ${formatoNumero.format(
                          convertirNumero(valor)
                        )}`
                      }
                    />

                    <Tooltip
                      content={
                        <TooltipMetodoPago tipo="moneda" />
                      }
                    />

                    <Bar
                      dataKey="totalVendido"
                      radius={[8, 8, 0, 0]}
                      maxBarSize={70}
                    >
                      {datosGrafica.map(
                        (metodo, index) => (
                          <Cell
                            key={`${metodo.metodoPago}-${index}`}
                            fill={metodo.color}
                          />
                        )
                      )}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </article>

            <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Distribución de ventas
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Participación de cada método según la cantidad de operaciones.
                </p>
              </div>

              {totalVentas > 0 ? (
                <div className="relative mt-4 h-[330px] w-full">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <PieChart>
                      <Pie
                        data={datosGrafica}
                        dataKey="cantidadVentas"
                        nameKey="nombre"
                        cx="50%"
                        cy="50%"
                        innerRadius={62}
                        outerRadius={98}
                        paddingAngle={3}
                      >
                        {datosGrafica.map(
                          (metodo, index) => (
                            <Cell
                              key={`${metodo.metodoPago}-${index}`}
                              fill={metodo.color}
                            />
                          )
                        )}
                      </Pie>

                      <Tooltip
                        content={
                          <TooltipMetodoPago tipo="cantidad" />
                        }
                      />

                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">
                        {mostrarNumero(
                          totalVentas
                        )}
                      </p>

                      <p className="text-xs text-gray-500">
                        Operaciones
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-5 flex h-[330px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-300">
                  <WalletCards
                    size={38}
                    className="text-gray-300"
                  />

                  <p className="mt-3 font-semibold text-gray-600">
                    Sin métodos de pago
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    No existen datos para representar.
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
                    Detalle por método de pago
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Cantidad, recaudación, promedio y participación por forma de pago.
                  </p>
                </div>
              </div>
            </div>

            {datosGrafica.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-[850px] w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                        Método
                      </th>

                      <th className="px-5 py-4 text-center text-xs font-bold uppercase tracking-wide text-gray-500">
                        Ventas
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-gray-500">
                        Total recaudado
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-gray-500">
                        Promedio
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-gray-500">
                        Participación
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {datosGrafica.map(
                      (metodo, index) => {
                        const Icono =
                          obtenerIconoMetodo(
                            metodo.metodoPago
                          );

                        return (
                          <tr
                            key={`${metodo.metodoPago}-${index}`}
                            className="transition hover:bg-gray-50"
                          >
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <div
                                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white"
                                  style={{
                                    backgroundColor:
                                      metodo.color,
                                  }}
                                >
                                  <Icono size={19} />
                                </div>

                                <span className="font-semibold text-gray-900">
                                  {metodo.nombre}
                                </span>
                              </div>
                            </td>

                            <td className="px-5 py-4 text-center font-bold text-gray-900">
                              {mostrarNumero(
                                metodo.cantidadVentas
                              )}
                            </td>

                            <td className="px-5 py-4 text-right font-bold text-emerald-700">
                              {mostrarMoneda(
                                metodo.totalVendido
                              )}
                            </td>

                            <td className="px-5 py-4 text-right text-gray-700">
                              {mostrarMoneda(
                                metodo.promedio
                              )}
                            </td>

                            <td className="px-5 py-4 text-right">
                              <span
                                className={`
                                  inline-flex rounded-full
                                  px-3 py-1 text-xs font-semibold
                                  ${
                                    metodo.porcentaje >= 40
                                      ? "bg-emerald-100 text-emerald-700"
                                      : metodo.porcentaje >= 20
                                        ? "bg-blue-100 text-blue-700"
                                        : "bg-gray-100 text-gray-700"
                                  }
                                `}
                              >
                                {mostrarPorcentaje(
                                  metodo.porcentaje
                                )}
                              </span>
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>

                  <tfoot className="bg-gray-900 text-white">
                    <tr>
                      <td className="px-5 py-4 font-bold">
                        Total
                      </td>

                      <td className="px-5 py-4 text-center font-bold">
                        {mostrarNumero(
                          totalVentas
                        )}
                      </td>

                      <td className="px-5 py-4 text-right font-bold text-emerald-400">
                        {mostrarMoneda(
                          totalVendido
                        )}
                      </td>

                      <td className="px-5 py-4 text-right font-bold">
                        {mostrarMoneda(
                          promedioGeneral
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
                <Star
                  size={42}
                  className="text-gray-300"
                />

                <p className="mt-4 font-semibold text-gray-600">
                  No existen métodos de pago registrados
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Cambia el rango de fechas o registra nuevas ventas.
                </p>
              </div>
            )}
          </article>

          {isFetching && (
            <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white shadow-xl">
              <LoaderCircle
                size={18}
                className="animate-spin"
              />

              Actualizando métodos de pago...
            </div>
          )}
        </section>
      </main>
    </div>
  );
}