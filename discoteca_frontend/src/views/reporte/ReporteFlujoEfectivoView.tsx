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
  ArrowDownCircle,
  ArrowUpCircle,
  Banknote,
  CalendarDays,
  CircleDollarSign,
  Download,
  FileBarChart,
  Filter,
  LoaderCircle,
  Printer,
  RefreshCcw,
  RotateCcw,
  TrendingDown,
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
  getReporteFlujoEfectivo,
} from "@/api/ReporteApi";

import type {
  FlujoEfectivoResponse,
} from "@/types/ReporteType";

/* =====================================================
   FORMATEADORES
===================================================== */

const formatoMoneda =
  new Intl.NumberFormat(
    "es-BO",
    {
      style: "currency",
      currency: "BOB",
      minimumFractionDigits: 2,
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
  return `${convertirNumero(
    valor
  ).toFixed(2)}%`;
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
    .replace(
      /\b\w/g,
      (letra) =>
        letra.toUpperCase()
    );
}

function formatearFecha(
  fecha?: string
): string {
  if (!fecha) {
    return "-";
  }

  const valor =
    new Date(
      `${fecha}T00:00:00`
    );

  if (
    Number.isNaN(
      valor.getTime()
    )
  ) {
    return fecha;
  }

  return valor.toLocaleDateString(
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
    .replace(/_+/g, "_");
}

/* =====================================================
   TIPOS AUXILIARES
===================================================== */

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

type MovimientoEfectivo = {
  metodoPago: string;
  cantidad: number;
  monto: number;
};

type MetodoPagoAgrupado = {
  metodoPago: string;
  nombre: string;

  entradas: number;
  salidas: number;

  cantidadEntradas: number;
  cantidadSalidas: number;

  flujoNeto: number;
};

type DatoDistribucion = {
  nombre: string;
  monto: number;
  color: string;
};

type TooltipComparativoProps = {
  active?: boolean;

  payload?: Array<{
    name?: string;
    value?: number;
    payload?: MetodoPagoAgrupado;
  }>;

  label?: string;
};

type TooltipDistribucionProps = {
  active?: boolean;

  payload?: Array<{
    value?: number;
    payload?: DatoDistribucion;
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

    negativo: {
      borde:
        "border-red-200",

      icono:
        "bg-red-100 text-red-700",

      valor:
        "text-red-700",
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
              mt-3 break-words
              text-2xl font-bold
              sm:text-3xl
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
            flex h-11 w-11
            shrink-0 items-center
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
   TOOLTIP COMPARATIVO
===================================================== */

function TooltipComparativo({
  active,
  payload,
  label,
}: TooltipComparativoProps) {
  if (
    !active ||
    !payload?.length
  ) {
    return null;
  }

  const item =
    payload[0]?.payload;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-lg">
      <p className="text-sm font-semibold text-gray-900">
        {label}
      </p>

      <p className="mt-2 text-sm text-emerald-700">
        Entradas:{" "}
        <strong>
          {mostrarMoneda(
            item?.entradas
          )}
        </strong>
      </p>

      <p className="mt-1 text-sm text-red-700">
        Salidas:{" "}
        <strong>
          {mostrarMoneda(
            item?.salidas
          )}
        </strong>
      </p>

      <p
        className={`
          mt-1 text-sm
          ${
            convertirNumero(
              item?.flujoNeto
            ) >= 0
              ? "text-blue-700"
              : "text-amber-700"
          }
        `}
      >
        Flujo neto:{" "}
        <strong>
          {mostrarMoneda(
            item?.flujoNeto
          )}
        </strong>
      </p>
    </div>
  );
}

/* =====================================================
   TOOLTIP DISTRIBUCIÓN
===================================================== */

function TooltipDistribucion({
  active,
  payload,
}: TooltipDistribucionProps) {
  if (
    !active ||
    !payload?.length
  ) {
    return null;
  }

  const item =
    payload[0]?.payload;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-lg">
      <p className="text-sm font-semibold text-gray-900">
        {item?.nombre}
      </p>

      <p className="mt-1 text-sm text-gray-600">
        {mostrarMoneda(
          item?.monto
        )}
      </p>
    </div>
  );
}

/* =====================================================
   SKELETON
===================================================== */

function ReporteFlujoEfectivoSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div>
        <div className="h-8 w-80 max-w-full rounded bg-gray-200" />

        <div className="mt-3 h-4 w-96 max-w-full rounded bg-gray-100" />
      </div>

      <div className="h-40 rounded-2xl border bg-white" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({
          length: 4,
        }).map(
          (_, index) => (
            <div
              key={index}
              className="h-40 rounded-2xl border bg-white"
            />
          )
        )}
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <div className="h-[420px] rounded-2xl border bg-white" />

        <div className="h-[420px] rounded-2xl border bg-white" />
      </div>

      <div className="h-[430px] rounded-2xl border bg-white" />
    </div>
  );
}

