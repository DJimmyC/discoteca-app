import {
  useState,
} from "react";

import {
  useForm,
} from "react-hook-form";

import {
  useMutation,
  useQuery,
} from "@tanstack/react-query";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  toast,
} from "react-toastify";

import {
  ArrowRight,
  BadgeCheck,
  Eye,
  EyeOff,
  Layers3,
  LoaderCircle,
  LockKeyhole,
  LogIn,
  Mail,
  ShieldCheck,
  Sparkles,
  Store,
  UserRoundCheck,
  WalletCards,
} from "lucide-react";

import {
  autenticacionUsuario,
} from "@/api/PerfilUsuarioApi";

import {
  getRoles,
} from "@/api/RolApi";

import type {
  LoginForm,
} from "@/types/PerfilUsuarioType";

import ErrorMessage from "@/components/ErrorMessage";

/* =====================================================
   HELPERS
===================================================== */

function obtenerIdRol(
  usuario: any
): string {
  if (!usuario) {
    return "";
  }

  if (
    typeof usuario.idRol === "string"
  ) {
    return usuario.idRol;
  }

  if (
    usuario.idRol?._id
  ) {
    return String(
      usuario.idRol._id
    );
  }

  if (
    usuario.rol?._id
  ) {
    return String(
      usuario.rol._id
    );
  }

  return "";
}

function obtenerNombreRolDesdeUsuario(
  usuario: any
): string {
  if (!usuario) {
    return "";
  }

  if (
    typeof usuario.idRol === "object" &&
    usuario.idRol?.nombre
  ) {
    return String(
      usuario.idRol.nombre
    );
  }

  if (
    usuario.rol?.nombre
  ) {
    return String(
      usuario.rol.nombre
    );
  }

  if (
    usuario.nombreRol
  ) {
    return String(
      usuario.nombreRol
    );
  }

  return "";
}

function obtenerNombreUsuario(
  usuario: any
): string {
  const nombreCompleto =
    `${usuario?.nombres || ""} ${usuario?.apellidos || ""}`
      .trim();

  return (
    nombreCompleto ||
    usuario?.nombre ||
    usuario?.email ||
    "Bienvenido"
  );
}

/* =====================================================
   VIEW
===================================================== */

