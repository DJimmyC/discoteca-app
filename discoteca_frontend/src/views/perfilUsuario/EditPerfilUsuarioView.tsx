import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Navigate,
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
  LoaderCircle,
  UserRoundPen,
  X,
} from "lucide-react";

import MenuListDashboard from "@/components/MenuListDashboard";

import PerfilUsuarioForm from "@/components/perfilUsuario/PerfilUsuarioForm";

import {
  getPerfilUsuarioById,
  updatePerfilUsuario,
} from "@/api/PerfilUsuarioApi";

import {
  getRoles,
} from "@/api/RolApi";

import {
  getSucursal,
} from "@/api/SucursalApi";

import {
  getAlmacenes,
} from "@/api/AlmacenApi";

import type {
  PerfilUsuarioForm as PerfilUsuarioFormType,
} from "@/types/PerfilUsuarioType";
import { useAuth } from "@/hooks/useAuth";

/* =====================================================
   ESTADO INICIAL
===================================================== */

const FORM_DATA_INICIAL: PerfilUsuarioFormType = {
  idRol: "",
  idSucursal: "",
  idAlmacen: "",

  nombres: "",
  apellidos: "",

  edad: 0,
  sexo: "",

  ci: "",
  telefono: "",
  email: "",

  password: "",

  estado: true,
  creadoPor: "",
};

/* =====================================================
   OBTENER ID DE REFERENCIA
===================================================== */

function obtenerIdReferencia(
  referencia:
    | string
    | {
        _id?: string;
      }
    | null
    | undefined
): string {
  if (!referencia) {
    return "";
  }

  if (
    typeof referencia ===
    "string"
  ) {
    return referencia;
  }

  return referencia._id ?? "";
}

/* =====================================================
   OBTENER MENSAJE DE ERROR
===================================================== */

function obtenerMensajeError(
  error: unknown
): string {
  if (
    error instanceof Error
  ) {
    return error.message;
  }

  return "Ocurrió un error inesperado.";
}

/* =====================================================
   VISTA
===================================================== */

