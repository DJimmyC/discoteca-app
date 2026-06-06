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
  CircleAlert,
  Download,
  FileBarChart,
  Filter,
  LoaderCircle,
  Package,
  PackageMinus,
  PackageOpen,
  Printer,
  RefreshCcw,
  RotateCcw,
  Search,
  ShieldAlert,
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
  getReporteInventarioStockBajo,
} from "@/api/ReporteApi";

/* =====================================================
   FORMATEADORES
===================================================== */

const formatoNumero = new Intl.NumberFormat("es-BO");

function convertirNumero(
  valor: number | string | null | undefined
): number {
  const numero = Number(valor);

  return Number.isFinite(numero) ? numero : 0;
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

type EstadoFiltro =
  | "todos"
  | "stock-bajo"
  | "agotado";

type VarianteTarjeta =
  | "normal"
  | "principal"
  | "advertencia"
  | "negativo"
  | "informativo";

type TarjetaIndicadorProps = {
  titulo: string;
  valor: string;
  descripcion: string;
  icono: ElementType;
  variante?: VarianteTarjeta;
};

type StockBajoItem = {
  _id: string;

  idAlmacen: string;
  nombreAlmacen: string;
  tipoAlmacen?: string;

  idSucursal?: string;

  idProducto: string;
  nombreProducto: string;
  marca?: string;

  cantidad: number;
  stockMinimo: number;

  agotado: boolean;
  faltanteParaMinimo: number;
};

type DatoGraficaFaltante = StockBajoItem & {
  nombreCorto: string;
};

type DatoEstadoStock = {
  nombre: string;
  cantidad: number;
  color: string;
};

type TooltipFaltanteProps = {
  active?: boolean;
  payload?: Array<{
    value?: number;
    payload?: DatoGraficaFaltante;
  }>;
};

type TooltipEstadoProps = {
  active?: boolean;
  payload?: Array<{
    value?: number;
    payload?: DatoEstadoStock;
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

    advertencia: {
      borde: "border-amber-200",
      icono: "bg-amber-100 text-amber-700",
      valor: "text-amber-700",
    },

    negativo: {
      borde: "border-red-200",
      icono: "bg-red-100 text-red-700",
      valor: "text-red-700",
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
   ETIQUETA DE ESTADO
===================================================== */

function EstadoStockBadge({
  agotado,
}: {
  agotado: boolean;
}) {
  if (agotado) {
    return (
      <span
        className="
          inline-flex items-center gap-1.5
          rounded-full bg-red-100 px-3 py-1
          text-xs font-semibold text-red-700
        "
      >
        <PackageOpen size={13} />
        Agotado
      </span>
    );
  }

  return (
    <span
      className="
        inline-flex items-center gap-1.5
        rounded-full bg-amber-100 px-3 py-1
        text-xs font-semibold text-amber-700
      "
    >
      <PackageMinus size={13} />
      Stock bajo
    </span>
  );
}

/* =====================================================
   PRIORIDAD DE REPOSICIÓN
===================================================== */

function PrioridadBadge({
  cantidad,
  stockMinimo,
  agotado,
}: {
  cantidad: number;
  stockMinimo: number;
  agotado: boolean;
}) {
  if (agotado) {
    return (
      <span className="font-bold text-red-700">
        Crítica
      </span>
    );
  }

  const porcentajeDisponible =
    stockMinimo > 0
      ? (cantidad / stockMinimo) * 100
      : 0;

  if (porcentajeDisponible <= 25) {
    return (
      <span className="font-bold text-orange-700">
        Alta
      </span>
    );
  }

  if (porcentajeDisponible <= 60) {
    return (
      <span className="font-semibold text-amber-700">
        Media
      </span>
    );
  }

  return (
    <span className="font-semibold text-gray-600">
      Baja
    </span>
  );
}

/* =====================================================
   TOOLTIPS
===================================================== */

function TooltipFaltante({
  active,
  payload,
}: TooltipFaltanteProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const item = payload[0]?.payload;

  return (
    <div className="max-w-xs rounded-xl border border-gray-200 bg-white p-3 shadow-lg">
      <p className="text-sm font-semibold text-gray-900">
        {item?.nombreProducto}
      </p>

      {item?.marca && (
        <p className="mt-1 text-xs text-gray-500">
          {item.marca}
        </p>
      )}

      <p className="mt-2 text-sm text-red-700">
        Faltante:{" "}
        <strong>
          {mostrarNumero(item?.faltanteParaMinimo)}
        </strong>
      </p>

      <p className="mt-1 text-xs text-gray-500">
        Actual: {mostrarNumero(item?.cantidad)}
      </p>

      <p className="mt-1 text-xs text-gray-500">
        Mínimo: {mostrarNumero(item?.stockMinimo)}
      </p>
    </div>
  );
}

function TooltipEstado({
  active,
  payload,
}: TooltipEstadoProps) {
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
        {mostrarNumero(item?.cantidad)} productos
      </p>
    </div>
  );
}

/* =====================================================
   SKELETON
===================================================== */

function ReporteStockBajoSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div>
        <div className="h-8 w-80 max-w-full rounded bg-gray-200" />
        <div className="mt-3 h-4 w-96 max-w-full rounded bg-gray-100" />
      </div>

      <div className="h-40 rounded-2xl border bg-white" />

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

export default function ReporteStockBajoView() {
  const { sucursalId } = useParams<{
    sucursalId: string;
  }>();

  const [busqueda, setBusqueda] = useState("");

  const [
    almacenSeleccionado,
    setAlmacenSeleccionado,
  ] = useState("");

  const [estadoFiltro, setEstadoFiltro] =
    useState<EstadoFiltro>("todos");

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: [
      "reporte-inventario-stock-bajo",
      sucursalId,
    ],

    queryFn: () =>
      getReporteInventarioStockBajo({
        idSucursal: sucursalId,
      }),

    enabled: Boolean(sucursalId),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });

  /* =====================================================
     DATOS DEL BACKEND
  ===================================================== */

  const productos =
    (data?.data ?? []) as StockBajoItem[];

  const almacenes = useMemo(() => {
    const mapa = new Map<string, string>();

    productos.forEach((producto) => {
      if (producto.idAlmacen) {
        mapa.set(
          producto.idAlmacen,
          producto.nombreAlmacen ||
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
  }, [productos]);

  const productosFiltrados = useMemo(() => {
    const texto = busqueda
      .trim()
      .toLowerCase();

    return productos.filter((producto) => {
      const coincideBusqueda =
        !texto ||
        producto.nombreProducto
          ?.toLowerCase()
          .includes(texto) ||
        producto.marca
          ?.toLowerCase()
          .includes(texto) ||
        producto.nombreAlmacen
          ?.toLowerCase()
          .includes(texto);

      const coincideAlmacen =
        !almacenSeleccionado ||
        producto.idAlmacen ===
          almacenSeleccionado;

      let coincideEstado = true;

      if (estadoFiltro === "agotado") {
        coincideEstado =
          producto.agotado ||
          convertirNumero(producto.cantidad) <= 0;
      }

      if (estadoFiltro === "stock-bajo") {
        coincideEstado =
          !producto.agotado &&
          convertirNumero(producto.cantidad) > 0;
      }

      return (
        coincideBusqueda &&
        coincideAlmacen &&
        coincideEstado
      );
    });
  }, [
    productos,
    busqueda,
    almacenSeleccionado,
    estadoFiltro,
  ]);

  const totalStockBajo =
    productosFiltrados.filter(
      (producto) =>
        !producto.agotado &&
        convertirNumero(producto.cantidad) > 0
    ).length;

  const totalAgotados =
    productosFiltrados.filter(
      (producto) =>
        producto.agotado ||
        convertirNumero(producto.cantidad) <= 0
    ).length;

  const unidadesActuales =
    productosFiltrados.reduce(
      (acumulado, producto) =>
        acumulado +
        convertirNumero(producto.cantidad),
      0
    );

  const unidadesFaltantes =
    productosFiltrados.reduce(
      (acumulado, producto) =>
        acumulado +
        convertirNumero(
          producto.faltanteParaMinimo
        ),
      0
    );

  const porcentajeAgotados =
    productosFiltrados.length > 0
      ? (totalAgotados /
          productosFiltrados.length) *
        100
      : 0;

  const productoMasUrgente =
    [...productosFiltrados].sort(
      (a, b) => {
        if (a.agotado && !b.agotado) {
          return -1;
        }

        if (!a.agotado && b.agotado) {
          return 1;
        }

        return (
          convertirNumero(
            b.faltanteParaMinimo
          ) -
          convertirNumero(
            a.faltanteParaMinimo
          )
        );
      }
    )[0] ?? null;

  /* =====================================================
     DATOS PARA LAS GRÁFICAS
  ===================================================== */

  const datosFaltantes =
    useMemo<DatoGraficaFaltante[]>(
      () =>
        [...productosFiltrados]
          .sort(
            (a, b) =>
              convertirNumero(
                b.faltanteParaMinimo
              ) -
              convertirNumero(
                a.faltanteParaMinimo
              )
          )
          .slice(0, 10)
          .map((producto) => ({
            ...producto,

            nombreCorto: recortarTexto(
              producto.nombreProducto,
              17
            ),

            faltanteParaMinimo:
              convertirNumero(
                producto.faltanteParaMinimo
              ),
          })),
      [productosFiltrados]
    );

  const datosEstado =
    useMemo<DatoEstadoStock[]>(
      () => [
        {
          nombre: "Stock bajo",
          cantidad: totalStockBajo,
          color: "#f59e0b",
        },
        {
          nombre: "Agotados",
          cantidad: totalAgotados,
          color: "#ef4444",
        },
      ],
      [totalStockBajo, totalAgotados]
    );

  const limpiarFiltros = () => {
    setBusqueda("");
    setAlmacenSeleccionado("");
    setEstadoFiltro("todos");
  };

  /* =====================================================
     GENERAR PDF
  ===================================================== */

  const generarReportePDF = (
    modo: "descargar" | "imprimir" = "descargar"
  ) => {
    if (
      !sucursalId ||
      productosFiltrados.length === 0
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

    documento.setFillColor(17, 24, 39);

    documento.rect(
      0,
      0,
      anchoPagina,
      38,
      "F"
    );

    documento.setTextColor(255, 255, 255);
    documento.setFont("helvetica", "bold");
    documento.setFontSize(18);

    documento.text(
      "STOCK BAJO Y PRODUCTOS AGOTADOS",
      margenIzquierdo,
      15
    );

    documento.setFont("helvetica", "normal");
    documento.setFontSize(10);

    documento.text(
      "Reporte de necesidades de reposición de inventario",
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
      `Registros: ${mostrarNumero(
        productosFiltrados.length
      )}`,
      anchoPagina - margenDerecho,
      27,
      {
        align: "right",
      }
    );

    /* RESUMEN EJECUTIVO */

    documento.setTextColor(31, 41, 55);
    documento.setFont("helvetica", "bold");
    documento.setFontSize(11);

    documento.text(
      "Resumen de reposición",
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
          "Productos afectados",
          "Stock bajo",
          "Agotados",
          "Unidades actuales",
          "Unidades faltantes",
          "% agotados",
        ],
      ],

      body: [
        [
          mostrarNumero(
            productosFiltrados.length
          ),
          mostrarNumero(totalStockBajo),
          mostrarNumero(totalAgotados),
          mostrarNumero(unidadesActuales),
          mostrarNumero(unidadesFaltantes),
          mostrarPorcentaje(
            porcentajeAgotados
          ),
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

    /* TABLA DETALLADA */

    documento.setFont("helvetica", "bold");
    documento.setFontSize(11);

    documento.text(
      "Detalle de productos para reposición",
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
          "Producto",
          "Marca",
          "Almacén",
          "Stock actual",
          "Stock mínimo",
          "Faltante",
          "Estado",
          "Prioridad",
        ],
      ],

      body: productosFiltrados.map(
        (producto) => {
          const cantidad =
            convertirNumero(
              producto.cantidad
            );

          const stockMinimo =
            convertirNumero(
              producto.stockMinimo
            );

          const agotado =
            producto.agotado ||
            cantidad <= 0;

          const porcentajeDisponible =
            stockMinimo > 0
              ? (cantidad / stockMinimo) *
                100
              : 0;

          const prioridad = agotado
            ? "Crítica"
            : porcentajeDisponible <= 25
              ? "Alta"
              : porcentajeDisponible <= 60
                ? "Media"
                : "Baja";

          return [
            producto.nombreProducto ||
              "Sin nombre",
            producto.marca || "Sin marca",
            producto.nombreAlmacen ||
              "Sin almacén",
            mostrarNumero(cantidad),
            mostrarNumero(stockMinimo),
            mostrarNumero(
              producto.faltanteParaMinimo
            ),
            agotado
              ? "Agotado"
              : "Stock bajo",
            prioridad,
          ];
        }
      ),

      theme: "grid",

      styles: {
        font: "helvetica",
        fontSize: 8,
        cellPadding: 2.6,
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
          cellWidth: 52,
        },
        1: {
          cellWidth: 34,
        },
        2: {
          cellWidth: 45,
        },
        3: {
          cellWidth: 27,
          halign: "center",
        },
        4: {
          cellWidth: 27,
          halign: "center",
        },
        5: {
          cellWidth: 26,
          halign: "center",
        },
        6: {
          cellWidth: 29,
          halign: "center",
        },
        7: {
          cellWidth: 25,
          halign: "center",
        },
      },

      didParseCell: (hookData) => {
        if (hookData.section !== "body") {
          return;
        }

        if (hookData.column.index === 5) {
          hookData.cell.styles.textColor = [
            185,
            28,
            28,
          ];

          hookData.cell.styles.fontStyle =
            "bold";
        }

        if (hookData.column.index === 6) {
          const valor = String(
            hookData.cell.raw
          );

          if (valor === "Agotado") {
            hookData.cell.styles.fillColor = [
              254,
              226,
              226,
            ];

            hookData.cell.styles.textColor = [
              185,
              28,
              28,
            ];
          } else {
            hookData.cell.styles.fillColor = [
              254,
              243,
              199,
            ];

            hookData.cell.styles.textColor = [
              180,
              83,
              9,
            ];
          }

          hookData.cell.styles.fontStyle =
            "bold";
        }

        if (hookData.column.index === 7) {
          const valor = String(
            hookData.cell.raw
          );

          if (
            valor === "Crítica" ||
            valor === "Alta"
          ) {
            hookData.cell.styles.textColor = [
              185,
              28,
              28,
            ];
          }

          if (valor === "Media") {
            hookData.cell.styles.textColor = [
              180,
              83,
              9,
            ];
          }

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

    documento.setTextColor(31, 41, 55);
    documento.setFont("helvetica", "bold");
    documento.setFontSize(11);

    documento.text(
      "Interpretación operativa",
      margenIzquierdo,
      posicionInterpretacion
    );

    const interpretaciones: string[] = [];

    interpretaciones.push(
      `Se identificaron ${mostrarNumero(
        productosFiltrados.length
      )} productos que requieren atención de inventario.`
    );

    interpretaciones.push(
      `${mostrarNumero(
        totalAgotados
      )} productos se encuentran agotados y ${mostrarNumero(
        totalStockBajo
      )} permanecen por debajo del nivel mínimo.`
    );

    interpretaciones.push(
      `Para alcanzar los niveles mínimos se requiere reponer aproximadamente ${mostrarNumero(
        unidadesFaltantes
      )} unidades.`
    );

    if (productoMasUrgente) {
      interpretaciones.push(
        `${productoMasUrgente.nombreProducto} presenta la mayor necesidad de reposición, con un faltante de ${mostrarNumero(
          productoMasUrgente.faltanteParaMinimo
        )} unidades.`
      );
    }

    if (porcentajeAgotados >= 30) {
      interpretaciones.push(
        "La proporción de productos agotados es elevada. Se recomienda priorizar compras o transferencias de inventario para evitar pérdidas de ventas."
      );
    }

    documento.setFont("helvetica", "normal");
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
        `stock_bajo_${sucursalId}`
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

    documento.save(`${nombreArchivo}.pdf`);
  };

  /* =====================================================
     ESTADOS DE LA VISTA
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
          <ReporteStockBajoSkeleton />
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
                  No se pudo cargar el reporte de stock bajo
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
                <ShieldAlert size={24} />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  Stock bajo y agotados
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Productos que necesitan reposición inmediata en la sucursal.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 xl:flex xl:items-center">
              <button
                type="button"
                onClick={() =>
                  generarReportePDF("descargar")
                }
                disabled={
                  isFetching ||
                  productosFiltrados.length === 0
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
                  generarReportePDF("imprimir")
                }
                disabled={
                  isFetching ||
                  productosFiltrados.length === 0
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
                  Filtros de reposición
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Busca productos y filtra por almacén o nivel de disponibilidad.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1.5fr_1fr_1fr_auto]">
              <div>
                <label
                  htmlFor="busquedaStock"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Buscar producto
                </label>

                <div className="relative">
                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="busquedaStock"
                    type="text"
                    value={busqueda}
                    onChange={(event) =>
                      setBusqueda(
                        event.target.value
                      )
                    }
                    placeholder="Producto, marca o almacén..."
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
                  htmlFor="almacenStock"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Almacén
                </label>

                <select
                  id="almacenStock"
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

                  {almacenes.map((almacen) => (
                    <option
                      key={almacen.id}
                      value={almacen.id}
                    >
                      {almacen.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="estadoStock"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Estado
                </label>

                <select
                  id="estadoStock"
                  value={estadoFiltro}
                  onChange={(event) =>
                    setEstadoFiltro(
                      event.target
                        .value as EstadoFiltro
                    )
                  }
                  className="
                    w-full rounded-xl border border-gray-300
                    bg-white px-4 py-3 text-sm text-gray-700
                    outline-none transition focus:border-gray-900
                    focus:ring-2 focus:ring-gray-900/10
                  "
                >
                  <option value="todos">
                    Todos
                  </option>

                  <option value="stock-bajo">
                    Stock bajo
                  </option>

                  <option value="agotado">
                    Agotados
                  </option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={limpiarFiltros}
                  disabled={
                    !busqueda &&
                    !almacenSeleccionado &&
                    estadoFiltro === "todos"
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
                  productosFiltrados.length
                )}
              </strong>{" "}
              de{" "}
              <strong>
                {mostrarNumero(productos.length)}
              </strong>{" "}
              productos con necesidad de reposición.
            </div>
          </article>

          {/* TARJETAS */}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <TarjetaIndicador
              titulo="Productos afectados"
              valor={mostrarNumero(
                productosFiltrados.length
              )}
              descripcion="Productos por debajo del nivel mínimo."
              icono={Package}
              variante="principal"
            />

            <TarjetaIndicador
              titulo="Stock bajo"
              valor={mostrarNumero(
                totalStockBajo
              )}
              descripcion="Productos con unidades, pero por debajo del mínimo."
              icono={PackageMinus}
              variante="advertencia"
            />

            <TarjetaIndicador
              titulo="Productos agotados"
              valor={mostrarNumero(
                totalAgotados
              )}
              descripcion={`${mostrarPorcentaje(
                porcentajeAgotados
              )} de los productos afectados.`}
              icono={PackageOpen}
              variante={
                totalAgotados > 0
                  ? "negativo"
                  : "normal"
              }
            />

            <TarjetaIndicador
              titulo="Unidades por reponer"
              valor={mostrarNumero(
                unidadesFaltantes
              )}
              descripcion="Unidades necesarias para alcanzar el stock mínimo."
              icono={Boxes}
              variante="informativo"
            />
          </div>

          {/* PRODUCTO MÁS URGENTE */}

          {productoMasUrgente && (
            <article className="overflow-hidden rounded-2xl border border-red-200 bg-white shadow-sm">
              <div
                className="
                  flex flex-col gap-5 bg-gradient-to-r
                  from-red-50 to-white p-5
                  md:flex-row md:items-center
                  md:justify-between
                "
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-red-700">
                    <CircleAlert size={28} />
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-red-700">
                      Reposición prioritaria
                    </p>

                    <h2 className="mt-1 text-xl font-bold text-gray-900">
                      {productoMasUrgente.nombreProducto}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      {productoMasUrgente.nombreAlmacen}
                      {productoMasUrgente.marca
                        ? ` · ${productoMasUrgente.marca}`
                        : ""}
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl bg-white px-4 py-3 shadow-sm">
                    <p className="text-xs text-gray-500">
                      Stock actual
                    </p>

                    <p className="mt-1 text-lg font-bold text-red-700">
                      {mostrarNumero(
                        productoMasUrgente.cantidad
                      )}
                    </p>
                  </div>

                  <div className="rounded-xl bg-white px-4 py-3 shadow-sm">
                    <p className="text-xs text-gray-500">
                      Stock mínimo
                    </p>

                    <p className="mt-1 text-lg font-bold text-gray-900">
                      {mostrarNumero(
                        productoMasUrgente.stockMinimo
                      )}
                    </p>
                  </div>

                  <div className="rounded-xl bg-white px-4 py-3 shadow-sm">
                    <p className="text-xs text-gray-500">
                      Faltante
                    </p>

                    <p className="mt-1 text-lg font-bold text-red-700">
                      {mostrarNumero(
                        productoMasUrgente.faltanteParaMinimo
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
                  Productos con mayor faltante
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Unidades necesarias para alcanzar el stock mínimo.
                </p>
              </div>

              {datosFaltantes.length > 0 ? (
                <div className="mt-5 h-[380px] w-full">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <BarChart
                      data={datosFaltantes}
                      layout="vertical"
                      margin={{
                        top: 5,
                        right: 25,
                        left: 30,
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
                          <TooltipFaltante />
                        }
                      />

                      <Bar
                        dataKey="faltanteParaMinimo"
                        radius={[0, 8, 8, 0]}
                        maxBarSize={28}
                      >
                        {datosFaltantes.map(
                          (producto, index) => (
                            <Cell
                              key={`${producto.idProducto}-${producto.idAlmacen}-${index}`}
                              fill={
                                producto.agotado
                                  ? "#ef4444"
                                  : "#f59e0b"
                              }
                            />
                          )
                        )}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="mt-5 flex h-[350px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-300">
                  <Boxes
                    size={38}
                    className="text-gray-300"
                  />

                  <p className="mt-3 font-semibold text-gray-600">
                    Sin productos para graficar
                  </p>
                </div>
              )}
            </article>

            <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Situación de disponibilidad
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Comparación entre productos agotados y con stock bajo.
                </p>
              </div>

              {productosFiltrados.length > 0 ? (
                <div className="relative mt-4 h-[350px] w-full">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <PieChart>
                      <Pie
                        data={datosEstado}
                        dataKey="cantidad"
                        nameKey="nombre"
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={102}
                        paddingAngle={4}
                      >
                        {datosEstado.map((item) => (
                          <Cell
                            key={item.nombre}
                            fill={item.color}
                          />
                        ))}
                      </Pie>

                      <Tooltip
                        content={
                          <TooltipEstado />
                        }
                      />

                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">
                        {mostrarNumero(
                          productosFiltrados.length
                        )}
                      </p>

                      <p className="text-xs text-gray-500">
                        Productos
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-5 flex h-[350px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-300">
                  <ShieldAlert
                    size={38}
                    className="text-gray-300"
                  />

                  <p className="mt-3 font-semibold text-gray-600">
                    Sin alertas de inventario
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
                    Detalle de reposición
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Productos que requieren compra o transferencia de inventario.
                  </p>
                </div>
              </div>
            </div>

            {productosFiltrados.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-[1050px] w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                        Producto
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                        Almacén
                      </th>

                      <th className="px-5 py-4 text-center text-xs font-bold uppercase tracking-wide text-gray-500">
                        Stock actual
                      </th>

                      <th className="px-5 py-4 text-center text-xs font-bold uppercase tracking-wide text-gray-500">
                        Stock mínimo
                      </th>

                      <th className="px-5 py-4 text-center text-xs font-bold uppercase tracking-wide text-gray-500">
                        Faltante
                      </th>

                      <th className="px-5 py-4 text-center text-xs font-bold uppercase tracking-wide text-gray-500">
                        Estado
                      </th>

                      <th className="px-5 py-4 text-center text-xs font-bold uppercase tracking-wide text-gray-500">
                        Prioridad
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {productosFiltrados.map(
                      (producto, index) => {
                        const cantidad =
                          convertirNumero(
                            producto.cantidad
                          );

                        const stockMinimo =
                          convertirNumero(
                            producto.stockMinimo
                          );

                        const agotado =
                          producto.agotado ||
                          cantidad <= 0;

                        return (
                          <tr
                            key={
                              producto._id ||
                              `${producto.idProducto}-${producto.idAlmacen}-${index}`
                            }
                            className="transition hover:bg-gray-50"
                          >
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`
                                    flex h-10 w-10 shrink-0
                                    items-center justify-center
                                    rounded-xl
                                    ${
                                      agotado
                                        ? "bg-red-100 text-red-700"
                                        : "bg-amber-100 text-amber-700"
                                    }
                                  `}
                                >
                                  {agotado ? (
                                    <PackageOpen
                                      size={19}
                                    />
                                  ) : (
                                    <PackageMinus
                                      size={19}
                                    />
                                  )}
                                </div>

                                <div>
                                  <p className="font-semibold text-gray-900">
                                    {producto.nombreProducto ||
                                      "Sin nombre"}
                                  </p>

                                  <p className="mt-1 text-sm text-gray-500">
                                    {producto.marca ||
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

                                <div>
                                  <p className="font-medium text-gray-700">
                                    {producto.nombreAlmacen ||
                                      "Sin almacén"}
                                  </p>

                                  {producto.tipoAlmacen && (
                                    <p className="mt-1 text-xs text-gray-500">
                                      {
                                        producto.tipoAlmacen
                                      }
                                    </p>
                                  )}
                                </div>
                              </div>
                            </td>

                            <td className="px-5 py-4 text-center">
                              <span
                                className={`
                                  text-base font-bold
                                  ${
                                    agotado
                                      ? "text-red-700"
                                      : "text-amber-700"
                                  }
                                `}
                              >
                                {mostrarNumero(
                                  cantidad
                                )}
                              </span>
                            </td>

                            <td className="px-5 py-4 text-center font-semibold text-gray-700">
                              {mostrarNumero(
                                stockMinimo
                              )}
                            </td>

                            <td className="px-5 py-4 text-center">
                              <span className="inline-flex min-w-12 justify-center rounded-lg bg-red-50 px-3 py-1.5 font-bold text-red-700">
                                {mostrarNumero(
                                  producto.faltanteParaMinimo
                                )}
                              </span>
                            </td>

                            <td className="px-5 py-4 text-center">
                              <EstadoStockBadge
                                agotado={agotado}
                              />
                            </td>

                            <td className="px-5 py-4 text-center">
                              <PrioridadBadge
                                cantidad={cantidad}
                                stockMinimo={
                                  stockMinimo
                                }
                                agotado={agotado}
                              />
                            </td>
                          </tr>
                        );
                      }
                    )}
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
                        {mostrarNumero(
                          unidadesActuales
                        )}
                      </td>

                      <td className="px-5 py-4 text-center">
                        -
                      </td>

                      <td className="px-5 py-4 text-center font-bold text-red-400">
                        {mostrarNumero(
                          unidadesFaltantes
                        )}
                      </td>

                      <td className="px-5 py-4 text-center font-bold">
                        {mostrarNumero(
                          productosFiltrados.length
                        )}{" "}
                        productos
                      </td>

                      <td className="px-5 py-4 text-center font-bold text-amber-300">
                        Reposición requerida
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ) : (
              <div className="flex min-h-80 flex-col items-center justify-center p-8 text-center">
                <Boxes
                  size={44}
                  className="text-gray-300"
                />

                <p className="mt-4 font-semibold text-gray-600">
                  No se encontraron productos
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

              Actualizando stock...
            </div>
          )}
        </section>
      </main>
    </div>
  );
}