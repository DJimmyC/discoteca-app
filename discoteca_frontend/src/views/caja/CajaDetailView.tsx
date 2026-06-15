import { useMemo, useState } from "react";
import {
  Link,
  Navigate,
  useParams,
} from "react-router-dom";

import {
  CirclePlus,
  Pencil,
  Search,
  Trash2,
  Archive,
  RefreshCw,
} from "lucide-react";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "react-toastify";

import type {
  CajaListType,
  DeleteCajaType,
} from "@/types/CajaType";

// Ajusta esta ruta al archivo real de tu API.
import {
  getCajasBySucursal,
  deleteCajaById,
} from "@/api/CajaApi";

// l archivo real de tu API.
// import {
//   getCajasBySucursal,
//   deleteCajaById,
// } from "@/api/CajaApi";

/* =========================
    OBTENER DESCRIPCIÓN
========================= */

const obtenerDescripcion = (
  descripcion: CajaListType["descripcion"]
) => {
  if (
    typeof descripcion !== "string" ||
    descripcion.trim() === ""
  ) {
    return "Sin descripción";
  }

  return descripcion;
};

/* =========================
    CAJA DETAIL VIEW
========================= */

export default function CajaDetailView() {
  const {
    sucursalId,
  } = useParams<{
    sucursalId: string;
  }>();

  const queryClient =
    useQueryClient();

  const [busqueda, setBusqueda] =
    useState("");

  const [cajaEliminando, setCajaEliminando] =
    useState<string | null>(null);

  /* =========================
      CONSULTAR CAJAS
  ========================= */

  const {
    data: cajas = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: [
      "cajas",
      sucursalId,
    ],

    queryFn: () =>
      getCajasBySucursal(
        sucursalId!
      ),

    enabled:
      Boolean(sucursalId),

    staleTime:
      1000 * 60 * 2,

    retry: 1,
  });

  /* =========================
      ELIMINAR CAJA
  ========================= */

  const eliminarCajaMutation =
    useMutation({
      mutationFn:
        (
          datos: DeleteCajaType
        ) =>
          deleteCajaById(datos),

      onMutate:
        (
          variables
        ) => {
          setCajaEliminando(
            variables.id
          );
        },

      onSuccess:
        async () => {
          toast.success(
            "Caja eliminada correctamente"
          );

          await queryClient.invalidateQueries({
            queryKey: [
              "cajas",
              sucursalId,
            ],
          });
        },

      onError:
        (
          error: Error
        ) => {
          toast.error(
            error.message ||
              "No se pudo eliminar la caja"
          );
        },

      onSettled:
        () => {
          setCajaEliminando(
            null
          );
        },
    });

  /* =========================
      FILTRAR CAJAS
  ========================= */

  const cajasFiltradas =
    useMemo(() => {
      const termino =
        busqueda
          .trim()
          .toLowerCase();

      if (!termino) {
        return cajas;
      }

      return cajas.filter(
        (caja) => {
          const nombre =
            caja.nombre
              .toLowerCase();

          const descripcion =
            typeof caja.descripcion ===
            "string"
              ? caja.descripcion.toLowerCase()
              : "";

          return (
            nombre.includes(
              termino
            ) ||
            descripcion.includes(
              termino
            )
          );
        }
      );
    }, [
      cajas,
      busqueda,
    ]);

  /* =========================
      CONFIRMAR ELIMINACIÓN
  ========================= */

  const handleEliminar =
    (
      caja: CajaListType
    ) => {
      const confirmar =
        window.confirm(
          `¿Estás seguro de eliminar la caja "${caja.nombre}"?`
        );

      if (!confirmar) {
        return;
      }

      /*
       * Sustituye este valor por el ID real
       * del usuario autenticado.
       *
       * Ejemplo:
       * const eliminadoPor = auth._id;
       */

      const usuarioId =
        localStorage.getItem(
          "usuarioId"
        ) ?? "";

      if (!usuarioId) {
        toast.error(
          "No se encontró el usuario que realiza la eliminación"
        );

        return;
      }

      eliminarCajaMutation.mutate({
        id: caja._id,
        eliminadoPor:
          usuarioId,
      });
    };

  /* =========================
      VALIDAR PARAMETRO
  ========================= */

  if (!sucursalId) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  /* =========================
      LOADING
  ========================= */

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw
            className="h-7 w-7 animate-spin text-blue-600"
          />

          <p className="text-sm text-gray-500">
            Cargando cajas...
          </p>
        </div>
      </div>
    );
  }

  /* =========================
      ERROR
  ========================= */

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
        <h2 className="text-lg font-semibold text-red-700">
          No se pudieron cargar las cajas
        </h2>

        <p className="mt-2 text-sm text-red-600">
          {error instanceof Error
            ? error.message
            : "Ocurrió un error inesperado"}
        </p>

        <button
          type="button"
          onClick={() =>
            refetch()
          }
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
        >
          <RefreshCw className="h-4 w-4" />
          Volver a intentar
        </button>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      {/* =========================
          CABECERA
      ========================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-600">
            Administración
          </p>

          <h1 className="text-2xl font-bold text-gray-900">
            Cajas
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Administra las cajas registradas en esta sucursal.
          </p>
        </div>

        <Link
          to={`/sucursal/${sucursalId}/caja/create`}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          <CirclePlus className="h-5 w-5" />
          Nueva caja
        </Link>
      </div>

      {/* =========================
          RESUMEN Y BUSCADOR
      ========================= */}

      <div className="grid gap-4 md:grid-cols-[220px_1fr]">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Total de cajas
          </p>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            {cajas.length}
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Registradas en la sucursal
          </p>
        </div>

        <div className="flex items-center rounded-2xl border border-gray-200 bg-white px-4 shadow-sm">
          <Search className="h-5 w-5 flex-shrink-0 text-gray-400" />

          <input
            type="search"
            value={busqueda}
            onChange={(
              event
            ) =>
              setBusqueda(
                event.target.value
              )
            }
            placeholder="Buscar por nombre o descripción..."
            className="w-full border-none bg-transparent px-3 py-4 text-sm text-gray-900 outline-none placeholder:text-gray-400"
          />

          {isFetching && (
            <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
          )}
        </div>
      </div>

      {/* =========================
          CONTENIDO
      ========================= */}

      {cajasFiltradas.length ===
      0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
            <Archive className="h-7 w-7 text-gray-400" />
          </div>

          <h2 className="mt-4 text-lg font-semibold text-gray-900">
            {busqueda
              ? "No se encontraron resultados"
              : "No existen cajas registradas"}
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
            {busqueda
              ? "Prueba utilizando otro nombre o descripción."
              : "Registra la primera caja que será utilizada en esta sucursal."}
          </p>

          {!busqueda && (
            <Link
              to={`/sucursal/${sucursalId}/caja/create`}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <CirclePlus className="h-5 w-5" />
              Crear primera caja
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {cajasFiltradas.map(
            (caja) => {
              const eliminando =
                cajaEliminando ===
                caja._id;

              return (
                <article
                  key={caja._id}
                  className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${
                            caja.estado !==
                            false
                              ? "bg-emerald-500"
                              : "bg-gray-300"
                          }`}
                        />

                        <span
                          className={`text-xs font-medium ${
                            caja.estado !==
                            false
                              ? "text-emerald-600"
                              : "text-gray-500"
                          }`}
                        >
                          {caja.estado !==
                          false
                            ? "Activa"
                            : "Inactiva"}
                        </span>
                      </div>

                      <h2 className="mt-3 truncate text-lg font-semibold text-gray-900">
                        {caja.nombre}
                      </h2>
                    </div>

                    <div className="flex items-center gap-1">
                      <Link
                        to={`/sucursal/${sucursalId}/caja/${caja._id}/edit`}
                        title="Editar caja"
                        aria-label={`Editar caja ${caja.nombre}`}
                        className="rounded-lg p-2 text-gray-500 transition hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>

                      <button
                        type="button"
                        title="Eliminar caja"
                        aria-label={`Eliminar caja ${caja.nombre}`}
                        disabled={
                          eliminando
                        }
                        onClick={() =>
                          handleEliminar(
                            caja
                          )
                        }
                        className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {eliminando ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <p className="mt-4 line-clamp-3 min-h-[60px] text-sm leading-5 text-gray-500">
                    {obtenerDescripcion(
                      caja.descripcion
                    )}
                  </p>

                  <div className="mt-5 border-t border-gray-100 pt-4">
                    <Link
                      to={`/sucursal/${sucursalId}/caja/${caja._id}/edit`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
                    >
                      Administrar caja
                      <span aria-hidden="true">
                        →
                      </span>
                    </Link>
                  </div>
                </article>
              );
            }
          )}
        </div>
      )}
    </section>
  );
}