// src/api/InventarioApi.ts

import api from "@/lib/axios";

import {
  isAxiosError,
} from "axios";

import {

  CreateInventarioResponseSchema,

  InventarioArraySchema,

  InventarioPrincipalResponseSchema,

  InventarioSchema,

  TransferenciaSolicitudResponseSchema,

  type AprobarTransferenciaSolicitudType,

  type DeleteInventarioType,

  type InventarioForm,

  type UpdateInventarioType,

} from "@/types/InventarioType";

/* =========================
    MENSAJE DE ERROR
========================= */

function obtenerMensajeError(
  error: unknown,
  mensajePredeterminado: string
): string {

  if (
    isAxiosError(error) &&
    error.response
  ) {

    const errorBackend =
      error.response.data?.error;

    const mensajeBackend =
      error.response.data?.message;

    if (
      typeof errorBackend ===
      "string"
    ) {
      return errorBackend;
    }

    if (
      typeof mensajeBackend ===
      "string"
    ) {
      return mensajeBackend;
    }

  }

  if (
    error instanceof Error
  ) {
    return error.message;
  }

  return mensajePredeterminado;

}

/* =========================
    CREAR O INGRESAR STOCK
========================= */

export async function createInventario(
  formData: InventarioForm
) {

  try {

    if (!formData.idAlmacen) {

      throw new Error(
        "Debe seleccionar un almacén"
      );

    }

    if (!formData.idProducto) {

      throw new Error(
        "Debe seleccionar un producto"
      );

    }

    if (
      !Number.isFinite(
        Number(
          formData.cantidad
        )
      ) ||
      Number(
        formData.cantidad
      ) <= 0
    ) {

      throw new Error(
        "La cantidad de entrada debe ser mayor a cero"
      );

    }

    if (
      !Number.isFinite(
        Number(
          formData.costoUnitario
        )
      ) ||
      Number(
        formData.costoUnitario
      ) < 0
    ) {

      throw new Error(
        "El costo de entrada no es válido"
      );

    }

    const {
      data,
    } = await api.post(

      "/inventario",

      formData

    );

    const response =
      CreateInventarioResponseSchema
        .safeParse(data);

    if (!response.success) {

      console.log(
        "RESPUESTA REAL INVENTARIO:",
        data
      );

      console.log(
        "ERROR ZOD INVENTARIO:",
        response.error.format()
      );

      throw new Error(
        "La respuesta del inventario no coincide con el type"
      );

    }

    return response.data;

  } catch (error: unknown) {

    throw new Error(
      obtenerMensajeError(
        error,
        "Error creando inventario"
      )
    );

  }

}

/* =========================
    OBTENER TODOS
========================= */

export async function getInventarios() {

  try {

    const {
      data,
    } = await api.get(
      "/inventario"
    );

    const response =
      InventarioArraySchema
        .safeParse(data);

    if (!response.success) {

      console.log(
        "RESPUESTA REAL INVENTARIOS:",
        data
      );

      console.log(
        response.error.format()
      );

      throw new Error(
        "Error validando inventarios"
      );

    }

    return response.data;

  } catch (error: unknown) {

    throw new Error(
      obtenerMensajeError(
        error,
        "Error obteniendo inventarios"
      )
    );

  }

}

/* =========================
    OBTENER POR ID
========================= */

export async function getInventarioById(
  id: string
) {

  try {

    if (!id) {

      throw new Error(
        "El ID del inventario es obligatorio"
      );

    }

    const {
      data,
    } = await api.get(
      `/inventario/${id}`
    );

    const response =
      InventarioSchema
        .safeParse(data);

    if (!response.success) {

      console.log(
        data
      );

      console.log(
        response.error.format()
      );

      throw new Error(
        "Error validando inventario"
      );

    }

    return response.data;

  } catch (error: unknown) {

    throw new Error(
      obtenerMensajeError(
        error,
        "Error obteniendo inventario"
      )
    );

  }

}

/* =========================
    ACTUALIZAR CONFIGURACIÓN
========================= */

export async function updateInventario({

  inventarioId,

  formData,

}: UpdateInventarioType) {

  try {

    if (!inventarioId) {

      throw new Error(
        "El ID del inventario es obligatorio"
      );

    }

    const {
      data,
    } = await api.put(

      `/inventario/${inventarioId}`,

      formData

    );

    return data;

  } catch (error: unknown) {

    throw new Error(
      obtenerMensajeError(
        error,
        "Error actualizando inventario"
      )
    );

  }

}

