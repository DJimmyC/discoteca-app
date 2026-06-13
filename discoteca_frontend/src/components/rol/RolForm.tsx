import React from "react";
import { motion } from "framer-motion";

import {
  ShieldCheck,
  Save,
  Receipt,
  Package,
  BarChart3,
  Users,
  Settings,
  Wallet,
} from "lucide-react";

import type {
  RolFormData,
} from "@/types/RolType";

/* =========================
   TIPOS
========================= */

type PermisoKey =
  | "ventas"
  | "egresos"
  | "inventario"
  | "reportes"
  | "usuarios"
  | "configuracion";

interface RolFormProps {
  formData: RolFormData;

  setFormData:
    React.Dispatch<
      React.SetStateAction<RolFormData>
    >;

  handleSubmit:
    (
      e: React.FormEvent<HTMLFormElement>
    ) => void;

  isPending?: boolean;

  submitText?: string;

  cancelAction?: () => void;
}

/* =========================
   PERMISOS
========================= */

const permisos: Array<{
  key: PermisoKey;
  label: string;
  icon: React.ElementType;
}> = [
  {
    key: "ventas",
    label: "Ventas",
    icon: Receipt,
  },
  {
    key: "egresos",
    label: "Egresos",
    icon: Wallet,
  },
  {
    key: "inventario",
    label: "Inventario",
    icon: Package,
  },
  {
    key: "reportes",
    label: "Reportes",
    icon: BarChart3,
  },
  {
    key: "usuarios",
    label: "Usuarios",
    icon: Users,
  },
  {
    key: "configuracion",
    label: "Configuración",
    icon: Settings,
  },
];

export default function RolForm({
  formData,
  setFormData,
  handleSubmit,
  isPending = false,
  submitText = "Guardar Rol",
  cancelAction,
}: RolFormProps) {
  /* =========================
     HANDLE CHANGE
  ========================= */

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const {
      name,
      value,
    } = e.target;

    setFormData(
      (prev) => ({
        ...prev,

        [name]:
          value,
      })
    );
  };

  /* =========================
     CAMBIAR ESTADO
  ========================= */

  const toggleEstado = () => {
    setFormData(
      (prev) => ({
        ...prev,

        estado:
          !prev.estado,
      })
    );
  };

  /* =========================
     CAMBIAR PERMISO
  ========================= */

  const togglePermission = (
    field: PermisoKey
  ) => {
    setFormData(
      (prev) => ({
        ...prev,

        [field]:
          !prev[field],
      })
    );
  };

  return (
    <motion.form
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      onSubmit={
        handleSubmit
      }
      className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
    >
      {/* INFORMACIÓN GENERAL */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* NOMBRE */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Nombre del Rol
          </label>

          <input
            type="text"
            name="nombre"
            value={
              formData.nombre
            }
            onChange={
              handleChange
            }
            placeholder="Ej: Administrador"
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none ring-fuchsia-200 transition focus:ring"
            required
          />
        </div>

        {/* ESTADO */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Estado
          </label>

          <button
            type="button"
            onClick={
              toggleEstado
            }
            className="flex h-[52px] w-full items-center rounded-2xl border border-slate-300 px-4 transition hover:bg-slate-50"
          >
            <div
              className={`mr-3 h-4 w-4 rounded-full ${
                formData.estado
                  ? "bg-emerald-500"
                  : "bg-red-500"
              }`}
            />

            <span className="font-medium text-slate-700">
              {formData.estado
                ? "Activo"
                : "Inactivo"}
            </span>
          </button>
        </div>
      </div>

      {/* DESCRIPCIÓN */}

      <div className="mt-6">
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Descripción
        </label>

        <textarea
          name="descripcion"
          value={
            formData.descripcion
          }
          onChange={
            handleChange
          }
          rows={4}
          placeholder="Describe las funciones del rol"
          className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none ring-fuchsia-200 transition focus:ring"
        />
      </div>

      {/* PERMISOS */}

      <div className="mt-10">
        <div className="mb-5 flex items-center gap-3">
          <ShieldCheck className="h-7 w-7 text-fuchsia-600" />

          <h2 className="text-2xl font-black text-slate-800">
            Permisos
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {permisos.map(
            (permiso) => {
              const Icon =
                permiso.icon;

              const activo =
                formData[
                  permiso.key
                ];

              return (
                <div
                  key={
                    permiso.key
                  }
                  className={`
                    rounded-3xl
                    border
                    p-5
                    transition-all
                    duration-300
                    ${
                      activo
                        ? "border-fuchsia-300 bg-fuchsia-50"
                        : "border-slate-200 bg-white"
                    }
                  `}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div
                        className={`
                          mb-4
                          flex
                          h-14
                          w-14
                          items-center
                          justify-center
                          rounded-2xl
                          ${
                            activo
                              ? "bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white"
                              : "bg-slate-100 text-slate-600"
                          }
                        `}
                      >
                        <Icon className="h-7 w-7" />
                      </div>

                      <h3 className="text-lg font-bold text-slate-800">
                        {
                          permiso.label
                        }
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        Permitir acceso al módulo de{" "}
                        {permiso.label.toLowerCase()}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      togglePermission(
                        permiso.key
                      )
                    }
                    className={`
                      mt-6
                      flex
                      w-full
                      items-center
                      justify-center
                      rounded-2xl
                      px-4
                      py-3
                      text-sm
                      font-bold
                      transition-all
                      duration-300
                      ${
                        activo
                          ? "bg-emerald-500 text-white hover:bg-emerald-600"
                          : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                      }
                    `}
                  >
                    {activo
                      ? "ENCENDIDO"
                      : "APAGADO"}
                  </button>
                </div>
              );
            }
          )}
        </div>
      </div>

      {/* BOTONES */}

      <div className="mt-10 flex justify-end gap-4">
        <button
          type="button"
          onClick={
            cancelAction
          }
          className="rounded-2xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={
            isPending
          }
          className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save className="h-5 w-5" />

          {isPending
            ? "Guardando..."
            : submitText}
        </button>
      </div>
    </motion.form>
  );
}