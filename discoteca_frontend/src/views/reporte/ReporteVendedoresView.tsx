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
  Award,
  CalendarDays,
  CircleDollarSign,
  Download,
  FileBarChart,
  LoaderCircle,
  Medal,
  Percent,
  Printer,
  ReceiptText,
  RefreshCcw,
  RotateCcw,
  Star,
  TrendingUp,
  Trophy,
  UserRoundCheck,
  Users,
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
  getReporteVentasPorVendedor,
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

  return Number.isFinite(numero) ? numero : 0;
}

function mostrarMoneda(
  valor: number | string | null | undefined
): string {
  return formatoMoneda.format(convertirNumero(valor));
}

function mostrarNumero(
  valor: number | string | null | undefined
): string {
  return formatoNumero.format(convertirNumero(valor));
}

function mostrarPorcentaje(
  valor: number | string | null | undefined
): string {
  return `${convertirNumero(valor).toFixed(2)}%`;
}

function formatearFechaDocumento(fecha?: string): string {
  if (!fecha) {
    return "Sin fecha definida";
  }

  const fechaLocal = new Date(`${fecha}T00:00:00`);

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

function limpiarNombreArchivo(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9-_]/g, "_")
    .replace(/_+/g, "_");
}

function recortarTexto(texto: string, limite = 18): string {
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

type VendedorReporte = {
  idPerfil: string;
  nombres: string;
  apellidos: string;
  email?: string;
  cantidadVentas: number;
  subtotal: number;
  descuento: number;
  totalVendido: number;
  ticketPromedio: number;
};

type TooltipVendedorProps = {
  active?: boolean;
  payload?: Array<{
    value?: number;
    payload?: VendedorReporte & {
      nombreCompleto?: string;
      nombreCorto?: string;
    };
  }>;
  tipo?: "cantidad" | "moneda";
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
              mt-3 break-words text-2xl font-bold sm:text-3xl
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
            flex h-11 w-11 shrink-0 items-center
            justify-center rounded-xl
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

function TooltipVendedor({
  active,
  payload,
  tipo = "moneda",
}: TooltipVendedorProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const item = payload[0]?.payload;

  return (
    <div className="max-w-xs rounded-xl border border-gray-200 bg-white p-3 shadow-lg">
      <p className="text-sm font-semibold text-gray-900">
        {item?.nombreCompleto}
      </p>

      {item?.email && (
        <p className="mt-1 text-xs text-gray-500">
          {item.email}
        </p>
      )}

      <p className="mt-2 text-sm text-gray-700">
        {tipo === "moneda"
          ? mostrarMoneda(payload[0]?.value)
          : `${mostrarNumero(payload[0]?.value)} ventas`}
      </p>
    </div>
  );
}

/* =====================================================
   ICONO POSICIÓN
===================================================== */

function IconoPosicion({
  posicion,
}: {
  posicion: number;
}) {
  if (posicion === 1) {
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
        <Trophy size={19} />
      </div>
    );
  }

  if (posicion === 2) {
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-200 text-gray-700">
        <Medal size={19} />
      </div>
    );
  }

  if (posicion === 3) {
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
        <Award size={19} />
      </div>
    );
  }

  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-sm font-bold text-gray-700">
      {posicion}
    </div>
  );
}

/* =====================================================
   SKELETON
===================================================== */

function ReporteVendedoresSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div>
        <div className="h-8 w-80 max-w-full rounded bg-gray-200" />
        <div className="mt-3 h-4 w-96 max-w-full rounded bg-gray-100" />
      </div>

      <div className="h-32 rounded-2xl border bg-white" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
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

export default function ReporteVendedoresView() {
  const { sucursalId } = useParams<{
    sucursalId: string;
  }>();

  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: [
      "reporte-ventas-vendedor",
      sucursalId,
      fechaDesde,
      fechaHasta,
    ],

    queryFn: () =>
      getReporteVentasPorVendedor({
        idSucursal: sucursalId,
        fechaDesde: fechaDesde || undefined,
        fechaHasta: fechaHasta || undefined,
      }),

    enabled: Boolean(sucursalId),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });

  const limpiarFiltros = () => {
    setFechaDesde("");
    setFechaHasta("");
  };

  const vendedores = (data?.data ?? []) as VendedorReporte[];