/* =========================
    ELIMINAR
========================= */

export async function deleteInventarioById({

  id,

  eliminadoPor,

}: DeleteInventarioType) {

  try {

    if (!id) {

      throw new Error(
        "El ID del inventario es obligatorio"
      );

    }

    const {
      data,
    } = await api.delete(

      `/inventario/${id}`,

      {
        data: {

          eliminadoPor:
            eliminadoPor ||
            "admin",

        },
      }

    );

    return data;

  } catch (error: unknown) {

    throw new Error(
      obtenerMensajeError(
        error,
        "Error eliminando inventario"
      )
    );

  }

}

/* =========================
    INVENTARIO BARRA
========================= */

export async function
getInventarioBarraPorSucursal(
  idSucursal: string
) {

  try {

    if (!idSucursal) {

      throw new Error(
        "El ID de la sucursal es obligatorio"
      );

    }

    const {
      data,
    } = await api.get(

      `/inventario/sucursal/${idSucursal}/barra`

    );

    const response =
      InventarioArraySchema
        .safeParse(data);

    if (!response.success) {

      console.log(
        data
      );

      console.log(
        response.error.format()
      );

      throw new Error(
        "Error validando inventario de barra"
      );

    }

    return response.data;

  } catch (error: unknown) {

    throw new Error(
      obtenerMensajeError(
        error,
        "Error obteniendo inventario de barra"
      )
    );

  }

}


/* =========================
    INVENTARIOS POR SUCURSAL
========================= */

export async function getInventariosPorSucursal(
  idSucursal: string
) {

  try {

    if (!idSucursal) {
      throw new Error(
        "El ID de la sucursal es obligatorio"
      );
    }

    const {
      data,
    } = await api.get(
      `/inventario/sucursal/${idSucursal}`
    );

    console.log(data)
    const response =
      InventarioArraySchema.safeParse(
        data
      );

    if (!response.success) {

      console.log(
        "RESPUESTA INVENTARIOS SUCURSAL:",
        data
      );

      console.log(
        "ERROR ZOD INVENTARIOS SUCURSAL:",
        response.error.format()
      );

      throw new Error(
        "La respuesta de inventarios por sucursal no coincide con el type"
      );
    }

    return response.data;

  } catch (error: unknown) {

    throw new Error(
      obtenerMensajeError(
        error,
        "Error obteniendo inventarios de la sucursal"
      )
    );
  }
}

/* =========================
    INVENTARIO PRINCIPAL
========================= */

export async function
getInventarioPrincipalPorSucursal(
  idSucursal: string
) {

  try {

    if (!idSucursal) {

      throw new Error(
        "El ID de la sucursal es obligatorio"
      );

    }

    const {
      data,
    } = await api.get(

      `/inventario/sucursal/${idSucursal}/principal`

    );

    const response =
      InventarioPrincipalResponseSchema
        .safeParse(data);

    if (!response.success) {

      console.log(
        "RESPUESTA INVENTARIO PRINCIPAL:",
        data
      );

      console.log(
        "ERROR ZOD INVENTARIO PRINCIPAL:",
        response.error.format()
      );

      throw new Error(
        "Error validando inventario principal"
      );

    }

    return response.data;

  } catch (error: unknown) {

    throw new Error(
      obtenerMensajeError(
        error,
        "Error obteniendo inventario principal"
      )
    );

  }

}

/* =========================
    APROBAR Y TRANSFERIR
    SOLICITUD
========================= */

export async function
aprobarYTransferirSolicitud({

  idSolicitud,

  actualizadoPor,

}: AprobarTransferenciaSolicitudType) {

  try {

    if (!idSolicitud) {

      throw new Error(
        "El ID de la solicitud es obligatorio"
      );

    }

    const {
      data,
    } = await api.patch(

      `/inventario/solicitud/${idSolicitud}/aprobar-transferir`,

      {

        actualizadoPor:
          actualizadoPor ||
          "sistema",

      }

    );

    const response =
      TransferenciaSolicitudResponseSchema
        .safeParse(data);

    if (!response.success) {

      console.log(
        "RESPUESTA TRANSFERENCIA:",
        data
      );

      console.log(
        "ERROR ZOD TRANSFERENCIA:",
        response.error.format()
      );

      throw new Error(
        "La respuesta de la transferencia no coincide con el type"
      );

    }

    return response.data;

  } catch (error: unknown) {

    throw new Error(
      obtenerMensajeError(
        error,
        "Error aprobando y transfiriendo la solicitud"
      )
    );

  }

}