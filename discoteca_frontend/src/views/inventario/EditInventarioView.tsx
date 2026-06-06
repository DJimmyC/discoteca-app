// src/views/inventario/EditInventarioView.tsx

import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import Swal from "sweetalert2";

import {
  ArrowLeft,
  Boxes,
  CircleDollarSign,
  Package,
  Save,
  Warehouse,
} from "lucide-react";

import MenuList from "@/components/MenuList";

import {
  getInventarioById,
  updateInventario,
} from "@/api/InventarioApi";

import {
  useAuth,
} from "@/hooks/useAuth";

import type {
  UpdateInventarioForm,
} from "@/types/InventarioType";

/* =========================
    HELPERS
========================= */

function obtenerTexto(
  valor: unknown,
  defecto = ""
): string {

  if (
    typeof valor ===
      "string" ||
    typeof valor ===
      "number"
  ) {
    return String(valor);
  }

  return defecto;

}

function obtenerNumero(
  valor: unknown
): number {

  const numero =
    Number(valor);

  return Number.isFinite(
    numero
  )
    ? numero
    : 0;

}

function dinero(
  valor: unknown
): string {

  return `Bs. ${obtenerNumero(
    valor
  ).toFixed(2)}`;

}

/* =========================
    COMPONENTE
========================= */

