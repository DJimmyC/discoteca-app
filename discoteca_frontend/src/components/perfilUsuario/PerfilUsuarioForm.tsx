// import {
//   useMemo,
//   useState,
// } from "react";

// import {
//   Search,
//   User,
//   Shield,
//   Building2,
//   Check,
// } from "lucide-react";
// import type {
//   AlmacenType,
// } from "@/types/AlmacenType";
// import type {
//   PerfilUsuarioForm,
// } from "@/types/PerfilUsuarioType";



// import type {
//   RolType,
// } from "@/types/RolType";

// import type {
//   SucursalType,
// } from "@/types/SucursalType";

// type PerfilUsuarioFormProps = {

//   formData:
//     PerfilUsuarioForm;

//   setFormData:
//     React.Dispatch<
//       React.SetStateAction<PerfilUsuarioForm>
//     >;

//   onSubmit:
//     (e: React.FormEvent) => void;

//   roles:
//     RolType[];

//   sucursales:
//     SucursalType[];

//   almacenes:
//     AlmacenType[];

//   loadingAlmacenes?:
//     boolean;

//   loading?:
//     boolean;

//   submitText?:
//     string;

// };
// export default function PerfilUsuarioForm({

//   formData,

//   setFormData,

//   onSubmit,

//   roles,

//   sucursales,

//   almacenes,

//   loadingAlmacenes,

//   loading,

//   submitText = "Guardar",

// }: PerfilUsuarioFormProps) {

//   /* =========================
//       SEARCH
//   ========================= */

//   const [searchUsuario, setSearchUsuario] =
//     useState("");

//   const [searchRol, setSearchRol] =
//     useState("");

//   const [searchSucursal, setSearchSucursal] =
//     useState("");

//     const [searchAlmacen, setSearchAlmacen] =
//   useState("");
//   /* =========================
//       FILTROS
//   ========================= */


//   const filteredRoles =
//     useMemo(() => {

//       return roles.filter((r) =>

//         r.nombre
//           .toLowerCase()
//           .includes(
//             searchRol.toLowerCase()
//           )

//       );

//     }, [roles, searchRol]);

//   const filteredSucursales =
//     useMemo(() => {

//       return sucursales.filter((s) =>

//         s.nombreSucursal
//           .toLowerCase()
//           .includes(
//             searchSucursal.toLowerCase()
//           )

//       );

//     }, [sucursales, searchSucursal]);
//     const filteredAlmacenes =
//   useMemo(() => {

//     return almacenes.filter((almacen) =>

//       almacen.nombre
//         ?.toLowerCase()
//         .includes(
//           searchAlmacen.toLowerCase()
//         )

//     );

//   }, [almacenes, searchAlmacen]);

//   return (

//     <form
//       onSubmit={onSubmit}
//       className="space-y-8"
//     >

//       {/* =========================
//           RELACIONES
//       ========================= */}

//       <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">

//         <h2 className="mb-6 text-xl font-black text-slate-700">
//           Relaciones del Sistema
//         </h2>

//         <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        

//           {/* =========================
//               ROL
//           ========================= */}

//           <div>

//             <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">

//               <Shield className="h-4 w-4" />

//               Rol

//             </label>

//             <div className="relative mb-3">

//               <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />

//               <input
//                 type="text"
//                 placeholder="Buscar rol..."
//                 value={searchRol}
//                 onChange={(e) =>
//                   setSearchRol(
//                     e.target.value
//                   )
//                 }
//                 className="w-full rounded-2xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-fuchsia-500"
//               />

//             </div>

//             <div className="max-h-56 overflow-y-auto rounded-2xl border border-slate-200 bg-white">

//               {filteredRoles.length > 0 ? (

//                 filteredRoles.map((rol) => (

//                   <button
//                     key={rol._id}
//                     type="button"
//                     onClick={() =>
//                       setFormData({

//                         ...formData,

//                         idRol:
//                           rol._id!,

//                       })
//                     }
//                     className={`
//                       flex
//                       w-full
//                       items-center
//                       justify-between
//                       border-b
//                       border-slate-100
//                       px-4
//                       py-3
//                       text-left
//                       transition
//                       hover:bg-fuchsia-50

//                       ${
//                         formData.idRol === rol._id
//                           ? "bg-fuchsia-100"
//                           : ""
//                       }
//                     `}
//                   >

//                     <span className="text-sm font-medium text-slate-700">

//                       {rol.nombre}