console.log(vendedores)
  const vendedoresOrdenados = [...vendedores].sort(
    (a, b) =>
      convertirNumero(b.totalVendido) -
      convertirNumero(a.totalVendido)
  );

  const totalVendido = vendedoresOrdenados.reduce(
    (acumulado, vendedor) =>
      acumulado + convertirNumero(vendedor.totalVendido),
    0
  );

  const totalVentas = vendedoresOrdenados.reduce(
    (acumulado, vendedor) =>
      acumulado + convertirNumero(vendedor.cantidadVentas),
    0
  );

  const totalSubtotal = vendedoresOrdenados.reduce(
    (acumulado, vendedor) =>
      acumulado + convertirNumero(vendedor.subtotal),
    0
  );

  const totalDescuentos = vendedoresOrdenados.reduce(
    (acumulado, vendedor) =>
      acumulado + convertirNumero(vendedor.descuento),
    0
  );

  const ticketPromedioGeneral =
    totalVentas > 0 ? totalVendido / totalVentas : 0;

  const vendedorLider = vendedoresOrdenados[0] ?? null;

  const porcentajeLider =
    vendedorLider && totalVendido > 0
      ? (convertirNumero(vendedorLider.totalVendido) / totalVendido) * 100
      : 0;

  const datosGraficaVentas = useMemo(
    () =>
      vendedoresOrdenados.slice(0, 10).map((vendedor) => {
        const nombreCompleto = `${vendedor.nombres ?? ""} ${
          vendedor.apellidos ?? ""
        }`.trim();

        return {
          ...vendedor,
          nombreCompleto,
          nombreCorto: recortarTexto(nombreCompleto, 16),
          totalVendido: convertirNumero(vendedor.totalVendido),
        };
      }),
    [vendedoresOrdenados]
  );

  const datosGraficaCantidad = useMemo(
    () =>
      vendedoresOrdenados.slice(0, 8).map((vendedor) => {
        const nombreCompleto = `${vendedor.nombres ?? ""} ${
          vendedor.apellidos ?? ""
        }`.trim();

        return {
          ...vendedor,
          nombreCompleto,
          nombreCorto: recortarTexto(nombreCompleto, 18),
          cantidadVentas: convertirNumero(vendedor.cantidadVentas),
        };
      }),
    [vendedoresOrdenados]
  );

  const coloresGrafica = [
    "#111827",
    "#2563eb",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#ef4444",
    "#0891b2",
    "#db2777",
    "#65a30d",
    "#ea580c",
  ];

  /* =====================================================
     GENERAR PDF
  ===================================================== */

  const generarReportePDF = (
    modo: "descargar" | "imprimir" = "descargar"
  ) => {
    if (!sucursalId || vendedoresOrdenados.length === 0) {
      return;
    }

    const documento = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const anchoPagina = documento.internal.pageSize.getWidth();
    const altoPagina = documento.internal.pageSize.getHeight();

    const margenIzquierdo = 15;
    const margenDerecho = 15;

    const nombreSucursal = `Sucursal ${sucursalId}`;

    const periodoDesde = fechaDesde
      ? formatearFechaDocumento(fechaDesde)
      : "Inicio de registros";

    const periodoHasta = fechaHasta
      ? formatearFechaDocumento(fechaHasta)
      : "Fecha actual";

    documento.setFillColor(17, 24, 39);
    documento.rect(0, 0, anchoPagina, 38, "F");

    documento.setTextColor(255, 255, 255);
    documento.setFont("helvetica", "bold");
    documento.setFontSize(18);

    documento.text(
      "VENTAS POR MESERO",
      margenIzquierdo,
      15
    );

    documento.setFont("helvetica", "normal");
    documento.setFontSize(10);

    documento.text(
      "Reporte de rendimiento comercial por vendedor o mesero",
      margenIzquierdo,
      23
    );

    documento.setFontSize(9);

    documento.text(
      nombreSucursal,
      anchoPagina - margenDerecho,
      13,
      {
        align: "right",
      }
    );

    documento.text(
      `Periodo: ${periodoDesde} al ${periodoHasta}`,
      anchoPagina - margenDerecho,
      20,
      {
        align: "right",
      }
    );

    documento.text(
      `Generado: ${formatearFechaHoraActual()}`,
      anchoPagina - margenDerecho,
      27,
      {
        align: "right",
      }
    );

    documento.setTextColor(31, 41, 55);
    documento.setFont("helvetica", "bold");
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
          "Meseros analizados",
          "Total ventas",
          "Total vendido",
          "Subtotal",
          "Descuentos",
          "Ticket promedio",
        ],
      ],

      body: [
        [
          mostrarNumero(vendedoresOrdenados.length),
          mostrarNumero(totalVentas),
          mostrarMoneda(totalVendido),
          mostrarMoneda(totalSubtotal),
          mostrarMoneda(totalDescuentos),
          mostrarMoneda(ticketPromedioGeneral),
        ],
      ],

      theme: "grid",

      styles: {
        font: "helvetica",
        fontSize: 9,
        cellPadding: 3,
        halign: "center",
        textColor: [31, 41, 55],
        lineColor: [229, 231, 235],
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

    documento.setFont("helvetica", "bold");
    documento.setFontSize(11);

    documento.text(
      "Ranking de meseros",
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
          "Pos.",
          "Mesero",
          "Correo",
          "Ventas",
          "Subtotal",
          "Descuentos",
          "Total vendido",
          "Ticket promedio",
          "Participación",
        ],
      ],

      body: vendedoresOrdenados.map((vendedor, index) => {
        const nombreCompleto = `${vendedor.nombres ?? ""} ${
          vendedor.apellidos ?? ""
        }`.trim();

        const totalMesero = convertirNumero(vendedor.totalVendido);

        const participacion =
          totalVendido > 0 ? (totalMesero / totalVendido) * 100 : 0;

        return [
          index + 1,
          nombreCompleto || "Sin nombre",
          vendedor.email || "Sin correo",
          mostrarNumero(vendedor.cantidadVentas),
          mostrarMoneda(vendedor.subtotal),
          mostrarMoneda(vendedor.descuento),
          mostrarMoneda(vendedor.totalVendido),
          mostrarMoneda(vendedor.ticketPromedio),
          mostrarPorcentaje(participacion),
        ];
      }),

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

      columnStyles: {
        0: {
          cellWidth: 12,
          halign: "center",
        },

        1: {
          cellWidth: 40,
        },

        2: {
          cellWidth: 48,
        },

        3: {
          cellWidth: 18,
          halign: "center",
        },

        4: {
          cellWidth: 31,
          halign: "right",
        },

        5: {
          cellWidth: 31,
          halign: "right",
        },

        6: {
          cellWidth: 31,
          halign: "right",
        },

        7: {
          cellWidth: 31,
          halign: "right",
        },

        8: {
          cellWidth: 24,
          halign: "right",
        },
      },

      didParseCell: (hookData) => {
        if (hookData.section !== "body") {
          return;
        }

        if (hookData.row.index === 0) {
          hookData.cell.styles.fillColor = [254, 243, 199];
          hookData.cell.styles.fontStyle = "bold";
        }

        if (hookData.row.index === 1) {
          hookData.cell.styles.fillColor = [243, 244, 246];
        }

        if (hookData.row.index === 2) {
          hookData.cell.styles.fillColor = [255, 237, 213];
        }

        if (hookData.column.index === 6) {
          hookData.cell.styles.textColor = [4, 120, 87];
          hookData.cell.styles.fontStyle = "bold";
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
      ).lastAutoTable?.finalY ?? 160;

    let posicionInterpretacion = posicionTabla + 11;

    if (posicionInterpretacion > altoPagina - 45) {
      documento.addPage();
      posicionInterpretacion = 20;
    }

    documento.setTextColor(31, 41, 55);
    documento.setFont("helvetica", "bold");
    documento.setFontSize(11);

    documento.text(
      "Interpretación del reporte",
      margenIzquierdo,
      posicionInterpretacion
    );

    const interpretaciones: string[] = [];

    if (vendedorLider) {
      const nombreLider = `${vendedorLider.nombres ?? ""} ${
        vendedorLider.apellidos ?? ""
      }`.trim();

      interpretaciones.push(
        `${nombreLider} ocupa el primer lugar con ${mostrarNumero(
          vendedorLider.cantidadVentas
        )} ventas y un total vendido de ${mostrarMoneda(
          vendedorLider.totalVendido
        )}.`
      );
    }

    interpretaciones.push(
      `El total vendido por los meseros analizados es de ${mostrarMoneda(
        totalVendido
      )}, con ${mostrarNumero(totalVentas)} ventas registradas.`
    );

    interpretaciones.push(
      `El ticket promedio general es de ${mostrarMoneda(
        ticketPromedioGeneral
      )}.`
    );

    if (porcentajeLider > 40) {
      interpretaciones.push(
        "Existe una alta concentración de ventas en el mesero principal. Se recomienda revisar si la distribución de atención entre el personal es equilibrada."
      );
    }

    if (totalDescuentos > totalSubtotal * 0.1 && totalSubtotal > 0) {
      interpretaciones.push(
        "Los descuentos superan el 10% del subtotal vendido. Se recomienda revisar las políticas de descuentos aplicadas por el personal."
      );
    }

    documento.setFont("helvetica", "normal");
    documento.setFontSize(9.5);

    let posicionTexto = posicionInterpretacion + 7;

    interpretaciones.forEach((interpretacion, index) => {
      const lineas = documento.splitTextToSize(
        `${index + 1}. ${interpretacion}`,
        anchoPagina - margenIzquierdo - margenDerecho - 4
      );

      documento.text(
        lineas,
        margenIzquierdo + 2,
        posicionTexto
      );

      posicionTexto += lineas.length * 5 + 2;
    });

    const totalPaginas = documento.getNumberOfPages();

    for (let pagina = 1; pagina <= totalPaginas; pagina++) {
      documento.setPage(pagina);

      documento.setDrawColor(229, 231, 235);

      documento.line(
        margenIzquierdo,
        altoPagina - 14,
        anchoPagina - margenDerecho,
        altoPagina - 14
      );

      documento.setFont("helvetica", "normal");
      documento.setFontSize(8);
      documento.setTextColor(107, 114, 128);

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

    const nombreArchivo = limpiarNombreArchivo(
      `ventas_por_mesero_${sucursalId}_${fechaDesde || "inicio"}_${fechaHasta || "actual"}`
    );

    if (modo === "imprimir") {
      const urlPDF = documento.output("bloburl");

      window.open(
        urlPDF,
        "_blank",
        "noopener,noreferrer"
      );

      return;
    }

    documento.save(`${nombreArchivo}.pdf`);
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
          <ReporteVendedoresSkeleton />
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
                  No se pudo cargar el reporte de meseros
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
                    mt-4 rounded-lg bg-red-700 px-4 py-2
                    text-sm font-semibold text-white transition
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

  return (
    <div className="flex min-h-screen bg-gray-50">
      <MenuList />

      <main className="min-w-0 flex-1 overflow-x-hidden">
        <section className="space-y-7 p-4 pt-20 sm:p-6 sm:pt-20 md:pt-6">
          {/* ENCABEZADO */}

          <header className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gray-900 text-white">
                <UserRoundCheck size={24} />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  Ventas por mesero
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Ranking de rendimiento comercial por mesero o vendedor de la sucursal.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 xl:flex xl:items-center">
              <button
                type="button"
                onClick={() => generarReportePDF("descargar")}
                disabled={isFetching || vendedoresOrdenados.length === 0}
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
                onClick={() => generarReportePDF("imprimir")}
                disabled={isFetching || vendedoresOrdenados.length === 0}
                className="
                  inline-flex items-center justify-center gap-2
                  rounded-xl border border-gray-900 bg-white
                  px-4 py-2.5 text-sm font-semibold
                  text-gray-900 shadow-sm transition hover:bg-gray-100
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
                  text-gray-700 shadow-sm transition hover:bg-gray-50
                  disabled:cursor-not-allowed disabled:opacity-60
                "
              >
                <RefreshCcw
                  size={17}
                  className={isFetching ? "animate-spin" : ""}
                />

                {isFetching ? "Actualizando..." : "Actualizar"}
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
                  Selecciona un rango de fechas para analizar el rendimiento de los meseros.
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
                    setFechaDesde(event.target.value)
                  }
                  max={fechaHasta || undefined}
                  className="
                    w-full rounded-xl border border-gray-300
                    bg-white px-4 py-3 text-sm text-gray-700
                    outline-none transition focus:border-gray-900
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
                    setFechaHasta(event.target.value)
                  }
                  min={fechaDesde || undefined}
                  className="
                    w-full rounded-xl border border-gray-300
                    bg-white px-4 py-3 text-sm text-gray-700
                    outline-none transition focus:border-gray-900
                    focus:ring-2 focus:ring-gray-900/10
                  "
                />
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={limpiarFiltros}
                  disabled={!fechaDesde && !fechaHasta}
                  className="
                    inline-flex w-full items-center justify-center gap-2
                    rounded-xl border border-gray-300 bg-white
                    px-4 py-3 text-sm font-semibold text-gray-700
                    transition hover:bg-gray-50
                    disabled:cursor-not-allowed disabled:opacity-50
                    xl:w-auto
                  "
                >
                  <RotateCcw size={17} />
                  Limpiar
                </button>
              </div>
            </div>

            {(fechaDesde || fechaHasta) && (
              <div className="mt-4 rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-600">
                Mostrando resultados
                {fechaDesde
                  ? ` desde ${formatearFechaDocumento(fechaDesde)}`
                  : ""}
                {fechaHasta
                  ? ` hasta ${formatearFechaDocumento(fechaHasta)}`
                  : ""}
                .
              </div>
            )}
          </article>

          {/* TARJETAS */}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <TarjetaIndicador
              titulo="Total vendido"
              valor={mostrarMoneda(totalVendido)}
              descripcion="Monto total vendido por los meseros."
              icono={CircleDollarSign}
              variante="principal"
            />

            <TarjetaIndicador
              titulo="Ventas realizadas"
              valor={mostrarNumero(totalVentas)}
              descripcion="Cantidad total de ventas registradas."
              icono={ReceiptText}
              variante="informativo"
            />

            <TarjetaIndicador
              titulo="Ticket promedio"
              valor={mostrarMoneda(ticketPromedioGeneral)}
              descripcion="Promedio general vendido por operación."
              icono={WalletCards}
              variante="positivo"
            />

            <TarjetaIndicador
              titulo="Descuentos"
              valor={mostrarMoneda(totalDescuentos)}
              descripcion="Total de descuentos aplicados."
              icono={Percent}
              variante={totalDescuentos > 0 ? "advertencia" : "normal"}
            />
          </div>

          {/* MESERO LÍDER */}

          {vendedorLider && (
            <article className="overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-sm">
              <div
                className="
                  flex flex-col gap-5 bg-gradient-to-r
                  from-amber-50 to-white p-5
                  md:flex-row md:items-center md:justify-between
                "
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                    <Trophy size={27} />
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-amber-700">
                      Mesero destacado
                    </p>

                    <h2 className="mt-1 text-xl font-bold text-gray-900">
                      {`${vendedorLider.nombres ?? ""} ${
                        vendedorLider.apellidos ?? ""
                      }`.trim()}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      {vendedorLider.email || "Sin correo registrado"}
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl bg-white px-4 py-3 shadow-sm">
                    <p className="text-xs text-gray-500">
                      Ventas
                    </p>

                    <p className="mt-1 text-lg font-bold text-gray-900">
                      {mostrarNumero(vendedorLider.cantidadVentas)}
                    </p>
                  </div>

                  <div className="rounded-xl bg-white px-4 py-3 shadow-sm">
                    <p className="text-xs text-gray-500">
                      Total vendido
                    </p>

                    <p className="mt-1 text-lg font-bold text-gray-900">
                      {mostrarMoneda(vendedorLider.totalVendido)}
                    </p>
                  </div>

                  <div className="rounded-xl bg-white px-4 py-3 shadow-sm">
                    <p className="text-xs text-gray-500">
                      Participación
                    </p>

                    <p className="mt-1 text-lg font-bold text-emerald-700">
                      {mostrarPorcentaje(porcentajeLider)}
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
                  Total vendido por mesero
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Comparación económica de los meseros con mayor venta.
                </p>
              </div>

              <div className="mt-5 h-[360px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={datosGraficaVentas}
                    layout="vertical"
                    margin={{
                      top: 5,
                      right: 25,
                      left: 25,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      horizontal={false}
                    />

                    <XAxis
                      type="number"
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(valor) =>
                        `Bs ${formatoNumero.format(convertirNumero(valor))}`
                      }
                    />

                    <YAxis
                      type="category"
                      dataKey="nombreCorto"
                      width={115}
                      tickLine={false}
                      axisLine={false}
                      tick={{
                        fontSize: 11,
                      }}
                    />

                    <Tooltip
                      content={
                        <TooltipVendedor tipo="moneda" />
                      }
                    />

                    <Bar
                      dataKey="totalVendido"
                      radius={[0, 8, 8, 0]}
                      maxBarSize={28}
                    >
                      {datosGraficaVentas.map((vendedor, index) => (
                        <Cell
                          key={`${vendedor.idPerfil}-${index}`}
                          fill={
                            coloresGrafica[
                              index % coloresGrafica.length
                            ]
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </article>

            <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Participación por cantidad de ventas
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Distribución de operaciones entre los meseros principales.
                </p>
              </div>

              {totalVentas > 0 ? (
                <div className="relative mt-4 h-[320px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={datosGraficaCantidad}
                        dataKey="cantidadVentas"
                        nameKey="nombreCompleto"
                        cx="50%"
                        cy="50%"
                        innerRadius={62}
                        outerRadius={96}
                        paddingAngle={3}
                      >
                        {datosGraficaCantidad.map((vendedor, index) => (
                          <Cell
                            key={`${vendedor.idPerfil}-${index}`}
                            fill={
                              coloresGrafica[
                                index % coloresGrafica.length
                              ]
                            }
                          />
                        ))}
                      </Pie>

                      <Tooltip
                        content={
                          <TooltipVendedor tipo="cantidad" />
                        }
                      />

                      <Legend
                        formatter={(valor) =>
                          recortarTexto(String(valor), 24)
                        }
                      />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">
                        {mostrarNumero(totalVentas)}
                      </p>

                      <p className="text-xs text-gray-500">
                        Ventas
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className="
                    mt-5 flex h-[330px] flex-col items-center
                    justify-center rounded-xl border border-dashed
                    border-gray-300
                  "
                >
                  <Users
                    size={38}
                    className="text-gray-300"
                  />

                  <p className="mt-3 font-semibold text-gray-600">
                    Sin ventas registradas
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
                    Ranking detallado de meseros
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Rendimiento comercial agrupado por mesero o vendedor.
                  </p>
                </div>
              </div>
            </div>

            {vendedoresOrdenados.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-[1050px] w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-5 py-4 text-center text-xs font-bold uppercase tracking-wide text-gray-500">
                        Posición
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                        Mesero
                      </th>

                      <th className="px-5 py-4 text-center text-xs font-bold uppercase tracking-wide text-gray-500">
                        Ventas
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-gray-500">
                        Subtotal
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-gray-500">
                        Descuentos
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-gray-500">
                        Total vendido
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-gray-500">
                        Ticket promedio
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-gray-500">
                        Participación
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {vendedoresOrdenados.map((vendedor, index) => {
                      const nombreCompleto = `${vendedor.nombres ?? ""} ${
                        vendedor.apellidos ?? ""
                      }`.trim();

                      const totalMesero = convertirNumero(
                        vendedor.totalVendido
                      );

                      const participacion =
                        totalVendido > 0
                          ? (totalMesero / totalVendido) * 100
                          : 0;

                      return (
                        <tr
                          key={vendedor.idPerfil || index}
                          className="transition hover:bg-gray-50"
                        >
                          <td className="px-5 py-4">
                            <div className="flex justify-center">
                              <IconoPosicion posicion={index + 1} />
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <div>
                              <p className="font-semibold text-gray-900">
                                {nombreCompleto || "Sin nombre"}
                              </p>

                              <p className="mt-1 text-sm text-gray-500">
                                {vendedor.email || "Sin correo"}
                              </p>
                            </div>
                          </td>

                          <td className="px-5 py-4 text-center font-bold text-gray-900">
                            {mostrarNumero(vendedor.cantidadVentas)}
                          </td>

                          <td className="px-5 py-4 text-right text-gray-700">
                            {mostrarMoneda(vendedor.subtotal)}
                          </td>

                          <td className="px-5 py-4 text-right text-amber-700">
                            {mostrarMoneda(vendedor.descuento)}
                          </td>

                          <td className="px-5 py-4 text-right font-bold text-emerald-700">
                            {mostrarMoneda(vendedor.totalVendido)}
                          </td>

                          <td className="px-5 py-4 text-right text-gray-700">
                            {mostrarMoneda(vendedor.ticketPromedio)}
                          </td>

                          <td className="px-5 py-4 text-right">
                            <span
                              className={`
                                inline-flex rounded-full px-3 py-1
                                text-xs font-semibold
                                ${
                                  participacion >= 30
                                    ? "bg-emerald-100 text-emerald-700"
                                    : participacion >= 15
                                      ? "bg-amber-100 text-amber-700"
                                      : "bg-gray-100 text-gray-700"
                                }
                              `}
                            >
                              {mostrarPorcentaje(participacion)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>

                  <tfoot className="bg-gray-900 text-white">
                    <tr>
                      <td
                        colSpan={2}
                        className="px-5 py-4 font-bold"
                      >
                        Total
                      </td>

                      <td className="px-5 py-4 text-center font-bold">
                        {mostrarNumero(totalVentas)}
                      </td>

                      <td className="px-5 py-4 text-right font-bold">
                        {mostrarMoneda(totalSubtotal)}
                      </td>

                      <td className="px-5 py-4 text-right font-bold text-amber-300">
                        {mostrarMoneda(totalDescuentos)}
                      </td>

                      <td className="px-5 py-4 text-right font-bold text-emerald-400">
                        {mostrarMoneda(totalVendido)}
                      </td>

                      <td className="px-5 py-4 text-right font-bold">
                        {mostrarMoneda(ticketPromedioGeneral)}
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
                  No existen ventas por mesero
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Cambia el rango de fechas o registra nuevas ventas.
                </p>
              </div>
            )}
          </article>

          {isFetching && (
            <div
              className="
                fixed bottom-5 right-5 z-50 flex items-center
                gap-3 rounded-xl bg-gray-900 px-4 py-3
                text-sm font-semibold text-white shadow-xl
              "
            >
              <LoaderCircle
                size={18}
                className="animate-spin"
              />

              Actualizando meseros...
            </div>
          )}
        </section>
      </main>
    </div>
  );
}