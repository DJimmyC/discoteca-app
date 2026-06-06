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
  Boxes,
  CircleDollarSign,
  Download,
  FileBarChart,
  Filter,
  Layers3,
  LoaderCircle,
  Package,
  PackageCheck,
  PackageMinus,
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
  getReporteInventarioGeneral,
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
  | "negativo"
  | "informativo";

type TarjetaIndicadorProps = {
  titulo: string;
  valor: string;
  descripcion: string;
  icono: ElementType;
  variante?: VarianteTarjeta;
};

type InventarioReporteItem = {
  _id: string;

  idAlmacen: string;
  nombreAlmacen: string;
  tipoAlmacen?: string;

  idSucursal?: string;

  idProducto: string;
  nombreProducto: string;
  marca?: string;
  idCategoria?: string;

  cantidad: number;
  costoUnitario: number;
  ultimoCostoEntrada?: number;
  precioVenta: number;
  stockMinimo: number;

  valorInventario: number;
  gananciaUnitaria: number;

  stockBajo: boolean;
  estado: boolean;
};

type EstadoFiltro =
  | "todos"
  | "disponible"
  | "stock-bajo"
  | "agotado";

type TooltipAlmacenProps = {
  active?: boolean;
  payload?: Array<{
    value?: number;
    payload?: {
      nombreAlmacen?: string;
      valorInventario?: number;
      unidades?: number;
      productos?: number;
    };
  }>;
};

type TooltipEstadoProps = {
  active?: boolean;
  payload?: Array<{
    value?: number;
    payload?: {
      nombre?: string;
      cantidad?: number;
      color?: string;
    };
  }>;
};

/* =====================================================
   TARJETA
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

    advertencia: {
      borde: "border-amber-200",
      icono:
        "bg-amber-100 text-amber-700",
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
   BADGE DE ESTADO
===================================================== */

