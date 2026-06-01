import {
  useMemo,
  useState,
} from "react";

import {
  Search,
  User,
  Shield,
  Building2,
  Check,
} from "lucide-react";

import type {
  PerfilUsuarioForm,
} from "@/types/PerfilUsuarioType";



import type {
  RolType,
} from "@/types/RolType";

import type {
  SucursalType,
} from "@/types/SucursalType";

type PerfilUsuarioFormProps = {

  formData:
    PerfilUsuarioForm;

  setFormData:
    React.Dispatch<
      React.SetStateAction<PerfilUsuarioForm>
    >;

  onSubmit:
    (e: React.FormEvent) => void;



  roles:
    RolType[];

  sucursales:
    SucursalType[];

  loading?:
    boolean;

  submitText?:
    string;

};

export default function PerfilUsuarioForm({

  formData,

  setFormData,

  onSubmit,



  roles,

  sucursales,

  loading,

  submitText = "Guardar",

}: PerfilUsuarioFormProps) {

  /* =========================
      SEARCH
  ========================= */

  const [searchUsuario, setSearchUsuario] =
    useState("");

  const [searchRol, setSearchRol] =
    useState("");

  const [searchSucursal, setSearchSucursal] =
    useState("");

  /* =========================
      FILTROS
  ========================= */


  const filteredRoles =
    useMemo(() => {

      return roles.filter((r) =>

        r.nombre
          .toLowerCase()
          .includes(
            searchRol.toLowerCase()
          )

      );

    }, [roles, searchRol]);

  const filteredSucursales =
    useMemo(() => {

      return sucursales.filter((s) =>

        s.nombreSucursal
          .toLowerCase()
          .includes(
            searchSucursal.toLowerCase()
          )

      );

    }, [sucursales, searchSucursal]);

  return (

    <form
      onSubmit={onSubmit}
      className="space-y-8"
    >

      {/* =========================
          RELACIONES
      ========================= */}

      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">

        <h2 className="mb-6 text-xl font-black text-slate-700">
          Relaciones del Sistema
        </h2>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        

          {/* =========================
              ROL
          ========================= */}

          <div>

            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">

              <Shield className="h-4 w-4" />

              Rol

            </label>

            <div className="relative mb-3">

              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />

              <input
                type="text"
                placeholder="Buscar rol..."
                value={searchRol}
                onChange={(e) =>
                  setSearchRol(
                    e.target.value
                  )
                }
                className="w-full rounded-2xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-fuchsia-500"
              />

            </div>

            <div className="max-h-56 overflow-y-auto rounded-2xl border border-slate-200 bg-white">

              {filteredRoles.length > 0 ? (

                filteredRoles.map((rol) => (

                  <button
                    key={rol._id}
                    type="button"
                    onClick={() =>
                      setFormData({

                        ...formData,

                        idRol:
                          rol._id!,

                      })
                    }
                    className={`
                      flex
                      w-full
                      items-center
                      justify-between
                      border-b
                      border-slate-100
                      px-4
                      py-3
                      text-left
                      transition
                      hover:bg-fuchsia-50

                      ${
                        formData.idRol === rol._id
                          ? "bg-fuchsia-100"
                          : ""
                      }
                    `}
                  >

                    <span className="text-sm font-medium text-slate-700">

                      {rol.nombre}

                    </span>

                    {formData.idRol === rol._id && (

                      <Check className="h-4 w-4 text-fuchsia-600" />

                    )}

                  </button>

                ))

              ) : (

                <p className="p-4 text-sm text-slate-400">
                  Sin resultados
                </p>

              )}

            </div>

          </div>

          {/* =========================
              SUCURSAL
          ========================= */}

          <div>

            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">

              <Building2 className="h-4 w-4" />

              Sucursal

            </label>

            <div className="relative mb-3">

              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />

              <input
                type="text"
                placeholder="Buscar sucursal..."
                value={searchSucursal}
                onChange={(e) =>
                  setSearchSucursal(
                    e.target.value
                  )
                }
                className="w-full rounded-2xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-fuchsia-500"
              />

            </div>

            <div className="max-h-56 overflow-y-auto rounded-2xl border border-slate-200 bg-white">

              {filteredSucursales.length > 0 ? (

                filteredSucursales.map((sucursal) => (

                  <button
                    key={sucursal._id}
                    type="button"
                    onClick={() =>
                      setFormData({

                        ...formData,

                        idSucursal:
                          sucursal._id!,

                      })
                    }
                    className={`
                      flex
                      w-full
                      items-center
                      justify-between
                      border-b
                      border-slate-100
                      px-4
                      py-3
                      text-left
                      transition
                      hover:bg-fuchsia-50

                      ${
                        formData.idSucursal === sucursal._id
                          ? "bg-fuchsia-100"
                          : ""
                      }
                    `}
                  >

                    <span className="text-sm font-medium text-slate-700">

                      {sucursal.nombreSucursal}

                    </span>

                    {formData.idSucursal === sucursal._id && (

                      <Check className="h-4 w-4 text-fuchsia-600" />

                    )}

                  </button>

                ))

              ) : (

                <p className="p-4 text-sm text-slate-400">
                  Sin resultados
                </p>

              )}

            </div>

          </div>

        </div>

      </div>

      {/* =========================
          DATOS PERSONALES
      ========================= */}

      <div className="rounded-3xl border border-slate-200 bg-white p-6">

        <h2 className="mb-6 text-xl font-black text-slate-700">
          Datos Personales
        </h2>

        <div className="grid grid-cols-12 gap-5">

          {/* NOMBRES */}
          <div className="col-span-12 md:col-span-6">

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Nombres
            </label>

            <input
              type="text"
              value={formData.nombres}
              onChange={(e) =>
                setFormData({

                  ...formData,

                  nombres:
                    e.target.value,

                })
              }
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-fuchsia-500"
            />

          </div>

          {/* APELLIDOS */}
          <div className="col-span-12 md:col-span-6">

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Apellidos
            </label>

            <input
              type="text"
              value={formData.apellidos}
              onChange={(e) =>
                setFormData({

                  ...formData,

                  apellidos:
                    e.target.value,

                })
              }
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-fuchsia-500"
            />

          </div>

          {/* EDAD */}
          <div className="col-span-6 md:col-span-2">

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Edad
            </label>

            <input
              type="number"
              value={formData.edad || ""}
              onChange={(e) =>
                setFormData({

                  ...formData,

                  edad:
                    Number(e.target.value),

                })
              }
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-fuchsia-500"
            />

          </div>

          {/* SEXO */}
          <div className="col-span-6 md:col-span-3">

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Sexo
            </label>

            <select
              value={formData.sexo || ""}
              onChange={(e) =>
                setFormData({

                  ...formData,

                  sexo:
                    e.target.value,

                })
              }
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-fuchsia-500"
            >

              <option value="">
                Seleccione
              </option>

              <option value="Masculino">
                Masculino
              </option>

              <option value="Femenino">
                Femenino
              </option>

            </select>

          </div>

          {/* CI */}
          <div className="col-span-12 md:col-span-3">

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              CI
            </label>

            <input
              type="text"
              value={formData.ci || ""}
              onChange={(e) =>
                setFormData({

                  ...formData,

                  ci:
                    e.target.value,

                })
              }
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-fuchsia-500"
            />

          </div>

          {/* TELEFONO */}
          <div className="col-span-12 md:col-span-4">

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Teléfono
            </label>

            <input
              type="text"
              value={formData.telefono || ""}
              onChange={(e) =>
                setFormData({

                  ...formData,

                  telefono:
                    e.target.value,

                })
              }
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-fuchsia-500"
            />

          </div>

          {/* EMAIL */}
          <div className="col-span-12 md:col-span-8">

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Email
            </label>

            <input
              type="text"
              value={formData.email || ""}
              onChange={(e) =>
                setFormData({

                  ...formData,

                  email:
                    e.target.value,

                })
              }
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-fuchsia-500"
            />

          </div>

          {/* PASSWORD */}
          <div className="col-span-12">

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Password
            </label>

            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({

                  ...formData,

                  password:
                    e.target.value,

                })
              }
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-fuchsia-500"
            />

          </div>

        </div>

      </div>

      {/* =========================
          ESTADO
      ========================= */}

      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5">

        <input
          type="checkbox"
          checked={formData.estado || false}
          onChange={(e) =>
            setFormData({

              ...formData,

              estado:
                e.target.checked,

            })
          }
          className="h-5 w-5"
        />

        <label className="font-medium text-slate-700">
          Perfil activo
        </label>

      </div>

      {/* BOTON */}
      <div className="flex justify-end">

        <button
          type="submit"
          disabled={loading}
          className="
            rounded-2xl
            bg-gradient-to-r
            from-fuchsia-600
            to-purple-600
            px-8
            py-3
            font-semibold
            text-white
            shadow-lg
            transition
            hover:scale-105
          "
        >

          {loading
            ? "Guardando..."
            : submitText}

        </button>

      </div>

    </form>

  );

}