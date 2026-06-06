import {
  type ElementType,
  useMemo,
  useState,
} from "react";

import { useParams } from "react-router-dom";

import { useQuery } from "@tanstack/react-query";

import {
  AlertTriangle,
  ArrowDownToLine,
  ArrowRightLeft,
  ArrowUpFromLine,
  Boxes,
  CalendarDays,
  CircleDollarSign,
  Download,
  FileBarChart,
  Filter,
  History,
  LoaderCircle,
  Package,
  Printer,
  RefreshCcw,
  RotateCcw,
  Search,
  TrendingDown,
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
  getReporteKardex,
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

function formatearFecha(fecha?: string): string {
  if (!fecha) {
    return "-";
  }

  const valor = new Date(fecha);

  if (Number.isNaN(valor.getTime())) {
    return fecha;
  }

  return valor.toLocaleDateString("es-BO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatearFechaHora(fecha?: string): string {
  if (!fecha) {
    return "-";
  }

  const valor = new Date(fecha);

  if (Number.isNaN(valor.getTime())) {
    return fecha;
  }

  return valor.toLocaleString("es-BO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
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

function normalizarTipoMovimiento(tipo?: string): string {
  if (!tipo) {
    return "Sin especificar";
  }

  return tipo
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (letra) => letra.toUpperCase());
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

type TipoMovimientoFiltro =
  | ""
  | "ENTRADA"
  | "SALIDA"
  | "AJUSTE_ENTRADA"
  | "AJUSTE_SALIDA"
  | "TRANSFERENCIA_ENTRADA"
  | "TRANSFERENCIA_SALIDA";

type VarianteTarjeta =
  | "normal"
  | "principal"
  | "positivo"
  | "negativo"
  | "advertencia"
  | "informativo";

type TarjetaIndicadorProps = {
  titulo: string;
  valor: string;
  descripcion: string;
  icono: ElementType;
  variante?: VarianteTarjeta;
};

type KardexMovimiento = {
  _id: string;

  fecha: string;

  tipoMovimiento: string;

  idProducto: string;
  nombreProducto: string;
  marca?: string;

  idAlmacen: string;
  nombreAlmacen: string;

  cantidadEntrada: number;
  cantidadSalida: number;

  saldoAnterior: number;
  saldoActual: number;

  costoUnitario: number;
  costoTotal: number;

  motivo?: string;
  referencia?: string;
  observacion?: string;

  creadoPor?: {
    _id?: string;
    nombres?: string;
    apellidos?: string;
  } | string;
};

type DatoGraficaPeriodo = {
  periodo: string;
  entrada: number;
  salida: number;
};

type DatoGraficaTipo = {
  nombre: string;
  cantidad: number;
  color: string;
};

type TooltipPeriodoProps = {
  active?: boolean;
  payload?: Array<{
    name?: string;
    value?: number;
    payload?: DatoGraficaPeriodo;
  }>;
  label?: string;
};

type TooltipTipoProps = {
  active?: boolean;
  payload?: Array<{
    value?: number;
    payload?: DatoGraficaTipo;
  }>;
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

    negativo: {
      borde: "border-red-200",
      icono: "bg-red-100 text-red-700",
      valor: "text-red-700",
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
        rounded-2xl border bg-white p-5 shadow-sm
        transition duration-200 hover:-translate-y-0.5
        hover:shadow-md ${estilo.borde}
      `}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-500">
            {titulo}
          </p>

          <p
            className={`
              mt-3 break-words text-2xl font-bold
              sm:text-3xl ${estilo.valor}
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
            justify-center rounded-xl ${estilo.icono}
          `}
        >
          <Icono size={21} />
        </div>
      </div>
    </article>
  );
}

/* =====================================================
   BADGE DE MOVIMIENTO
===================================================== */

function TipoMovimientoBadge({
  tipo,
}: {
  tipo: string;
}) {
  const tipoNormalizado = tipo.toUpperCase();

  const esEntrada =
    tipoNormalizado.includes("ENTRADA");

  const esSalida =
    tipoNormalizado.includes("SALIDA");

  if (esEntrada) {
    return (
      <span
        className="
          inline-flex items-center gap-1.5 rounded-full
          bg-emerald-100 px-3 py-1 text-xs
          font-semibold text-emerald-700
        "
      >
        <ArrowDownToLine size={13} />

        {normalizarTipoMovimiento(tipo)}
      </span>
    );
  }

  if (esSalida) {
    return (
      <span
        className="
          inline-flex items-center gap-1.5 rounded-full
          bg-red-100 px-3 py-1 text-xs
          font-semibold text-red-700
        "
      >
        <ArrowUpFromLine size={13} />

        {normalizarTipoMovimiento(tipo)}
      </span>
    );
  }

  return (
    <span
      className="
        inline-flex items-center gap-1.5 rounded-full
        bg-blue-100 px-3 py-1 text-xs
        font-semibold text-blue-700
      "
    >
      <ArrowRightLeft size={13} />

      {normalizarTipoMovimiento(tipo)}
    </span>
  );
}

/* =====================================================
   TOOLTIP GRÁFICA DE PERIODO
===================================================== */

function TooltipPeriodo({
  active,
  payload,
  label,
}: TooltipPeriodoProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const entrada =
    payload.find(
      (item) => item.name === "Entradas"
    )?.value ?? 0;

  const salida =
    payload.find(
      (item) => item.name === "Salidas"
    )?.value ?? 0;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-lg">
      <p className="text-sm font-semibold text-gray-900">
        {label}
      </p>

      <p className="mt-2 text-sm text-emerald-700">
        Entradas:{" "}
        <strong>{mostrarNumero(entrada)}</strong>
      </p>

      <p className="mt-1 text-sm text-red-700">
        Salidas:{" "}
        <strong>{mostrarNumero(salida)}</strong>
      </p>
    </div>
  );
}

/* =====================================================
   TOOLTIP GRÁFICA POR TIPO
===================================================== */

function TooltipTipo({
  active,
  payload,
}: TooltipTipoProps) {
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
        {mostrarNumero(item?.cantidad)} movimientos
      </p>
    </div>
  );
}

/* =====================================================
   SKELETON
===================================================== */

function ReporteKardexSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div>
        <div className="h-8 w-80 max-w-full rounded bg-gray-200" />

        <div className="mt-3 h-4 w-96 max-w-full rounded bg-gray-100" />
      </div>

      <div className="h-44 rounded-2xl border bg-white" />

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

      <div className="h-[450px] rounded-2xl border bg-white" />
    </div>
  );
}

/* =====================================================
   VISTA PRINCIPAL
===================================================== */

export default function ReporteKardexView() {
  const { sucursalId } = useParams<{
    sucursalId: string;
  }>();

  const [fechaDesde, setFechaDesde] =
    useState("");

  const [fechaHasta, setFechaHasta] =
    useState("");

  const [busqueda, setBusqueda] =
    useState("");

  const [
    productoSeleccionado,
    setProductoSeleccionado,
  ] = useState("");

  const [
    almacenSeleccionado,
    setAlmacenSeleccionado,
  ] = useState("");

  const [
    tipoMovimiento,
    setTipoMovimiento,
  ] = useState<TipoMovimientoFiltro>("");

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: [
      "reporte-kardex",
      sucursalId,
      fechaDesde,
      fechaHasta,
      productoSeleccionado,
      almacenSeleccionado,
      tipoMovimiento,
    ],

    queryFn: () =>
      getReporteKardex({
        idSucursal: sucursalId,
        fechaDesde:
          fechaDesde || undefined,
        fechaHasta:
          fechaHasta || undefined,
        idProducto:
          productoSeleccionado ||
          undefined,
        idAlmacen:
          almacenSeleccionado ||
          undefined,
        tipoMovimiento:
          tipoMovimiento || undefined,
      }),

    enabled: Boolean(sucursalId),

    staleTime: 1000 * 60 * 2,

    refetchOnWindowFocus: false,
  });

const movimientos =
  (data?.movimientos ?? []) as KardexMovimiento[];
  /* =====================================================
     LISTAS PARA FILTROS
  ===================================================== */

  const productos = useMemo(() => {
    const mapa = new Map<string, string>();

    movimientos.forEach((movimiento) => {
      if (movimiento.idProducto) {
        mapa.set(
          movimiento.idProducto,
          movimiento.nombreProducto ||
            "Producto sin nombre"
        );
      }
    });

    return Array.from(mapa.entries())
      .map(([id, nombre]) => ({
        id,
        nombre,
      }))
      .sort((a, b) =>
        a.nombre.localeCompare(b.nombre)
      );
  }, [movimientos]);

  const almacenes = useMemo(() => {
    const mapa = new Map<string, string>();

    movimientos.forEach((movimiento) => {
      if (movimiento.idAlmacen) {
        mapa.set(
          movimiento.idAlmacen,
          movimiento.nombreAlmacen ||
            "Almacén sin nombre"
        );
      }
    });

    return Array.from(mapa.entries())
      .map(([id, nombre]) => ({
        id,
        nombre,
      }))
      .sort((a, b) =>
        a.nombre.localeCompare(b.nombre)
      );
  }, [movimientos]);

  /* =====================================================
     FILTRO LOCAL
  ===================================================== */

  const movimientosFiltrados = useMemo(() => {
    const texto = busqueda
      .trim()
      .toLowerCase();

    return movimientos.filter(
      (movimiento) => {
        const coincideBusqueda =
          !texto ||
          movimiento.nombreProducto
            ?.toLowerCase()
            .includes(texto) ||
          movimiento.marca
            ?.toLowerCase()
            .includes(texto) ||
          movimiento.nombreAlmacen
            ?.toLowerCase()
            .includes(texto) ||
          movimiento.referencia
            ?.toLowerCase()
            .includes(texto) ||
          movimiento.motivo
            ?.toLowerCase()
            .includes(texto);

        return coincideBusqueda;
      }
    );
  }, [movimientos, busqueda]);

  /* =====================================================
     TOTALES
  ===================================================== */

  const totalEntradas =
    movimientosFiltrados.reduce(
      (acumulado, movimiento) =>
        acumulado +
        convertirNumero(
          movimiento.cantidadEntrada
        ),
      0
    );

  const totalSalidas =
    movimientosFiltrados.reduce(
      (acumulado, movimiento) =>
        acumulado +
        convertirNumero(
          movimiento.cantidadSalida
        ),
      0
    );

  const diferenciaNeta =
    totalEntradas - totalSalidas;

  const valorMovimientos =
    movimientosFiltrados.reduce(
      (acumulado, movimiento) =>
        acumulado +
        convertirNumero(
          movimiento.costoTotal
        ),
      0
    );

  const ultimoMovimiento =
    [...movimientosFiltrados].sort(
      (a, b) =>
        new Date(b.fecha).getTime() -
        new Date(a.fecha).getTime()
    )[0] ?? null;

  const saldoActual =
    convertirNumero(
      ultimoMovimiento?.saldoActual
    );

  /* =====================================================
     GRÁFICA POR FECHA
  ===================================================== */

  const datosPorFecha =
    useMemo<DatoGraficaPeriodo[]>(() => {
      const mapa = new Map<
        string,
        DatoGraficaPeriodo
      >();

      movimientosFiltrados.forEach(
        (movimiento) => {
          const periodo =
            formatearFecha(
              movimiento.fecha
            );

          const actual =
            mapa.get(periodo) ?? {
              periodo,
              entrada: 0,
              salida: 0,
            };

          actual.entrada +=
            convertirNumero(
              movimiento.cantidadEntrada
            );

          actual.salida +=
            convertirNumero(
              movimiento.cantidadSalida
            );

          mapa.set(periodo, actual);
        }
      );

      return Array.from(mapa.values()).slice(
        -15
      );
    }, [movimientosFiltrados]);

  /* =====================================================
     GRÁFICA POR TIPO
  ===================================================== */

  const colores = [
    "#10b981",
    "#ef4444",
    "#2563eb",
    "#f59e0b",
    "#8b5cf6",
    "#0891b2",
  ];

  const datosPorTipo =
    useMemo<DatoGraficaTipo[]>(() => {
      const mapa = new Map<string, number>();

      movimientosFiltrados.forEach(
        (movimiento) => {
          const nombre =
            normalizarTipoMovimiento(
              movimiento.tipoMovimiento
            );

          mapa.set(
            nombre,
            (mapa.get(nombre) ?? 0) + 1
          );
        }
      );

      return Array.from(mapa.entries()).map(
        ([nombre, cantidad], index) => ({
          nombre,
          cantidad,
          color:
            colores[index % colores.length],
        })
      );
    }, [movimientosFiltrados]);

  const limpiarFiltros = () => {
    setFechaDesde("");
    setFechaHasta("");
    setBusqueda("");
    setProductoSeleccionado("");
    setAlmacenSeleccionado("");
    setTipoMovimiento("");
  };

  /* =====================================================
     GENERAR PDF
  ===================================================== */

  const generarReportePDF = (
    modo: "descargar" | "imprimir" = "descargar"
  ) => {
    if (
      !sucursalId ||
      movimientosFiltrados.length === 0
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

    const periodoDesde = fechaDesde
      ? formatearFecha(fechaDesde)
      : "Inicio de registros";

    const periodoHasta = fechaHasta
      ? formatearFecha(fechaHasta)
      : "Fecha actual";

    /* ENCABEZADO */

    documento.setFillColor(17, 24, 39);

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
      "KARDEX DE INVENTARIO",
      margenIzquierdo,
      15
    );

    documento.setFont(
      "helvetica",
      "normal"
    );

    documento.setFontSize(10);

    documento.text(
      "Reporte de movimientos y saldos de inventario",
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

    /* RESUMEN */

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
      "Resumen de movimientos",
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
          "Movimientos",
          "Entradas",
          "Salidas",
          "Diferencia neta",
          "Saldo actual",
          "Valor movimientos",
        ],
      ],

      body: [
        [
          mostrarNumero(
            movimientosFiltrados.length
          ),
          mostrarNumero(totalEntradas),
          mostrarNumero(totalSalidas),
          mostrarNumero(diferenciaNeta),
          mostrarNumero(saldoActual),
          mostrarMoneda(valorMovimientos),
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

    /* TABLA KARDEX */

    documento.setFont(
      "helvetica",
      "bold"
    );

    documento.setFontSize(11);

    documento.text(
      "Detalle del Kardex",
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
          "Fecha",
          "Producto",
          "Almacén",
          "Movimiento",
          "Entrada",
          "Salida",
          "Saldo anterior",
          "Saldo actual",
          "Costo unit.",
          "Costo total",
          "Referencia",
        ],
      ],

      body: movimientosFiltrados.map(
        (movimiento) => [
          formatearFechaHora(
            movimiento.fecha
          ),

          movimiento.nombreProducto ||
            "Sin producto",

          movimiento.nombreAlmacen ||
            "Sin almacén",

          normalizarTipoMovimiento(
            movimiento.tipoMovimiento
          ),

          mostrarNumero(
            movimiento.cantidadEntrada
          ),

          mostrarNumero(
            movimiento.cantidadSalida
          ),

          mostrarNumero(
            movimiento.saldoAnterior
          ),

          mostrarNumero(
            movimiento.saldoActual
          ),

          mostrarMoneda(
            movimiento.costoUnitario
          ),

          mostrarMoneda(
            movimiento.costoTotal
          ),

          movimiento.referencia ||
            movimiento.motivo ||
            "-",
        ]
      ),

      theme: "grid",

      styles: {
        font: "helvetica",
        fontSize: 6.8,
        cellPadding: 2.1,
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
          cellWidth: 27,
        },

        1: {
          cellWidth: 39,
        },

        2: {
          cellWidth: 31,
        },

        3: {
          cellWidth: 31,
          halign: "center",
        },

        4: {
          cellWidth: 18,
          halign: "center",
        },

        5: {
          cellWidth: 18,
          halign: "center",
        },

        6: {
          cellWidth: 22,
          halign: "center",
        },

        7: {
          cellWidth: 22,
          halign: "center",
        },

        8: {
          cellWidth: 25,
          halign: "right",
        },

        9: {
          cellWidth: 26,
          halign: "right",
        },

        10: {
          cellWidth: 26,
        },
      },

      didParseCell: (hookData) => {
        if (
          hookData.section !== "body"
        ) {
          return;
        }

        if (hookData.column.index === 4) {
          const valor = convertirNumero(
            hookData.cell.raw as
              | string
              | number
          );

          if (valor > 0) {
            hookData.cell.styles.textColor =
              [4, 120, 87];

            hookData.cell.styles.fontStyle =
              "bold";
          }
        }

        if (hookData.column.index === 5) {
          const valor = convertirNumero(
            hookData.cell.raw as
              | string
              | number
          );

          if (valor > 0) {
            hookData.cell.styles.textColor =
              [185, 28, 28];

            hookData.cell.styles.fontStyle =
              "bold";
          }
        }

        if (hookData.column.index === 7) {
          hookData.cell.styles.fontStyle =
            "bold";
        }
      },
    });

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
        `kardex_${sucursalId}_${fechaDesde || "inicio"}_${fechaHasta || "actual"}`
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
          <ReporteKardexSkeleton />
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
                  No se pudo cargar el Kardex
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
                    text-sm font-semibold text-white
                    transition hover:bg-red-800
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
                <History size={24} />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  Kardex de inventario
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Historial de entradas, salidas, ajustes y saldos de la sucursal.
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
                  movimientosFiltrados.length ===
                    0
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
                  movimientosFiltrados.length ===
                    0
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
            <div className="mb-5 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                <Filter size={20} />
              </div>

              <div>
                <h2 className="font-bold text-gray-900">
                  Filtros del Kardex
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Selecciona fechas, producto, almacén o tipo de movimiento.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <div>
                <label
                  htmlFor="fechaDesde"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Fecha inicial
                </label>

                <div className="relative">
                  <CalendarDays
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

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
                  htmlFor="fechaHasta"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Fecha final
                </label>

                <div className="relative">
                  <CalendarDays
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

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
                  htmlFor="buscarKardex"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Buscar
                </label>

                <div className="relative">
                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="buscarKardex"
                    type="text"
                    value={busqueda}
                    onChange={(event) =>
                      setBusqueda(
                        event.target.value
                      )
                    }
                    placeholder="Producto, almacén o referencia..."
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
                  htmlFor="productoKardex"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Producto
                </label>

                <select
                  id="productoKardex"
                  value={productoSeleccionado}
                  onChange={(event) =>
                    setProductoSeleccionado(
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
                    Todos los productos
                  </option>

                  {productos.map(
                    (producto) => (
                      <option
                        key={producto.id}
                        value={producto.id}
                      >
                        {producto.nombre}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label
                  htmlFor="almacenKardex"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Almacén
                </label>

                <select
                  id="almacenKardex"
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

                  {almacenes.map(
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

              <div>
                <label
                  htmlFor="tipoKardex"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Tipo de movimiento
                </label>

                <select
                  id="tipoKardex"
                  value={tipoMovimiento}
                  onChange={(event) =>
                    setTipoMovimiento(
                      event.target
                        .value as TipoMovimientoFiltro
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
                    Todos los movimientos
                  </option>

                  <option value="ENTRADA">
                    Entrada
                  </option>

                  <option value="SALIDA">
                    Salida
                  </option>

                  <option value="AJUSTE_ENTRADA">
                    Ajuste de entrada
                  </option>

                  <option value="AJUSTE_SALIDA">
                    Ajuste de salida
                  </option>

                  <option value="TRANSFERENCIA_ENTRADA">
                    Transferencia de entrada
                  </option>

                  <option value="TRANSFERENCIA_SALIDA">
                    Transferencia de salida
                  </option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-600">
                Mostrando{" "}
                <strong>
                  {mostrarNumero(
                    movimientosFiltrados.length
                  )}
                </strong>{" "}
                movimientos.
              </div>

              <button
                type="button"
                onClick={limpiarFiltros}
                disabled={
                  !fechaDesde &&
                  !fechaHasta &&
                  !busqueda &&
                  !productoSeleccionado &&
                  !almacenSeleccionado &&
                  !tipoMovimiento
                }
                className="
                  inline-flex items-center justify-center gap-2
                  rounded-xl border border-gray-300 bg-white
                  px-4 py-3 text-sm font-semibold text-gray-700
                  transition hover:bg-gray-50
                  disabled:cursor-not-allowed disabled:opacity-50
                "
              >
                <RotateCcw size={17} />

                Limpiar filtros
              </button>
            </div>
          </article>

          {/* TARJETAS */}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <TarjetaIndicador
              titulo="Total entradas"
              valor={mostrarNumero(
                totalEntradas
              )}
              descripcion="Unidades incorporadas al inventario."
              icono={ArrowDownToLine}
              variante="positivo"
            />

            <TarjetaIndicador
              titulo="Total salidas"
              valor={mostrarNumero(
                totalSalidas
              )}
              descripcion="Unidades retiradas del inventario."
              icono={ArrowUpFromLine}
              variante="negativo"
            />

            <TarjetaIndicador
              titulo="Diferencia neta"
              valor={mostrarNumero(
                diferenciaNeta
              )}
              descripcion="Entradas menos salidas del periodo."
              icono={
                diferenciaNeta >= 0
                  ? TrendingUp
                  : TrendingDown
              }
              variante={
                diferenciaNeta >= 0
                  ? "informativo"
                  : "advertencia"
              }
            />

            <TarjetaIndicador
              titulo="Valor de movimientos"
              valor={mostrarMoneda(
                valorMovimientos
              )}
              descripcion="Valor económico acumulado de los movimientos."
              icono={CircleDollarSign}
              variante="principal"
            />
          </div>

          {/* GRÁFICAS */}

          <div className="grid gap-5 xl:grid-cols-2">
            <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Entradas y salidas por fecha
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Comparación de unidades ingresadas y retiradas.
                </p>
              </div>

              {datosPorFecha.length > 0 ? (
                <div className="mt-5 h-[360px] w-full">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <BarChart
                      data={datosPorFecha}
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
                        dataKey="periodo"
                        tickLine={false}
                        axisLine={false}
                        angle={-20}
                        textAnchor="end"
                        height={65}
                        tick={{
                          fontSize: 10,
                        }}
                      />

                      <YAxis
                        tickLine={false}
                        axisLine={false}
                      />

                      <Tooltip
                        content={
                          <TooltipPeriodo />
                        }
                      />

                      <Legend />

                      <Bar
                        dataKey="entrada"
                        name="Entradas"
                        fill="#10b981"
                        radius={[6, 6, 0, 0]}
                        maxBarSize={38}
                      />

                      <Bar
                        dataKey="salida"
                        name="Salidas"
                        fill="#ef4444"
                        radius={[6, 6, 0, 0]}
                        maxBarSize={38}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="mt-5 flex h-[340px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-300">
                  <Boxes
                    size={40}
                    className="text-gray-300"
                  />

                  <p className="mt-3 font-semibold text-gray-600">
                    Sin movimientos para graficar
                  </p>
                </div>
              )}
            </article>

            <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Movimientos por tipo
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Distribución de las operaciones registradas.
                </p>
              </div>

              {datosPorTipo.length > 0 ? (
                <div className="relative mt-4 h-[350px] w-full">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <PieChart>
                      <Pie
                        data={datosPorTipo}
                        dataKey="cantidad"
                        nameKey="nombre"
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={102}
                        paddingAngle={3}
                      >
                        {datosPorTipo.map(
                          (item) => (
                            <Cell
                              key={item.nombre}
                              fill={item.color}
                            />
                          )
                        )}
                      </Pie>

                      <Tooltip
                        content={
                          <TooltipTipo />
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
                      <p className="text-2xl font-bold text-gray-900">
                        {mostrarNumero(
                          movimientosFiltrados.length
                        )}
                      </p>

                      <p className="text-xs text-gray-500">
                        Movimientos
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-5 flex h-[340px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-300">
                  <History
                    size={40}
                    className="text-gray-300"
                  />

                  <p className="mt-3 font-semibold text-gray-600">
                    Sin información disponible
                  </p>
                </div>
              )}
            </article>
          </div>

          {/* TABLA KARDEX */}

          <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                  <FileBarChart size={20} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Detalle de movimientos
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Registro cronológico de entradas, salidas y saldos.
                  </p>
                </div>
              </div>
            </div>

            {movimientosFiltrados.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1450px]">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                        Fecha
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                        Producto
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                        Almacén
                      </th>

                      <th className="px-5 py-4 text-center text-xs font-bold uppercase tracking-wide text-gray-500">
                        Movimiento
                      </th>

                      <th className="px-5 py-4 text-center text-xs font-bold uppercase tracking-wide text-gray-500">
                        Entrada
                      </th>

                      <th className="px-5 py-4 text-center text-xs font-bold uppercase tracking-wide text-gray-500">
                        Salida
                      </th>

                      <th className="px-5 py-4 text-center text-xs font-bold uppercase tracking-wide text-gray-500">
                        Saldo anterior
                      </th>

                      <th className="px-5 py-4 text-center text-xs font-bold uppercase tracking-wide text-gray-500">
                        Saldo actual
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-gray-500">
                        Costo unitario
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-gray-500">
                        Costo total
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                        Referencia
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {movimientosFiltrados.map(
                      (movimiento, index) => {
                        const entrada =
                          convertirNumero(
                            movimiento.cantidadEntrada
                          );

                        const salida =
                          convertirNumero(
                            movimiento.cantidadSalida
                          );

                        return (
                          <tr
                            key={
                              movimiento._id ||
                              `${movimiento.idProducto}-${movimiento.fecha}-${index}`
                            }
                            className="transition hover:bg-gray-50"
                          >
                            <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-700">
                              {formatearFechaHora(
                                movimiento.fecha
                              )}
                            </td>

                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                                  <Package size={19} />
                                </div>

                                <div>
                                  <p className="font-semibold text-gray-900">
                                    {movimiento.nombreProducto ||
                                      "Sin producto"}
                                  </p>

                                  <p className="mt-1 text-sm text-gray-500">
                                    {movimiento.marca ||
                                      "Sin marca"}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-5 py-4">
                              <div className="flex items-center gap-2">
                                <Warehouse
                                  size={17}
                                  className="text-gray-400"
                                />

                                <span className="font-medium text-gray-700">
                                  {movimiento.nombreAlmacen ||
                                    "Sin almacén"}
                                </span>
                              </div>
                            </td>

                            <td className="px-5 py-4 text-center">
                              <TipoMovimientoBadge
                                tipo={
                                  movimiento.tipoMovimiento
                                }
                              />
                            </td>

                            <td className="px-5 py-4 text-center">
                              <span
                                className={`
                                  font-bold
                                  ${
                                    entrada > 0
                                      ? "text-emerald-700"
                                      : "text-gray-400"
                                  }
                                `}
                              >
                                {mostrarNumero(
                                  entrada
                                )}
                              </span>
                            </td>

                            <td className="px-5 py-4 text-center">
                              <span
                                className={`
                                  font-bold
                                  ${
                                    salida > 0
                                      ? "text-red-700"
                                      : "text-gray-400"
                                  }
                                `}
                              >
                                {mostrarNumero(
                                  salida
                                )}
                              </span>
                            </td>

                            <td className="px-5 py-4 text-center font-medium text-gray-700">
                              {mostrarNumero(
                                movimiento.saldoAnterior
                              )}
                            </td>

                            <td className="px-5 py-4 text-center">
                              <span className="inline-flex min-w-14 justify-center rounded-lg bg-blue-50 px-3 py-1.5 font-bold text-blue-700">
                                {mostrarNumero(
                                  movimiento.saldoActual
                                )}
                              </span>
                            </td>

                            <td className="px-5 py-4 text-right text-gray-700">
                              {mostrarMoneda(
                                movimiento.costoUnitario
                              )}
                            </td>

                            <td className="px-5 py-4 text-right font-bold text-gray-900">
                              {mostrarMoneda(
                                movimiento.costoTotal
                              )}
                            </td>

                            <td className="px-5 py-4">
                              <p className="font-medium text-gray-700">
                                {movimiento.referencia ||
                                  movimiento.motivo ||
                                  "-"}
                              </p>

                              {movimiento.observacion && (
                                <p className="mt-1 max-w-xs text-xs text-gray-500">
                                  {
                                    movimiento.observacion
                                  }
                                </p>
                              )}
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>

                  <tfoot className="bg-gray-900 text-white">
                    <tr>
                      <td
                        colSpan={4}
                        className="px-5 py-4 font-bold"
                      >
                        Totales del periodo
                      </td>

                      <td className="px-5 py-4 text-center font-bold text-emerald-400">
                        {mostrarNumero(
                          totalEntradas
                        )}
                      </td>

                      <td className="px-5 py-4 text-center font-bold text-red-400">
                        {mostrarNumero(
                          totalSalidas
                        )}
                      </td>

                      <td className="px-5 py-4 text-center">
                        -
                      </td>

                      <td className="px-5 py-4 text-center font-bold text-blue-300">
                        {mostrarNumero(
                          saldoActual
                        )}
                      </td>

                      <td className="px-5 py-4 text-right">
                        -
                      </td>

                      <td className="px-5 py-4 text-right font-bold">
                        {mostrarMoneda(
                          valorMovimientos
                        )}
                      </td>

                      <td className="px-5 py-4 text-left font-bold">
                        {mostrarNumero(
                          movimientosFiltrados.length
                        )}{" "}
                        movimientos
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ) : (
              <div className="flex min-h-80 flex-col items-center justify-center p-8 text-center">
                <History
                  size={44}
                  className="text-gray-300"
                />

                <p className="mt-4 font-semibold text-gray-600">
                  No se encontraron movimientos
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
                bg-gray-900 px-4 py-3 text-sm
                font-semibold text-white shadow-xl
              "
            >
              <LoaderCircle
                size={18}
                className="animate-spin"
              />

              Actualizando Kardex...
            </div>
          )}
        </section>
      </main>
    </div>
  );
}