//                     </span>

//                     {formData.idRol === rol._id && (

//                       <Check className="h-4 w-4 text-fuchsia-600" />

//                     )}

//                   </button>

//                 ))

//               ) : (

//                 <p className="p-4 text-sm text-slate-400">
//                   Sin resultados
//                 </p>

//               )}

//             </div>

//           </div>

//           {/* =========================
//               SUCURSAL
//           ========================= */}

//           <div>

//             <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">

//               <Building2 className="h-4 w-4" />

//               Sucursal

//             </label>

//             <div className="relative mb-3">

//               <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />

//               <input
//                 type="text"
//                 placeholder="Buscar sucursal..."
//                 value={searchSucursal}
//                 onChange={(e) =>
//                   setSearchSucursal(
//                     e.target.value
//                   )
//                 }
//                 className="w-full rounded-2xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-fuchsia-500"
//               />

//             </div>

//             <div className="max-h-56 overflow-y-auto rounded-2xl border border-slate-200 bg-white">

//               {filteredSucursales.length > 0 ? (

//                 filteredSucursales.map((sucursal) => (

//                   <button
//                     key={sucursal._id}
//                     type="button"
//                     onClick={() =>
//                       setFormData({

//                         ...formData,

//                         idSucursal:
//                           sucursal._id!,

//                       })
//                     }
//                     className={`
//                       flex
//                       w-full
//                       items-center
//                       justify-between
//                       border-b
//                       border-slate-100
//                       px-4
//                       py-3
//                       text-left
//                       transition
//                       hover:bg-fuchsia-50

//                       ${
//                         formData.idSucursal === sucursal._id
//                           ? "bg-fuchsia-100"
//                           : ""
//                       }
//                     `}
//                   >

//                     <span className="text-sm font-medium text-slate-700">

//                       {sucursal.nombreSucursal}

//                     </span>

//                     {formData.idSucursal === sucursal._id && (

//                       <Check className="h-4 w-4 text-fuchsia-600" />

//                     )}

//                   </button>

//                 ))

//               ) : (

//                 <p className="p-4 text-sm text-slate-400">
//                   Sin resultados
//                 </p>

//               )}

//             </div>

//           </div>

//           {/* =========================
//     ALMACEN
// ========================= */}

// <div>

//   <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">

//     <Building2 className="h-4 w-4" />

//     Almacén

//   </label>

//   <div className="relative mb-3">

//     <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />

//     <input
//       type="text"
//       placeholder="Buscar almacén..."
//       value={searchAlmacen}
//       onChange={(e) =>
//         setSearchAlmacen(
//           e.target.value
//         )
//       }
//       className="w-full rounded-2xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-fuchsia-500"
//     />

//   </div>

//   <div className="max-h-56 overflow-y-auto rounded-2xl border border-slate-200 bg-white">

//     {loadingAlmacenes ? (

//       <p className="p-4 text-sm text-slate-400">
//         Cargando almacenes...
//       </p>

//     ) : filteredAlmacenes.length > 0 ? (

//       filteredAlmacenes.map((almacen) => (

//         <button
//           key={almacen._id}
//           type="button"
//           onClick={() =>
//             setFormData({

//               ...formData,

//               idAlmacen:
//                 almacen._id!,

//             })
//           }
//           className={`
//             flex
//             w-full
//             items-center
//             justify-between
//             border-b
//             border-slate-100
//             px-4
//             py-3
//             text-left
//             transition
//             hover:bg-fuchsia-50

//             ${
//               formData.idAlmacen === almacen._id
//                 ? "bg-fuchsia-100"
//                 : ""
//             }
//           `}
//         >

//           <div>

//             <p className="text-sm font-medium text-slate-700">

//               {almacen.nombre}

//             </p>

//             {almacen.tipo && (

//               <p className="text-xs text-slate-400">

//                 {almacen.tipo}

//               </p>

//             )}

//           </div>

//           {formData.idAlmacen === almacen._id && (

//             <Check className="h-4 w-4 text-fuchsia-600" />

//           )}

//         </button>

//       ))

//     ) : (

//       <p className="p-4 text-sm text-slate-400">
//         No hay almacenes para esta sucursal
//       </p>

//     )}

//   </div>

// </div>

//         </div>

//       </div>

//       {/* =========================
//           DATOS PERSONALES
//       ========================= */}

//       <div className="rounded-3xl border border-slate-200 bg-white p-6">

