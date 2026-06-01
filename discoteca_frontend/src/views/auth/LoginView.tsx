import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { loginPerfilUsuario } from "@/api/PerfilUsuarioApi";
import { autenticacionUsuario } from "@/api/PerfilUsuarioApi";
import type { LoginForm, LoginSchema } from "@/types/PerfilUsuarioType";
import ErrorMessage from "@/components/ErrorMessage";
import { getRoles } from "@/api/RolApi";

export default function LoginView() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    defaultValues: { email: "", password: "" },
  });
  const {
    data: roles = [],
  } = useQuery({

    queryKey: ["roles"],

    queryFn: getRoles,

  });
  

  const { mutate, isPending } = useMutation({

    mutationFn: autenticacionUsuario,
    onError: (error: any) => {
      toast.error(error?.message ?? "Error al iniciar sesión");
    },
    onSuccess: (data) => {
      toast.success(String(data.nombres ?? "Bienvenido"));

      console.log("Usuario logueado:", data);

      // Buscar el rol completo usando el idRol
      const rolUsuario = roles.find(
        (rol) => rol._id === data.idRol
      );

      console.log("Rol encontrado:", rolUsuario);

      // Verificar si es mesero
      if (rolUsuario?.nombre === "Mesero") {

        navigate("/mesero");

      } else {

        navigate("/");

      }

    },
  });

  const onSubmit = (formData: LoginForm) => mutate(formData);

  return (
    <div className="min-h-[calc(100vh-160px)] grid place-items-center px-4">
      <div className="w-full max-w-xl">
        {/* Encabezado */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
            Iniciar Sesión
          </h1>
          <p className="mt-3 text-slate-200">
            <span className="text-fuchsia-300 font-semibold">
              Inicia sesión para continuar
            </span>
          </p>
        </div>

        {/* Tarjeta */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm backdrop-blur">
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="tu@email.com"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-indigo-200 focus:ring"
                autoComplete="email"
                disabled={isPending}
                {...register("email", {
                  required: "El Email es obligatorio",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "E-mail no válido",
                  },
                })}
              />
              {errors.email && <ErrorMessage>{errors.email.message as string}</ErrorMessage>}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Tu contraseña"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 pr-24 outline-none ring-indigo-200 focus:ring"
                  autoComplete="current-password"
                  disabled={isPending}
                  {...register("password", {
                    required: "El Password es obligatorio",
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-700 hover:bg-slate-50"
                  tabIndex={-1}
                >
                  {showPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>
              {errors.password && <ErrorMessage>{errors.password.message as string}</ErrorMessage>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-white font-semibold shadow-sm transition hover:bg-indigo-700 disabled:opacity-60"
            >
              {isPending ? "Ingresando..." : "Iniciar Sesión"}
            </button>
          </form>

          {/* Links */}
          <nav className="mt-6 space-y-3 text-center">
            <Link
              to="/auth/registrar"
              className="inline-block text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              ¿No tienes una cuenta? <span className="underline">Crear cuenta</span>
            </Link>

            {/* Si luego habilitas recuperación:
            <div>
              <Link
                to="/auth/forgot-password"
                className="inline-block text-sm text-slate-600 hover:text-slate-800"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div> */}
          </nav>
        </div>
      </div>
    </div>
  );
}