export default function EditInventarioView() {

  const navigate =
    useNavigate();

  const {
    sucursalId,
    inventarioId,
  } = useParams();

  const queryClient =
    useQueryClient();

  const {
    data: perfil,
  } = useAuth();

  const [
    formData,
    setFormData,
  ] =
    useState<UpdateInventarioForm>({

      precioVenta:
        0,

      stockMinimo:
        0,

      estado:
        true,

      actualizadoPor:
        "",

    });

  /* =========================
      CONSULTAR INVENTARIO
  ========================= */

  const {
    data: inventario,
    isLoading,
    isError,
    error,
  } = useQuery({

    queryKey: [
      "inventario",
      inventarioId,
    ],

    queryFn: () =>
      getInventarioById(
        inventarioId!
      ),

    enabled:
      Boolean(
        inventarioId
      ),

  });

  /* =========================
      CARGAR FORM
  ========================= */

  useEffect(() => {

    if (!inventario) {
      return;
    }

    setFormData({

      precioVenta:
        obtenerNumero(
          inventario.precioVenta
        ),

      stockMinimo:
        obtenerNumero(
          inventario.stockMinimo
        ),

      estado:
        inventario.estado ??
        true,

      actualizadoPor:
        perfil?.nombres ||
        "admin",

    });

  }, [
    inventario,
    perfil?.nombres,
  ]);

  /* =========================
      ACTUALIZAR
  ========================= */

  const {
    mutate,
    isPending,
  } = useMutation({

    mutationFn: () =>
      updateInventario({

        inventarioId:
          inventarioId!,

        formData: {

          ...formData,

          precioVenta:
            Number(
              formData.precioVenta
            ),

          stockMinimo:
            Number(
              formData.stockMinimo
            ),

          actualizadoPor:
            perfil?.nombres ||
            "admin",

        },

      }),

    onSuccess:
      async (
        data
      ) => {

        await Swal.fire({

          icon:
            "success",

          title:
            data?.message ||
            "Inventario actualizado",

          timer:
            1800,

          showConfirmButton:
            false,

        });

        await Promise.all([

          queryClient.invalidateQueries({

            queryKey: [
              "inventarios",
            ],

          }),

          queryClient.invalidateQueries({

            queryKey: [
              "inventario",
              inventarioId,
            ],

          }),

          queryClient.invalidateQueries({

            queryKey: [
              "inventario-principal",
              sucursalId,
            ],

          }),

          queryClient.invalidateQueries({

            queryKey: [
              "inventario-barra",
              sucursalId,
            ],

          }),

        ]);

        navigate(
          `/sucursal/${sucursalId}/inventario`
        );

      },

    onError:
      async (
        error
      ) => {

        await Swal.fire({

          icon:
            "error",

          title:
            "Error al actualizar",

          text:
            error instanceof Error
              ? error.message
              : "No se pudo actualizar el inventario",

        });

      },

  });

  /* =========================
      SUBMIT
  ========================= */

  const handleSubmit =
    (
      event:
        React.FormEvent<HTMLFormElement>
    ) => {

      event.preventDefault();

      if (
        obtenerNumero(
          formData.precioVenta
        ) < 0
      ) {

        void Swal.fire({

          icon:
            "warning",

          title:
            "Precio no válido",

        });

        return;

      }

      if (
        obtenerNumero(
          formData.stockMinimo
        ) < 0
      ) {

        void Swal.fire({

          icon:
            "warning",

          title:
            "Stock mínimo no válido",

        });

        return;

      }

      mutate();

    };

  /* =========================
      DATOS POPULADOS
  ========================= */

  const producto =
    inventario &&
    typeof inventario.idProducto ===
      "object" &&
    inventario.idProducto !==
      null
      ? inventario.idProducto
      : null;

  const almacen =
    inventario &&
    typeof inventario.idAlmacen ===
      "object" &&
    inventario.idAlmacen !==
      null
      ? inventario.idAlmacen
      : null;

  const cantidad =
    obtenerNumero(
      inventario?.cantidad
    );

  const costoPromedio =
    obtenerNumero(
      inventario?.costoUnitario
    );

  const valorInventario =
    inventario
      ?.valorInventario ??
    (
      cantidad *
      costoPromedio
    );

  /* =========================
      LOADING
  ========================= */

  if (isLoading) {

    return (

      <div className="flex min-h-screen items-center justify-center bg-slate-50">

        <div className="text-center">

          <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-slate-200 border-t-fuchsia-600" />

          <p className="mt-4 font-bold text-slate-600">

            Cargando inventario...

          </p>

        </div>

      </div>

    );

  }

  if (
    isError ||
    !inventario
  ) {

    return (

      <div className="flex min-h-screen items-center justify-center bg-slate-50">

        <div className="rounded-3xl border border-red-200 bg-white p-8 text-center shadow-sm">

          <h2 className="text-xl font-black text-red-600">

            Inventario no encontrado

          </h2>

          <p className="mt-2 text-slate-500">

            {error instanceof Error
              ? error.message
              : "No se pudo cargar el inventario"}

          </p>

        </div>

      </div>

    );

  }

  return (

    <div className="flex min-h-screen bg-slate-50">

      <MenuList />

      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">

        <div className="mx-auto max-w-6xl">

          {/* HEADER */}

          <section className="mb-7 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

              <div>

                <p className="text-sm font-semibold text-fuchsia-600">

                  Configuración de inventario

                </p>

                <h1 className="mt-1 text-3xl font-black text-slate-800">

                  Editar inventario

                </h1>

                <p className="mt-2 text-slate-500">

                  Modifica el precio de venta, stock mínimo o estado.

                </p>

              </div>

              <Link
                to={`/sucursal/${sucursalId}/inventario`}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-3 font-bold text-slate-700 transition hover:bg-slate-100"
              >

                <ArrowLeft className="h-5 w-5" />

                Volver

              </Link>

            </div>

          </section>

          {/* INFORMACIÓN ACTUAL */}

          <section className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <InfoCard
              titulo="Producto"
              valor={obtenerTexto(
                producto?.nombre,
                "Producto"
              )}
              detalle={obtenerTexto(
                producto?.marca,
                "Sin marca"
              )}
              icono={
                <Package className="h-6 w-6" />
              }
            />

            <InfoCard
              titulo="Almacén"
              valor={obtenerTexto(
                almacen?.nombre,
                "Almacén"
              )}
              detalle={obtenerTexto(
                almacen?.tipo,
                "Sin tipo"
              )}
              icono={
                <Warehouse className="h-6 w-6" />
              }
            />

            <InfoCard
              titulo="Stock actual"
              valor={cantidad}
              detalle={`Mínimo: ${obtenerNumero(
                inventario.stockMinimo
              )}`}
              icono={
                <Boxes className="h-6 w-6" />
              }
            />

            <InfoCard
              titulo="Valor inventario"
              valor={dinero(
                valorInventario
              )}
              detalle={`Costo promedio: ${dinero(
                costoPromedio
              )}`}
              icono={
                <CircleDollarSign className="h-6 w-6" />
              }
            />

          </section>

          {/* AVISO */}

          <section className="mb-7 rounded-3xl border border-amber-200 bg-amber-50 p-5">

            <p className="font-black text-amber-800">

              Cantidad y costo promedio protegidos

            </p>

            <p className="mt-1 text-sm text-amber-700">

              Para aumentar el stock utiliza “Registrar entrada”. La cantidad y el costo promedio no deben modificarse manualmente porque son calculados por las operaciones de inventario.

            </p>

          </section>

          {/* FORMULARIO */}

          <form
            onSubmit={
              handleSubmit
            }
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
          >

            <div className="grid gap-6 md:grid-cols-2">

              <div>

                <label
                  htmlFor="precioVenta"
                  className="mb-2 block text-sm font-black text-slate-700"
                >

                  Precio de venta

                </label>

                <input
                  id="precioVenta"
                  type="number"
                  min={0}
                  step="0.01"
                  value={
                    formData.precioVenta ??
                    0
                  }
                  onChange={(
                    event
                  ) =>
                    setFormData(
                      (
                        current
                      ) => ({

                        ...current,

                        precioVenta:
                          Number(
                            event.target.value
                          ),

                      })
                    )
                  }
                  disabled={
                    isPending
                  }
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-fuchsia-500"
                />

                {obtenerNumero(
                  formData.precioVenta
                ) <
                  costoPromedio && (

                  <p className="mt-2 text-sm font-bold text-red-600">

                    Advertencia: el precio de venta es menor que el costo promedio.

                  </p>

                )}

              </div>

              <div>

                <label
                  htmlFor="stockMinimo"
                  className="mb-2 block text-sm font-black text-slate-700"
                >

                  Stock mínimo

                </label>

                <input
                  id="stockMinimo"
                  type="number"
                  min={0}
                  step={1}
                  value={
                    formData.stockMinimo ??
                    0
                  }
                  onChange={(
                    event
                  ) =>
                    setFormData(
                      (
                        current
                      ) => ({

                        ...current,

                        stockMinimo:
                          Number(
                            event.target.value
                          ),

                      })
                    )
                  }
                  disabled={
                    isPending
                  }
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-fuchsia-500"
                />

              </div>

            </div>

            <label className="mt-6 flex cursor-pointer items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">

              <input
                type="checkbox"
                checked={
                  formData.estado ??
                  true
                }
                onChange={(
                  event
                ) =>
                  setFormData(
                    (
                      current
                    ) => ({

                      ...current,

                      estado:
                        event.target.checked,

                    })
                  )
                }
                disabled={
                  isPending
                }
                className="h-5 w-5"
              />

              <div>

                <p className="font-black text-slate-800">

                  Inventario activo

                </p>

                <p className="text-sm text-slate-500">

                  Un inventario inactivo no debe utilizarse para ventas o transferencias.

                </p>

              </div>

            </label>

            <button
              type="submit"
              disabled={
                isPending
              }
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-fuchsia-600 px-6 py-4 font-black text-white transition hover:bg-fuchsia-700 disabled:cursor-not-allowed disabled:opacity-50"
            >

              <Save className="h-5 w-5" />

              {isPending
                ? "Actualizando..."
                : "Guardar cambios"}

            </button>

          </form>

        </div>

      </main>

    </div>

  );

}

/* =========================
    TARJETA INFO
========================= */

type InfoCardProps = {
  titulo: string;
  valor: string | number;
  detalle: string;
  icono: React.ReactNode;
};

function InfoCard({
  titulo,
  valor,
  detalle,
  icono,
}: InfoCardProps) {

  return (

    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-start justify-between gap-3">

        <div>

          <p className="text-sm font-semibold text-slate-500">

            {titulo}

          </p>

          <p className="mt-2 text-lg font-black text-slate-800">

            {valor}

          </p>

          <p className="mt-1 text-xs text-slate-500">

            {detalle}

          </p>

        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-fuchsia-50 text-fuchsia-600">

          {icono}

        </div>

      </div>

    </div>

  );

}