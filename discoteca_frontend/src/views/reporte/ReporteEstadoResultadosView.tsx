import {
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
  ArrowDownRight,
  ArrowUpRight,
  BanknoteArrowDown,
  CalendarDays,
  CircleDollarSign,
  Download,
  FileBarChart,
  LoaderCircle,
  Percent,
  Printer,
  ReceiptText,
  RefreshCcw,
  RotateCcw,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
  WalletCards,
} from "lucide-react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getSucursalById } from '@/api/SucursalApi'
import type { SucursalType } from '@/types/SucursalType'
import MenuList from "@/components/MenuList";

import {
  getReporteEstadoResultados,
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

const formatoPorcentaje = new Intl.NumberFormat("es-BO", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

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
  return `${formatoPorcentaje.format(convertirNumero(valor))}%`;
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

/* =====================================================
   TIPOS AUXILIARES
===================================================== */

type VarianteTarjeta =
  | "normal"
  | "positivo"
  | "negativo"
  | "principal"
  | "advertencia";

type TarjetaResultadoProps = {
  titulo: string;
  valor: string;
  descripcion: string;
  icono: React.ElementType;
  variante?: VarianteTarjeta;
};

type FilaResultadoProps = {
  titulo: string;
  valor: number;
  tipo?:
    | "ingreso"
    | "resta"
    | "resultado"
    | "resultado-final";
};

type TooltipGraficaProps = {
  active?: boolean;
  payload?: Array<{
    value?: number;
    payload?: {
      nombre?: string;
      valor?: number;
      tipo?: string;
    };
  }>;
};

/* =====================================================
   TARJETA DE RESULTADO
===================================================== */

function TarjetaResultado({
  titulo,
  valor,
  descripcion,
  icono: Icono,
  variante = "normal",
}: TarjetaResultadoProps) {
  const estilos = {
    normal: {
      borde: "border-gray-200",
      icono: "bg-gray-100 text-gray-700",
      valor: "text-gray-900",
    },

    positivo: {
      borde: "border-emerald-200",
      icono: "bg-emerald-100 text-emerald-700",
      valor: "text-emerald-700",
    },

    negativo: {
      borde: "border-red-200",
      icono: "bg-red-100 text-red-700",
      valor: "text-red-700",
    },

    principal: {
      borde: "border-gray-900",
      icono: "bg-gray-900 text-white",
      valor: "text-gray-900",
    },

    advertencia: {
      borde: "border-amber-200",
      icono: "bg-amber-100 text-amber-700",
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
              mt-3 truncate text-2xl font-bold sm:text-3xl
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
   FILA DEL ESTADO DE RESULTADOS
===================================================== */

function FilaResultado({
  titulo,
  valor,
  tipo = "ingreso",
}: FilaResultadoProps) {
  const esResta = tipo === "resta";
  const esResultado = tipo === "resultado";
  const esResultadoFinal = tipo === "resultado-final";

  return (
    <div
      className={`
        flex items-center justify-between gap-4 px-4 py-4 sm:px-5
        ${
          esResultadoFinal
            ? "bg-gray-900 text-white"
            : esResultado
              ? "bg-gray-50"
              : "bg-white"
        }
      `}
    >
      <div className="flex min-w-0 items-center gap-3">
        {esResta ? (
          <ArrowDownRight
            size={18}
            className="shrink-0 text-red-500"
          />
        ) : esResultadoFinal ? (
          valor >= 0 ? (
            <TrendingUp
              size={18}
              className="shrink-0 text-emerald-400"
            />
          ) : (
            <TrendingDown
              size={18}
              className="shrink-0 text-red-400"
            />
          )
        ) : (
          <ArrowUpRight
            size={18}
            className="shrink-0 text-emerald-600"
          />
        )}

        <span
          className={`
            text-sm sm:text-base
            ${
              esResultado || esResultadoFinal
                ? "font-bold"
                : "font-medium"
            }
            ${
              esResultadoFinal
                ? "text-white"
                : "text-gray-700"
            }
          `}
        >
          {titulo}
        </span>
      </div>

      <span
        className={`
          whitespace-nowrap text-sm sm:text-base
          ${
            esResultado || esResultadoFinal
              ? "font-bold"
              : "font-semibold"
          }
          ${
            esResultadoFinal
              ? valor >= 0
                ? "text-emerald-400"
                : "text-red-400"
              : esResta
                ? "text-red-600"
                : "text-gray-900"
          }
        `}
      >
        {esResta ? "- " : ""}
        {mostrarMoneda(Math.abs(valor))}
      </span>
    </div>
  );
}

/* =====================================================
   TOOLTIP DE GRÁFICA
===================================================== */

function TooltipGrafica({
  active,
  payload,
}: TooltipGraficaProps) {
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
        {mostrarMoneda(item?.valor)}
      </p>
    </div>
  );
}

/* =====================================================
   SKELETON
===================================================== */

function EstadoResultadosSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div>
        <div className="h-8 w-80 max-w-full rounded bg-gray-200" />
        <div className="mt-3 h-4 w-96 max-w-full rounded bg-gray-100" />
      </div>

      <div className="h-28 rounded-2xl border bg-white" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="h-40 rounded-2xl border bg-white"
          />
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <div className="h-[430px] rounded-2xl border bg-white" />
        <div className="h-[430px] rounded-2xl border bg-white" />
      </div>
    </div>
  );
}

/* =====================================================
   VISTA PRINCIPAL
===================================================== */

export default function ReporteEstadoResultadosView() {
  const { sucursalId } = useParams<{
    sucursalId: string;
  }>();

  const { data:suc } = useQuery<SucursalType>({
      queryKey: ['sucursal', sucursalId],
      queryFn: () => getSucursalById(sucursalId),
      retry: false
    })
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
      "reporte-estado-resultados",
      sucursalId,
      fechaDesde,
      fechaHasta,
    ],

    queryFn: () =>
      getReporteEstadoResultados({
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

  const estado = data?.estadoResultados;

  const ventasBrutas = convertirNumero(estado?.ventasBrutas);
  const descuentos = convertirNumero(estado?.descuentos);
  const ventasNetas = convertirNumero(estado?.ventasNetas);
  const costoVentas = convertirNumero(estado?.costoVentas);
  const utilidadBruta = convertirNumero(estado?.utilidadBruta);
  const egresosOperativos = convertirNumero(
    estado?.egresosOperativos
  );
  const utilidadNeta = convertirNumero(estado?.utilidadNeta);
  const margenNetoPorcentaje = convertirNumero(
    estado?.margenNetoPorcentaje
  );
  const cantidadVentas = convertirNumero(estado?.cantidadVentas);
  const cantidadEgresos = convertirNumero(estado?.cantidadEgresos);

  const datosGrafica = useMemo(
    () => [
      {
        nombre: "Ventas brutas",
        valor: ventasBrutas,
        tipo: "ingreso",
      },
      {
        nombre: "Ventas netas",
        valor: ventasNetas,
        tipo: "ingreso",
      },
      {
        nombre: "Costo ventas",
        valor: costoVentas,
        tipo: "egreso",
      },
      {
        nombre: "Utilidad bruta",
        valor: utilidadBruta,
        tipo: utilidadBruta >= 0 ? "utilidad" : "perdida",
      },
      {
        nombre: "Egresos",
        valor: egresosOperativos,
        tipo: "egreso",
      },
      {
        nombre: "Utilidad neta",
        valor: utilidadNeta,
        tipo: utilidadNeta >= 0 ? "utilidad" : "perdida",
      },
    ],
    [
      ventasBrutas,
      ventasNetas,
      costoVentas,
      utilidadBruta,
      egresosOperativos,
      utilidadNeta,
    ]
  );

  function obtenerColorBarra(tipo: string): string {
    switch (tipo) {
      case "ingreso":
        return "#111827";

      case "egreso":
        return "#ef4444";

      case "utilidad":
        return "#10b981";

      case "perdida":
        return "#dc2626";

      default:
        return "#6b7280";
    }
  }

  const generarReportePDF = (
    modo: "descargar" | "imprimir" = "descargar"
  ) => {
    if (!data?.estadoResultados || !sucursalId) {
      return;
    }

    const documento = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const anchoPagina = documento.internal.pageSize.getWidth();
    const altoPagina = documento.internal.pageSize.getHeight();

    const margenIzquierdo = 15;
    const margenDerecho = 15;

    
    const nombreSucursal = `Sucursal ${suc.nombreSucursal}`;

    const periodoDesde = fechaDesde
      ? formatearFechaDocumento(fechaDesde)
      : "Inicio de registros";

    const periodoHasta = fechaHasta
      ? formatearFechaDocumento(fechaHasta)
      : "Fecha actual";

    const utilidadPositiva = utilidadNeta >= 0;

    /* ENCABEZADO */

    documento.setFillColor(17, 24, 39);
    documento.rect(0, 0, anchoPagina, 38, "F");

    documento.setTextColor(255, 255, 255);
    documento.setFont("helvetica", "bold");
    documento.setFontSize(18);

    documento.text(
      "ESTADO DE RESULTADOS",
      margenIzquierdo,
      16
    );

    documento.setFont("helvetica", "normal");
    documento.setFontSize(10);

    documento.text(
      "Reporte financiero de la sucursal",
      margenIzquierdo,
      23
    );

    documento.setFontSize(9);

    documento.text(
      nombreSucursal,
      anchoPagina - margenDerecho,
      15,
      {
        align: "right",
      }
    );

    documento.text(
      `Generado: ${formatearFechaHoraActual()}`,
      anchoPagina - margenDerecho,
      22,
      {
        align: "right",
      }
    );

    documento.text(
      `Periodo: ${periodoDesde} al ${periodoHasta}`,
      anchoPagina - margenDerecho,
      29,
      {
        align: "right",
      }
    );

    /* INFORMACIÓN GENERAL */

    documento.setTextColor(31, 41, 55);
    documento.setFont("helvetica", "bold");
    documento.setFontSize(11);

    documento.text(
      "Información general",
      margenIzquierdo,
      49
    );

    autoTable(documento, {
      startY: 54,

      margin: {
        left: margenIzquierdo,
        right: margenDerecho,
      },

      head: [["Concepto", "Detalle"]],

      body: [
        ["Sucursal", nombreSucursal],
        ["Periodo inicial", periodoDesde],
        ["Periodo final", periodoHasta],
        ["Cantidad de ventas", mostrarNumero(cantidadVentas)],
        ["Cantidad de egresos", mostrarNumero(cantidadEgresos)],
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
          cellWidth: 55,
          fontStyle: "bold",
        },

        1: {
          halign: "right",
        },
      },
    });

    const posicionInformacion =
      (
        documento as jsPDF & {
          lastAutoTable?: {
            finalY: number;
          };
        }
      ).lastAutoTable?.finalY ?? 90;

    /* DETALLE CONTABLE */

    documento.setFont("helvetica", "bold");
    documento.setFontSize(11);

    documento.text(
      "Detalle del estado de resultados",
      margenIzquierdo,
      posicionInformacion + 11
    );

    autoTable(documento, {
      startY: posicionInformacion + 16,

      margin: {
        left: margenIzquierdo,
        right: margenDerecho,
      },

      head: [["Concepto contable", "Importe"]],

      body: [
        ["Ventas brutas", mostrarMoneda(ventasBrutas)],
        ["(-) Descuentos", mostrarMoneda(descuentos)],
        ["Ventas netas", mostrarMoneda(ventasNetas)],
        ["(-) Costo de ventas", mostrarMoneda(costoVentas)],
        ["Utilidad bruta", mostrarMoneda(utilidadBruta)],
        ["(-) Egresos operativos", mostrarMoneda(egresosOperativos)],
        [
          utilidadPositiva ? "UTILIDAD NETA" : "PÉRDIDA NETA",
          mostrarMoneda(utilidadNeta),
        ],
        ["Margen neto", mostrarPorcentaje(margenNetoPorcentaje)],
      ],

      theme: "plain",

      styles: {
        font: "helvetica",
        fontSize: 10,
        cellPadding: 3.6,
        textColor: [31, 41, 55],
        lineColor: [209, 213, 219],
        lineWidth: 0.2,
      },

      headStyles: {
        fillColor: [17, 24, 39],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        cellPadding: 4,
      },

      columnStyles: {
        0: {
          cellWidth: 120,
        },

        1: {
          halign: "right",
          fontStyle: "bold",
        },
      },

      didParseCell: (hookData) => {
        if (hookData.section !== "body") {
          return;
        }

        const fila = hookData.row.index;

        if (fila === 2 || fila === 4) {
          hookData.cell.styles.fillColor = [249, 250, 251];
          hookData.cell.styles.fontStyle = "bold";
        }

        if (fila === 6) {
          hookData.cell.styles.fillColor = utilidadPositiva
            ? [220, 252, 231]
            : [254, 226, 226];

          hookData.cell.styles.textColor = utilidadPositiva
            ? [21, 128, 61]
            : [185, 28, 28];

          hookData.cell.styles.fontStyle = "bold";
        }
      },
    });

    const posicionEstadoResultados =
      (
        documento as jsPDF & {
          lastAutoTable?: {
            finalY: number;
          };
        }
      ).lastAutoTable?.finalY ?? 190;

    /* INTERPRETACIÓN */

    let posicionInterpretacion = posicionEstadoResultados + 12;

    if (posicionInterpretacion > altoPagina - 65) {
      documento.addPage();
      posicionInterpretacion = 20;
    }

    documento.setFont("helvetica", "bold");
    documento.setFontSize(11);
    documento.setTextColor(31, 41, 55);

    documento.text(
      "Interpretación financiera",
      margenIzquierdo,
      posicionInterpretacion
    );

    const interpretaciones: string[] = [];

    if (ventasNetas > 0) {
      interpretaciones.push(
        `La sucursal registró ventas netas por ${mostrarMoneda(
          ventasNetas
        )}.`
      );
    } else {
      interpretaciones.push(
        "La sucursal no registró ventas netas durante el periodo seleccionado."
      );
    }

    if (utilidadNeta > 0) {
      interpretaciones.push(
        `El resultado final representa una utilidad neta de ${mostrarMoneda(
          utilidadNeta
        )}, equivalente a un margen neto de ${mostrarPorcentaje(
          margenNetoPorcentaje
        )}.`
      );
    } else if (utilidadNeta < 0) {
      interpretaciones.push(
        `El resultado final representa una pérdida neta de ${mostrarMoneda(
          Math.abs(utilidadNeta)
        )}. Se recomienda revisar costos de venta, descuentos y egresos operativos.`
      );
    } else {
      interpretaciones.push(
        "El resultado financiero del periodo se encuentra en punto de equilibrio."
      );
    }

    if (descuentos > ventasBrutas * 0.1 && ventasBrutas > 0) {
      interpretaciones.push(
        "Los descuentos superan el 10% de las ventas brutas. Conviene revisar las políticas de descuentos aplicadas."
      );
    }

    if (egresosOperativos > utilidadBruta && utilidadBruta > 0) {
      interpretaciones.push(
        "Los egresos operativos son superiores a la utilidad bruta, reduciendo significativamente la rentabilidad de la sucursal."
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

    /* FIRMAS */

    if (posicionTexto > altoPagina - 45) {
      documento.addPage();
      posicionTexto = 35;
    } else {
      posicionTexto += 15;
    }

    documento.setDrawColor(156, 163, 175);

    documento.line(
      margenIzquierdo,
      posicionTexto,
      margenIzquierdo + 70,
      posicionTexto
    );

    documento.line(
      anchoPagina - margenDerecho - 70,
      posicionTexto,
      anchoPagina - margenDerecho,
      posicionTexto
    );

    documento.setFontSize(8.5);
    documento.setTextColor(75, 85, 99);

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
      anchoPagina - margenDerecho - 35,
      posicionTexto + 5,
      {
        align: "center",
      }
    );

    /* PIE DE PÁGINA */

    const totalPaginas = documento.getNumberOfPages();

    for (let pagina = 1; pagina <= totalPaginas; pagina++) {
      documento.setPage(pagina);

      documento.setDrawColor(229, 231, 235);

      documento.line(
        margenIzquierdo,
        altoPagina - 15,
        anchoPagina - margenDerecho,
        altoPagina - 15
      );

      documento.setFont("helvetica", "normal");
      documento.setFontSize(8);
      documento.setTextColor(107, 114, 128);

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

    const nombreArchivo = limpiarNombreArchivo(
      `estado_resultados_${sucursalId}_${fechaDesde || "inicio"}_${fechaHasta || "actual"}`
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
          <EstadoResultadosSkeleton />
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
                  No se pudo cargar el estado de resultados
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

          <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gray-900 text-white">
                <FileBarChart size={24} />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  Estado de resultados
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Consulta ingresos, costos, egresos y utilidad generada por la sucursal.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:flex sm:items-center">
              <button
                type="button"
                onClick={() => generarReportePDF("descargar")}
                disabled={isFetching || !data?.estadoResultados}
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
                disabled={isFetching || !data?.estadoResultados}
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

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <CalendarDays
                size={20}
                className="text-gray-700"
              />

              <div>
                <h2 className="font-bold text-gray-900">
                  Periodo del reporte
                </h2>

                <p className="text-sm text-gray-500">
                  Selecciona un rango de fechas para analizar los resultados.
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
                {fechaDesde ? ` desde ${fechaDesde}` : ""}
                {fechaHasta ? ` hasta ${fechaHasta}` : ""}.
              </div>
            )}
          </div>

          {/* TARJETAS */}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <TarjetaResultado
              titulo="Ventas brutas"
              valor={mostrarMoneda(ventasBrutas)}
              descripcion="Monto total vendido antes de descuentos."
              icono={ShoppingCart}
              variante="principal"
            />

            <TarjetaResultado
              titulo="Descuentos"
              valor={mostrarMoneda(descuentos)}
              descripcion="Descuentos aplicados durante el periodo."
              icono={Percent}
              variante={descuentos > 0 ? "advertencia" : "normal"}
            />

            <TarjetaResultado
              titulo="Ventas netas"
              valor={mostrarMoneda(ventasNetas)}
              descripcion="Ingresos después de descontar rebajas."
              icono={ReceiptText}
              variante="positivo"
            />

            <TarjetaResultado
              titulo="Costo de ventas"
              valor={mostrarMoneda(costoVentas)}
              descripcion="Costo de los productos que fueron vendidos."
              icono={WalletCards}
              variante={costoVentas > 0 ? "advertencia" : "normal"}
            />

            <TarjetaResultado
              titulo="Utilidad bruta"
              valor={mostrarMoneda(utilidadBruta)}
              descripcion="Ventas netas menos el costo de ventas."
              icono={TrendingUp}
              variante={utilidadBruta >= 0 ? "positivo" : "negativo"}
            />

            <TarjetaResultado
              titulo="Egresos operativos"
              valor={mostrarMoneda(egresosOperativos)}
              descripcion="Gastos operativos registrados en la sucursal."
              icono={BanknoteArrowDown}
              variante={egresosOperativos > 0 ? "advertencia" : "normal"}
            />

            <TarjetaResultado
              titulo="Utilidad neta"
              valor={mostrarMoneda(utilidadNeta)}
              descripcion="Resultado final después de costos y egresos."
              icono={utilidadNeta >= 0 ? TrendingUp : TrendingDown}
              variante={utilidadNeta >= 0 ? "positivo" : "negativo"}
            />

            <TarjetaResultado
              titulo="Margen neto"
              valor={mostrarPorcentaje(margenNetoPorcentaje)}
              descripcion="Porcentaje de utilidad respecto a ventas netas."
              icono={Percent}
              variante={
                margenNetoPorcentaje >= 0 ? "positivo" : "negativo"
              }
            />
          </div>

          {/* GRÁFICA Y DETALLE */}

          <div className="grid gap-5 xl:grid-cols-2">
            <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Composición financiera
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Comparación de ingresos, costos y resultados.
                  </p>
                </div>

                <CircleDollarSign
                  size={22}
                  className="shrink-0 text-gray-500"
                />
              </div>

              <div className="h-[360px] w-full">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <BarChart
                    data={datosGrafica}
                    margin={{
                      top: 25,
                      right: 10,
                      left: 0,
                      bottom: 25,
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
                      angle={-20}
                      textAnchor="end"
                      height={70}
                      tick={{
                        fontSize: 11,
                      }}
                    />

                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      width={78}
                      tickFormatter={(valor) =>
                        `Bs ${formatoNumero.format(
                          convertirNumero(valor)
                        )}`
                      }
                    />

                    <Tooltip content={<TooltipGrafica />} />

                    <Bar
                      dataKey="valor"
                      radius={[8, 8, 0, 0]}
                      maxBarSize={60}
                    >
                      {datosGrafica.map((item, index) => (
                        <Cell
                          key={`${item.nombre}-${index}`}
                          fill={obtenerColorBarra(item.tipo)}
                        />
                      ))}

                      <LabelList
                        dataKey="valor"
                        position="top"
                        formatter={(valor: number | string) =>
                          mostrarNumero(valor)
                        }
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                        }}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </article>

            <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-100 p-5">
                <h2 className="text-lg font-bold text-gray-900">
                  Detalle del resultado
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Estructura financiera del periodo seleccionado.
                </p>
              </div>

              <div className="divide-y divide-gray-100">
                <FilaResultado
                  titulo="Ventas brutas"
                  valor={ventasBrutas}
                />

                <FilaResultado
                  titulo="Descuentos"
                  valor={descuentos}
                  tipo="resta"
                />

                <FilaResultado
                  titulo="Ventas netas"
                  valor={ventasNetas}
                  tipo="resultado"
                />

                <FilaResultado
                  titulo="Costo de ventas"
                  valor={costoVentas}
                  tipo="resta"
                />

                <FilaResultado
                  titulo="Utilidad bruta"
                  valor={utilidadBruta}
                  tipo="resultado"
                />

                <FilaResultado
                  titulo="Egresos operativos"
                  valor={egresosOperativos}
                  tipo="resta"
                />

                <FilaResultado
                  titulo="Utilidad neta"
                  valor={utilidadNeta}
                  tipo="resultado-final"
                />
              </div>
            </article>
          </div>

          {/* RESUMEN OPERATIVO */}

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                  <ShoppingCart size={20} />
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Cantidad de ventas
                  </p>

                  <p className="text-xl font-bold text-gray-900">
                    {mostrarNumero(cantidadVentas)}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                  <BanknoteArrowDown size={20} />
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Cantidad de egresos
                  </p>

                  <p className="text-xl font-bold text-gray-900">
                    {mostrarNumero(cantidadEgresos)}
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`
                rounded-2xl border bg-white p-5 shadow-sm
                ${
                  utilidadNeta >= 0
                    ? "border-emerald-200"
                    : "border-red-200"
                }
              `}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`
                    flex h-10 w-10 items-center justify-center rounded-xl
                    ${
                      utilidadNeta >= 0
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }
                  `}
                >
                  {utilidadNeta >= 0 ? (
                    <TrendingUp size={20} />
                  ) : (
                    <TrendingDown size={20} />
                  )}
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Situación financiera
                  </p>

                  <p
                    className={`
                      text-xl font-bold
                      ${
                        utilidadNeta >= 0
                          ? "text-emerald-700"
                          : "text-red-700"
                      }
                    `}
                  >
                    {utilidadNeta >= 0 ? "Ganancia" : "Pérdida"}
                  </p>
                </div>
              </div>
            </div>
          </div>

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

              Actualizando resultados...
            </div>
          )}
        </section>
      </main>
    </div>
  );
}