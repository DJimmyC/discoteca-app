import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import {
  useQuery,
} from "@tanstack/react-query";

import {
  ShieldAlert,
} from "lucide-react";

import {
  getRoles,
} from "@/api/RolApi";

import {
  useAuth,
} from "@/hooks/useAuth";

type PermisoRol =
  | "ventas"
  | "egresos"
  | "inventario"
  | "reportes"
  | "usuarios"
  | "configuracion";

type RequirePermissionProps = {
  permiso?: PermisoRol;
};

function obtenerIdRol(
  perfil: any
): string {
  if (!perfil) {
    return "";
  }

  if (
    typeof perfil.idRol === "string"
  ) {
    return perfil.idRol;
  }

  if (
    perfil.idRol?._id
  ) {
    return String(
      perfil.idRol._id
    );
  }

  if (
    perfil.rol?._id
  ) {
    return String(
      perfil.rol._id
    );
  }

  return "";
}

export default function RequirePermission({
  permiso,
}: RequirePermissionProps) {
  const location =
    useLocation();

  const {
    data: perfil,
    isLoading: cargandoPerfil,
  } = useAuth();

  const idRol =
    obtenerIdRol(
      perfil
    );

  const {
    data: roles = [],
    isLoading: cargandoRoles,
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

  if (
    cargandoPerfil ||
    cargandoRoles
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-slate-200 border-b-fuchsia-600" />
      </div>
    );
  }

  if (!perfil) {
    return (
      <Navigate
        to="/auth/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  const rolUsuario =
    roles.find(
      (rol: any) =>
        String(rol._id) ===
        String(idRol)
    );

  if (!rolUsuario) {
    return (
      <Navigate
        to="/auth/login"
        replace
      />
    );
  }

  const nombreRol =
    String(
      rolUsuario.nombre || ""
    ).toLowerCase();

  if (
    rolUsuario.estado === false
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md rounded-3xl border border-red-200 bg-white p-8 text-center shadow-xl">
          <ShieldAlert className="mx-auto h-16 w-16 text-red-600" />

          <h1 className="mt-4 text-2xl font-black text-slate-900">
            Rol inactivo
          </h1>

          <p className="mt-2 text-slate-500">
            Tu rol está inactivo. Comunícate con el administrador.
          </p>
        </div>
      </div>
    );
  }

  /*
    Si el usuario es Mesero, nunca debe entrar
    al panel administrativo aunque conozca la ruta.
  */
  if (nombreRol === "mesero") {
    return (
      <Navigate
        to="/mesero"
        replace
      />
    );
  }

  /*
    Si no se manda permiso, solamente validamos:
    - que esté logueado
    - que no sea Mesero
    - que el rol esté activo
  */
  if (!permiso) {
    return <Outlet />;
  }

  /*
    Si el rol tiene el permiso en true,
    entra al módulo.
  */
  if (
    rolUsuario[permiso] === true
  ) {
    return <Outlet />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md rounded-3xl border border-red-200 bg-white p-8 text-center shadow-xl">
        <ShieldAlert className="mx-auto h-16 w-16 text-red-600" />

        <h1 className="mt-4 text-2xl font-black text-slate-900">
          Acceso denegado
        </h1>

        <p className="mt-2 text-slate-500">
          No tienes permiso para entrar a este módulo.
        </p>
      </div>
    </div>
  );
}