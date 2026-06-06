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
  PackageCheck,
  Percent,
  Printer,
  RefreshCcw,
  RotateCcw,
  ShoppingBag,
  Star,
  TrendingUp,
  Trophy,
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
  getReporteProductosMasVendidos,
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

function recortarTexto(
  texto: string,
  limite = 18
): string {
  if (
    !texto ||
    texto.length <= limite
  ) {
    return texto;
  }

  return `${texto.slice(
    0,
    limite
  )}...`;
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

type ProductoReporte = {
  idProducto: string;
  nombre: string;
  marca?: string;
  idCategoria?: string;
  cantidadVendida: number;
  totalVendido: number;
  costoTotal: number;
  utilidad: number;
  precioPromedio: number;
};

type TooltipProductoProps = {
  active?: boolean;
  payload?: Array<{
    value?: number;
    payload?: ProductoReporte & {
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
      borde:
        "border-gray-200",
      icono:
        "bg-gray-100 text-gray-700",
      valor:
        "text-gray-900",
    },

    principal: {
      borde:
        "border-gray-900",
      icono:
        "bg-gray-900 text-white",
      valor:
        "text-gray-900",
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
   TOOLTIP
===================================================== */

function TooltipProducto({
  active,
  payload,
  tipo = "cantidad",
}: TooltipProductoProps) {
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
        max-w-xs rounded-xl
        border border-gray-200
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

      {item?.marca && (
        <p
          className="
            mt-1 text-xs
            text-gray-500
          "
        >
          {item.marca}
        </p>
      )}

      <p
        className="
          mt-2 text-sm
          text-gray-700
        "
      >
        {tipo === "moneda"
          ? mostrarMoneda(
              payload[0]?.value
            )
          : `${mostrarNumero(
              payload[0]?.value
            )} unidades`}
      </p>
    </div>
  );
}

/* =====================================================
   POSICIÓN DEL RANKING
===================================================== */

function IconoPosicion({
  posicion,
}: {
  posicion: number;
}) {
  if (posicion === 1) {
    return (
      <div
        className="
          flex h-9 w-9 items-center
          justify-center rounded-xl
          bg-amber-100 text-amber-700
        "
      >
        <Trophy size={19} />
      </div>
    );
  }

  if (posicion === 2) {
    return (
      <div
        className="
          flex h-9 w-9 items-center
          justify-center rounded-xl
          bg-gray-200 text-gray-700
        "
      >
        <Medal size={19} />
      </div>
    );
  }

  if (posicion === 3) {
    return (
      <div
        className="
          flex h-9 w-9 items-center
          justify-center rounded-xl
          bg-orange-100 text-orange-700
        "
      >
        <Award size={19} />
      </div>
    );
  }

  return (
    <div
      className="
        flex h-9 w-9 items-center
        justify-center rounded-xl
        bg-gray-100 text-sm
        font-bold text-gray-700
      "
    >
      {posicion}
    </div>
  );
}

/* =====================================================
   SKELETON
===================================================== */

function ReporteProductosSkeleton() {
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
            h-8 w-80
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
          length: 4,
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

      <div
        className="
          h-[420px] rounded-2xl
          border bg-white
        "
      />
    </div>
  );
}

/* =====================================================
   VISTA PRINCIPAL
===================================================== */

export default function ReporteProductosView() {
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

  const [
    limite,
    setLimite,
  ] = useState(10);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: [
      "reporte-productos-mas-vendidos",
      sucursalId,
      fechaDesde,
      fechaHasta,
      limite,
    ],

    queryFn: () =>
      getReporteProductosMasVendidos({
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
      setLimite(10);
    };

  const productos =
    (data?.data ??
      []) as ProductoReporte[];

  const totalUnidadesVendidas =
    productos.reduce(
      (
        acumulado,
        producto
      ) =>
        acumulado +
        convertirNumero(
          producto.cantidadVendida
        ),
      0
    );

  const totalIngresos =
    productos.reduce(
      (
        acumulado,
        producto
      ) =>
        acumulado +
        convertirNumero(
          producto.totalVendido
        ),
      0
    );

  const costoTotal =
    productos.reduce(
      (
        acumulado,
        producto
      ) =>
        acumulado +
        convertirNumero(
          producto.costoTotal
        ),
      0
    );

  const utilidadTotal =
    productos.reduce(
      (
        acumulado,
        producto
      ) =>
        acumulado +
        convertirNumero(
          producto.utilidad
        ),
      0
    );

  const margenUtilidad =
    totalIngresos > 0
      ? (utilidadTotal /
          totalIngresos) *
        100
      : 0;

  const productoLider =
    productos[0] ?? null;

  const datosGraficaCantidad =
    useMemo(
      () =>
        productos
          .slice(0, 10)
          .map(
            (
              producto
            ) => ({
              ...producto,

              nombreCorto:
                recortarTexto(
                  producto.nombre,
                  16
                ),

              cantidadVendida:
                convertirNumero(
                  producto.cantidadVendida
                ),
            })
          ),
      [productos]
    );

  const datosGraficaIngresos =
    useMemo(
      () =>
        productos
          .slice(0, 6)
          .map(
            (
              producto
            ) => ({
              ...producto,

              nombreCorto:
                recortarTexto(
                  producto.nombre,
                  16
                ),

              totalVendido:
                convertirNumero(
                  producto.totalVendido
                ),
            })
          ),
      [productos]
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
    modo:
      | "descargar"
      | "imprimir" =
      "descargar"
  ) => {
    if (
      !sucursalId ||
      productos.length === 0
    ) {
      return;
    }

    const documento =
      new jsPDF({
        orientation:
          "landscape",

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

    documento.setFontSize(
      18
    );

    documento.text(
      "PRODUCTOS MÁS VENDIDOS",
      margenIzquierdo,
      15
    );

    documento.setFont(
      "helvetica",
      "normal"
    );

    documento.setFontSize(
      10
    );

    documento.text(
      "Reporte comercial de rotación, ingresos y utilidad",
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
      13,
      {
        align: "right",
      }
    );

    documento.text(
      `Periodo: ${periodoDesde} al ${periodoHasta}`,
      anchoPagina -
        margenDerecho,
      20,
      {
        align: "right",
      }
    );

    documento.text(
      `Generado: ${formatearFechaHoraActual()}`,
      anchoPagina -
        margenDerecho,
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

    documento.setFontSize(
      11
    );

    documento.text(
      "Resumen ejecutivo",
      margenIzquierdo,
      48
    );

    autoTable(documento, {
      startY: 53,

      margin: {
        left:
          margenIzquierdo,

        right:
          margenDerecho,
      },

      head: [
        [
          "Productos analizados",
          "Unidades vendidas",
          "Ingresos",
          "Costo total",
          "Utilidad",
          "Margen",
        ],
      ],

      body: [
        [
          mostrarNumero(
            productos.length
          ),

          mostrarNumero(
            totalUnidadesVendidas
          ),

          mostrarMoneda(
            totalIngresos
          ),

          mostrarMoneda(
            costoTotal
          ),

          mostrarMoneda(
            utilidadTotal
          ),

          mostrarPorcentaje(
            margenUtilidad
          ),
        ],
      ],

      theme: "grid",

      styles: {
        font:
          "helvetica",

        fontSize: 9,

        cellPadding: 3,

        halign:
          "center",

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

        fontStyle:
          "bold",
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
        ?.finalY ?? 75;

    /* TABLA PRINCIPAL */

    documento.setFont(
      "helvetica",
      "bold"
    );

    documento.setFontSize(
      11
    );

    documento.text(
      "Ranking de productos",
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
          "Pos.",
          "Producto",
          "Marca",
          "Cantidad",
          "Precio promedio",
          "Ingreso",
          "Costo",
          "Utilidad",
          "Margen",
        ],
      ],

      body:
        productos.map(
          (
            producto,
            index
          ) => {
            const ingreso =
              convertirNumero(
                producto.totalVendido
              );

            const utilidad =
              convertirNumero(
                producto.utilidad
              );

            const margen =
              ingreso > 0
                ? (utilidad /
                    ingreso) *
                  100
                : 0;

            return [
              index + 1,

              producto.nombre ||
                "Sin nombre",

              producto.marca ||
                "Sin marca",

              mostrarNumero(
                producto.cantidadVendida
              ),

              mostrarMoneda(
                producto.precioPromedio
              ),

              mostrarMoneda(
                producto.totalVendido
              ),

              mostrarMoneda(
                producto.costoTotal
              ),

              mostrarMoneda(
                producto.utilidad
              ),

              mostrarPorcentaje(
                margen
              ),
            ];
          }
        ),

      theme: "grid",

      styles: {
        font:
          "helvetica",

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

        fontStyle:
          "bold",

        halign:
          "center",
      },

      columnStyles: {
        0: {
          cellWidth: 12,
          halign: "center",
        },

        1: {
          cellWidth: 45,
        },

        2: {
          cellWidth: 29,
        },

        3: {
          cellWidth: 22,
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
          cellWidth: 23,
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
              254,
              243,
              199,
            ];

          hookData.cell.styles.fontStyle =
            "bold";
        }

        if (
          hookData.row.index ===
          1
        ) {
          hookData.cell.styles.fillColor =
            [
              243,
              244,
              246,
            ];
        }

        if (
          hookData.row.index ===
          2
        ) {
          hookData.cell.styles.fillColor =
            [
              255,
              237,
              213,
            ];
        }

        if (
          hookData.column.index ===
          7
        ) {
          hookData.cell.styles.textColor =
            [
              4,
              120,
              87,
            ];

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
      ).lastAutoTable
        ?.finalY ?? 160;

    /* INTERPRETACIÓN */

    let posicionInterpretacion =
      posicionTabla + 11;

    if (
      posicionInterpretacion >
      altoPagina - 45
    ) {
      documento.addPage();

      posicionInterpretacion =
        20;
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

    if (productoLider) {
      interpretaciones.push(
        `${productoLider.nombre} ocupa el primer lugar con ${mostrarNumero(
          productoLider.cantidadVendida
        )} unidades vendidas y un ingreso de ${mostrarMoneda(
          productoLider.totalVendido
        )}.`
      );
    }

    interpretaciones.push(
      `Los productos analizados generaron ingresos por ${mostrarMoneda(
        totalIngresos
      )} y una utilidad estimada de ${mostrarMoneda(
        utilidadTotal
      )}.`
    );

    interpretaciones.push(
      `El margen de utilidad acumulado es de ${mostrarPorcentaje(
        margenUtilidad
      )}.`
    );

    if (
      productos.length > 0 &&
      totalUnidadesVendidas > 0
    ) {
      const participacionLider =
        (convertirNumero(
          productoLider
            ?.cantidadVendida
        ) /
          totalUnidadesVendidas) *
        100;

      if (
        participacionLider >
        40
      ) {
        interpretaciones.push(
          "Existe una alta concentración de ventas en el producto principal. Se recomienda garantizar su disponibilidad y evaluar alternativas para diversificar las ventas."
        );
      }
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
      7;

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
          lineas.length *
            5 +
          2;
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
        altoPagina - 14,
        anchoPagina -
          margenDerecho,
        altoPagina - 14
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
        `productos_mas_vendidos_${sucursalId}_${fechaDesde || "inicio"}_${fechaHasta || "actual"}`
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
     ESTADOS
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
                  No se encontró el ID de
                  la sucursal en la ruta.
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
          <ReporteProductosSkeleton />
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
                  reporte de productos
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
                <PackageCheck
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
                  Productos más vendidos
                </h1>

                <p
                  className="
                    mt-1 text-sm
                    text-gray-500
                  "
                >
                  Ranking de productos por
                  cantidad, ingresos y utilidad
                  generada en la sucursal.
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
                  productos.length === 0
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
                  productos.length === 0
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
                  Filtros del reporte
                </h2>

                <p
                  className="
                    mt-1 text-sm
                    text-gray-500
                  "
                >
                  Selecciona el periodo y la
                  cantidad de productos que
                  deseas analizar.
                </p>
              </div>
            </div>

            <div
              className="
                grid gap-4
                md:grid-cols-2
                xl:grid-cols-[1fr_1fr_180px_auto]
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

              <div>
                <label
                  htmlFor="limite"
                  className="
                    mb-2 block
                    text-sm font-semibold
                    text-gray-700
                  "
                >
                  Mostrar
                </label>

                <select
                  id="limite"
                  value={
                    limite
                  }
                  onChange={(
                    event
                  ) =>
                    setLimite(
                      Number(
                        event.target
                          .value
                      )
                    )
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
                    !fechaHasta &&
                    limite === 10
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
          </article>

          {/* TARJETAS */}

          <div
            className="
              grid gap-4
              sm:grid-cols-2
              xl:grid-cols-4
            "
          >
            <TarjetaIndicador
              titulo="Unidades vendidas"
              valor={mostrarNumero(
                totalUnidadesVendidas
              )}
              descripcion="Cantidad acumulada de productos vendidos."
              icono={
                ShoppingBag
              }
              variante="informativo"
            />

            <TarjetaIndicador
              titulo="Ingresos generados"
              valor={mostrarMoneda(
                totalIngresos
              )}
              descripcion="Ingresos obtenidos por los productos analizados."
              icono={
                CircleDollarSign
              }
              variante="principal"
            />

            <TarjetaIndicador
              titulo="Utilidad estimada"
              valor={mostrarMoneda(
                utilidadTotal
              )}
              descripcion="Ganancia generada después de considerar costos."
              icono={
                TrendingUp
              }
              variante="positivo"
            />

            <TarjetaIndicador
              titulo="Margen de utilidad"
              valor={mostrarPorcentaje(
                margenUtilidad
              )}
              descripcion="Porcentaje de utilidad respecto a los ingresos."
              icono={Percent}
              variante={
                margenUtilidad >= 20
                  ? "positivo"
                  : "advertencia"
              }
            />
          </div>

          {/* PRODUCTO LÍDER */}

          {productoLider && (
            <article
              className="
                overflow-hidden
                rounded-2xl border
                border-amber-200
                bg-white shadow-sm
              "
            >
              <div
                className="
                  flex flex-col gap-5
                  bg-gradient-to-r
                  from-amber-50
                  to-white p-5
                  md:flex-row
                  md:items-center
                  md:justify-between
                "
              >
                <div
                  className="
                    flex items-center
                    gap-4
                  "
                >
                  <div
                    className="
                      flex h-14 w-14
                      shrink-0 items-center
                      justify-center
                      rounded-2xl
                      bg-amber-100
                      text-amber-700
                    "
                  >
                    <Trophy
                      size={27}
                    />
                  </div>

                  <div>
                    <p
                      className="
                        text-xs font-bold
                        uppercase tracking-wide
                        text-amber-700
                      "
                    >
                      Producto líder
                    </p>

                    <h2
                      className="
                        mt-1 text-xl
                        font-bold text-gray-900
                      "
                    >
                      {
                        productoLider.nombre
                      }
                    </h2>

                    <p
                      className="
                        mt-1 text-sm
                        text-gray-500
                      "
                    >
                      {productoLider.marca ||
                        "Sin marca registrada"}
                    </p>
                  </div>
                </div>

                <div
                  className="
                    grid gap-3
                    sm:grid-cols-3
                  "
                >
                  <div
                    className="
                      rounded-xl bg-white
                      px-4 py-3 shadow-sm
                    "
                  >
                    <p
                      className="
                        text-xs
                        text-gray-500
                      "
                    >
                      Cantidad
                    </p>

                    <p
                      className="
                        mt-1 text-lg
                        font-bold text-gray-900
                      "
                    >
                      {mostrarNumero(
                        productoLider.cantidadVendida
                      )}
                    </p>
                  </div>

                  <div
                    className="
                      rounded-xl bg-white
                      px-4 py-3 shadow-sm
                    "
                  >
                    <p
                      className="
                        text-xs
                        text-gray-500
                      "
                    >
                      Ingreso
                    </p>

                    <p
                      className="
                        mt-1 text-lg
                        font-bold text-gray-900
                      "
                    >
                      {mostrarMoneda(
                        productoLider.totalVendido
                      )}
                    </p>
                  </div>

                  <div
                    className="
                      rounded-xl bg-white
                      px-4 py-3 shadow-sm
                    "
                  >
                    <p
                      className="
                        text-xs
                        text-gray-500
                      "
                    >
                      Utilidad
                    </p>

                    <p
                      className="
                        mt-1 text-lg
                        font-bold
                        text-emerald-700
                      "
                    >
                      {mostrarMoneda(
                        productoLider.utilidad
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          )}

          {/* GRÁFICAS */}

          <div
            className="
              grid gap-5
              xl:grid-cols-2
            "
          >
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
                  Productos por cantidad vendida
                </h2>

                <p
                  className="
                    mt-1 text-sm
                    text-gray-500
                  "
                >
                  Comparación de unidades vendidas
                  de los principales productos.
                </p>
              </div>

              <div
                className="
                  mt-5 h-[360px]
                  w-full
                "
              >
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <BarChart
                    data={
                      datosGraficaCantidad
                    }
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
                    />

                    <YAxis
                      type="category"
                      dataKey="nombreCorto"
                      width={110}
                      tickLine={false}
                      axisLine={false}
                      tick={{
                        fontSize: 11,
                      }}
                    />

                    <Tooltip
                      content={
                        <TooltipProducto
                          tipo="cantidad"
                        />
                      }
                    />

                    <Bar
                      dataKey="cantidadVendida"
                      radius={[
                        0,
                        8,
                        8,
                        0,
                      ]}
                      maxBarSize={28}
                    >
                      {datosGraficaCantidad.map(
                        (
                          producto,
                          index
                        ) => (
                          <Cell
                            key={`${producto.idProducto}-${index}`}
                            fill={
                              coloresGrafica[
                                index %
                                  coloresGrafica.length
                              ]
                            }
                          />
                        )
                      )}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </article>

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
                  Participación en ingresos
                </h2>

                <p
                  className="
                    mt-1 text-sm
                    text-gray-500
                  "
                >
                  Distribución de ingresos entre
                  los productos principales.
                </p>
              </div>

              {totalIngresos > 0 ? (
                <>
                  <div
                    className="
                      relative mt-4
                      h-[270px] w-full
                    "
                  >
                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >
                      <PieChart>
                        <Pie
                          data={
                            datosGraficaIngresos
                          }
                          dataKey="totalVendido"
                          nameKey="nombre"
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={95}
                          paddingAngle={3}
                        >
                          {datosGraficaIngresos.map(
                            (
                              producto,
                              index
                            ) => (
                              <Cell
                                key={`${producto.idProducto}-${index}`}
                                fill={
                                  coloresGrafica[
                                    index %
                                      coloresGrafica.length
                                  ]
                                }
                              />
                            )
                          )}
                        </Pie>

                        <Tooltip
                          content={
                            <TooltipProducto
                              tipo="moneda"
                            />
                          }
                        />

                        <Legend
                          formatter={(
                            valor
                          ) =>
                            recortarTexto(
                              String(
                                valor
                              ),
                              24
                            )
                          }
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
                            text-xl font-bold
                            text-gray-900
                          "
                        >
                          {mostrarMoneda(
                            totalIngresos
                          )}
                        </p>

                        <p
                          className="
                            text-xs
                            text-gray-500
                          "
                        >
                          Ingreso total
                        </p>
                      </div>
                    </div>
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
                  <PackageCheck
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
                    Sin datos de productos
                  </p>

                  <p
                    className="
                      mt-1 text-sm
                      text-gray-500
                    "
                  >
                    No existen ventas para representar.
                  </p>
                </div>
              )}
            </article>
          </div>

          {/* TABLA */}

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
                  <FileBarChart
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
                    Ranking detallado
                  </h2>

                  <p
                    className="
                      mt-1 text-sm
                      text-gray-500
                    "
                  >
                    Rendimiento comercial y financiero
                    de cada producto.
                  </p>
                </div>
              </div>
            </div>

            {productos.length > 0 ? (
              <div
                className="
                  overflow-x-auto
                "
              >
                <table
                  className="
                    min-w-[1050px]
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
                          text-center text-xs
                          font-bold uppercase
                          tracking-wide
                          text-gray-500
                        "
                      >
                        Posición
                      </th>

                      <th
                        className="
                          px-5 py-4
                          text-left text-xs
                          font-bold uppercase
                          tracking-wide
                          text-gray-500
                        "
                      >
                        Producto
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
                        Precio promedio
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
                        Ingreso
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
                        Costo
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
                        Utilidad
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
                        Margen
                      </th>
                    </tr>
                  </thead>

                  <tbody
                    className="
                      divide-y
                      divide-gray-100
                    "
                  >
                    {productos.map(
                      (
                        producto,
                        index
                      ) => {
                        const ingreso =
                          convertirNumero(
                            producto.totalVendido
                          );

                        const utilidad =
                          convertirNumero(
                            producto.utilidad
                          );

                        const margen =
                          ingreso > 0
                            ? (utilidad /
                                ingreso) *
                              100
                            : 0;

                        return (
                          <tr
                            key={
                              producto.idProducto ||
                              index
                            }
                            className="
                              transition
                              hover:bg-gray-50
                            "
                          >
                            <td
                              className="
                                px-5 py-4
                              "
                            >
                              <div
                                className="
                                  flex justify-center
                                "
                              >
                                <IconoPosicion
                                  posicion={
                                    index +
                                    1
                                  }
                                />
                              </div>
                            </td>

                            <td
                              className="
                                px-5 py-4
                              "
                            >
                              <div>
                                <p
                                  className="
                                    font-semibold
                                    text-gray-900
                                  "
                                >
                                  {
                                    producto.nombre
                                  }
                                </p>

                                <p
                                  className="
                                    mt-1 text-sm
                                    text-gray-500
                                  "
                                >
                                  {producto.marca ||
                                    "Sin marca"}
                                </p>
                              </div>
                            </td>

                            <td
                              className="
                                px-5 py-4
                                text-center
                                font-bold
                                text-gray-900
                              "
                            >
                              {mostrarNumero(
                                producto.cantidadVendida
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
                                producto.precioPromedio
                              )}
                            </td>

                            <td
                              className="
                                px-5 py-4
                                text-right
                                font-semibold
                                text-gray-900
                              "
                            >
                              {mostrarMoneda(
                                producto.totalVendido
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
                                producto.costoTotal
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
                                producto.utilidad
                              )}
                            </td>

                            <td
                              className="
                                px-5 py-4
                                text-right
                              "
                            >
                              <span
                                className={`
                                  inline-flex
                                  rounded-full
                                  px-3 py-1
                                  text-xs
                                  font-semibold

                                  ${
                                    margen >=
                                    30
                                      ? "bg-emerald-100 text-emerald-700"
                                      : margen >=
                                          15
                                        ? "bg-amber-100 text-amber-700"
                                        : "bg-red-100 text-red-700"
                                  }
                                `}
                              >
                                {mostrarPorcentaje(
                                  margen
                                )}
                              </span>
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>

                  <tfoot
                    className="
                      bg-gray-900
                      text-white
                    "
                  >
                    <tr>
                      <td
                        colSpan={2}
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
                          totalUnidadesVendidas
                        )}
                      </td>

                      <td
                        className="
                          px-5 py-4
                          text-right
                        "
                      >
                        -
                      </td>

                      <td
                        className="
                          px-5 py-4
                          text-right
                          font-bold
                        "
                      >
                        {mostrarMoneda(
                          totalIngresos
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
                          costoTotal
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
                          utilidadTotal
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
                        {mostrarPorcentaje(
                          margenUtilidad
                        )}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ) : (
              <div
                className="
                  flex min-h-80
                  flex-col items-center
                  justify-center p-8
                  text-center
                "
              >
                <Star
                  size={42}
                  className="
                    text-gray-300
                  "
                />

                <p
                  className="
                    mt-4 font-semibold
                    text-gray-600
                  "
                >
                  No existen productos vendidos
                </p>

                <p
                  className="
                    mt-1 text-sm
                    text-gray-500
                  "
                >
                  Cambia el rango de fechas o registra
                  nuevas ventas.
                </p>
              </div>
            )}
          </article>

          {isFetching && (
            <div
              className="
                fixed bottom-5 right-5
                z-50 flex items-center
                gap-3 rounded-xl
                bg-gray-900 px-4 py-3
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

              Actualizando productos...
            </div>
          )}
        </section>
      </main>
    </div>
  );
}