//         <h2 className="mb-6 text-xl font-black text-slate-700">
//           Datos Personales
//         </h2>

//         <div className="grid grid-cols-12 gap-5">

//           {/* NOMBRES */}
//           <div className="col-span-12 md:col-span-6">

//             <label className="mb-2 block text-sm font-semibold text-slate-700">
//               Nombres
//             </label>

//             <input
//               type="text"
//               value={formData.nombres}
//               onChange={(e) =>
//                 setFormData({

//                   ...formData,

//                   nombres:
//                     e.target.value,

//                 })
//               }
//               className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-fuchsia-500"
//             />

//           </div>

//           {/* APELLIDOS */}
//           <div className="col-span-12 md:col-span-6">

//             <label className="mb-2 block text-sm font-semibold text-slate-700">
//               Apellidos
//             </label>

//             <input
//               type="text"
//               value={formData.apellidos}
//               onChange={(e) =>
//                 setFormData({

//                   ...formData,

//                   apellidos:
//                     e.target.value,

//                 })
//               }
//               className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-fuchsia-500"
//             />

//           </div>

//           {/* EDAD */}
//           <div className="col-span-6 md:col-span-2">

//             <label className="mb-2 block text-sm font-semibold text-slate-700">
//               Edad
//             </label>

//             <input
//               type="number"
//               value={formData.edad || ""}
//               onChange={(e) =>
//                 setFormData({

//                   ...formData,

//                   edad:
//                     Number(e.target.value),

//                 })
//               }
//               className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-fuchsia-500"
//             />

//           </div>

//           {/* SEXO */}
//           <div className="col-span-6 md:col-span-3">

//             <label className="mb-2 block text-sm font-semibold text-slate-700">
//               Sexo
//             </label>

//             <select
//               value={formData.sexo || ""}
//               onChange={(e) =>
//                 setFormData({

//                   ...formData,

//                   sexo:
//                     e.target.value,

//                 })
//               }
//               className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-fuchsia-500"
//             >

//               <option value="">
//                 Seleccione
//               </option>

//               <option value="Masculino">
//                 Masculino
//               </option>

//               <option value="Femenino">
//                 Femenino
//               </option>

//             </select>

//           </div>

//           {/* CI */}
//           <div className="col-span-12 md:col-span-3">

//             <label className="mb-2 block text-sm font-semibold text-slate-700">
//               CI
//             </label>

//             <input
//               type="text"
//               value={formData.ci || ""}
//               onChange={(e) =>
//                 setFormData({

//                   ...formData,

//                   ci:
//                     e.target.value,

//                 })
//               }
//               className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-fuchsia-500"
//             />

//           </div>

//           {/* TELEFONO */}
//           <div className="col-span-12 md:col-span-4">

//             <label className="mb-2 block text-sm font-semibold text-slate-700">
//               Teléfono
//             </label>

//             <input
//               type="text"
//               value={formData.telefono || ""}
//               onChange={(e) =>
//                 setFormData({

//                   ...formData,

//                   telefono:
//                     e.target.value,

//                 })
//               }
//               className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-fuchsia-500"
//             />

//           </div>

//           {/* EMAIL */}
//           <div className="col-span-12 md:col-span-8">

//             <label className="mb-2 block text-sm font-semibold text-slate-700">
//               Email
//             </label>

//             <input
//               type="text"
//               value={formData.email || ""}
//               onChange={(e) =>
//                 setFormData({

//                   ...formData,

//                   email:
//                     e.target.value,

//                 })
//               }
//               className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-fuchsia-500"
//             />

//           </div>

//           {/* PASSWORD */}
//           <div className="col-span-12">

//             <label className="mb-2 block text-sm font-semibold text-slate-700">
//               Password
//             </label>

//             <input
//               type="password"
//               value={formData.password}
//               onChange={(e) =>
//                 setFormData({

//                   ...formData,

//                   password:
//                     e.target.value,

//                 })
//               }
//               className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-fuchsia-500"
//             />

//           </div>

//         </div>

//       </div>

//       {/* =========================
//           ESTADO
//       ========================= */}

//       <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5">

//         <input
//           type="checkbox"
//           checked={formData.estado || false}
//           onChange={(e) =>
//             setFormData({

//               ...formData,

//               estado:
//                 e.target.checked,

//             })
//           }
//           className="h-5 w-5"
//         />

//         <label className="font-medium text-slate-700">
//           Perfil activo
//         </label>