/* =====================================================
   VISTA PRINCIPAL
===================================================== */

export default function ReporteFlujoEfectivoView() {
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
    metodoPago,
    setMetodoPago,
  ] = useState("");

  const {
    data:
      reporteFlujo,

    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery<
    FlujoEfectivoResponse,
    Error
  >({
    queryKey: [
      "reporte-flujo-efectivo",
      sucursalId,
      fechaDesde,
      fechaHasta,
      metodoPago,
    ],

    queryFn: () =>
      getReporteFlujoEfectivo({
        idSucursal:
          sucursalId!,

        fechaDesde:
          fechaDesde ||
          undefined,

        fechaHasta:
          fechaHasta ||
          undefined,

        metodoPago:
          metodoPago ||
          undefined,
      }),

    enabled:
      Boolean(
        sucursalId
      ),

    staleTime:
      1000 * 60 * 2,

    refetchOnWindowFocus:
      false,
  });

  const entradas =
    (
      reporteFlujo?.entradas ??
      []
    ) as MovimientoEfectivo[];

  const salidas =
    (
      reporteFlujo?.salidas ??
      []
    ) as MovimientoEfectivo[];

  const totalEntradas =
    convertirNumero(
      reporteFlujo
        ?.resumen
        ?.totalEntradas
    );

  const totalSalidas =
    convertirNumero(
      reporteFlujo
        ?.resumen
        ?.totalSalidas
    );

  const flujoNeto =
    convertirNumero(
      reporteFlujo
        ?.resumen
        ?.flujoNeto
    );

  const cantidadEntradas =
    entradas.reduce(
      (
        total,
        item
      ) =>
        total +
        convertirNumero(
          item.cantidad
        ),
      0
    );

  const cantidadSalidas =
    salidas.reduce(
      (
        total,
        item
      ) =>
        total +
        convertirNumero(
          item.cantidad
        ),
      0
    );

  const totalMovimientos =
    cantidadEntradas +
    cantidadSalidas;

  const porcentajeSalidas =
    totalEntradas > 0
      ? (
          totalSalidas /
          totalEntradas
        ) *
        100
      : totalSalidas > 0
        ? 100
        : 0;

  /* =====================================================
     MÉTODOS DISPONIBLES
  ===================================================== */

  const metodosDisponibles =
    useMemo(() => {
      const conjunto =
        new Set<string>();

      entradas.forEach(
        (item) => {
          if (
            item.metodoPago
          ) {
            conjunto.add(
              item.metodoPago
            );
          }
        }
      );

      salidas.forEach(
        (item) => {
          if (
            item.metodoPago
          ) {
            conjunto.add(
              item.metodoPago
            );
          }
        }
      );

      return Array.from(
        conjunto
      ).sort(
        (a, b) =>
          normalizarMetodoPago(
            a
          ).localeCompare(
            normalizarMetodoPago(
              b
            )
          )
      );
    }, [
      entradas,
      salidas,
    ]);

  /* =====================================================
     COMBINAR ENTRADAS Y SALIDAS
  ===================================================== */

  const datosPorMetodo =
    useMemo<
      MetodoPagoAgrupado[]
    >(() => {
      const mapa =
        new Map<
          string,
          MetodoPagoAgrupado
        >();

      entradas.forEach(
        (entrada) => {
          const clave =
            entrada.metodoPago ||
            "sin_especificar";

          const actual =
            mapa.get(
              clave
            ) ?? {
              metodoPago:
                clave,

              nombre:
                normalizarMetodoPago(
                  clave
                ),

              entradas: 0,
              salidas: 0,

              cantidadEntradas:
                0,

              cantidadSalidas:
                0,

              flujoNeto:
                0,
            };

          actual.entradas +=
            convertirNumero(
              entrada.monto
            );

          actual.cantidadEntradas +=
            convertirNumero(
              entrada.cantidad
            );

          mapa.set(
            clave,
            actual
          );
        }
      );

      salidas.forEach(
        (salida) => {
          const clave =
            salida.metodoPago ||
            "sin_especificar";

          const actual =
            mapa.get(
              clave
            ) ?? {
              metodoPago:
                clave,

              nombre:
                normalizarMetodoPago(
                  clave
                ),

              entradas: 0,
              salidas: 0,

              cantidadEntradas:
                0,

              cantidadSalidas:
                0,

              flujoNeto:
                0,
            };

          actual.salidas +=
            convertirNumero(
              salida.monto
            );

          actual.cantidadSalidas +=
            convertirNumero(
              salida.cantidad
            );

          mapa.set(
            clave,
            actual
          );
        }
      );

      return Array.from(
        mapa.values()
      )
        .map(
          (item) => ({
            ...item,

            flujoNeto:
              item.entradas -
              item.salidas,
          })
        )
        .sort(
          (a, b) =>
            (
              b.entradas +
              b.salidas
            ) -
            (
              a.entradas +
              a.salidas
            )
        );
    }, [
      entradas,
      salidas,
    ]);

  const datosDistribucion =
    useMemo<
      DatoDistribucion[]
    >(
      () => [
        {
          nombre:
            "Entradas",

          monto:
            totalEntradas,

          color:
            "#10b981",
        },

        {
          nombre:
            "Salidas",

          monto:
            totalSalidas,

          color:
            "#ef4444",
        },
      ],
      [
        totalEntradas,
        totalSalidas,
      ]
    );

  const metodoMayorEntrada =
    [...datosPorMetodo].sort(
      (a, b) =>
        b.entradas -
        a.entradas
    )[0] ?? null;

  const metodoMayorSalida =
    [...datosPorMetodo].sort(
      (a, b) =>
        b.salidas -
        a.salidas
    )[0] ?? null;

  const limpiarFiltros =
    () => {
      setFechaDesde("");
      setFechaHasta("");
      setMetodoPago("");
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
      datosPorMetodo.length ===
        0
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
      documento
        .internal
        .pageSize
        .getWidth();

    const altoPagina =
      documento
        .internal
        .pageSize
        .getHeight();

    const margenIzquierdo =
      15;

    const margenDerecho =
      15;

    const periodoDesde =
      fechaDesde
        ? formatearFecha(
            fechaDesde
          )
        : "Inicio de registros";

    const periodoHasta =
      fechaHasta
        ? formatearFecha(
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
      "FLUJO DE EFECTIVO",
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
      "Reporte de entradas, salidas y disponibilidad de efectivo",
      margenIzquierdo,
      23
    );

    documento.setFontSize(
      9
    );

    documento.text(
      `Sucursal: ${sucursalId}`,
      anchoPagina -
        margenDerecho,
      13,
      {
        align:
          "right",
      }
    );

    documento.text(
      `Periodo: ${periodoDesde} al ${periodoHasta}`,
      anchoPagina -
        margenDerecho,
      20,
      {
        align:
          "right",
      }
    );

    documento.text(
      `Generado: ${formatearFechaHoraActual()}`,
      anchoPagina -
        margenDerecho,
      27,
      {
        align:
          "right",
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

    documento.setFontSize(
      11
    );

    documento.text(
      "Resumen financiero",
      margenIzquierdo,
      48
    );

    autoTable(
      documento,
      {
        startY:
          53,

        margin: {
          left:
            margenIzquierdo,

          right:
            margenDerecho,
        },

        head: [
          [
            "Entradas",
            "Salidas",
            "Flujo neto",
            "Mov. entrada",
            "Mov. salida",
            "% salidas/entradas",
          ],
        ],

        body: [
          [
            mostrarMoneda(
              totalEntradas
            ),

            mostrarMoneda(
              totalSalidas
            ),

            mostrarMoneda(
              flujoNeto
            ),

            mostrarNumero(
              cantidadEntradas
            ),

            mostrarNumero(
              cantidadSalidas
            ),

            mostrarPorcentaje(
              porcentajeSalidas
            ),
          ],
        ],

        theme:
          "grid",

        styles: {
          font:
            "helvetica",

          fontSize:
            9,

          cellPadding:
            3,

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
      }
    );

    const posicionResumen =
      (
        documento as
          jsPDF & {
            lastAutoTable?: {
              finalY:
                number;
            };
          }
      )
        .lastAutoTable
        ?.finalY ??
      75;

    documento.setFont(
      "helvetica",
      "bold"
    );

    documento.setFontSize(
      11
    );

    documento.text(
      "Detalle por método de pago",
      margenIzquierdo,
      posicionResumen +
        11
    );

    autoTable(
      documento,
      {
        startY:
          posicionResumen +
          16,

        margin: {
          left:
            margenIzquierdo,

          right:
            margenDerecho,
        },

        head: [
          [
            "Método de pago",
            "Cant. entradas",
            "Monto entradas",
            "Cant. salidas",
            "Monto salidas",
            "Flujo neto",
          ],
        ],

        body:
          datosPorMetodo.map(
            (item) => [
              item.nombre,

              mostrarNumero(
                item.cantidadEntradas
              ),

              mostrarMoneda(
                item.entradas
              ),

              mostrarNumero(
                item.cantidadSalidas
              ),

              mostrarMoneda(
                item.salidas
              ),

              mostrarMoneda(
                item.flujoNeto
              ),
            ]
          ),

        foot: [
          [
            "TOTAL",

            mostrarNumero(
              cantidadEntradas
            ),

            mostrarMoneda(
              totalEntradas
            ),

            mostrarNumero(
              cantidadSalidas
            ),

            mostrarMoneda(
              totalSalidas
            ),

            mostrarMoneda(
              flujoNeto
            ),
          ],
        ],

        theme:
          "grid",

        styles: {
          font:
            "helvetica",

          fontSize:
            8,

          cellPadding:
            2.6,

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

        footStyles: {
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
        },

        columnStyles: {
          0: {
            cellWidth:
              55,
          },

          1: {
            halign:
              "center",
          },

          2: {
            halign:
              "right",
          },

          3: {
            halign:
              "center",
          },

          4: {
            halign:
              "right",
          },

          5: {
            halign:
              "right",
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
            hookData.column.index ===
            2
          ) {
            hookData
              .cell
              .styles
              .textColor = [
              4,
              120,
              87,
            ];

            hookData
              .cell
              .styles
              .fontStyle =
              "bold";
          }

          if (
            hookData.column.index ===
            4
          ) {
            hookData
              .cell
              .styles
              .textColor = [
              185,
              28,
              28,
            ];

            hookData
              .cell
              .styles
              .fontStyle =
              "bold";
          }
        },
      }
    );

    const posicionTabla =
      (
        documento as
          jsPDF & {
            lastAutoTable?: {
              finalY:
                number;
            };
          }
      )
        .lastAutoTable
        ?.finalY ??
      150;

    let posicionInterpretacion =
      posicionTabla +
      12;

    if (
      posicionInterpretacion >
      altoPagina -
        45
    ) {
      documento.addPage();

      posicionInterpretacion =
        20;
    }

    documento.setFont(
      "helvetica",
      "bold"
    );

    documento.setFontSize(
      11
    );

    documento.text(
      "Interpretación financiera",
      margenIzquierdo,
      posicionInterpretacion
    );

    const interpretaciones:
      string[] = [];

    interpretaciones.push(
      `Durante el periodo se registraron entradas por ${mostrarMoneda(
        totalEntradas
      )} y salidas por ${mostrarMoneda(
        totalSalidas
      )}.`
    );

    interpretaciones.push(
      flujoNeto >= 0
        ? `El flujo neto fue positivo en ${mostrarMoneda(
            flujoNeto
          )}, lo cual indica que las entradas superaron a las salidas.`
        : `El flujo neto fue negativo en ${mostrarMoneda(
            Math.abs(
              flujoNeto
            )
          )}, lo cual indica que las salidas superaron a las entradas.`
    );

    if (
      metodoMayorEntrada &&
      metodoMayorEntrada
        .entradas >
        0
    ) {
      interpretaciones.push(
        `${metodoMayorEntrada.nombre} fue el método con mayor ingreso, con ${mostrarMoneda(
          metodoMayorEntrada.entradas
        )}.`
      );
    }

    if (
      metodoMayorSalida &&
      metodoMayorSalida
        .salidas >
        0
    ) {
      interpretaciones.push(
        `${metodoMayorSalida.nombre} concentró el mayor monto de salida, con ${mostrarMoneda(
          metodoMayorSalida.salidas
        )}.`
      );
    }

    if (
      porcentajeSalidas >
      90
    ) {
      interpretaciones.push(
        "Las salidas representan una proporción elevada de las entradas. Se recomienda revisar egresos operativos y preservar liquidez."
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
      7;

    interpretaciones.forEach(
      (
        texto,
        index
      ) => {
        const lineas =
          documento.splitTextToSize(
            `${index + 1}. ${texto}`,

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

    /* PIE */

    const totalPaginas =
      documento
        .getNumberOfPages();

    for (
      let pagina = 1;
      pagina <=
      totalPaginas;
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
        altoPagina -
          14,

        anchoPagina -
          margenDerecho,

        altoPagina -
          14
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

        altoPagina -
          8
      );

      documento.text(
        `Página ${pagina} de ${totalPaginas}`,

        anchoPagina -
          margenDerecho,

        altoPagina -
          8,

        {
          align:
            "right",
        }
      );
    }

    const nombreArchivo =
      limpiarNombreArchivo(
        `flujo_efectivo_${sucursalId}_${fechaDesde || "inicio"}_${fechaHasta || "actual"}`
      );

    if (
      modo ===
      "imprimir"
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
                  No se encontró el identificador de la sucursal en la ruta.
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
          <ReporteFlujoEfectivoSkeleton />
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
                  No se pudo cargar el flujo de efectivo
                </h1>

                <p className="mt-2 text-sm text-red-700">
                  {error instanceof
                  Error
                    ? error.message
                    : "Ocurrió un error consultando el reporte."}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    refetch()
                  }
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
                <WalletCards
                  size={24}
                />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  Flujo de efectivo
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Control de entradas, salidas y disponibilidad financiera de la sucursal.
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
                  datosPorMetodo.length ===
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
                  datosPorMetodo.length ===
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
            <div className="mb-5 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                <Filter
                  size={20}
                />
              </div>

              <div>
                <h2 className="font-bold text-gray-900">
                  Filtros del flujo de efectivo
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Selecciona un periodo y método de pago para analizar los movimientos.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_auto]">
              <div>
                <label
                  htmlFor="fechaDesdeFlujo"
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
                    id="fechaDesdeFlujo"
                    type="date"
                    value={
                      fechaDesde
                    }
                    max={
                      fechaHasta ||
                      undefined
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
                    className="
                      w-full rounded-xl border border-gray-300
                      bg-white py-3 pl-11 pr-4 text-sm text-gray-700
                      outline-none transition focus:border-gray-900
                      focus:ring-2 focus:ring-gray-900/10
                    "
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="fechaHastaFlujo"
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
                    id="fechaHastaFlujo"
                    type="date"
                    value={
                      fechaHasta
                    }
                    min={
                      fechaDesde ||
                      undefined
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
                    className="
                      w-full rounded-xl border border-gray-300
                      bg-white py-3 pl-11 pr-4 text-sm text-gray-700
                      outline-none transition focus:border-gray-900
                      focus:ring-2 focus:ring-gray-900/10
                    "
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="metodoPagoFlujo"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Método de pago
                </label>

                <select
                  id="metodoPagoFlujo"
                  value={
                    metodoPago
                  }
                  onChange={(
                    event
                  ) =>
                    setMetodoPago(
                      event
                        .target
                        .value
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
                    Todos los métodos
                  </option>

                  {metodosDisponibles.map(
                    (
                      metodo
                    ) => (
                      <option
                        key={
                          metodo
                        }
                        value={
                          metodo
                        }
                      >
                        {normalizarMetodoPago(
                          metodo
                        )}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={
                    limpiarFiltros
                  }
                  disabled={
                    !fechaDesde &&
                    !fechaHasta &&
                    !metodoPago
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
                  <RotateCcw
                    size={17}
                  />

                  Limpiar
                </button>
              </div>
            </div>
          </article>

          {/* TARJETAS */}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <TarjetaIndicador
              titulo="Total de entradas"
              valor={mostrarMoneda(
                totalEntradas
              )}
              descripcion={`${mostrarNumero(
                cantidadEntradas
              )} movimientos de ingreso registrados.`}
              icono={
                ArrowDownCircle
              }
              variante="positivo"
            />

            <TarjetaIndicador
              titulo="Total de salidas"
              valor={mostrarMoneda(
                totalSalidas
              )}
              descripcion={`${mostrarNumero(
                cantidadSalidas
              )} movimientos de egreso registrados.`}
              icono={
                ArrowUpCircle
              }
              variante="negativo"
            />

            <TarjetaIndicador
              titulo="Flujo neto"
              valor={mostrarMoneda(
                flujoNeto
              )}
              descripcion={
                flujoNeto >=
                0
                  ? "Las entradas superan a las salidas."
                  : "Las salidas superan a las entradas."
              }
              icono={
                flujoNeto >=
                0
                  ? TrendingUp
                  : TrendingDown
              }
              variante={
                flujoNeto >=
                0
                  ? "informativo"
                  : "advertencia"
              }
            />

            <TarjetaIndicador
              titulo="Total movimientos"
              valor={mostrarNumero(
                totalMovimientos
              )}
              descripcion={`${mostrarPorcentaje(
                porcentajeSalidas
              )} de salidas respecto a las entradas.`}
              icono={
                CircleDollarSign
              }
              variante="principal"
            />
          </div>

          {/* INTERPRETACIÓN */}

          <article
            className={`
              rounded-2xl border p-5 shadow-sm
              ${
                flujoNeto >= 0
                  ? "border-emerald-200 bg-emerald-50"
                  : "border-amber-200 bg-amber-50"
              }
            `}
          >
            <div className="flex items-start gap-4">
              <div
                className={`
                  flex h-12 w-12 shrink-0 items-center
                  justify-center rounded-xl
                  ${
                    flujoNeto >=
                    0
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  }
                `}
              >
                {flujoNeto >=
                0 ? (
                  <TrendingUp
                    size={24}
                  />
                ) : (
                  <TrendingDown
                    size={24}
                  />
                )}
              </div>

              <div>
                <h2
                  className={`
                    text-lg font-bold
                    ${
                      flujoNeto >=
                      0
                        ? "text-emerald-800"
                        : "text-amber-800"
                    }
                  `}
                >
                  {flujoNeto >=
                  0
                    ? "Flujo de efectivo positivo"
                    : "Flujo de efectivo negativo"}
                </h2>

                <p
                  className={`
                    mt-2 text-sm leading-6
                    ${
                      flujoNeto >=
                      0
                        ? "text-emerald-700"
                        : "text-amber-700"
                    }
                  `}
                >
                  {flujoNeto >=
                  0
                    ? `La sucursal conserva un flujo disponible de ${mostrarMoneda(
                        flujoNeto
                      )} después de cubrir sus salidas registradas.`
                    : `La sucursal presenta un déficit de ${mostrarMoneda(
                        Math.abs(
                          flujoNeto
                        )
                      )}. Se recomienda revisar los egresos y la disponibilidad de caja.`}
                </p>
              </div>
            </div>
          </article>

          {/* GRÁFICAS */}

          <div className="grid gap-5 xl:grid-cols-2">
            <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Entradas y salidas por método
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Comparación del movimiento de efectivo según la forma de pago.
                </p>
              </div>

              {datosPorMetodo.length >
              0 ? (
                <div className="mt-5 h-[380px] w-full">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <BarChart
                      data={
                        datosPorMetodo
                      }
                      margin={{
                        top: 10,
                        right: 10,
                        left: 5,
                        bottom: 30,
                      }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={
                          false
                        }
                      />

                      <XAxis
                        dataKey="nombre"
                        tickLine={
                          false
                        }
                        axisLine={
                          false
                        }
                        interval={0}
                        angle={-15}
                        textAnchor="end"
                        height={65}
                        tick={{
                          fontSize: 11,
                        }}
                      />

                      <YAxis
                        tickLine={
                          false
                        }
                        axisLine={
                          false
                        }
                        width={85}
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
                          <TooltipComparativo />
                        }
                      />

                      <Legend />

                      <Bar
                        dataKey="entradas"
                        name="Entradas"
                        fill="#10b981"
                        radius={[
                          6,
                          6,
                          0,
                          0,
                        ]}
                        maxBarSize={
                          45
                        }
                      />

                      <Bar
                        dataKey="salidas"
                        name="Salidas"
                        fill="#ef4444"
                        radius={[
                          6,
                          6,
                          0,
                          0,
                        ]}
                        maxBarSize={
                          45
                        }
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="mt-5 flex h-[350px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-300">
                  <WalletCards
                    size={40}
                    className="text-gray-300"
                  />

                  <p className="mt-3 font-semibold text-gray-600">
                    Sin datos para graficar
                  </p>
                </div>
              )}
            </article>

            <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Distribución financiera
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Proporción entre entradas y salidas del periodo.
                </p>
              </div>

              {totalEntradas +
                totalSalidas >
              0 ? (
                <div className="relative mt-4 h-[350px] w-full">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <PieChart>
                      <Pie
                        data={
                          datosDistribucion
                        }
                        dataKey="monto"
                        nameKey="nombre"
                        cx="50%"
                        cy="50%"
                        innerRadius={
                          65
                        }
                        outerRadius={
                          103
                        }
                        paddingAngle={
                          4
                        }
                      >
                        {datosDistribucion.map(
                          (
                            item
                          ) => (
                            <Cell
                              key={
                                item.nombre
                              }
                              fill={
                                item.color
                              }
                            />
                          )
                        )}
                      </Pie>

                      <Tooltip
                        content={
                          <TooltipDistribucion />
                        }
                      />

                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p
                        className={`
                          text-xl font-bold
                          ${
                            flujoNeto >=
                            0
                              ? "text-emerald-700"
                              : "text-red-700"
                          }
                        `}
                      >
                        {mostrarMoneda(
                          flujoNeto
                        )}
                      </p>

                      <p className="text-xs text-gray-500">
                        Flujo neto
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-5 flex h-[350px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-300">
                  <Banknote
                    size={40}
                    className="text-gray-300"
                  />

                  <p className="mt-3 font-semibold text-gray-600">
                    Sin movimientos financieros
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
                  <FileBarChart
                    size={20}
                  />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Flujo por método de pago
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Detalle de ingresos, egresos y saldo por cada método.
                  </p>
                </div>
              </div>
            </div>

            {datosPorMetodo.length >
            0 ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[950px]">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                        Método de pago
                      </th>

                      <th className="px-5 py-4 text-center text-xs font-bold uppercase tracking-wide text-gray-500">
                        Mov. entradas
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-gray-500">
                        Total entradas
                      </th>

                      <th className="px-5 py-4 text-center text-xs font-bold uppercase tracking-wide text-gray-500">
                        Mov. salidas
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-gray-500">
                        Total salidas
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-gray-500">
                        Flujo neto
                      </th>

                      <th className="px-5 py-4 text-center text-xs font-bold uppercase tracking-wide text-gray-500">
                        Estado
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {datosPorMetodo.map(
                      (
                        item
                      ) => (
                        <tr
                          key={
                            item.metodoPago
                          }
                          className="transition hover:bg-gray-50"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                                <WalletCards
                                  size={19}
                                />
                              </div>

                              <p className="font-semibold text-gray-900">
                                {
                                  item.nombre
                                }
                              </p>
                            </div>
                          </td>

                          <td className="px-5 py-4 text-center font-semibold text-gray-700">
                            {mostrarNumero(
                              item.cantidadEntradas
                            )}
                          </td>

                          <td className="px-5 py-4 text-right font-bold text-emerald-700">
                            {mostrarMoneda(
                              item.entradas
                            )}
                          </td>

                          <td className="px-5 py-4 text-center font-semibold text-gray-700">
                            {mostrarNumero(
                              item.cantidadSalidas
                            )}
                          </td>

                          <td className="px-5 py-4 text-right font-bold text-red-700">
                            {mostrarMoneda(
                              item.salidas
                            )}
                          </td>

                          <td
                            className={`
                              px-5 py-4 text-right font-bold
                              ${
                                item.flujoNeto >=
                                0
                                  ? "text-blue-700"
                                  : "text-amber-700"
                              }
                            `}
                          >
                            {mostrarMoneda(
                              item.flujoNeto
                            )}
                          </td>

                          <td className="px-5 py-4 text-center">
                            <span
                              className={`
                                inline-flex rounded-full px-3 py-1
                                text-xs font-semibold
                                ${
                                  item.flujoNeto >=
                                  0
                                    ? "bg-emerald-100 text-emerald-700"
                                    : "bg-red-100 text-red-700"
                                }
                              `}
                            >
                              {item.flujoNeto >=
                              0
                                ? "Positivo"
                                : "Negativo"}
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
                          cantidadEntradas
                        )}
                      </td>

                      <td className="px-5 py-4 text-right font-bold text-emerald-400">
                        {mostrarMoneda(
                          totalEntradas
                        )}
                      </td>

                      <td className="px-5 py-4 text-center font-bold">
                        {mostrarNumero(
                          cantidadSalidas
                        )}
                      </td>

                      <td className="px-5 py-4 text-right font-bold text-red-400">
                        {mostrarMoneda(
                          totalSalidas
                        )}
                      </td>

                      <td
                        className={`
                          px-5 py-4 text-right font-bold
                          ${
                            flujoNeto >=
                            0
                              ? "text-blue-300"
                              : "text-amber-300"
                          }
                        `}
                      >
                        {mostrarMoneda(
                          flujoNeto
                        )}
                      </td>

                      <td className="px-5 py-4 text-center font-bold">
                        {flujoNeto >=
                        0
                          ? "Favorable"
                          : "Desfavorable"}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ) : (
              <div className="flex min-h-80 flex-col items-center justify-center p-8 text-center">
                <WalletCards
                  size={44}
                  className="text-gray-300"
                />

                <p className="mt-4 font-semibold text-gray-600">
                  No existen movimientos de efectivo
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Modifica los filtros o actualiza el reporte.
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

              Actualizando flujo de efectivo...
            </div>
          )}
        </section>
      </main>
    </div>
  );
}