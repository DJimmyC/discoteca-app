import {
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  useMutation,
  useQuery,
} from "@tanstack/react-query";

import Swal from "sweetalert2";

import {
  ArrowLeft,
} from "lucide-react";

import MenuList from "@/components/MenuList";

import InventarioForm from "@/components/inventario/InventarioForm";

import {
  createInventario,
} from "@/api/InventarioApi";

import {
  getAlmacenes,
} from "@/api/AlmacenApi";

import {
  getProductos,
} from "@/api/ProductoApi";

import {
  getSucursalById,
} from "@/api/SucursalApi";

import type {
  InventarioFormData,
} from "@/types/InventarioType";

export default function CreateInventarioView() {

  const {
    sucursalId,
  } = useParams();

  /* =========================
      FORM
  ========================= */

  const [
    formData,

    setFormData,

  ] = useState<InventarioFormData>({

    idAlmacen: "",

    idProducto: "",

    cantidad: 0,

    costoUnitario: 0,

    precioVenta: 0,

    stockMinimo: 0,

    estado: true,

    creadoPor: "admin",

  });

  /* =========================
      GET SUCURSAL
  ========================= */

  const {
    data: sucursal,
  } = useQuery({

    queryKey: [

      "sucursal",

      sucursalId,

    ],

    queryFn: () =>
      getSucursalById(
        sucursalId!
      ),

    enabled:
      !!sucursalId,

  });

  /* =========================
      GET ALMACENES
  ========================= */

  const {
    data: almacenes = [],
  } = useQuery({

    queryKey: [
      "almacenes"
    ],

    queryFn:
      getAlmacenes,

  });

  /* =========================
      FILTRAR ALMACENES
  ========================= */

  const almacenesSucursal =
    almacenes.filter(
      (almacen: any) => {

        if (
          typeof almacen.idSucursal === "string"
        ) {

          return (
            almacen.idSucursal ===
            sucursalId
          );

        }

        return (
          almacen.idSucursal?._id ===
          sucursalId
        );

      }
    );

  /* =========================
      GET PRODUCTOS
  ========================= */

  const {
    data: productos = [],
  } = useQuery({

    queryKey: [
      "productos"
    ],

    queryFn:
      getProductos,

  });

  /* =========================
      CREATE
  ========================= */

  const {
    mutate,
    isPending,
  } = useMutation({

    mutationFn:
      createInventario,

    onSuccess: async (
      data
    ) => {

      await Swal.fire({

        icon: "success",

        title:
          data,

        timer: 2000,

        showConfirmButton: false,

      });

      setFormData({

        idAlmacen: "",

        idProducto: "",

        cantidad: 0,

        costoUnitario: 0,

        precioVenta: 0,

        stockMinimo: 0,

        estado: true,

        creadoPor: "admin",

      });

    },

    onError: async (
      error: any
    ) => {

      await Swal.fire({

        icon: "error",

        title:
          error.message,

      });

    },

  });

  /* =========================
      SUBMIT
  ========================= */

  const handleSubmit = (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    mutate(formData);

  };

  return (

    <div className="flex min-h-screen bg-slate-50">

      {/* SIDEBAR */}
      <MenuList />

      {/* CONTENT */}
      <main className="flex-1 p-8">

        <div className="mx-auto max-w-7xl rounded-3xl bg-white p-8 shadow-sm">

          {/* HEADER */}
          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">

                <span>

                  {

                    sucursal?.nombreSucursal ||
                    "Sucursal"

                  }

                </span>

                <span>/</span>

                <span className="font-semibold text-fuchsia-600">

                  Nuevo Inventario

                </span>

              </div>

              <h1 className="text-4xl font-black text-slate-800">

                Crear Inventario

              </h1>

              <p className="mt-2 text-slate-500">

                Registra productos en almacenes

              </p>

            </div>

            {/* BACK */}
            <Link

              to={`/sucursal/${sucursalId}/inventario`}

              className="
                inline-flex
                items-center
                gap-2
                rounded-2xl
                border
                border-slate-300
                bg-white
                px-5
                py-3
                text-sm
                font-semibold
                text-slate-700
                transition
                hover:bg-slate-100
              "
            >

              <ArrowLeft className="h-5 w-5" />

              Volver

            </Link>

          </div>

          {/* FORM */}
          <InventarioForm

            formData={formData}

            setFormData={setFormData}

            onSubmit={handleSubmit}

            almacenes={almacenesSucursal}

            productos={productos}

            loading={isPending}

            submitText="Crear Inventario"

          />

        </div>

      </main>

    </div>

  );

}