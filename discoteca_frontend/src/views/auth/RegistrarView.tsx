// import { useForm } from "react-hook-form";
// import type { UsuarioRegistraForm } from "@/types/index";
// import ErrorMessage from "@/components/ErrorMessage";
// import { Link, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import api from "@/lib/axios";
// import { useMutation } from "@tanstack/react-query";
// import { crearCuenta } from "@/api/AuthApi";
// import Swal from "sweetalert2";
// import { toast } from "react-toastify";

// interface Sucursal {
//   // _id: string;
//   nombreSucursal: string;
// }

// interface Cargo {
//   _id: string;
//   nombreCargo: string;
// }
// export default function RegisterView() {
//   const navigate = useNavigate()

//   const [sucursales, setSucursales] = useState<Sucursal[]>([]);
//   const [cargos, setCargos] = useState<Cargo[]>([]);
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const { data: sucursalesRes } = await api.get<Sucursal[]>("/sucursal");
//         setSucursales(sucursalesRes);

//         const { data: cargosRes } = await api.get<Cargo[]>("/cargo");
//         setCargos(cargosRes);
//       } catch (error) {
//         console.error("Error cargando sucursales/cargos:", error);
//       }
//     };
//     fetchData();
//   }, []);

//   const initialValues: UsuarioRegistraForm = {
//     nombre: "",
//     ap_paterno: "",
//     ap_materno: "",
//     cargo: "",
//     sucursal: "",
//     edad: 0,
//     telefono: "",
//     genero: "",
//     email: "",
//     password: "",
//     password_confirmation: "",
//     us_creado: "admin",
//     confirmed: true
//   };

//   const { register, handleSubmit, watch, reset, formState: { errors } } =
//     useForm<UsuarioRegistraForm>({ defaultValues: initialValues });


//   const { mutate } = useMutation({
//     mutationFn: crearCuenta,
//     onError: async (error) => {
//       await Swal.fire({
//         icon: 'error',
//         title: error.message,

//         timer: 2000,
//         showConfirmButton: false
//       })
//     },
//     onSuccess: async (data) => {
//       toast.success(data)
//       await Swal.fire({
//         icon: 'success',
//         title: data,
//         timer: 2000,
//         showConfirmButton: false,

//       })
//       navigate("/auth/login");



//     }
//   })
//   const password = watch("password");

//   const handleRegister = (formData: UsuarioRegistraForm) => {
//     mutate(formData)
//     console.log(formData)
//     // aquí haces la petición POST a tu API
//   };

//   return (
//     <>
//       <h1 className="text-5xl font-black text-white">Crear Cuenta</h1>
//       <p className="text-2xl font-light text-white mt-5">
//         Llena el formulario para{" "}
//         <span className=" text-fuchsia-500 font-bold"> crear tu cuenta</span>
//       </p>

//       <form
//         onSubmit={handleSubmit(handleRegister)}
//         className="space-y-8 p-10 bg-white mt-10"
//         noValidate
//       >

//         <div className="flex flex-col gap-5">
//           <label className="font-normal text-2xl">Sucursal</label>
//           <select
//             className="w-full p-3 border-gray-300 border"
//           {...register("sucursal", { required: "La Sucursal es obligatoria" })}
//           >
//             <option value="">-- Selecciona una sucursal --</option>
//             {sucursales.map((s) => (
//               <option key={s._id} value={s._id}>
//                 {s.nombreSucursal || s._id}
//                 {/* {s.nombre} */}
//               </option>
//             ))}
//           </select>
//           {errors.sucursal && <ErrorMessage>{errors.sucursal.message}</ErrorMessage>}
//         </div>



//         <div className="flex flex-col gap-5">
//           <label className="font-normal text-2xl">Cargo</label>
//           <select
//             className="w-full p-3 border-gray-300 border"
//             {...register("cargo", { required: "El Cargo es obligatorio" })}
//           >
//             <option value="">-- Selecciona un cargo --</option>
//             {cargos.map((c) => (
//               <option key={c._id} value={c._id}>
//                 {c.nombreCargo}
//               </option>
//             ))}
//           </select>
//           {errors.cargo && <ErrorMessage>{errors.cargo.message}</ErrorMessage>}
//         </div>


//         {/* NOMBRE */}
//         <div className="flex flex-col gap-5">
//           <label className="font-normal text-2xl">Nombre</label>
//           <input
//             type="text"
//             placeholder="Nombre"
//             className="w-full p-3 border-gray-300 border"
//             {...register("nombre", { required: "El Nombre es obligatorio" })}
//           />
//           {errors.nombre && <ErrorMessage>{errors.nombre.message}</ErrorMessage>}
//         </div>