export default function EditPerfilUsuarioView() {
  const {data:perfil} =useAuth()
  const navigate =
    useNavigate();

  const queryClient =
    useQueryClient();

  const {
    perfilUsuarioId,
  } = useParams<{
    perfilUsuarioId: string;
  }>();

  const [
    formData,
    setFormData,
  ] = useState<PerfilUsuarioFormType>(
    FORM_DATA_INICIAL
  );

  /* =====================================================
     PERFIL
  ===================================================== */

  const {
    data: perfilUsuario,
    isLoading: cargandoPerfil,
    isError: errorPerfil,
    error: perfilError,
  } = useQuery({
    queryKey: [
      "perfilusuario",
      perfilUsuarioId,
    ],

    queryFn: () =>
      getPerfilUsuarioById(
        perfilUsuarioId!
      ),

    enabled:
      Boolean(
        perfilUsuarioId
      ),

    retry:
      false,

    refetchOnWindowFocus:
      false,
  });

  /* =====================================================
     ROLES
  ===================================================== */

  const {
    data: roles = [],
    isLoading: cargandoRoles,
    isError: errorRoles,
  } = useQuery({
    queryKey: [
      "roles",
    ],

    queryFn:
      getRoles,

    staleTime:
      1000 * 60 * 5,

    refetchOnWindowFocus:
      false,
  });

  /* =====================================================
     SUCURSALES
  ===================================================== */

  const {
    data: sucursales = [],
    isLoading:
      cargandoSucursales,
    isError:
      errorSucursales,
  } = useQuery({
    queryKey: [
      "sucursales",
    ],

    queryFn:
      getSucursal,

    staleTime:
      1000 * 60 * 5,

    refetchOnWindowFocus:
      false,
  });

  /* =====================================================
     ALMACENES
  ===================================================== */

  const {
    data: almacenes = [],
    isLoading:
      loadingAlmacenes,
    isError:
      errorAlmacenes,
  } = useQuery({
    queryKey: [
      "almacenes",
    ],

    queryFn:
      getAlmacenes,

    staleTime:
      1000 * 60 * 5,

    refetchOnWindowFocus:
      false,
  });

  /* =====================================================
     FILTRAR ALMACENES POR SUCURSAL
  ===================================================== */

  const almacenesSucursal =
    useMemo(() => {
      if (
        !formData.idSucursal
      ) {
        return [];
      }

      return almacenes.filter(
        (almacen) => {
          const idSucursalAlmacen =
            typeof almacen.idSucursal ===
            "string"
              ? almacen.idSucursal
              : almacen.idSucursal?._id;

          return (
            idSucursalAlmacen ===
            formData.idSucursal
          );
        }
      );
    }, [
      almacenes,
      formData.idSucursal,
    ]);

  /* =====================================================
     CARGAR DATOS DEL PERFIL
  ===================================================== */

  useEffect(() => {
    if (
      !perfilUsuario
    ) {
      return;
    }

    setFormData({
      idRol:
        obtenerIdReferencia(
          perfilUsuario.idRol
        ),

      idSucursal:
        obtenerIdReferencia(
          perfilUsuario.idSucursal
        ),

      idAlmacen:
        obtenerIdReferencia(
          perfilUsuario.idAlmacen
        ),

      nombres:
        perfilUsuario.nombres ??
        "",

      apellidos:
        perfilUsuario.apellidos ??
        "",

      edad:
        Number(
          perfilUsuario.edad ??
          0
        ),

      sexo:
        perfilUsuario.sexo ??
        "",

      ci:
        perfilUsuario.ci ??
        "",

      telefono:
        perfilUsuario.telefono ??
        "",

      email:
        perfilUsuario.email ??
        "",

      password: "",

      estado:
        perfilUsuario.estado ??
        true,

      actualizadoPor:perfil._id
    });
  }, [
    perfilUsuario,
  ]);

  /* =====================================================
     ACTUALIZAR
  ===================================================== */

  const {
    mutate:
      actualizarPerfil,

    isPending,
  } = useMutation({
    mutationFn:
      updatePerfilUsuario,

    onSuccess: async (
      respuesta
    ) => {
      await queryClient.invalidateQueries({
        queryKey: [
          "perfilusuario",
        ],
      });

      await Swal.fire({
        icon:
          "success",

        title:
          "Perfil actualizado",

        text:
          typeof respuesta ===
          "string"
            ? respuesta
            : "El perfil fue actualizado correctamente.",

        timer:
          2000,

        showConfirmButton:
          false,
      });

      navigate(
        "/perfilusuario"
      );
    },

    onError: async (
      error: unknown
    ) => {
      await Swal.fire({
        icon:
          "error",

        title:
          "No se pudo actualizar",

        text:
          obtenerMensajeError(
            error
          ),
      });
    },
  });

  /* =====================================================
     SUBMIT
  ===================================================== */

  const handleSubmit = (
    event:
      React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (
      !perfilUsuarioId
    ) {
      return;
    }

    const datosEnviar = {
      ...formData,
    };

    if (
      !datosEnviar.password
        .trim()
    ) {
      delete (
        datosEnviar as Partial<PerfilUsuarioFormType>
      ).password;
    }

    actualizarPerfil({
      formData:
        datosEnviar,

      perfilUsuarioId,
    });
  };

  /* =====================================================
     VALIDACIONES
  ===================================================== */

  if (
    !perfilUsuarioId
  ) {
    return (
      <Navigate
        to="/404"
        replace
      />
    );
  }

  const cargando =
    cargandoPerfil ||
    cargandoRoles ||
    cargandoSucursales ||
    loadingAlmacenes;

  if (cargando) {
    return (
      <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
        <MenuListDashboard />

        <main className="flex min-w-0 flex-1 items-center justify-center p-6 pt-20 lg:pt-6">
          <div className="flex flex-col items-center">
            <LoaderCircle
              size={42}
              className="animate-spin text-slate-700 dark:text-slate-300"
            />

            <p className="mt-4 text-sm font-medium text-slate-500">
              Cargando perfil...
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (
    errorPerfil ||
    errorRoles ||
    errorSucursales ||
    errorAlmacenes ||
    !perfilUsuario
  ) {
    return (
      <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
        <MenuListDashboard />

        <main className="min-w-0 flex-1 p-4 pt-20 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-red-50 p-6">
            <h1 className="font-bold text-red-800">
              No se pudo cargar el perfil
            </h1>

            <p className="mt-2 text-sm text-red-700">
              {perfilError instanceof
              Error
                ? perfilError.message
                : "No fue posible cargar los datos necesarios."}
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <MenuListDashboard />

      <main className="min-w-0 flex-1 overflow-x-hidden p-4 pt-20 sm:p-6 sm:pt-20 lg:p-8 lg:pt-8">
        <div className="mx-auto w-full max-w-6xl">
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <header className="border-b border-slate-800 bg-slate-900 p-5 text-white sm:p-7">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10">
                    <UserRoundPen
                      size={24}
                    />
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                      Administración de usuarios
                    </p>

                    <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
                      Editar perfil de usuario
                    </h1>

                    <p className="mt-2 text-sm text-slate-300">
                      Actualiza el rol, sucursal, almacén y datos personales.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      "/perfilusuario"
                    )
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/20"
                >
                  <ArrowLeft
                    size={17}
                  />

                  Volver
                </button>
              </div>
            </header>

            <div className="p-4 sm:p-6 lg:p-8">
              <PerfilUsuarioForm
                formData={
                  formData
                }
                setFormData={
                  setFormData
                }
                onSubmit={
                  handleSubmit
                }
                roles={
                  roles
                }
                sucursales={
                  sucursales
                }
                almacenes={
                  almacenesSucursal
                }
                loadingAlmacenes={
                  loadingAlmacenes
                }
                loading={
                  isPending
                }
                submitText="Actualizar perfil"
              />

              <div className="mt-7 flex justify-end border-t border-slate-200 pt-6 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      "/perfilusuario"
                    )
                  }
                  disabled={
                    isPending
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <X size={18} />

                  Cancelar
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}