export default function LoginView() {
  const navigate =
    useNavigate();

  const [
    showPassword,
    setShowPassword,
  ] =
    useState(false);

  const {
    register,
    handleSubmit,
    formState: {
      errors,
    },
  } =
    useForm<LoginForm>({
      defaultValues: {
        email: "",
        password: "",
      },
    });

  const {
    data: roles = [],
    refetch: refetchRoles,
    isFetching: cargandoRoles,
  } =
    useQuery({
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

  const {
    mutate,
    isPending,
  } =
    useMutation({
      mutationFn:
        autenticacionUsuario,

      onError:
        (error: any) => {
          toast.error(
            error?.message ??
              "Error al iniciar sesión"
          );
        },

      onSuccess:
        async (usuario) => {
          toast.success(
            `Bienvenido ${obtenerNombreUsuario(usuario)}`
          );

          let nombreRol =
            obtenerNombreRolDesdeUsuario(
              usuario
            );

          if (!nombreRol) {
            const idRolUsuario =
              obtenerIdRol(
                usuario
              );

            let listaRoles =
              roles;

            if (
              listaRoles.length === 0
            ) {
              const resultado =
                await refetchRoles();

              listaRoles =
                resultado.data ?? [];
            }

            const rolUsuario =
              listaRoles.find(
                (rol: any) =>
                  String(rol._id) ===
                  String(idRolUsuario)
              );

            nombreRol =
              rolUsuario?.nombre || "";
          }

          if (
            nombreRol.toLowerCase() ===
            "mesero"
          ) {
            navigate(
              "/mesero",
              {
                replace: true,
              }
            );

            return;
          }

          navigate(
            "/",
            {
              replace: true,
            }
          );
        },
    });

  const onSubmit =
    (formData: LoginForm) => {
      mutate(
        formData
      );
    };

  const loginBloqueado =
    isPending ||
    cargandoRoles;

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#09090f] text-white">
      {/* Fondo premium */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(217,70,239,0.35),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(99,102,241,0.35),transparent_30%),radial-gradient(circle_at_50%_90%,rgba(14,165,233,0.22),transparent_30%)]" />

      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(24,24,70,0.9),rgba(88,28,135,0.88))]" />

      <div className="absolute left-10 top-10 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />
      <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />

      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.6)_1px,transparent_1px)] [background-size:44px_44px]" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid w-full max-w-7xl overflow-hidden rounded-[2.2rem] border border-white/10 bg-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl lg:min-h-[720px] lg:grid-cols-[1.1fr_0.9fr]">
          {/* Panel izquierdo */}
          <aside className="relative hidden overflow-hidden p-8 lg:block xl:p-12">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent" />

            <div className="relative z-10 flex h-full flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-fuchsia-100 shadow-lg backdrop-blur">
                  <Sparkles className="h-4 w-4 text-fuchsia-300" />
                  ERP inteligente para tu negocio
                </div>

                <h1 className="mt-10 max-w-2xl text-5xl font-black leading-[1.05] tracking-tight xl:text-6xl">
                  Control total de{" "}
                  <span className="bg-gradient-to-r from-fuchsia-300 via-white to-cyan-200 bg-clip-text text-transparent">
                    ventas, caja e inventario
                  </span>{" "}
                  en tiempo real.
                </h1>

                <p className="mt-6 max-w-xl text-base leading-8 text-slate-300 xl:text-lg">
                  Accede al sistema según tu rol. Cada usuario ve únicamente los módulos autorizados: ventas, egresos, inventario, reportes, usuarios y configuración.
                </p>

                <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                    <WalletCards className="h-6 w-6 text-fuchsia-300" />

                    <p className="mt-3 text-2xl font-black">
                      Caja
                    </p>

                    <p className="mt-1 text-xs text-slate-300">
                      Apertura, cierre y arqueo.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                    <Layers3 className="h-6 w-6 text-cyan-300" />

                    <p className="mt-3 text-2xl font-black">
                      Stock
                    </p>

                    <p className="mt-1 text-xs text-slate-300">
                      Inventario y movimientos.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                    <Store className="h-6 w-6 text-indigo-300" />

                    <p className="mt-3 text-2xl font-black">
                      Ventas
                    </p>

                    <p className="mt-1 text-xs text-slate-300">
                      Meseros y reportes.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 xl:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-xl backdrop-blur">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 to-purple-600 shadow-lg shadow-fuchsia-500/25">
                      <ShieldCheck className="h-6 w-6" />
                    </div>

                    <div>
                      <p className="font-black">
                        Seguridad por roles
                      </p>

                      <p className="mt-1 text-sm leading-5 text-slate-300">
                        Cada perfil tiene permisos específicos.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-xl backdrop-blur">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-blue-500/25">
                      <UserRoundCheck className="h-6 w-6" />
                    </div>

                    <div>
                      <p className="font-black">
                        Panel personalizado
                      </p>

                      <p className="mt-1 text-sm leading-5 text-slate-300">
                        Administrador, mesero, almacén y más.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Panel derecho */}
          <div className="relative bg-white p-5 text-slate-900 sm:p-8 lg:p-10">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-bl-full bg-gradient-to-br from-fuchsia-100 to-indigo-100" />

            <div className="relative z-10 mx-auto flex min-h-[640px] max-w-md flex-col justify-center">
              <div className="mb-8 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.7rem] bg-gradient-to-br from-fuchsia-500 via-purple-600 to-indigo-600 text-white shadow-2xl shadow-fuchsia-500/30">
                  <LockKeyhole className="h-9 w-9" />
                </div>

                <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-black uppercase tracking-wide text-emerald-700">
                  <BadgeCheck className="h-4 w-4" />
                  Acceso seguro
                </div>

                <h2 className="mt-5 text-4xl font-black tracking-tight text-slate-950">
                  Bienvenido
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Ingresa tus credenciales para continuar al sistema.
                </p>
              </div>

              <form
                onSubmit={handleSubmit(
                  onSubmit
                )}
                noValidate
                className="space-y-5"
              >
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-black text-slate-700"
                  >
                    Correo electrónico
                  </label>

                  <div className="group relative">
                    <div className="pointer-events-none absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl bg-slate-100 text-slate-400 transition group-focus-within:bg-fuchsia-100 group-focus-within:text-fuchsia-600">
                      <Mail className="h-5 w-5" />
                    </div>

                    <input
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      autoComplete="email"
                      disabled={loginBloqueado}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-16 pr-4 text-sm font-bold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-fuchsia-400 focus:bg-white focus:ring-4 focus:ring-fuchsia-100 disabled:cursor-not-allowed disabled:opacity-70"
                      {...register(
                        "email",
                        {
                          required:
                            "El Email es obligatorio",

                          pattern: {
                            value:
                              /\S+@\S+\.\S+/,

                            message:
                              "E-mail no válido",
                          },
                        }
                      )}
                    />
                  </div>

                  {errors.email && (
                    <ErrorMessage>
                      {errors.email.message as string}
                    </ErrorMessage>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="text-sm font-black text-slate-700"
                  >
                    Contraseña
                  </label>

                  <div className="group relative">
                    <div className="pointer-events-none absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl bg-slate-100 text-slate-400 transition group-focus-within:bg-fuchsia-100 group-focus-within:text-fuchsia-600">
                      <LockKeyhole className="h-5 w-5" />
                    </div>

                    <input
                      id="password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      placeholder="Tu contraseña"
                      autoComplete="current-password"
                      disabled={loginBloqueado}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-16 pr-14 text-sm font-bold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-fuchsia-400 focus:bg-white focus:ring-4 focus:ring-fuchsia-100 disabled:cursor-not-allowed disabled:opacity-70"
                      {...register(
                        "password",
                        {
                          required:
                            "El Password es obligatorio",
                        }
                      )}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (valor) => !valor
                        )
                      }
                      disabled={loginBloqueado}
                      className="absolute right-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-200 hover:text-slate-800 disabled:opacity-50"
                      tabIndex={-1}
                      aria-label={
                        showPassword
                          ? "Ocultar contraseña"
                          : "Mostrar contraseña"
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>

                  {errors.password && (
                    <ErrorMessage>
                      {errors.password.message as string}
                    </ErrorMessage>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loginBloqueado}
                  className="group relative mt-2 inline-flex w-full items-center justify-center overflow-hidden rounded-2xl bg-slate-950 px-5 py-4 text-sm font-black text-white shadow-2xl shadow-fuchsia-500/20 transition hover:-translate-y-0.5 hover:shadow-fuchsia-500/30 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 opacity-100 transition group-hover:opacity-90" />

                  <span className="relative z-10 inline-flex items-center gap-2">
                    {isPending ? (
                      <>
                        <LoaderCircle className="h-5 w-5 animate-spin" />
                        Ingresando...
                      </>
                    ) : (
                      <>
                        <LogIn className="h-5 w-5 transition group-hover:translate-x-0.5" />
                        Iniciar sesión
                        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                      </>
                    )}
                  </span>
                </button>
              </form>

              <div className="mt-6 rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                    <ShieldCheck className="h-5 w-5" />
                  </div>

                  <p className="text-xs font-medium leading-5 text-slate-500">
                    Tu acceso se valida según el rol asignado. Si un módulo no aparece o no puedes ingresar, solicita permiso al administrador.
                  </p>
                </div>
              </div>

              <nav className="mt-6 text-center">
                <Link
                  to="/auth/registrar"
                  className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-black text-indigo-600 transition hover:bg-indigo-50 hover:text-indigo-700"
                >
                  ¿No tienes una cuenta? Crear cuenta
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}