//         <div className="flex flex-col gap-5">
//           <label className="font-normal text-2xl">Apellido Paterno</label>
//           <input
//             type="text"
//             placeholder="Apellido Paterno"
//             className="w-full p-3 border-gray-300 border"
//             {...register("ap_paterno", { required: "El Apellido Paterno es obligatorio" })}
//           />
//           {errors.ap_paterno && (
//             <ErrorMessage>{errors.ap_paterno.message}</ErrorMessage>
//           )}
//         </div>


//         <div className="flex flex-col gap-5">
//           <label className="font-normal text-2xl">Apellido Materno</label>
//           <input
//             type="text"
//             placeholder="Apellido Materno"
//             className="w-full p-3 border-gray-300 border"
//             {...register("ap_materno", { required: "El Apellido Materno es obligatorio" })}
//           />
//           {errors.ap_materno && (
//             <ErrorMessage>{errors.ap_materno.message}</ErrorMessage>
//           )}
//         </div>

//         <div className="flex flex-col gap-5">
//           <label className="font-normal text-2xl">Edad</label>
//           <input
//             type="number"
//             placeholder="Edad"
//             className="w-full p-3 border-gray-300 border"
//             {...register("edad", {
//               required: "La edad es obligatoria",
//               min: { value: 18, message: "Debe ser mayor de 18" },
//             })}
//           />
//           {errors.edad && <ErrorMessage>{errors.edad.message}</ErrorMessage>}
//         </div>


//         <div className="flex flex-col gap-5">
//           <label className="font-normal text-2xl">Teléfono</label>
//           <input
//             type="text"
//             placeholder="Teléfono"
//             className="w-full p-3 border-gray-300 border"
//             {...register("telefono", { required: "El Teléfono es obligatorio" })}
//           />
//           {errors.telefono && (
//             <ErrorMessage>{errors.telefono.message}</ErrorMessage>
//           )}
//         </div>

//         <div className="flex flex-col gap-5">
//           <label className="font-normal text-2xl">Género</label>
//           <select
//             className="w-full p-3 border-gray-300 border"
//             {...register("genero", { required: "El Género es obligatorio" })}
//           >
//             <option value="">-- Selecciona un género --</option>
//             <option value="masculino">Masculino</option>
//             <option value="femenino">Femenino</option>
//             <option value="Otro">Otro</option>
//           </select>
//           {errors.genero && <ErrorMessage>{errors.genero.message}</ErrorMessage>}
//         </div>


//         {/* EMAIL */}
//         <div className="flex flex-col gap-5">
//           <label className="font-normal text-2xl">Email</label>
//           <input
//             type="email"
//             placeholder="Email de Registro"
//             className="w-full p-3 border-gray-300 border"
//             {...register("email", {
//               required: "El Email de registro es obligatorio",
//               pattern: {
//                 value: /\S+@\S+\.\S+/,
//                 message: "E-mail no válido",
//               },
//             })}
//           />
//           {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
//         </div>

//         {/* PASSWORD */}
//         <div className="flex flex-col gap-5">
//           <label className="font-normal text-2xl">Password</label>
//           <input
//             type="password"
//             placeholder="Password de Registro"
//             className="w-full p-3 border-gray-300 border"
//             {...register("password", {
//               required: "El Password es obligatorio",
//               minLength: {
//                 value: 8,
//                 message: "El Password debe ser mínimo de 8 caracteres",
//               },
//             })}
//           />
//           {errors.password && (
//             <ErrorMessage>{errors.password.message}</ErrorMessage>
//           )}
//         </div>

//         <div className="flex flex-col gap-5">
//           <label className="font-normal text-2xl">Repetir Password</label>
//           <input
//             type="password"
//             placeholder="Repite Password"
//             className="w-full p-3 border-gray-300 border"
//             {...register("password_confirmation", {
//               required: "Repetir Password es obligatorio",
//               validate: (value) =>
//                 value === password || "Los Passwords no son iguales",
//             })}
//           />
//           {errors.password_confirmation && (
//             <ErrorMessage>{errors.password_confirmation.message}</ErrorMessage>
//           )}
//         </div>



//         <input
//           type="submit"
//           value="Registrarme"
//           className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 text-white font-black text-xl cursor-pointer"
//         />
//       </form>
//       <nav className="mt-10 flex flex-col space-y-4">
//         <Link
//           to={'/auth/login'}
//           className="text-center text-gray-300 font-normal">
//           ya tienes una Cuenta?
//         </Link>

//         {/* <Link
//           to={'/auth/forgot-password'}
//           className="text-center text-gray-300 font-normal">
//           Olvidaste tu contraseña? Reestablecer
//         </Link> */}

//       </nav>
//     </>
//   );
// }