function EstadoStockBadge({
  cantidad,
  stockMinimo,
}: {
  cantidad: number;
  stockMinimo: number;
}) {
  if (cantidad <= 0) {
    return (
      <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
        Agotado
      </span>
    );
  }

  if (cantidad <= stockMinimo) {
    return (
      <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
        Stock bajo
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
      Disponible
    </span>
  );
}

/* =====================================================
   TOOLTIPS
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
    <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-lg">
      <p className="text-sm font-semibold text-gray-900">
        {item?.nombreAlmacen}
      </p>

      <p className="mt-1 text-sm text-gray-600">
        Valor:{" "}
        {mostrarMoneda(
          item?.valorInventario
        )}
      </p>

      <p className="mt-1 text-xs text-gray-500">
        Unidades:{" "}
        {mostrarNumero(item?.unidades)}
      </p>

      <p className="mt-1 text-xs text-gray-500">
        Productos:{" "}
        {mostrarNumero(item?.productos)}
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

function ReporteInventarioSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div>
        <div className="h-8 w-80 max-w-full rounded bg-gray-200" />
        <div className="mt-3 h-4 w-96 max-w-full rounded bg-gray-100" />
      </div>

      <div className="h-40 rounded-2xl border bg-white" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({
          length: 6,
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

      <div className="h-[450px] rounded-2xl border bg-white" />
    </div>
  );
}

/* =====================================================
   VISTA PRINCIPAL
===================================================== */

export default function ReporteInventarioView() {
  const { sucursalId } = useParams<{
    sucursalId: string;
  }>();

  const [busqueda, setBusqueda] =
    useState("");

  const [almacenSeleccionado, setAlmacenSeleccionado] =
    useState("");

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
      "reporte-inventario-general",
      sucursalId,
    ],

    queryFn: () =>
      getReporteInventarioGeneral({
        idSucursal: sucursalId,
      }),

    enabled: Boolean(sucursalId),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });

  const inventario =
    (data?.data ??
      []) as InventarioReporteItem[];

  const almacenes = useMemo(() => {
    const mapa = new Map<
      string,
      string
    >();

    inventario.forEach((item) => {
      if (item.idAlmacen) {
        mapa.set(
          item.idAlmacen,
          item.nombreAlmacen ||
            "Almacén sin nombre"
        );
      }
    });

    return Array.from(mapa.entries()).map(
      ([id, nombre]) => ({
        id,
        nombre,
      })
    );
  }, [inventario]);

  const inventarioFiltrado = useMemo(() => {
    const texto = busqueda
      .trim()
      .toLowerCase();

    return inventario.filter((item) => {
      const coincideBusqueda =
        !texto ||
        item.nombreProducto
          ?.toLowerCase()
          .includes(texto) ||
        item.marca
          ?.toLowerCase()
          .includes(texto) ||
        item.nombreAlmacen
          ?.toLowerCase()
          .includes(texto);

      const coincideAlmacen =
        !almacenSeleccionado ||
        item.idAlmacen ===
          almacenSeleccionado;

      const cantidad =
        convertirNumero(item.cantidad);

      const stockMinimo =
        convertirNumero(
          item.stockMinimo
        );

      let coincideEstado = true;

      if (
        estadoFiltro ===
        "disponible"
      ) {
        coincideEstado =
          cantidad > stockMinimo;
      }

      if (
        estadoFiltro ===
        "stock-bajo"
      ) {
        coincideEstado =
          cantidad > 0 &&
          cantidad <= stockMinimo;
      }

      if (
        estadoFiltro ===
        "agotado"
      ) {
        coincideEstado =
          cantidad <= 0;
      }

      return (
        coincideBusqueda &&
        coincideAlmacen &&
        coincideEstado
      );
    });
  }, [
    inventario,
    busqueda,
    almacenSeleccionado,
    estadoFiltro,
  ]);

  const totalProductos =
    inventarioFiltrado.length;

  const totalUnidades =
    inventarioFiltrado.reduce(
      (acumulado, item) =>
        acumulado +
        convertirNumero(
          item.cantidad
        ),
      0
    );

  const valorInventario =
    inventarioFiltrado.reduce(
      (acumulado, item) =>
        acumulado +
        convertirNumero(
          item.valorInventario
        ),
      0
    );

  const valorVentaPotencial =
    inventarioFiltrado.reduce(
      (acumulado, item) =>
        acumulado +
        convertirNumero(
          item.cantidad
        ) *
          convertirNumero(
            item.precioVenta
          ),
      0
    );

  const gananciaPotencial =
    valorVentaPotencial -
    valorInventario;

  const productosStockBajo =
    inventarioFiltrado.filter(
      (item) => {
        const cantidad =
          convertirNumero(
            item.cantidad
          );

        const minimo =
          convertirNumero(
            item.stockMinimo
          );

        return (
          cantidad > 0 &&
          cantidad <= minimo
        );
      }
    ).length;

  const productosAgotados =
    inventarioFiltrado.filter(
      (item) =>
        convertirNumero(
          item.cantidad
        ) <= 0
    ).length;

  const productosDisponibles =
    inventarioFiltrado.filter(
      (item) =>
        convertirNumero(
          item.cantidad
        ) >
        convertirNumero(
          item.stockMinimo
        )
    ).length;

  const margenPotencial =
    valorVentaPotencial > 0
      ? (gananciaPotencial /
          valorVentaPotencial) *
        100
      : 0;

  const datosPorAlmacen = useMemo(() => {
    const mapa = new Map<
      string,
      {
        nombreAlmacen: string;
        valorInventario: number;
        unidades: number;
        productos: number;
      }
    >();

    inventarioFiltrado.forEach(
      (item) => {
        const clave =
          item.idAlmacen ||
          item.nombreAlmacen ||
          "sin-almacen";

        const actual = mapa.get(
          clave
        ) ?? {
          nombreAlmacen:
            item.nombreAlmacen ||
            "Sin almacén",
          valorInventario: 0,
          unidades: 0,
          productos: 0,
        };

        actual.valorInventario +=
          convertirNumero(
            item.valorInventario
          );

        actual.unidades +=
          convertirNumero(
            item.cantidad
          );

        actual.productos += 1;

        mapa.set(clave, actual);
      }
    );

    return Array.from(
      mapa.values()
    ).sort(
      (a, b) =>
        b.valorInventario -
        a.valorInventario
    );
  }, [inventarioFiltrado]);

  const datosEstadoStock = useMemo(
    () => [
      {
        nombre: "Disponible",
        cantidad:
          productosDisponibles,
        color: "#10b981",
      },
      {
        nombre: "Stock bajo",
        cantidad:
          productosStockBajo,
        color: "#f59e0b",
      },
      {
        nombre: "Agotado",
        cantidad:
          productosAgotados,
        color: "#ef4444",
      },
    ],
    [
      productosDisponibles,
      productosStockBajo,
      productosAgotados,
    ]
  );

  const limpiarFiltros = () => {
    setBusqueda("");
    setAlmacenSeleccionado("");
    setEstadoFiltro("todos");
  };

  /* =====================================================
     PDF
  ===================================================== */

  const generarReportePDF = (
    modo:
      | "descargar"
      | "imprimir" =
      "descargar"
  ) => {
    if (
      !sucursalId ||
      inventarioFiltrado.length === 0
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
      "INVENTARIO GENERAL",
      margenIzquierdo,
      15
    );

    documento.setFont(
      "helvetica",
      "normal"
    );

    documento.setFontSize(10);

    documento.text(
      "Reporte de existencias, costos y valoración del inventario",
      margenIzquierdo,
      23
    );

    documento.setFontSize(9);

    documento.text(
      `Sucursal ${sucursalId}`,
      anchoPagina -
        margenDerecho,
      13,
      {
        align: "right",
      }
    );

    documento.text(
      `Generado: ${formatearFechaHoraActual()}`,
      anchoPagina -
        margenDerecho,
      21,
      {
        align: "right",
      }
    );

    documento.text(
      `Registros mostrados: ${mostrarNumero(
        inventarioFiltrado.length
      )}`,
      anchoPagina -
        margenDerecho,
      28,
      {
        align: "right",
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
          "Productos",
          "Unidades",
          "Valor costo",
          "Valor venta",
          "Ganancia potencial",
          "Stock bajo",
          "Agotados",
        ],
      ],

      body: [
        [
          mostrarNumero(
            totalProductos
          ),
          mostrarNumero(
            totalUnidades
          ),
          mostrarMoneda(
            valorInventario
          ),
          mostrarMoneda(
            valorVentaPotencial
          ),
          mostrarMoneda(
            gananciaPotencial
          ),
          mostrarNumero(
            productosStockBajo
          ),
          mostrarNumero(
            productosAgotados
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

    documento.setFont(
      "helvetica",
      "bold"
    );

    documento.setFontSize(11);

    documento.text(
      "Detalle del inventario",
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
          "Producto",
          "Marca",
          "Almacén",
          "Cantidad",
          "Mínimo",
          "Costo unit.",
          "Precio venta",
          "Valor inventario",
          "Ganancia unit.",
          "Estado",
        ],
      ],

      body:
        inventarioFiltrado.map(
          (item) => {
            const cantidad =
              convertirNumero(
                item.cantidad
              );

            const minimo =
              convertirNumero(
                item.stockMinimo
              );

            const estado =
              cantidad <= 0
                ? "Agotado"
                : cantidad <= minimo
                  ? "Stock bajo"
                  : "Disponible";

            return [
              item.nombreProducto ||
                "Sin nombre",
              item.marca ||
                "Sin marca",
              item.nombreAlmacen ||
                "Sin almacén",
              mostrarNumero(
                cantidad
              ),
              mostrarNumero(
                minimo
              ),
              mostrarMoneda(
                item.costoUnitario
              ),
              mostrarMoneda(
                item.precioVenta
              ),
              mostrarMoneda(
                item.valorInventario
              ),
              mostrarMoneda(
                item.gananciaUnitaria
              ),
              estado,
            ];
          }
        ),

      theme: "grid",

      styles: {
        font: "helvetica",
        fontSize: 7,
        cellPadding: 2.2,
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
          cellWidth: 42,
        },
        1: {
          cellWidth: 27,
        },
        2: {
          cellWidth: 34,
        },
        3: {
          cellWidth: 20,
          halign: "center",
        },
        4: {
          cellWidth: 19,
          halign: "center",
        },
        5: {
          cellWidth: 27,
          halign: "right",
        },
        6: {
          cellWidth: 27,
          halign: "right",
        },
        7: {
          cellWidth: 32,
          halign: "right",
        },
        8: {
          cellWidth: 27,
          halign: "right",
        },
        9: {
          cellWidth: 25,
          halign: "center",
        },
      },

      didParseCell: (hookData) => {
        if (
          hookData.section !== "body"
        ) {
          return;
        }

        if (
          hookData.column.index === 9
        ) {
          const valor = String(
            hookData.cell.raw
          );

          if (valor === "Disponible") {
            hookData.cell.styles.textColor =
              [4, 120, 87];
          }

          if (
            valor === "Stock bajo"
          ) {
            hookData.cell.styles.textColor =
              [180, 83, 9];
          }

          if (valor === "Agotado") {
            hookData.cell.styles.textColor =
              [185, 28, 28];
          }

          hookData.cell.styles.fontStyle =
            "bold";
        }
      },
    });

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
        anchoPagina -
          margenDerecho,
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
        anchoPagina -
          margenDerecho,
        altoPagina - 8,
        {
          align: "right",
        }
      );
    }

    const nombreArchivo =
      limpiarNombreArchivo(
        `inventario_general_${sucursalId}`
      );

    if (modo === "imprimir") {
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
          <ReporteInventarioSkeleton />
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
                  No se pudo cargar el inventario
                </h1>

                <p className="mt-2 text-sm text-red-700">
                  {error instanceof Error
                    ? error.message
                    : "Ocurrió un error al consultar el reporte."}
                </p>

                <button
                  type="button"
                  onClick={() => refetch()}
                  className="mt-4 rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-800"
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
                <Boxes size={24} />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  Inventario general
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Existencias, costos, precios y valoración del inventario de la sucursal.
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
                  inventarioFiltrado.length ===
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
                  inventarioFiltrado.length ===
                    0
                }
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
                  Filtros de inventario
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Busca productos y filtra por almacén o estado de disponibilidad.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1.5fr_1fr_1fr_auto]">
              <div>
                <label
                  htmlFor="busqueda"
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
                    id="busqueda"
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
                  htmlFor="almacen"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Almacén
                </label>

                <select
                  id="almacen"
                  value={
                    almacenSeleccionado
                  }
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
                  htmlFor="estado"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Estado
                </label>

                <select
                  id="estado"
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

                  <option value="disponible">
                    Disponible
                  </option>

                  <option value="stock-bajo">
                    Stock bajo
                  </option>

                  <option value="agotado">
                    Agotado
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

            <div className="mt-4 rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-600">
              Mostrando{" "}
              <strong>
                {mostrarNumero(
                  inventarioFiltrado.length
                )}
              </strong>{" "}
              de{" "}
              <strong>
                {mostrarNumero(
                  inventario.length
                )}
              </strong>{" "}
              registros.
            </div>
          </article>

          {/* TARJETAS */}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
            <TarjetaIndicador
              titulo="Productos"
              valor={mostrarNumero(
                totalProductos
              )}
              descripcion="Productos registrados según los filtros."
              icono={Package}
              variante="informativo"
            />

            <TarjetaIndicador
              titulo="Unidades disponibles"
              valor={mostrarNumero(
                totalUnidades
              )}
              descripcion="Cantidad total de unidades en inventario."
              icono={Boxes}
              variante="principal"
            />

            <TarjetaIndicador
              titulo="Valor del inventario"
              valor={mostrarMoneda(
                valorInventario
              )}
              descripcion="Valor acumulado al costo."
              icono={CircleDollarSign}
              variante="principal"
            />

            <TarjetaIndicador
              titulo="Ganancia potencial"
              valor={mostrarMoneda(
                gananciaPotencial
              )}
              descripcion={`${mostrarPorcentaje(
                margenPotencial
              )} de margen potencial.`}
              icono={TrendingUp}
              variante="positivo"
            />

            <TarjetaIndicador
              titulo="Stock bajo"
              valor={mostrarNumero(
                productosStockBajo
              )}
              descripcion="Productos que requieren reposición."
              icono={PackageMinus}
              variante={
                productosStockBajo > 0
                  ? "advertencia"
                  : "normal"
              }
            />

            <TarjetaIndicador
              titulo="Productos agotados"
              valor={mostrarNumero(
                productosAgotados
              )}
              descripcion="Productos sin unidades disponibles."
              icono={AlertTriangle}
              variante={
                productosAgotados > 0
                  ? "negativo"
                  : "normal"
              }
            />
          </div>

          {/* GRÁFICAS */}

          <div className="grid gap-5 xl:grid-cols-2">
            <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Valor por almacén
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Comparación del valor del inventario almacenado.
                </p>
              </div>

              <div className="mt-5 h-[350px] w-full">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <BarChart
                    data={datosPorAlmacen}
                    margin={{
                      top: 10,
                      right: 15,
                      left: 0,
                      bottom: 25,
                    }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                    />

                    <XAxis
                      dataKey="nombreAlmacen"
                      tickLine={false}
                      axisLine={false}
                      interval={0}
                      angle={-15}
                      textAnchor="end"
                      height={60}
                      tick={{
                        fontSize: 11,
                      }}
                      tickFormatter={(valor) =>
                        recortarTexto(
                          String(valor),
                          17
                        )
                      }
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

                    <Bar
                      dataKey="valorInventario"
                      radius={[8, 8, 0, 0]}
                      maxBarSize={70}
                    >
                      {datosPorAlmacen.map(
                        (item, index) => (
                          <Cell
                            key={`${item.nombreAlmacen}-${index}`}
                            fill={
                              index === 0
                                ? "#111827"
                                : "#2563eb"
                            }
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
                  Estado del inventario
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Distribución de productos por disponibilidad.
                </p>
              </div>

              {totalProductos > 0 ? (
                <div className="relative mt-4 h-[330px] w-full">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <PieChart>
                      <Pie
                        data={datosEstadoStock}
                        dataKey="cantidad"
                        nameKey="nombre"
                        cx="50%"
                        cy="50%"
                        innerRadius={62}
                        outerRadius={98}
                        paddingAngle={4}
                      >
                        {datosEstadoStock.map(
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
                          totalProductos
                        )}
                      </p>

                      <p className="text-xs text-gray-500">
                        Productos
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-5 flex h-[330px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-300">
                  <Boxes
                    size={38}
                    className="text-gray-300"
                  />

                  <p className="mt-3 font-semibold text-gray-600">
                    Sin inventario
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
                    Detalle del inventario
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Existencias, costos, precios y estado de cada producto.
                  </p>
                </div>
              </div>
            </div>

            {inventarioFiltrado.length >
            0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-[1250px] w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                        Producto
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                        Almacén
                      </th>

                      <th className="px-5 py-4 text-center text-xs font-bold uppercase tracking-wide text-gray-500">
                        Cantidad
                      </th>

                      <th className="px-5 py-4 text-center text-xs font-bold uppercase tracking-wide text-gray-500">
                        Stock mínimo
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-gray-500">
                        Costo unitario
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-gray-500">
                        Precio venta
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-gray-500">
                        Valor inventario
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-gray-500">
                        Ganancia unitaria
                      </th>

                      <th className="px-5 py-4 text-center text-xs font-bold uppercase tracking-wide text-gray-500">
                        Estado
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {inventarioFiltrado.map(
                      (item, index) => {
                        const cantidad =
                          convertirNumero(
                            item.cantidad
                          );

                        const stockMinimo =
                          convertirNumero(
                            item.stockMinimo
                          );

                        return (
                          <tr
                            key={
                              item._id ||
                              `${item.idProducto}-${index}`
                            }
                            className="transition hover:bg-gray-50"
                          >
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                                  <PackageCheck
                                    size={19}
                                  />
                                </div>

                                <div>
                                  <p className="font-semibold text-gray-900">
                                    {item.nombreProducto ||
                                      "Sin nombre"}
                                  </p>

                                  <p className="mt-1 text-sm text-gray-500">
                                    {item.marca ||
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
                                    {item.nombreAlmacen ||
                                      "Sin almacén"}
                                  </p>

                                  {item.tipoAlmacen && (
                                    <p className="mt-1 text-xs text-gray-500">
                                      {item.tipoAlmacen}
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
                                    cantidad <= 0
                                      ? "text-red-700"
                                      : cantidad <=
                                          stockMinimo
                                        ? "text-amber-700"
                                        : "text-gray-900"
                                  }
                                `}
                              >
                                {mostrarNumero(
                                  cantidad
                                )}
                              </span>
                            </td>

                            <td className="px-5 py-4 text-center text-gray-700">
                              {mostrarNumero(
                                stockMinimo
                              )}
                            </td>

                            <td className="px-5 py-4 text-right text-gray-700">
                              {mostrarMoneda(
                                item.costoUnitario
                              )}
                            </td>

                            <td className="px-5 py-4 text-right font-semibold text-gray-900">
                              {mostrarMoneda(
                                item.precioVenta
                              )}
                            </td>

                            <td className="px-5 py-4 text-right font-bold text-blue-700">
                              {mostrarMoneda(
                                item.valorInventario
                              )}
                            </td>

                            <td className="px-5 py-4 text-right font-bold text-emerald-700">
                              {mostrarMoneda(
                                item.gananciaUnitaria
                              )}
                            </td>

                            <td className="px-5 py-4 text-center">
                              <EstadoStockBadge
                                cantidad={
                                  cantidad
                                }
                                stockMinimo={
                                  stockMinimo
                                }
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
                          totalUnidades
                        )}
                      </td>

                      <td className="px-5 py-4 text-center">
                        -
                      </td>

                      <td className="px-5 py-4 text-right">
                        -
                      </td>

                      <td className="px-5 py-4 text-right font-bold">
                        {mostrarMoneda(
                          valorVentaPotencial
                        )}
                      </td>

                      <td className="px-5 py-4 text-right font-bold text-blue-300">
                        {mostrarMoneda(
                          valorInventario
                        )}
                      </td>

                      <td className="px-5 py-4 text-right font-bold text-emerald-400">
                        {mostrarMoneda(
                          gananciaPotencial
                        )}
                      </td>

                      <td className="px-5 py-4 text-center font-bold">
                        {mostrarNumero(
                          totalProductos
                        )}{" "}
                        productos
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ) : (
              <div className="flex min-h-80 flex-col items-center justify-center p-8 text-center">
                <Layers3
                  size={42}
                  className="text-gray-300"
                />

                <p className="mt-4 font-semibold text-gray-600">
                  No se encontraron productos
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Modifica los filtros para mostrar otros registros.
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

              Actualizando inventario...
            </div>
          )}
        </section>
      </main>
    </div>
  );
}