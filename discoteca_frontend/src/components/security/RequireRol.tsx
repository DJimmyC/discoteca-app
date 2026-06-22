import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import {
  useQuery,
} from "@tanstack/react-query";

import {
  getRoles,
} from "@/api/RolApi";

import {
  useAuth,
} from "@/hooks/useAuth";

type RequireRolProps = {
  nombreRol: string;
  permitirAdmin?: boolean;
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

function esRolAdministrador(
  rol: any
): boolean {
  if (!rol) {
    return false;
  }

  const nombreRol =
    String(
      rol.nombre || ""
    ).toLowerCase();

  const esAdminPorNombre =
    nombreRol === "administrador" ||
    nombreRol === "admin";

  const tieneTodoTrue =
    rol.ventas === true &&
    rol.egresos === true &&
    rol.inventario === true &&
    rol.reportes === true &&
    rol.usuarios === true &&
    rol.configuracion === true;

  return (
    esAdminPorNombre ||
    tieneTodoTrue
  );
}

export default function RequireRol({
  nombreRol,
  permitirAdmin = true,
}: RequireRolProps) {
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
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-slate-700 border-b-fuchsia-500" />
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

  if (
    rolUsuario.estado === false
  ) {
    return (
      <Navigate
        to="/auth/login"
        replace
      />
    );
  }

  const nombreRolUsuario =
    String(
      rolUsuario.nombre || ""
    ).toLowerCase();

  const nombreRolPermitido =
    nombreRol.toLowerCase();

  const adminPermitido =
    permitirAdmin &&
    esRolAdministrador(
      rolUsuario
    );

  if (
    nombreRolUsuario ===
      nombreRolPermitido ||
    adminPermitido
  ) {
    return <Outlet />;
  }

  return (
    <Navigate
      to="/"
      replace
    />
  );
}