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
  Download,
  FileText,
  HandCoins,
  LoaderCircle,
  Percent,
  Printer,
  ReceiptText,
  RefreshCcw,
  RotateCcw,
  ShoppingCart,
  TicketCheck,
  TrendingUp,
  XCircle,
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
  getReporteVentasResumen,
} from "@/api/ReporteApi";

/* =====================================================
   FORMATEADORES
===================================================== */

const formatoMoneda = new Intl.NumberFormat(
  "es-BO",
  {
    style: "currency",
    currency: "BOB",
    minimumFractionDigits: 2,
  }
);

const formatoNumero = new Intl.NumberFormat(
  "es-BO"
);

function convertirNumero(
  valor:
    | number
    | string
    | null
    | undefined
): number {
  const numero = Number(valor);

  return Number.isFinite(numero)
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
    convertirNumero(valor)
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
    convertirNumero(valor)
  );
}

function mostrarPorcentaje(
  valor:
    | number
    | string
    | null
    | undefined
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

  return fechaLocal.toLocaleDateString(
    "es-BO",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }
  );
}

function formatearFechaHoraActual(): string {
  return new Date().toLocaleString(
    "es-BO",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}

function limpiarNombreArchivo(
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
   TIPOS AUXILIARES
===================================================== */

type VarianteTarjeta =
  | "normal"
  | "principal"
  | "positivo"
  | "advertencia"
  | "negativo"
  | "informativo";

type TarjetaResumenProps = {
  titulo: string;
  valor: string;
  descripcion: string;
  icono: ElementType;
  variante?: VarianteTarjeta;
};

type TooltipMonedaProps = {
  active?: boolean;
  payload?: Array<{
    value?: number;
    payload?: {
      nombre?: string;
      valor?: number;
      cantidad?: number;
      total?: number;
    };
  }>;
};

type TooltipCantidadProps = {
  active?: boolean;
  payload?: Array<{
    value?: number;
    payload?: {
      nombre?: string;
      cantidad?: number;
    };
  }>;
};

/* =====================================================
   TARJETA
===================================================== */

function TarjetaResumen({
  titulo,
  valor,
  descripcion,
  icono: Icono,
  variante = "normal",
}: TarjetaResumenProps) {
  const estilos = {
    normal: {
      borde: "border-gray-200",
      icono:
        "bg-gray-100 text-gray-700",
      valor: "text-gray-900",
    },

    principal: {
      borde: "border-gray-900",
      icono:
        "bg-gray-900 text-white",
      valor: "text-gray-900",
    },

    positivo: {
      borde:
        "border-emerald-200",
      icono:
        "bg-emerald-100 text-emerald-700",
      valor:
        "text-emerald-700",
    },

    advertencia: {
      borde:
        "border-amber-200",
      icono:
        "bg-amber-100 text-amber-700",
      valor:
        "text-amber-700",
    },

    negativo: {
      borde:
        "border-red-200",
      icono:
        "bg-red-100 text-red-700",
      valor:
        "text-red-700",
    },

    informativo: {
      borde:
        "border-blue-200",
      icono:
        "bg-blue-100 text-blue-700",
      valor:
        "text-blue-700",
    },
  };

  const estilo =
    estilos[variante];

  return (
    <article
      className={`
        rounded-2xl border bg-white p-5
        shadow-sm transition duration-200
        hover:-translate-y-0.5
        hover:shadow-md
        ${estilo.borde}
      `}
    >
      <div
        className="
          flex items-start
          justify-between gap-4
        "
      >
        <div className="min-w-0">
          <p
            className="
              text-sm font-medium
              text-gray-500
            "
          >
            {titulo}
          </p>

          <p
            className={`
              mt-3 break-words
              text-2xl font-bold
              sm:text-3xl
              ${estilo.valor}
            `}
          >
            {valor}
          </p>

          <p
            className="
              mt-2 text-xs
              leading-5 text-gray-500
            "
          >
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
   TOOLTIP DE MONEDA
===================================================== */

function TooltipMoneda({
  active,
  payload,
}: TooltipMonedaProps) {
  if (
    !active ||
    !payload?.length
  ) {
    return null;
  }

  const item =
    payload[0]?.payload;

  return (
    <div
      className="
        rounded-xl border
        border-gray-200
        bg-white p-3
        shadow-lg
      "
    >
      <p
        className="
          text-sm font-semibold
          text-gray-900
        "
      >
        {item?.nombre}
      </p>

      <p
        className="
          mt-1 text-sm
          text-gray-600
        "
      >
        Total:{" "}
        {mostrarMoneda(
          item?.valor ??
            item?.total
        )}
      </p>

      {item?.cantidad !==
        undefined && (
        <p
          className="
            mt-1 text-xs
            text-gray-500
          "
        >
          Cantidad:{" "}
          {mostrarNumero(
            item.cantidad
          )}
        </p>
      )}
    </div>
  );
}

/* =====================================================
   TOOLTIP DE CANTIDAD
===================================================== */

function TooltipCantidad({
  active,
  payload,
}: TooltipCantidadProps) {
  if (
    !active ||
    !payload?.length
  ) {
    return null;
  }

  const item =
    payload[0]?.payload;

  return (
    <div
      className="
        rounded-xl border
        border-gray-200
        bg-white p-3
        shadow-lg
      "
    >
      <p
        className="
          text-sm font-semibold
          text-gray-900
        "
      >
        {item?.nombre}
      </p>

      <p
        className="
          mt-1 text-sm
          text-gray-600
        "
      >
        Ventas:{" "}
        {mostrarNumero(
          item?.cantidad
        )}
      </p>
    </div>
  );
}

/* =====================================================
   SKELETON
===================================================== */

function ReporteVentasSkeleton() {
  return (
    <div
      className="
        animate-pulse
        space-y-6
      "
    >
      <div>
        <div
          className="
            h-8 w-72
            max-w-full rounded
            bg-gray-200
          "
        />

        <div
          className="
            mt-3 h-4 w-96
            max-w-full rounded
            bg-gray-100
          "
        />
      </div>

      <div
        className="
          h-32 rounded-2xl
          border bg-white
        "
      />

      <div
        className="
          grid gap-4
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >
        {Array.from({
          length: 8,
        }).map((_, index) => (
          <div
            key={index}
            className="
              h-40 rounded-2xl
              border bg-white
            "
          />
        ))}
      </div>

      <div
        className="
          grid gap-5
          xl:grid-cols-2
        "
      >
        <div
          className="
            h-[420px] rounded-2xl
            border bg-white
          "
        />

        <div
          className="
            h-[420px] rounded-2xl
            border bg-white
          "
        />
      </div>
    </div>
  );
}

/* =====================================================
   VISTA PRINCIPAL
===================================================== */

export default function ReporteVentasView() {
  const {
    sucursalId,
  } = useParams<{
    sucursalId: string;
  }>();

  const [
    fechaDesde,
    setFechaDesde,
  ] = useState("");

  const [
    fechaHasta,
    setFechaHasta,
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
      "reporte-ventas-resumen",
      sucursalId,
      fechaDesde,
      fechaHasta,
    ],

    queryFn: () =>
      getReporteVentasResumen({
        idSucursal:
          sucursalId,

        fechaDesde:
          fechaDesde ||
          undefined,

        fechaHasta:
          fechaHasta ||
          undefined,
      }),

    enabled:
      Boolean(sucursalId),

    staleTime:
      1000 * 60 * 2,

    refetchOnWindowFocus:
      false,
  });

  const limpiarFiltros =
    () => {
      setFechaDesde("");
      setFechaHasta("");
    };

  /* =====================================================
     DATOS DEL BACKEND
  ===================================================== */

  const resumen =
    data?.resumen;

  const pagadas =
    resumen?.pagado;

  const anuladas =
    resumen?.anulado;

  const cortesias =
    resumen?.cortesia;

  const cantidadPagadas =
    convertirNumero(
      pagadas?.cantidad
    );

  const subtotalPagadas =
    convertirNumero(
      pagadas?.subtotal
    );

  const descuentosPagadas =
    convertirNumero(
      pagadas?.descuento
    );

  const totalPagadas =
    convertirNumero(
      pagadas?.total
    );

  const promedioPagadas =
    convertirNumero(
      pagadas?.promedio
    );

  const cantidadAnuladas =
    convertirNumero(
      anuladas?.cantidad
    );

  const subtotalAnuladas =
    convertirNumero(
      anuladas?.subtotal
    );

  const descuentosAnuladas =
    convertirNumero(
      anuladas?.descuento
    );

  const totalAnuladas =
    convertirNumero(
      anuladas?.total
    );

  const promedioAnuladas =
    convertirNumero(
      anuladas?.promedio
    );

  const cantidadCortesias =
    convertirNumero(
      cortesias?.cantidad
    );

  const subtotalCortesias =
    convertirNumero(
      cortesias?.subtotal
    );

  const descuentosCortesias =
    convertirNumero(
      cortesias?.descuento
    );

  const totalCortesias =
    convertirNumero(
      cortesias?.total
    );

  const promedioCortesias =
    convertirNumero(
      cortesias?.promedio
    );

  const ingresosReales =
    convertirNumero(
      data?.ingresosReales
    );

  const cantidadTotalVentas =
    cantidadPagadas +
    cantidadAnuladas +
    cantidadCortesias;

  const subtotalGeneral =
    subtotalPagadas +
    subtotalAnuladas +
    subtotalCortesias;

  const descuentosGenerales =
    descuentosPagadas +
    descuentosAnuladas +
    descuentosCortesias;

  const porcentajePagadas =
    cantidadTotalVentas > 0
      ? (cantidadPagadas /
          cantidadTotalVentas) *
        100
      : 0;

  const porcentajeAnuladas =
    cantidadTotalVentas > 0
      ? (cantidadAnuladas /
          cantidadTotalVentas) *
        100
      : 0;

  const porcentajeCortesias =
    cantidadTotalVentas > 0
      ? (cantidadCortesias /
          cantidadTotalVentas) *
        100
      : 0;

  /* =====================================================
     DATOS PARA GRÁFICAS
  ===================================================== */

  const datosMontos =
    useMemo(
      () => [
        {
          nombre:
            "Pagadas",
          valor:
            totalPagadas,
          cantidad:
            cantidadPagadas,
          color:
            "#10b981",
        },

        {
          nombre:
            "Anuladas",
          valor:
            totalAnuladas,
          cantidad:
            cantidadAnuladas,
          color:
            "#ef4444",
        },

        {
          nombre:
            "Cortesías",
          valor:
            totalCortesias,
          cantidad:
            cantidadCortesias,
          color:
            "#f59e0b",
        },
      ],
      [
        totalPagadas,
        totalAnuladas,
        totalCortesias,
        cantidadPagadas,
        cantidadAnuladas,
        cantidadCortesias,
      ]
    );

  const datosCantidades =
    useMemo(
      () => [
        {
          nombre:
            "Pagadas",
          cantidad:
            cantidadPagadas,
          color:
            "#10b981",
        },

        {
          nombre:
            "Anuladas",
          cantidad:
            cantidadAnuladas,
          color:
            "#ef4444",
        },

        {
          nombre:
            "Cortesías",
          cantidad:
            cantidadCortesias,
          color:
            "#f59e0b",
        },
      ],
      [
        cantidadPagadas,
        cantidadAnuladas,
        cantidadCortesias,
      ]
    );

  /* =====================================================
     GENERACIÓN DEL PDF
  ===================================================== */

  const generarReportePDF = (
    modo:
      | "descargar"
      | "imprimir" =
      "descargar"
  ) => {
    if (
      !data ||
      !sucursalId
    ) {
      return;
    }

    const documento =
      new jsPDF({
        orientation:
          "portrait",
        unit: "mm",
        format: "a4",
      });

    const anchoPagina =
      documento.internal.pageSize.getWidth();

    const altoPagina =
      documento.internal.pageSize.getHeight();

    const margenIzquierdo =
      15;

    const margenDerecho =
      15;

    const nombreSucursal =
      `Sucursal ${sucursalId}`;

    const periodoDesde =
      fechaDesde
        ? formatearFechaDocumento(
            fechaDesde
          )
        : "Inicio de registros";

    const periodoHasta =
      fechaHasta
        ? formatearFechaDocumento(
            fechaHasta
          )
        : "Fecha actual";

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

    documento.setFontSize(
      18
    );

    documento.text(
      "RESUMEN DE VENTAS",
      margenIzquierdo,
      16
    );

    documento.setFont(
      "helvetica",
      "normal"
    );

    documento.setFontSize(
      10
    );

    documento.text(
      "Reporte comercial y operativo",
      margenIzquierdo,
      23
    );

    documento.setFontSize(
      9
    );

    documento.text(
      nombreSucursal,
      anchoPagina -
        margenDerecho,
      14,
      {
        align: "right",
      }
    );

    documento.text(
      `Periodo: ${periodoDesde} al ${periodoHasta}`,
      anchoPagina -
        margenDerecho,
      21,
      {
        align: "right",
      }
    );

    documento.text(
      `Generado: ${formatearFechaHoraActual()}`,
      anchoPagina -
        margenDerecho,
      28,
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

    documento.setFontSize(
      11
    );

    documento.text(
      "Resumen ejecutivo",
      margenIzquierdo,
      51
    );

    autoTable(documento, {
      startY: 56,

      margin: {
        left:
          margenIzquierdo,
        right:
          margenDerecho,
      },

      head: [
        [
          "Indicador",
          "Resultado",
        ],
      ],

      body: [
        [
          "Cantidad total de ventas",
          mostrarNumero(
            cantidadTotalVentas
          ),
        ],

        [
          "Ventas pagadas",
          mostrarNumero(
            cantidadPagadas
          ),
        ],

        [
          "Ingresos reales",
          mostrarMoneda(
            ingresosReales
          ),
        ],

        [
          "Subtotal general",
          mostrarMoneda(
            subtotalGeneral
          ),
        ],

        [
          "Descuentos aplicados",
          mostrarMoneda(
            descuentosGenerales
          ),
        ],

        [
          "Ticket promedio pagado",
          mostrarMoneda(
            promedioPagadas
          ),
        ],
      ],

      theme: "grid",

      styles: {
        font: "helvetica",
        fontSize: 9,
        cellPadding: 3,
        textColor: [
          31,
          41,
          55,
        ],
        lineColor: [
          229,
          231,
          235,
        ],
        lineWidth: 0.2,
      },

      headStyles: {
        fillColor: [
          55,
          65,
          81,
        ],
        textColor: [
          255,
          255,
          255,
        ],
        fontStyle: "bold",
      },

      columnStyles: {
        0: {
          cellWidth: 105,
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
      ).lastAutoTable
        ?.finalY ?? 100;

    /* DETALLE POR ESTADO */

    documento.setFont(
      "helvetica",
      "bold"
    );

    documento.setFontSize(
      11
    );

    documento.text(
      "Detalle de ventas por estado",
      margenIzquierdo,
      posicionResumen + 11
    );

    autoTable(documento, {
      startY:
        posicionResumen + 16,

      margin: {
        left:
          margenIzquierdo,
        right:
          margenDerecho,
      },

      head: [
        [
          "Estado",
          "Cantidad",
          "Subtotal",
          "Descuento",
          "Total",
          "Promedio",
        ],
      ],

      body: [
        [
          "Pagadas",
          mostrarNumero(
            cantidadPagadas
          ),
          mostrarMoneda(
            subtotalPagadas
          ),
          mostrarMoneda(
            descuentosPagadas
          ),
          mostrarMoneda(
            totalPagadas
          ),
          mostrarMoneda(
            promedioPagadas
          ),
        ],

        [
          "Anuladas",
          mostrarNumero(
            cantidadAnuladas
          ),
          mostrarMoneda(
            subtotalAnuladas
          ),
          mostrarMoneda(
            descuentosAnuladas
          ),
          mostrarMoneda(
            totalAnuladas
          ),
          mostrarMoneda(
            promedioAnuladas
          ),
        ],

        [
          "Cortesías",
          mostrarNumero(
            cantidadCortesias
          ),
          mostrarMoneda(
            subtotalCortesias
          ),
          mostrarMoneda(
            descuentosCortesias
          ),
          mostrarMoneda(
            totalCortesias
          ),
          mostrarMoneda(
            promedioCortesias
          ),
        ],

        [
          "TOTAL",
          mostrarNumero(
            cantidadTotalVentas
          ),
          mostrarMoneda(
            subtotalGeneral
          ),
          mostrarMoneda(
            descuentosGenerales
          ),
          mostrarMoneda(
            ingresosReales
          ),
          "-",
        ],
      ],

      theme: "grid",

      styles: {
        font: "helvetica",
        fontSize: 7.5,
        cellPadding: 2.5,
        textColor: [
          31,
          41,
          55,
        ],
        lineColor: [
          209,
          213,
          219,
        ],
        lineWidth: 0.2,
        overflow:
          "linebreak",
      },

      headStyles: {
        fillColor: [
          17,
          24,
          39,
        ],
        textColor: [
          255,
          255,
          255,
        ],
        fontStyle: "bold",
        halign: "center",
      },

      columnStyles: {
        0: {
          cellWidth: 27,
          fontStyle: "bold",
        },

        1: {
          cellWidth: 22,
          halign: "center",
        },

        2: {
          cellWidth: 34,
          halign: "right",
        },

        3: {
          cellWidth: 34,
          halign: "right",
        },

        4: {
          cellWidth: 34,
          halign: "right",
        },

        5: {
          cellWidth: 29,
          halign: "right",
        },
      },

      didParseCell: (
        hookData
      ) => {
        if (
          hookData.section !==
          "body"
        ) {
          return;
        }

        if (
          hookData.row.index ===
          0
        ) {
          hookData.cell.styles.fillColor =
            [
              236,
              253,
              245,
            ];

          hookData.cell.styles.textColor =
            [
              4,
              120,
              87,
            ];
        }

        if (
          hookData.row.index ===
          1
        ) {
          hookData.cell.styles.fillColor =
            [
              254,
              242,
              242,
            ];

          hookData.cell.styles.textColor =
            [
              185,
              28,
              28,
            ];
        }

        if (
          hookData.row.index ===
          2
        ) {
          hookData.cell.styles.fillColor =
            [
              255,
              251,
              235,
            ];

          hookData.cell.styles.textColor =
            [
              180,
              83,
              9,
            ];
        }

        if (
          hookData.row.index ===
          3
        ) {
          hookData.cell.styles.fillColor =
            [
              243,
              244,
              246,
            ];

          hookData.cell.styles.fontStyle =
            "bold";
        }
      },
    });

    const posicionDetalle =
      (
        documento as jsPDF & {
          lastAutoTable?: {
            finalY: number;
          };
        }
      ).lastAutoTable
        ?.finalY ?? 180;

    /* INTERPRETACIÓN */

    let posicionInterpretacion =
      posicionDetalle + 12;

    if (
      posicionInterpretacion >
      altoPagina - 70
    ) {
      documento.addPage();

      posicionInterpretacion =
        22;
    }

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
      "Interpretación comercial",
      margenIzquierdo,
      posicionInterpretacion
    );

    const interpretaciones: string[] =
      [];

    if (
      cantidadTotalVentas ===
      0
    ) {
      interpretaciones.push(
        "No existen ventas registradas durante el periodo seleccionado."
      );
    } else {
      interpretaciones.push(
        `Se registraron ${mostrarNumero(
          cantidadTotalVentas
        )} ventas durante el periodo analizado.`
      );
    }

    if (
      cantidadPagadas > 0
    ) {
      interpretaciones.push(
        `Las ventas pagadas representan el ${mostrarPorcentaje(
          porcentajePagadas
        )} del total de operaciones, generando ingresos reales por ${mostrarMoneda(
          ingresosReales
        )}.`
      );
    }

    if (
      porcentajeAnuladas >
      10
    ) {
      interpretaciones.push(
        `Las ventas anuladas representan el ${mostrarPorcentaje(
          porcentajeAnuladas
        )} del total. Se recomienda revisar las causas de anulación y los procedimientos de venta.`
      );
    } else if (
      cantidadAnuladas > 0
    ) {
      interpretaciones.push(
        `Las ventas anuladas representan el ${mostrarPorcentaje(
          porcentajeAnuladas
        )} del total de operaciones.`
      );
    }

    if (
      cantidadCortesias > 0
    ) {
      interpretaciones.push(
        `Las cortesías representan el ${mostrarPorcentaje(
          porcentajeCortesias
        )} del total. Conviene verificar que cuenten con autorización correspondiente.`
      );
    }

    if (
      descuentosGenerales >
        subtotalGeneral *
          0.1 &&
      subtotalGeneral > 0
    ) {
      interpretaciones.push(
        "Los descuentos superan el 10% del subtotal general. Se recomienda revisar la política de descuentos aplicada."
      );
    }

    documento.setFont(
      "helvetica",
      "normal"
    );

    documento.setFontSize(
      9.5
    );

    let posicionTexto =
      posicionInterpretacion +
      8;

    interpretaciones.forEach(
      (
        interpretacion,
        index
      ) => {
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
          margenIzquierdo +
            2,
          posicionTexto
        );

        posicionTexto +=
          lineas.length * 5 +
          2;
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
      anchoPagina -
        margenDerecho,
      posicionTexto
    );

    documento.setFontSize(
      8.5
    );

    documento.setTextColor(
      75,
      85,
      99
    );

    documento.text(
      "Responsable de la sucursal",
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
      documento.setPage(
        pagina
      );

      documento.setDrawColor(
        229,
        231,
        235
      );

      documento.line(
        margenIzquierdo,
        altoPagina - 15,
        anchoPagina -
          margenDerecho,
        altoPagina - 15
      );

      documento.setFont(
        "helvetica",
        "normal"
      );

      documento.setFontSize(
        8
      );

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
        anchoPagina -
          margenDerecho,
        altoPagina - 9,
        {
          align: "right",
        }
      );
    }

    const nombreArchivo =
      limpiarNombreArchivo(
        `resumen_ventas_${sucursalId}_${fechaDesde || "inicio"}_${fechaHasta || "actual"}`
      );

    if (
      modo === "imprimir"
    ) {
      const urlPDF =
        documento.output(
          "bloburl"
        );

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
     ESTADOS DE LA VISTA
  ===================================================== */

  if (!sucursalId) {
    return (
      <div
        className="
          flex min-h-screen
          bg-gray-50
        "
      >
        <MenuList />

        <main
          className="
            min-w-0 flex-1
            p-4 pt-20
            sm:p-6 sm:pt-20
            md:pt-6
          "
        >
          <div
            className="
              rounded-2xl border
              border-red-200
              bg-red-50 p-6
            "
          >
            <div
              className="
                flex items-start
                gap-3
              "
            >
              <AlertTriangle
                size={22}
                className="
                  mt-0.5
                  text-red-600
                "
              />

              <div>
                <h1
                  className="
                    font-bold
                    text-red-800
                  "
                >
                  Sucursal no encontrada
                </h1>

                <p
                  className="
                    mt-1 text-sm
                    text-red-700
                  "
                >
                  No se encontró el
                  identificador de la
                  sucursal en la ruta.
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
      <div
        className="
          flex min-h-screen
          bg-gray-50
        "
      >
        <MenuList />

        <main
          className="
            min-w-0 flex-1
            p-4 pt-20
            sm:p-6 sm:pt-20
            md:pt-6
          "
        >
          <ReporteVentasSkeleton />
        </main>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className="
          flex min-h-screen
          bg-gray-50
        "
      >
        <MenuList />

        <main
          className="
            min-w-0 flex-1
            p-4 pt-20
            sm:p-6 sm:pt-20
            md:pt-6
          "
        >
          <div
            className="
              rounded-2xl border
              border-red-200
              bg-red-50 p-6
            "
          >
            <div
              className="
                flex items-start
                gap-4
              "
            >
              <div
                className="
                  flex h-11 w-11
                  shrink-0 items-center
                  justify-center
                  rounded-xl bg-red-100
                  text-red-700
                "
              >
                <AlertTriangle
                  size={22}
                />
              </div>

              <div className="flex-1">
                <h1
                  className="
                    text-lg font-bold
                    text-red-800
                  "
                >
                  No se pudo cargar el
                  resumen de ventas
                </h1>

                <p
                  className="
                    mt-2 text-sm
                    text-red-700
                  "
                >
                  {error instanceof Error
                    ? error.message
                    : "Ocurrió un error al consultar el reporte."}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    refetch()
                  }
                  className="
                    mt-4 rounded-lg
                    bg-red-700 px-4
                    py-2 text-sm
                    font-semibold
                    text-white transition
                    hover:bg-red-800
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

  /* =====================================================
     CONTENIDO PRINCIPAL
  ===================================================== */

  return (
    <div
      className="
        flex min-h-screen
        bg-gray-50
      "
    >
      {/* MENÚ LATERAL */}

      <MenuList />

      {/* CONTENIDO */}

      <main
        className="
          min-w-0 flex-1
          overflow-x-hidden
        "
      >
        <section
          className="
            space-y-7
            p-4 pt-20
            sm:p-6 sm:pt-20
            md:pt-6
          "
        >
          {/* ENCABEZADO */}

          <header
            className="
              flex flex-col gap-4
              xl:flex-row
              xl:items-center
              xl:justify-between
            "
          >
            <div
              className="
                flex items-center
                gap-3
              "
            >
              <div
                className="
                  flex h-12 w-12
                  shrink-0 items-center
                  justify-center
                  rounded-2xl
                  bg-gray-900
                  text-white
                "
              >
                <ShoppingCart
                  size={24}
                />
              </div>

              <div>
                <h1
                  className="
                    text-2xl font-bold
                    text-gray-900
                    sm:text-3xl
                  "
                >
                  Resumen de ventas
                </h1>

                <p
                  className="
                    mt-1 text-sm
                    text-gray-500
                  "
                >
                  Análisis de ventas
                  pagadas, anuladas,
                  cortesías e ingresos
                  reales de la sucursal.
                </p>
              </div>
            </div>

            <div
              className="
                grid gap-3
                sm:grid-cols-3
                xl:flex
                xl:items-center
              "
            >
              <button
                type="button"
                onClick={() =>
                  generarReportePDF(
                    "descargar"
                  )
                }
                disabled={
                  isFetching ||
                  !data
                }
                className="
                  inline-flex items-center
                  justify-center gap-2
                  rounded-xl bg-gray-900
                  px-4 py-2.5
                  text-sm font-semibold
                  text-white shadow-sm
                  transition hover:bg-black
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                <Download
                  size={17}
                />

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
                  !data
                }
                className="
                  inline-flex items-center
                  justify-center gap-2
                  rounded-xl border
                  border-gray-900
                  bg-white px-4 py-2.5
                  text-sm font-semibold
                  text-gray-900
                  shadow-sm transition
                  hover:bg-gray-100
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                <Printer
                  size={17}
                />

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
                className="
                  inline-flex items-center
                  justify-center gap-2
                  rounded-xl border
                  border-gray-300
                  bg-white px-4 py-2.5
                  text-sm font-semibold
                  text-gray-700
                  shadow-sm transition
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

          <article
            className="
              rounded-2xl border
              border-gray-200
              bg-white p-5
              shadow-sm
            "
          >
            <div
              className="
                mb-4 flex
                items-start gap-3
              "
            >
              <div
                className="
                  flex h-10 w-10
                  shrink-0 items-center
                  justify-center
                  rounded-xl
                  bg-gray-100
                  text-gray-700
                "
              >
                <CalendarDays
                  size={20}
                />
              </div>

              <div>
                <h2
                  className="
                    font-bold
                    text-gray-900
                  "
                >
                  Periodo del reporte
                </h2>

                <p
                  className="
                    mt-1 text-sm
                    text-gray-500
                  "
                >
                  Selecciona un rango de
                  fechas para analizar las
                  ventas.
                </p>
              </div>
            </div>

            <div
              className="
                grid gap-4
                md:grid-cols-2
                xl:grid-cols-[1fr_1fr_auto]
              "
            >
              <div>
                <label
                  htmlFor="fechaDesde"
                  className="
                    mb-2 block
                    text-sm font-semibold
                    text-gray-700
                  "
                >
                  Fecha inicial
                </label>

                <input
                  id="fechaDesde"
                  type="date"
                  value={
                    fechaDesde
                  }
                  onChange={(
                    event
                  ) =>
                    setFechaDesde(
                      event.target
                        .value
                    )
                  }
                  max={
                    fechaHasta ||
                    undefined
                  }
                  className="
                    w-full rounded-xl
                    border border-gray-300
                    bg-white px-4 py-3
                    text-sm text-gray-700
                    outline-none transition
                    focus:border-gray-900
                    focus:ring-2
                    focus:ring-gray-900/10
                  "
                />
              </div>

              <div>
                <label
                  htmlFor="fechaHasta"
                  className="
                    mb-2 block
                    text-sm font-semibold
                    text-gray-700
                  "
                >
                  Fecha final
                </label>

                <input
                  id="fechaHasta"
                  type="date"
                  value={
                    fechaHasta
                  }
                  onChange={(
                    event
                  ) =>
                    setFechaHasta(
                      event.target
                        .value
                    )
                  }
                  min={
                    fechaDesde ||
                    undefined
                  }
                  className="
                    w-full rounded-xl
                    border border-gray-300
                    bg-white px-4 py-3
                    text-sm text-gray-700
                    outline-none transition
                    focus:border-gray-900
                    focus:ring-2
                    focus:ring-gray-900/10
                  "
                />
              </div>

              <div
                className="
                  flex items-end
                "
              >
                <button
                  type="button"
                  onClick={
                    limpiarFiltros
                  }
                  disabled={
                    !fechaDesde &&
                    !fechaHasta
                  }
                  className="
                    inline-flex w-full
                    items-center
                    justify-center gap-2
                    rounded-xl border
                    border-gray-300
                    bg-white px-4 py-3
                    text-sm font-semibold
                    text-gray-700
                    transition
                    hover:bg-gray-50
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                    xl:w-auto
                  "
                >
                  <RotateCcw
                    size={17}
                  />

                  Limpiar
                </button>
              </div>
            </div>

            {(fechaDesde ||
              fechaHasta) && (
              <div
                className="
                  mt-4 rounded-xl
                  bg-gray-50 px-4
                  py-3 text-sm
                  text-gray-600
                "
              >
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

          {/* TARJETAS GENERALES */}

          <div
            className="
              grid gap-4
              sm:grid-cols-2
              xl:grid-cols-4
            "
          >
            <TarjetaResumen
              titulo="Ingresos reales"
              valor={mostrarMoneda(
                ingresosReales
              )}
              descripcion="Monto real generado por ventas pagadas."
              icono={Banknote}
              variante="principal"
            />

            <TarjetaResumen
              titulo="Ventas registradas"
              valor={mostrarNumero(
                cantidadTotalVentas
              )}
              descripcion="Total de operaciones pagadas, anuladas y cortesías."
              icono={ShoppingCart}
              variante="informativo"
            />

            <TarjetaResumen
              titulo="Ventas pagadas"
              valor={mostrarNumero(
                cantidadPagadas
              )}
              descripcion={`${mostrarPorcentaje(
                porcentajePagadas
              )} del total de operaciones.`}
              icono={TicketCheck}
              variante="positivo"
            />

            <TarjetaResumen
              titulo="Ticket promedio"
              valor={mostrarMoneda(
                promedioPagadas
              )}
              descripcion="Importe promedio por cada venta pagada."
              icono={ReceiptText}
              variante="positivo"
            />

            <TarjetaResumen
              titulo="Subtotal general"
              valor={mostrarMoneda(
                subtotalGeneral
              )}
              descripcion="Importe acumulado antes de aplicar descuentos."
              icono={
                CircleDollarSign
              }
            />

            <TarjetaResumen
              titulo="Descuentos"
              valor={mostrarMoneda(
                descuentosGenerales
              )}
              descripcion="Total de descuentos aplicados en el periodo."
              icono={Percent}
              variante={
                descuentosGenerales >
                0
                  ? "advertencia"
                  : "normal"
              }
            />

            <TarjetaResumen
              titulo="Ventas anuladas"
              valor={mostrarNumero(
                cantidadAnuladas
              )}
              descripcion={`${mostrarPorcentaje(
                porcentajeAnuladas
              )} del total de operaciones.`}
              icono={XCircle}
              variante={
                cantidadAnuladas > 0
                  ? "negativo"
                  : "normal"
              }
            />

            <TarjetaResumen
              titulo="Cortesías"
              valor={mostrarNumero(
                cantidadCortesias
              )}
              descripcion={`${mostrarPorcentaje(
                porcentajeCortesias
              )} del total de operaciones.`}
              icono={HandCoins}
              variante={
                cantidadCortesias > 0
                  ? "advertencia"
                  : "normal"
              }
            />
          </div>

          {/* GRÁFICAS */}

          <div
            className="
              grid gap-5
              xl:grid-cols-2
            "
          >
            {/* GRÁFICO DE BARRAS */}

            <article
              className="
                rounded-2xl border
                border-gray-200
                bg-white p-5
                shadow-sm
              "
            >
              <div>
                <h2
                  className="
                    text-lg font-bold
                    text-gray-900
                  "
                >
                  Montos por estado
                </h2>

                <p
                  className="
                    mt-1 text-sm
                    text-gray-500
                  "
                >
                  Comparación económica
                  entre ventas pagadas,
                  anuladas y cortesías.
                </p>
              </div>

              <div
                className="
                  mt-5 h-[330px]
                  w-full
                "
              >
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <BarChart
                    data={
                      datosMontos
                    }
                    margin={{
                      top: 15,
                      right: 10,
                      left: 0,
                      bottom: 10,
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
                    />

                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      width={80}
                      tickFormatter={(
                        valor
                      ) =>
                        `Bs ${formatoNumero.format(
                          convertirNumero(
                            valor
                          )
                        )}`
                      }
                    />

                    <Tooltip
                      content={
                        <TooltipMoneda />
                      }
                    />

                    <Bar
                      dataKey="valor"
                      radius={[
                        8,
                        8,
                        0,
                        0,
                      ]}
                      maxBarSize={75}
                    >
                      {datosMontos.map(
                        (
                          item,
                          index
                        ) => (
                          <Cell
                            key={`${item.nombre}-${index}`}
                            fill={
                              item.color
                            }
                          />
                        )
                      )}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </article>

            {/* GRÁFICO DE TORTA */}

            <article
              className="
                rounded-2xl border
                border-gray-200
                bg-white p-5
                shadow-sm
              "
            >
              <div>
                <h2
                  className="
                    text-lg font-bold
                    text-gray-900
                  "
                >
                  Distribución de ventas
                </h2>

                <p
                  className="
                    mt-1 text-sm
                    text-gray-500
                  "
                >
                  Proporción de operaciones
                  según su estado.
                </p>
              </div>

              {cantidadTotalVentas >
              0 ? (
                <>
                  <div
                    className="
                      relative mt-4
                      h-[260px] w-full
                    "
                  >
                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >
                      <PieChart>
                        <Pie
                          data={
                            datosCantidades
                          }
                          dataKey="cantidad"
                          nameKey="nombre"
                          cx="50%"
                          cy="50%"
                          innerRadius={62}
                          outerRadius={95}
                          paddingAngle={4}
                        >
                          {datosCantidades.map(
                            (
                              item,
                              index
                            ) => (
                              <Cell
                                key={`${item.nombre}-${index}`}
                                fill={
                                  item.color
                                }
                              />
                            )
                          )}
                        </Pie>

                        <Tooltip
                          content={
                            <TooltipCantidad />
                          }
                        />

                        <Legend
                          verticalAlign="bottom"
                          height={30}
                        />
                      </PieChart>
                    </ResponsiveContainer>

                    <div
                      className="
                        pointer-events-none
                        absolute inset-0
                        flex items-center
                        justify-center
                      "
                    >
                      <div
                        className="
                          text-center
                        "
                      >
                        <p
                          className="
                            text-3xl
                            font-bold
                            text-gray-900
                          "
                        >
                          {mostrarNumero(
                            cantidadTotalVentas
                          )}
                        </p>

                        <p
                          className="
                            text-xs
                            text-gray-500
                          "
                        >
                          Operaciones
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    className="
                      mt-3 grid gap-3
                      sm:grid-cols-3
                    "
                  >
                    {datosCantidades.map(
                      (item) => {
                        const porcentaje =
                          cantidadTotalVentas >
                          0
                            ? (item.cantidad /
                                cantidadTotalVentas) *
                              100
                            : 0;

                        return (
                          <div
                            key={
                              item.nombre
                            }
                            className="
                              rounded-xl
                              bg-gray-50
                              px-3 py-3
                              text-center
                            "
                          >
                            <div
                              className="
                                mx-auto h-3
                                w-3 rounded-full
                              "
                              style={{
                                backgroundColor:
                                  item.color,
                              }}
                            />

                            <p
                              className="
                                mt-2 text-sm
                                font-semibold
                                text-gray-900
                              "
                            >
                              {
                                item.nombre
                              }
                            </p>

                            <p
                              className="
                                mt-1 text-xs
                                text-gray-500
                              "
                            >
                              {mostrarPorcentaje(
                                porcentaje
                              )}
                            </p>
                          </div>
                        );
                      }
                    )}
                  </div>
                </>
              ) : (
                <div
                  className="
                    mt-5 flex h-[330px]
                    flex-col items-center
                    justify-center
                    rounded-xl border
                    border-dashed
                    border-gray-300
                  "
                >
                  <ShoppingCart
                    size={38}
                    className="
                      text-gray-300
                    "
                  />

                  <p
                    className="
                      mt-3 font-semibold
                      text-gray-600
                    "
                  >
                    Sin ventas registradas
                  </p>

                  <p
                    className="
                      mt-1 text-sm
                      text-gray-500
                    "
                  >
                    No existen datos para
                    representar en la gráfica.
                  </p>
                </div>
              )}
            </article>
          </div>

          {/* TABLA DETALLADA */}

          <article
            className="
              overflow-hidden
              rounded-2xl border
              border-gray-200
              bg-white shadow-sm
            "
          >
            <div
              className="
                border-b
                border-gray-100
                p-5
              "
            >
              <div
                className="
                  flex items-center
                  gap-3
                "
              >
                <div
                  className="
                    flex h-10 w-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-gray-100
                    text-gray-700
                  "
                >
                  <FileText
                    size={20}
                  />
                </div>

                <div>
                  <h2
                    className="
                      text-lg font-bold
                      text-gray-900
                    "
                  >
                    Detalle de ventas
                  </h2>

                  <p
                    className="
                      mt-1 text-sm
                      text-gray-500
                    "
                  >
                    Resumen financiero
                    agrupado por estado de
                    venta.
                  </p>
                </div>
              </div>
            </div>

            <div
              className="
                overflow-x-auto
              "
            >
              <table
                className="
                  min-w-[850px]
                  w-full
                "
              >
                <thead
                  className="
                    bg-gray-50
                  "
                >
                  <tr>
                    <th
                      className="
                        px-5 py-4
                        text-left text-xs
                        font-bold uppercase
                        tracking-wide
                        text-gray-500
                      "
                    >
                      Estado
                    </th>

                    <th
                      className="
                        px-5 py-4
                        text-center text-xs
                        font-bold uppercase
                        tracking-wide
                        text-gray-500
                      "
                    >
                      Cantidad
                    </th>

                    <th
                      className="
                        px-5 py-4
                        text-right text-xs
                        font-bold uppercase
                        tracking-wide
                        text-gray-500
                      "
                    >
                      Subtotal
                    </th>

                    <th
                      className="
                        px-5 py-4
                        text-right text-xs
                        font-bold uppercase
                        tracking-wide
                        text-gray-500
                      "
                    >
                      Descuento
                    </th>

                    <th
                      className="
                        px-5 py-4
                        text-right text-xs
                        font-bold uppercase
                        tracking-wide
                        text-gray-500
                      "
                    >
                      Total
                    </th>

                    <th
                      className="
                        px-5 py-4
                        text-right text-xs
                        font-bold uppercase
                        tracking-wide
                        text-gray-500
                      "
                    >
                      Promedio
                    </th>
                  </tr>
                </thead>

                <tbody
                  className="
                    divide-y
                    divide-gray-100
                  "
                >
                  <tr>
                    <td
                      className="
                        px-5 py-4
                      "
                    >
                      <span
                        className="
                          inline-flex
                          rounded-full
                          bg-emerald-100
                          px-3 py-1
                          text-xs
                          font-semibold
                          text-emerald-700
                        "
                      >
                        Pagadas
                      </span>
                    </td>

                    <td
                      className="
                        px-5 py-4
                        text-center
                        font-semibold
                        text-gray-900
                      "
                    >
                      {mostrarNumero(
                        cantidadPagadas
                      )}
                    </td>

                    <td
                      className="
                        px-5 py-4
                        text-right
                        text-gray-700
                      "
                    >
                      {mostrarMoneda(
                        subtotalPagadas
                      )}
                    </td>

                    <td
                      className="
                        px-5 py-4
                        text-right
                        text-amber-700
                      "
                    >
                      {mostrarMoneda(
                        descuentosPagadas
                      )}
                    </td>

                    <td
                      className="
                        px-5 py-4
                        text-right
                        font-bold
                        text-emerald-700
                      "
                    >
                      {mostrarMoneda(
                        totalPagadas
                      )}
                    </td>

                    <td
                      className="
                        px-5 py-4
                        text-right
                        text-gray-700
                      "
                    >
                      {mostrarMoneda(
                        promedioPagadas
                      )}
                    </td>
                  </tr>

                  <tr>
                    <td
                      className="
                        px-5 py-4
                      "
                    >
                      <span
                        className="
                          inline-flex
                          rounded-full
                          bg-red-100
                          px-3 py-1
                          text-xs
                          font-semibold
                          text-red-700
                        "
                      >
                        Anuladas
                      </span>
                    </td>

                    <td
                      className="
                        px-5 py-4
                        text-center
                        font-semibold
                        text-gray-900
                      "
                    >
                      {mostrarNumero(
                        cantidadAnuladas
                      )}
                    </td>

                    <td
                      className="
                        px-5 py-4
                        text-right
                        text-gray-700
                      "
                    >
                      {mostrarMoneda(
                        subtotalAnuladas
                      )}
                    </td>

                    <td
                      className="
                        px-5 py-4
                        text-right
                        text-amber-700
                      "
                    >
                      {mostrarMoneda(
                        descuentosAnuladas
                      )}
                    </td>

                    <td
                      className="
                        px-5 py-4
                        text-right
                        font-bold
                        text-red-700
                      "
                    >
                      {mostrarMoneda(
                        totalAnuladas
                      )}
                    </td>

                    <td
                      className="
                        px-5 py-4
                        text-right
                        text-gray-700
                      "
                    >
                      {mostrarMoneda(
                        promedioAnuladas
                      )}
                    </td>
                  </tr>

                  <tr>
                    <td
                      className="
                        px-5 py-4
                      "
                    >
                      <span
                        className="
                          inline-flex
                          rounded-full
                          bg-amber-100
                          px-3 py-1
                          text-xs
                          font-semibold
                          text-amber-700
                        "
                      >
                        Cortesías
                      </span>
                    </td>

                    <td
                      className="
                        px-5 py-4
                        text-center
                        font-semibold
                        text-gray-900
                      "
                    >
                      {mostrarNumero(
                        cantidadCortesias
                      )}
                    </td>

                    <td
                      className="
                        px-5 py-4
                        text-right
                        text-gray-700
                      "
                    >
                      {mostrarMoneda(
                        subtotalCortesias
                      )}
                    </td>

                    <td
                      className="
                        px-5 py-4
                        text-right
                        text-amber-700
                      "
                    >
                      {mostrarMoneda(
                        descuentosCortesias
                      )}
                    </td>

                    <td
                      className="
                        px-5 py-4
                        text-right
                        font-bold
                        text-amber-700
                      "
                    >
                      {mostrarMoneda(
                        totalCortesias
                      )}
                    </td>

                    <td
                      className="
                        px-5 py-4
                        text-right
                        text-gray-700
                      "
                    >
                      {mostrarMoneda(
                        promedioCortesias
                      )}
                    </td>
                  </tr>
                </tbody>

                <tfoot
                  className="
                    bg-gray-900
                    text-white
                  "
                >
                  <tr>
                    <td
                      className="
                        px-5 py-4
                        font-bold
                      "
                    >
                      Total
                    </td>

                    <td
                      className="
                        px-5 py-4
                        text-center
                        font-bold
                      "
                    >
                      {mostrarNumero(
                        cantidadTotalVentas
                      )}
                    </td>

                    <td
                      className="
                        px-5 py-4
                        text-right
                        font-bold
                      "
                    >
                      {mostrarMoneda(
                        subtotalGeneral
                      )}
                    </td>

                    <td
                      className="
                        px-5 py-4
                        text-right
                        font-bold
                        text-amber-300
                      "
                    >
                      {mostrarMoneda(
                        descuentosGenerales
                      )}
                    </td>

                    <td
                      className="
                        px-5 py-4
                        text-right
                        font-bold
                        text-emerald-400
                      "
                    >
                      {mostrarMoneda(
                        ingresosReales
                      )}
                    </td>

                    <td
                      className="
                        px-5 py-4
                        text-right
                        font-bold
                      "
                    >
                      {mostrarMoneda(
                        promedioPagadas
                      )}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </article>

          {/* INDICADORES DE DECISIÓN */}

          <div
            className="
              grid gap-4
              md:grid-cols-3
            "
          >
            <article
              className="
                rounded-2xl border
                border-emerald-200
                bg-white p-5
                shadow-sm
              "
            >
              <div
                className="
                  flex items-center
                  gap-3
                "
              >
                <div
                  className="
                    flex h-11 w-11
                    items-center
                    justify-center
                    rounded-xl
                    bg-emerald-100
                    text-emerald-700
                  "
                >
                  <TrendingUp
                    size={21}
                  />
                </div>

                <div>
                  <p
                    className="
                      text-sm
                      text-gray-500
                    "
                  >
                    Efectividad de ventas
                  </p>

                  <p
                    className="
                      text-xl font-bold
                      text-emerald-700
                    "
                  >
                    {mostrarPorcentaje(
                      porcentajePagadas
                    )}
                  </p>
                </div>
              </div>
            </article>

            <article
              className={`
                rounded-2xl border
                bg-white p-5
                shadow-sm

                ${
                  porcentajeAnuladas >
                  10
                    ? "border-red-200"
                    : "border-gray-200"
                }
              `}
            >
              <div
                className="
                  flex items-center
                  gap-3
                "
              >
                <div
                  className={`
                    flex h-11 w-11
                    items-center
                    justify-center
                    rounded-xl

                    ${
                      porcentajeAnuladas >
                      10
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                    }
                  `}
                >
                  <XCircle
                    size={21}
                  />
                </div>

                <div>
                  <p
                    className="
                      text-sm
                      text-gray-500
                    "
                  >
                    Tasa de anulación
                  </p>

                  <p
                    className={`
                      text-xl font-bold

                      ${
                        porcentajeAnuladas >
                        10
                          ? "text-red-700"
                          : "text-gray-900"
                      }
                    `}
                  >
                    {mostrarPorcentaje(
                      porcentajeAnuladas
                    )}
                  </p>
                </div>
              </div>
            </article>

            <article
              className={`
                rounded-2xl border
                bg-white p-5
                shadow-sm

                ${
                  descuentosGenerales >
                  subtotalGeneral * 0.1
                    ? "border-amber-200"
                    : "border-gray-200"
                }
              `}
            >
              <div
                className="
                  flex items-center
                  gap-3
                "
              >
                <div
                  className={`
                    flex h-11 w-11
                    items-center
                    justify-center
                    rounded-xl

                    ${
                      descuentosGenerales >
                      subtotalGeneral * 0.1
                        ? "bg-amber-100 text-amber-700"
                        : "bg-gray-100 text-gray-700"
                    }
                  `}
                >
                  <Percent
                    size={21}
                  />
                </div>

                <div>
                  <p
                    className="
                      text-sm
                      text-gray-500
                    "
                  >
                    Descuento sobre subtotal
                  </p>

                  <p
                    className={`
                      text-xl font-bold

                      ${
                        descuentosGenerales >
                        subtotalGeneral * 0.1
                          ? "text-amber-700"
                          : "text-gray-900"
                      }
                    `}
                  >
                    {mostrarPorcentaje(
                      subtotalGeneral > 0
                        ? (descuentosGenerales /
                            subtotalGeneral) *
                            100
                        : 0
                    )}
                  </p>
                </div>
              </div>
            </article>
          </div>

          {/* INDICADOR DE ACTUALIZACIÓN */}

          {isFetching && (
            <div
              className="
                fixed bottom-5
                right-5 z-50
                flex items-center
                gap-3 rounded-xl
                bg-gray-900
                px-4 py-3
                text-sm font-semibold
                text-white shadow-xl
              "
            >
              <LoaderCircle
                size={18}
                className="
                  animate-spin
                "
              />

              Actualizando ventas...
            </div>
          )}
        </section>
      </main>
    </div>
  );
}