//       </div>

//       {/* BOTON */}
//       <div className="flex justify-end">

//         <button
//           type="submit"
//           disabled={loading}
//           className="
//             rounded-2xl
//             bg-gradient-to-r
//             from-fuchsia-600
//             to-purple-600
//             px-8
//             py-3
//             font-semibold
//             text-white
//             shadow-lg
//             transition
//             hover:scale-105
//           "
//         >

//           {loading
//             ? "Guardando..."
//             : submitText}

//         </button>

//       </div>

//     </form>

//   );

// }
import {
  useMemo,
  useState,
} from "react";

import {
  Building2,
  Check,
  Search,
  Shield,
  Warehouse,
} from "lucide-react";

import type {
  PerfilUsuarioForm as PerfilUsuarioFormType,
} from "@/types/PerfilUsuarioType";

import type {
  RolType,
} from "@/types/RolType";

import type {
  SucursalType,
} from "@/types/SucursalType";

import type {
  AlmacenType,
} from "@/types/AlmacenType";

type PerfilUsuarioFormProps = {

  formData:
    PerfilUsuarioFormType;

  setFormData:
    React.Dispatch<
      React.SetStateAction<PerfilUsuarioFormType>
    >;

  onSubmit:
    (e: React.FormEvent) => void;

  roles:
    RolType[];

  sucursales:
    SucursalType[];

  almacenes:
    AlmacenType[];

  loadingAlmacenes?:
    boolean;

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

  almacenes,

  loadingAlmacenes = false,

  loading = false,

  submitText = "Guardar",

}: PerfilUsuarioFormProps) {

  const [searchRol, setSearchRol] =
    useState("");

  const [searchSucursal, setSearchSucursal] =
    useState("");

  const [searchAlmacen, setSearchAlmacen] =
    useState("");

  /* =========================
      FILTROS
  ========================= */

  const filteredRoles =
    useMemo(() => {

      return roles.filter((rol: any) => {

        const nombreRol =
          rol.nombre ||
          rol.nombreRol ||
          "";

        return nombreRol
          .toLowerCase()
          .includes(
            searchRol.toLowerCase()
          );

      });

    }, [roles, searchRol]);

  const filteredSucursales =
    useMemo(() => {

      return sucursales.filter((sucursal: any) => {

        const nombreSucursal =
          sucursal.nombreSucursal ||
          sucursal.nombre ||
          "";

        return nombreSucursal
          .toLowerCase()
          .includes(
            searchSucursal.toLowerCase()
          );

      });

    }, [sucursales, searchSucursal]);

  const filteredAlmacenes =
    useMemo(() => {

      return almacenes.filter((almacen: any) => {

        const nombreAlmacen =
          almacen.nombre ||
          "";

        return nombreAlmacen
          .toLowerCase()
          .includes(
            searchAlmacen.toLowerCase()
          );

      });

    }, [almacenes, searchAlmacen]);

  /* =========================
      HANDLERS
  ========================= */

  const handleSelectRol = (
    idRol: string
  ) => {

    setFormData((prev) => ({

      ...prev,

      idRol,

    }));

  };

  const handleSelectSucursal = (
    idSucursal: string
  ) => {

    setFormData((prev) => ({

      ...prev,

      idSucursal,

      // IMPORTANTE:
      // cada vez que cambia la sucursal,
      // limpiamos el almacén seleccionado
      idAlmacen: "",

    }));

  };

  const handleSelectAlmacen = (
    idAlmacen: string
  ) => {

    setFormData((prev) => ({

      ...prev,

      idAlmacen,

    }));

  };

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {

    const {
      name,
      value,
      type,
    } = e.target;

    setFormData((prev) => ({

      ...prev,

      [name]:
        type === "number"
          ? Number(value)
          : value,

    }));

  };

  return (

    <form
      onSubmit={onSubmit}
      className="space-y-10"
    >

      {/* =========================
          RELACIONES DEL SISTEMA
      ========================= */}

      <section className="rounded-3xl border border-slate-200 bg-slate-50 p-8">

        <h2 className="mb-8 text-2xl font-black text-slate-800">
          Relaciones del Sistema
        </h2>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

          {/* =========================
              ROL
          ========================= */}

          <div>

            <label className="mb-3 flex items-center gap-2 text-base font-semibold text-slate-700">

              <Shield className="h-5 w-5" />

              Rol

            </label>

            <div className="relative mb-4">

              <Search className="absolute left-4 top-4 h-5 w-5 text-slate-400" />

              <input
                type="text"
                placeholder="Buscar rol..."
                value={searchRol}
                onChange={(e) =>
                  setSearchRol(
                    e.target.value
                  )
                }
                className="w-full rounded-2xl border border-slate-300 bg-white py-4 pl-12 pr-4 outline-none focus:border-fuchsia-500"
              />

            </div>

            <div className="max-h-56 overflow-y-auto rounded-2xl border border-slate-200 bg-white">

              {filteredRoles.length > 0 ? (

                filteredRoles.map((rol: any) => {

                  const nombreRol =
                    rol.nombre ||
                    rol.nombreRol ||
                    "Rol";

                  return (

                    <button
                      key={rol._id}
                      type="button"
                      onClick={() =>
                        handleSelectRol(
                          rol._id
                        )
                      }
                      className={`
                        flex
                        w-full
                        items-center
                        justify-between
                        border-b
                        border-slate-100
                        px-5
                        py-4
                        text-left
                        font-semibold
                        text-slate-700
                        transition
                        hover:bg-fuchsia-50

                        ${
                          formData.idRol === rol._id
                            ? "bg-fuchsia-100"
                            : ""
                        }
                      `}
                    >

                      <span>
                        {nombreRol}
                      </span>

                      {formData.idRol === rol._id && (

                        <Check className="h-5 w-5 text-fuchsia-600" />

                      )}

                    </button>

                  );

                })

              ) : (

                <p className="p-5 text-sm text-slate-400">
                  No hay roles disponibles
                </p>

              )}

            </div>

          </div>

          {/* =========================
              SUCURSAL
          ========================= */}

          <div>

            <label className="mb-3 flex items-center gap-2 text-base font-semibold text-slate-700">

              <Building2 className="h-5 w-5" />

              Sucursal

            </label>

            <div className="relative mb-4">

              <Search className="absolute left-4 top-4 h-5 w-5 text-slate-400" />

              <input
                type="text"
                placeholder="Buscar sucursal..."
                value={searchSucursal}
                onChange={(e) =>
                  setSearchSucursal(
                    e.target.value
                  )
                }
                className="w-full rounded-2xl border border-slate-300 bg-white py-4 pl-12 pr-4 outline-none focus:border-fuchsia-500"
              />

            </div>

            <div className="max-h-56 overflow-y-auto rounded-2xl border border-slate-200 bg-white">

              {filteredSucursales.length > 0 ? (

                filteredSucursales.map((sucursal: any) => {

                  const nombreSucursal =
                    sucursal.nombreSucursal ||
                    sucursal.nombre ||
                    "Sucursal";

                  return (

                    <button
                      key={sucursal._id}
                      type="button"
                      onClick={() =>
                        handleSelectSucursal(
                          sucursal._id
                        )
                      }
                      className={`
                        flex
                        w-full
                        items-center
                        justify-between
                        border-b
                        border-slate-100
                        px-5
                        py-4
                        text-left
                        font-semibold
                        text-slate-700
                        transition
                        hover:bg-fuchsia-50

                        ${
                          formData.idSucursal === sucursal._id
                            ? "bg-fuchsia-100"
                            : ""
                        }
                      `}
                    >

                      <span>
                        {nombreSucursal}
                      </span>

                      {formData.idSucursal === sucursal._id && (

                        <Check className="h-5 w-5 text-fuchsia-600" />

                      )}

                    </button>

                  );

                })

              ) : (

                <p className="p-5 text-sm text-slate-400">
                  No hay sucursales disponibles
                </p>

              )}

            </div>

          </div>

          {/* =========================
              ALMACEN
          ========================= */}

          <div>

            <label className="mb-3 flex items-center gap-2 text-base font-semibold text-slate-700">

              <Warehouse className="h-5 w-5" />

              Almacén

            </label>

            <div className="relative mb-4">

              <Search className="absolute left-4 top-4 h-5 w-5 text-slate-400" />

              <input
                type="text"
                placeholder="Buscar almacén..."
                value={searchAlmacen}
                onChange={(e) =>
                  setSearchAlmacen(
                    e.target.value
                  )
                }
                disabled={!formData.idSucursal}
                className="
                  w-full
                  rounded-2xl
                  border
                  border-slate-300
                  bg-white
                  py-4
                  pl-12
                  pr-4
                  outline-none
                  focus:border-fuchsia-500
                  disabled:cursor-not-allowed
                  disabled:bg-slate-100
                "
              />

            </div>

            <div className="max-h-56 overflow-y-auto rounded-2xl border border-slate-200 bg-white">

              {!formData.idSucursal ? (

                <p className="p-5 text-sm text-slate-400">
                  Primero seleccione una sucursal
                </p>

              ) : loadingAlmacenes ? (

                <p className="p-5 text-sm text-slate-400">
                  Cargando almacenes...
                </p>

              ) : filteredAlmacenes.length > 0 ? (

                filteredAlmacenes.map((almacen: any) => {

                  const nombreAlmacen =
                    almacen.nombre ||
                    "Almacén";

                  return (

                    <button
                      key={almacen._id}
                      type="button"
                      onClick={() =>
                        handleSelectAlmacen(
                          almacen._id
                        )
                      }
                      className={`
                        flex
                        w-full
                        items-center
                        justify-between
                        border-b
                        border-slate-100
                        px-5
                        py-4
                        text-left
                        font-semibold
                        text-slate-700
                        transition
                        hover:bg-fuchsia-50

                        ${
                          formData.idAlmacen === almacen._id
                            ? "bg-fuchsia-100"
                            : ""
                        }
                      `}
                    >

                      <div>

                        <p>
                          {nombreAlmacen}
                        </p>

                        {almacen.tipo && (

                          <p className="text-xs font-normal text-slate-400">
                            {almacen.tipo}
                          </p>

                        )}

                      </div>

                      {formData.idAlmacen === almacen._id && (

                        <Check className="h-5 w-5 text-fuchsia-600" />

                      )}

                    </button>

                  );

                })

              ) : (

                <p className="p-5 text-sm text-slate-400">
                  No hay almacenes para esta sucursal
                </p>

              )}

            </div>

          </div>

        </div>

      </section>

      {/* =========================
          DATOS PERSONALES
      ========================= */}

      <section className="rounded-3xl border border-slate-200 bg-white p-8">

        <h2 className="mb-8 text-2xl font-black text-slate-800">
          Datos Personales
        </h2>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          <div>

            <label className="mb-2 block font-semibold text-slate-700">
              Nombres
            </label>

            <input
              type="text"
              name="nombres"
              value={formData.nombres}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-300 px-4 py-4 outline-none focus:border-fuchsia-500"
            />

          </div>

          <div>

            <label className="mb-2 block font-semibold text-slate-700">
              Apellidos
            </label>

            <input
              type="text"
              name="apellidos"
              value={formData.apellidos}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-300 px-4 py-4 outline-none focus:border-fuchsia-500"
            />

          </div>

        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-4">

          <div>

            <label className="mb-2 block font-semibold text-slate-700">
              Edad
            </label>

            <input
              type="number"
              name="edad"
              value={formData.edad || 0}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-300 px-4 py-4 outline-none focus:border-fuchsia-500"
            />

          </div>

          <div>

            <label className="mb-2 block font-semibold text-slate-700">
              Sexo
            </label>

            <select
              name="sexo"
              value={formData.sexo || ""}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-300 px-4 py-4 outline-none focus:border-fuchsia-500"
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

          <div>

            <label className="mb-2 block font-semibold text-slate-700">
              CI
            </label>

            <input
              type="text"
              name="ci"
              value={formData.ci || ""}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-300 px-4 py-4 outline-none focus:border-fuchsia-500"
            />

          </div>

          <div>

            <label className="mb-2 block font-semibold text-slate-700">
              Teléfono
            </label>

            <input
              type="text"
              name="telefono"
              value={formData.telefono || ""}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-300 px-4 py-4 outline-none focus:border-fuchsia-500"
            />

          </div>

        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">

          <div>

            <label className="mb-2 block font-semibold text-slate-700">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-300 px-4 py-4 outline-none focus:border-fuchsia-500"
            />

          </div>

          <div>

            <label className="mb-2 block font-semibold text-slate-700">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password || ""}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-300 px-4 py-4 outline-none focus:border-fuchsia-500"
            />

          </div>

        </div>

      </section>

      {/* =========================
          BOTON
      ========================= */}

      <div className="flex justify-end">

        <button
          type="submit"
          disabled={loading}
          className="
            rounded-2xl
            bg-fuchsia-700
            px-10
            py-4
            font-black
            text-white
            transition
            hover:bg-fuchsia-800
            disabled:cursor-not-allowed
            disabled:opacity-60
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