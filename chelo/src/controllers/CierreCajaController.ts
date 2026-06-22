// import type {
//   Request,
//   Response,
// } from "express";

// import mongoose from "mongoose";

// import CierreCaja from "../models/CierreCaja";
// import AperturaCaja from "../models/AperturaCaja";
// import Caja from "../models/Caja";
// import Venta from "../models/Venta";
// import DetalleVenta from "../models/DetalleVenta";
// import Egreso from "../models/Egreso";
// import Movimiento from "../models/Movimiento";

// /* =========================
//     UTILIDADES
// ========================= */

// function redondear(
//   valor: number,
//   decimales = 2
// ): number {

//   const factor =
//     Math.pow(
//       10,
//       decimales
//     );

//   return (
//     Math.round(
//       (
//         Number(valor) +
//         Number.EPSILON
//       ) *
//         factor
//     ) / factor
//   );
// }

// /*
//   Acepta:
//   - fechaCierre ISO completa
//   - fecha + horaCierre
//   - solo horaCierre

//   Regla nocturna:
//   Si la hora de cierre es menor que la hora de apertura,
//   se interpreta como el día siguiente.

//   Ejemplo:
//   apertura 23/06 19:00
//   cierre 04:00
//   => cierre 24/06 04:00
// */
// function construirFechaCierre({
//   fechaApertura,
//   fechaCierre,
//   fecha,
//   horaCierre,
// }: {
//   fechaApertura: Date;
//   fechaCierre?: unknown;
//   fecha?: unknown;
//   horaCierre?: unknown;
// }): Date {

//   if (
//     typeof fechaCierre ===
//     "string"
//   ) {

//     const directa =
//       new Date(
//         fechaCierre
//       );

//     if (
//       !Number.isNaN(
//         directa.getTime()
//       )
//     ) {
//       return directa;
//     }
//   }

//   const formatterFecha =
//     new Intl.DateTimeFormat(
//       "en-CA",
//       {
//         timeZone:
//           "America/La_Paz",
//         year:
//           "numeric",
//         month:
//           "2-digit",
//         day:
//           "2-digit",
//       }
//     );

//   const formatterHora =
//     new Intl.DateTimeFormat(
//       "en-GB",
//       {
//         timeZone:
//           "America/La_Paz",
//         hour:
//           "2-digit",
//         minute:
//           "2-digit",
//         hour12:
//           false,
//       }
//     );

//   const fechaAperturaLocal =
//     formatterFecha.format(
//       fechaApertura
//     );

//   const horaAperturaLocal =
//     formatterHora.format(
//       fechaApertura
//     );

//   const fechaBase =
//     typeof fecha ===
//     "string"
//       ? fecha.slice(0, 10)
//       : fechaAperturaLocal;

//   const hora =
//     typeof horaCierre ===
//     "string"
//       ? horaCierre
//       : formatterHora.format(
//           new Date()
//         );

//   let cierre =
//     new Date(
//       `${fechaBase}T${hora}:00-04:00`
//     );

//   if (
//     Number.isNaN(
//       cierre.getTime()
//     )
//   ) {
//     throw new Error(
//       "La fecha u hora de cierre no es válida"
//     );
//   }

//   /*
//     Si el usuario mandó la misma fecha de apertura
//     y una hora menor, el cierre pertenece al día siguiente.
//   */
//   if (
//     fechaBase ===
//       fechaAperturaLocal &&
//     hora <
//       horaAperturaLocal
//   ) {

//     cierre =
//       new Date(
//         cierre.getTime() +
//           24 *
//             60 *
//             60 *
//             1000
//       );
//   }

//   return cierre;
// }

// function obtenerMontoEgreso(
//   egreso: Record<string, unknown>
// ): number {

//   const valor =
//     egreso.monto ??
//     egreso.total ??
//     egreso.importe ??
//     egreso.montoEgreso ??
//     0;

//   const numero =
//     Number(valor);

//   return Number.isFinite(numero)
//     ? numero
//     : 0;
// }

// function obtenerFechaEgreso(
//   egreso: Record<string, unknown>
// ): Date | null {

//   const valor =
//     egreso.fechaEgreso ??
//     egreso.fecha ??
//     egreso.fechaCreacion;

//   if (!valor) {
//     return null;
//   }

//   const fecha =
//     new Date(
//       String(valor)
//     );

//   return Number.isNaN(
//     fecha.getTime()
//   )
//     ? null
//     : fecha;
// }

// function obtenerMetodoPagoEgreso(
//   egreso: Record<string, unknown>
// ): string {

//   const metodo =
//     egreso.metodoPago ??
//     egreso.formaPago ??
//     "efectivo";

//   return String(metodo);
// }

// export class CierreCajaController {

//   static createCierre = async (
//     req: Request,
//     res: Response
//   ) => {

//     try {

//       const {
//         idCaja,
//         idPerfil,
//         montoReal,
//         observacion,
//         creadoPor,
//         horaCierre,
//         fechaCierre,
//         fecha,
//       } = req.body;

//       if (
//         !mongoose.isValidObjectId(
//           idCaja
//         )
//       ) {
//         return res.status(400).json({
//           error:
//             "El ID de caja no es válido",
//         });
//       }

//       if (
//         !mongoose.isValidObjectId(
//           idPerfil
//         )
//       ) {
//         return res.status(400).json({
//           error:
//             "El ID del perfil no es válido",
//         });
//       }

//       const caja =
//         await Caja.findOne({
//           _id:
//             idCaja,
//           estado:
//             true,
//         });

//       if (!caja) {
//         return res.status(404).json({
//           error:
//             "La caja no existe o está inactiva",
//         });
//       }

//       const apertura =
//         await AperturaCaja.findOne({
//           idCaja,
//           estado:
//             "abierta",
//         });

//       if (!apertura) {
//         return res.status(404).json({
//           error:
//             "La caja no tiene una apertura activa",
//         });
//       }

//       const cierreExistente =
//         await CierreCaja.findOne({
//           idAperturaCaja:
//             apertura._id,
//         });

//       if (cierreExistente) {
//         return res.status(409).json({
//           error:
//             "La apertura ya tiene un cierre registrado",
//         });
//       }

//       const fechaFinalCierre =
//         construirFechaCierre({
//           fechaApertura:
//             apertura.fechaApertura,
//           fechaCierre,
//           fecha,
//           horaCierre,
//         });

//       if (
//         fechaFinalCierre <=
//         apertura.fechaApertura
//       ) {
//         return res.status(400).json({
//           error:
//             "La fecha de cierre debe ser posterior a la apertura",
//         });
//       }

//       const montoContado =
//         Number(
//           montoReal
//         );

//       if (
//         !Number.isFinite(
//           montoContado
//         ) ||
//         montoContado < 0
//       ) {
//         return res.status(400).json({
//           error:
//             "El monto real no es válido",
//         });
//       }

//       /*
//         Consulta por rango real de jornada.
//         Esto permite abrir el 23 a las 19:00
//         y cerrar el 24 a las 04:00.
//       */
//       const ventas =
//         await Venta.find({
//           idCaja,
//           idSucursal:
//             apertura.idSucursal,
//           fechaVenta: {
//             $gte:
//               apertura.fechaApertura,
//             $lte:
//               fechaFinalCierre,
//           },
//         })
//           .lean();

//       const ventasValidas =
//         ventas.filter(
//           (
//             venta: any
//           ) =>
//             venta.estado ===
//               "pagado" ||
//             venta.estado ===
//               "cortesia"
//         );

//       const idsVentas =
//         ventasValidas.map(
//           (
//             venta: any
//           ) =>
//             venta._id
//         );

//       const detallesVenta =
//         idsVentas.length > 0
//           ? await DetalleVenta.find({
//               idVenta: {
//                 $in:
//                   idsVentas,
//               },
//             })
//               .populate({
//                 path:
//                   "idProducto",
//                 select:
//                   "_id nombre marca descripcion",
//               })
//               .lean()
//           : [];

//       /*
//         Se consultan egresos por sucursal y luego
//         se filtran por fecha para tolerar nombres
//         de campo diferentes en tu modelo actual.
//       */
//       const egresosTodos =
//         await Egreso.find({
//           idSucursal:
//             apertura.idSucursal,
//         })
//           .lean();

//       const egresos =
//         egresosTodos.filter(
//           (
//             egreso: any
//           ) => {

//             const fechaEgreso =
//               obtenerFechaEgreso(
//                 egreso
//               );

//             if (!fechaEgreso) {
//               return false;
//             }

//             const perteneceCaja =
//               !egreso.idCaja ||
//               String(
//                 egreso.idCaja
//               ) ===
//                 String(idCaja);

//             const estadoValido =
//               egreso.estado !==
//                 "anulado" &&
//               egreso.estado !==
//                 "eliminado" &&
//               !egreso.fechaEliminado;

//             return (
//               perteneceCaja &&
//               estadoValido &&
//               fechaEgreso >=
//                 apertura.fechaApertura &&
//               fechaEgreso <=
//                 fechaFinalCierre
//             );
//           }
//         );

//       let totalVentas = 0;
//       let totalVentasEfectivo = 0;
//       let totalVentasQr = 0;
//       let totalVentasTransferencia = 0;
//       let totalVentasMixto = 0;
//       let totalCortesias = 0;
//       let totalVentasAnuladas = 0;

//       for (
//         const venta
//         of ventas as any[]
//       ) {

//         const total =
//           Number(
//             venta.total || 0
//           );

//         if (
//           venta.estado ===
//           "anulado"
//         ) {
//           totalVentasAnuladas +=
//             total;
//           continue;
//         }

//         if (
//           venta.estado ===
//           "cortesia"
//         ) {
//           totalCortesias +=
//             total;
//           continue;
//         }

//         if (
//           venta.estado !==
//           "pagado"
//         ) {
//           continue;
//         }

//         totalVentas +=
//           total;

//         switch (
//           venta.metodoPago
//         ) {
//           case "efectivo":
//             totalVentasEfectivo +=
//               total;
//             break;

//           case "qr":
//             totalVentasQr +=
//               total;
//             break;

//           case "transferencia":
//             totalVentasTransferencia +=
//               total;
//             break;

//           case "mixto":
//             totalVentasMixto +=
//               total;

//             /*
//               Si tu modelo Venta luego incorpora:
//               montoEfectivo, montoQr, montoTransferencia,
//               esta lógica ya lo aprovecha.
//             */
//             totalVentasEfectivo +=
//               Number(
//                 venta.montoEfectivo ||
//                   0
//               );

//             totalVentasQr +=
//               Number(
//                 venta.montoQr ||
//                   0
//               );

//             totalVentasTransferencia +=
//               Number(
//                 venta.montoTransferencia ||
//                   0
//               );
//             break;
//         }
//       }

//       let totalEgresos = 0;
//       let totalEgresosEfectivo = 0;

//       for (
//         const egreso
//         of egresos as any[]
//       ) {

//         const monto =
//           obtenerMontoEgreso(
//             egreso
//           );

//         totalEgresos +=
//           monto;

//         if (
//           obtenerMetodoPagoEgreso(
//             egreso
//           ) ===
//           "efectivo"
//         ) {
//           totalEgresosEfectivo +=
//             monto;
//         }
//       }

//       const cantidadProductosVendidos =
//         detallesVenta.reduce(
//           (
//             acumulado,
//             detalle: any
//           ) =>
//             acumulado +
//             Number(
//               detalle.cantidad ||
//                 0
//             ),
//           0
//         );

//       const productosMap =
//         new Map<
//           string,
//           {
//             idProducto:
//               string;
//             nombre:
//               string;
//             marca:
//               string;
//             cantidadVendida:
//               number;
//             totalVendido:
//               number;
//           }
//         >();

//       for (
//         const detalle
//         of detallesVenta as any[]
//       ) {

//         const producto =
//           detalle.idProducto;

//         const idProducto =
//           producto?._id
//             ? String(
//                 producto._id
//               )
//             : String(
//                 detalle.idProducto
//               );

//         const actual =
//           productosMap.get(
//             idProducto
//           ) || {
//             idProducto,
//             nombre:
//               producto?.nombre ||
//               "Producto",
//             marca:
//               producto?.marca ||
//               "",
//             cantidadVendida:
//               0,
//             totalVendido:
//               0,
//           };

//         actual.cantidadVendida +=
//           Number(
//             detalle.cantidad || 0
//           );

//         actual.totalVendido +=
//           Number(
//             detalle.subtotal || 0
//           );

//         productosMap.set(
//           idProducto,
//           actual
//         );
//       }

//       const productosVendidos =
//         Array.from(
//           productosMap.values()
//         )
//           .map(
//             (
//               producto
//             ) => ({
//               ...producto,
//               precioPromedio:
//                 producto
//                   .cantidadVendida >
//                 0
//                   ? redondear(
//                       producto
//                         .totalVendido /
//                         producto
//                           .cantidadVendida
//                     )
//                   : 0,
//               totalVendido:
//                 redondear(
//                   producto
//                     .totalVendido
//                 ),
//             })
//           )
//           .sort(
//             (
//               a,
//               b
//             ) =>
//               b.cantidadVendida -
//               a.cantidadVendida
//           );

//       const totalEsperadoEfectivo =
//         redondear(
//           Number(
//             apertura.montoInicial ||
//               0
//           ) +
//             totalVentasEfectivo -
//             totalEgresosEfectivo
//         );

//       const diferencia =
//         redondear(
//           montoContado -
//             totalEsperadoEfectivo
//         );

//       const tolerancia =
//         0.009;

//       const estado =
//         Math.abs(
//           diferencia
//         ) <= tolerancia
//           ? "cuadrado"
//           : diferencia > 0
//             ? "sobrante"
//             : "faltante";

//       const usuario =
//         creadoPor ||
//         "sistema";

//       const cierre =
//         await CierreCaja.create({
//           idAperturaCaja:
//             apertura._id,
//           idPerfil,
//           idSucursal:
//             apertura.idSucursal,
//           idCaja,
//           fechaApertura:
//             apertura.fechaApertura,
//           fechaCierre:
//             fechaFinalCierre,
//           montoInicial:
//             redondear(
//               apertura.montoInicial
//             ),
//           totalVentas:
//             redondear(
//               totalVentas
//             ),
//           totalVentasEfectivo:
//             redondear(
//               totalVentasEfectivo
//             ),
//           totalVentasQr:
//             redondear(
//               totalVentasQr
//             ),
//           totalVentasTransferencia:
//             redondear(
//               totalVentasTransferencia
//             ),
//           totalVentasMixto:
//             redondear(
//               totalVentasMixto
//             ),
//           totalCortesias:
//             redondear(
//               totalCortesias
//             ),
//           totalVentasAnuladas:
//             redondear(
//               totalVentasAnuladas
//             ),
//           totalEgresos:
//             redondear(
//               totalEgresos
//             ),
//           totalEgresosEfectivo:
//             redondear(
//               totalEgresosEfectivo
//             ),
//           totalEsperadoEfectivo,
//           montoReal:
//             redondear(
//               montoContado
//             ),
//           diferencia,
//           cantidadVentas:
//             ventasValidas.filter(
//               (
//                 venta: any
//               ) =>
//                 venta.estado ===
//                 "pagado"
//             ).length,
//           cantidadProductosVendidos,
//           cantidadEgresos:
//             egresos.length,
//           estado,
//           observacion:
//             observacion || "",
//           creadoPor:
//             usuario,
//         });

//       apertura.estado =
//         "cerrada";

//       apertura.actualizadoPor =
//         usuario;

//       apertura.fechaActualizacion =
//         new Date();

//       await apertura.save();

//       await Movimiento.create({
//         fecha:
//           fechaFinalCierre,
//         tipoMovimiento:
//           "cierre_caja",
//         origenMovimiento:
//           "cierre_caja",
//         modulo:
//           "cierre",
//         idSucursal:
//           apertura.idSucursal,
//         idCaja,
//         idPerfil,
//         idAperturaCaja:
//           apertura._id,
//         idCierreCaja:
//           cierre._id,
//         referenciaId:
//           cierre._id,
//         referenciaModelo:
//           "CierreCaja",
//         montoInicial:
//           apertura.montoInicial,
//         montoEntrada:
//           totalVentasEfectivo,
//         montoSalida:
//           totalEgresosEfectivo,
//         montoEsperado:
//           totalEsperadoEfectivo,
//         montoReal:
//           montoContado,
//         montoFisico:
//           montoContado,
//         diferenciaMonto:
//           diferencia,
//         total:
//           totalVentas,
//         estado,
//         observacion:
//           observacion ||
//           "Cierre de caja",
//         creadoPor:
//           usuario,
//       });

//       return res.status(201).json({
//         message:
//           "Caja cerrada correctamente",
//         cierre,
//         jornada: {
//           fechaApertura:
//             apertura.fechaApertura,
//           fechaCierre:
//             fechaFinalCierre,
//           duracionMinutos:
//             Math.round(
//               (
//                 fechaFinalCierre.getTime() -
//                 apertura.fechaApertura.getTime()
//               ) /
//                 60000
//             ),
//         },
//         resumen: {
//           cantidadVentas:
//             cierre.cantidadVentas,
//           cantidadProductosVendidos,
//           cantidadEgresos:
//             egresos.length,
//           totalVentas:
//             cierre.totalVentas,
//           totalVentasEfectivo:
//             cierre.totalVentasEfectivo,
//           totalVentasQr:
//             cierre.totalVentasQr,
//           totalVentasTransferencia:
//             cierre.totalVentasTransferencia,
//           totalVentasMixto:
//             cierre.totalVentasMixto,
//           totalCortesias:
//             cierre.totalCortesias,
//           totalVentasAnuladas:
//             cierre.totalVentasAnuladas,
//           totalEgresos:
//             cierre.totalEgresos,
//           totalEgresosEfectivo:
//             cierre.totalEgresosEfectivo,
//           montoInicial:
//             cierre.montoInicial,
//           totalEsperadoEfectivo:
//             cierre.totalEsperadoEfectivo,
//           montoReal:
//             cierre.montoReal,
//           diferencia:
//             cierre.diferencia,
//           estado:
//             cierre.estado,
//         },
//         productosVendidos,
//         ventas,
//         egresos,
//       });

//     } catch (error: unknown) {

//       return res.status(500).json({
//         error:
//           error instanceof Error
//             ? error.message
//             : "Error al crear cierre de caja",
//       });
//     }
//   };

//   static getAllCierres = async (
//     _req: Request,
//     res: Response
//   ) => {

//     try {

//       const cierres =
//         await CierreCaja.find({})
//           .populate(
//             "idAperturaCaja"
//           )
//           .populate(
//             "idPerfil"
//           )
//           .populate(
//             "idSucursal"
//           )
//           .populate(
//             "idCaja"
//           )
//           .sort({
//             fechaCierre: -1,
//           });

//       return res.json(
//         cierres
//       );

//     } catch (error) {

//       return res.status(500).json({
//         error:
//           "Error al obtener cierres",
//       });
//     }
//   };

//   static getCierreById = async (
//     req: Request,
//     res: Response
//   ) => {

//     try {

//       const cierre =
//         await CierreCaja.findById(
//           req.params.id
//         )
//           .populate(
//             "idAperturaCaja"
//           )
//           .populate(
//             "idPerfil"
//           )
//           .populate(
//             "idSucursal"
//           )
//           .populate(
//             "idCaja"
//           );

//       if (!cierre) {
//         return res.status(404).json({
//           error:
//             "Cierre no encontrado",
//         });
//       }

//       return res.json(
//         cierre
//       );

//     } catch (error) {

//       return res.status(500).json({
//         error:
//           "Error al obtener cierre",
//       });
//     }
//   };

//   /*
//     El cierre financiero no debe recalcularse manualmente.
//     Solo permite actualizar observación y auditoría.
//   */
//   static updateCierre = async (
//     req: Request,
//     res: Response
//   ) => {

//     try {

//       const cierre =
//         await CierreCaja.findById(
//           req.params.id
//         );

//       if (!cierre) {
//         return res.status(404).json({
//           error:
//             "Cierre no encontrado",
//         });
//       }

//       if (
//         req.body.observacion !==
//         undefined
//       ) {
//         cierre.observacion =
//           req.body.observacion;
//       }

//       cierre.actualizadoPor =
//         req.body.actualizadoPor ||
//         "sistema";

//       cierre.fechaActualizacion =
//         new Date();

//       await cierre.save();

//       return res.json({
//         message:
//           "Observación del cierre actualizada",
//         cierre,
//       });

//     } catch (error) {

//       return res.status(500).json({
//         error:
//           "Error al actualizar cierre",
//       });
//     }
//   };

//   static deleteCierre = async (
//     req: Request,
//     res: Response
//   ) => {

//     try {

//       const cierre =
//         await CierreCaja.findById(
//           req.params.id
//         );

//       if (!cierre) {
//         return res.status(404).json({
//           error:
//             "Cierre no encontrado",
//         });
//       }

//       if (
//         !req.body.motivo
//       ) {
//         return res.status(400).json({
//           error:
//             "El motivo de anulación es obligatorio",
//         });
//       }

//       cierre.estado =
//         "anulado";

//       cierre.observacion =
//         `${cierre.observacion || ""}\nANULADO: ${req.body.motivo}`.trim();

//       cierre.eliminadoPor =
//         req.body.eliminadoPor ||
//         "sistema";

//       cierre.fechaEliminado =
//         new Date();

//       await cierre.save();

//       return res.json({
//         message:
//           "Cierre anulado correctamente",
//         cierre,
//       });

//     } catch (error) {

//       return res.status(500).json({
//         error:
//           "Error al anular cierre",
//       });
//     }
//   };

//   static getCierresByCajaId =
//     async (
//       req: Request,
//       res: Response
//     ) => {

//       try {

//         const cierres =
//           await CierreCaja.find({
//             idCaja:
//               req.params.cajaId,
//           })
//             .populate(
//               "idAperturaCaja"
//             )
//             .populate(
//               "idCaja"
//             )
//             .populate(
//               "idPerfil"
//             )
//             .populate(
//               "idSucursal"
//             )
//             .sort({
//               fechaCierre: -1,
//             });

//         return res.json(
//           cierres
//         );

//       } catch (error) {

//         return res.status(500).json({
//           error:
//             "Error obteniendo cierres",
//         });
//       }
//     };
// }

// src/controllers/CierreCajaController.ts

import type {
  Request,
  Response,
} from "express";

import mongoose from "mongoose";

import AperturaCaja from "../models/AperturaCaja";
import Caja from "../models/Caja";
import CierreCaja from "../models/CierreCaja";
import Comanda from "../models/Comanda";
import DetalleComanda from "../models/DetalleComanda";
import DetalleEgreso from "../models/DetalleEgreso";
import DetalleVenta from "../models/DetalleVenta";
import Egreso from "../models/Egreso";
import PerfilUsuario from "../models/PerfilUsuario";
import Sucursal from "../models/Sucursal";
import Venta from "../models/Venta";

/* ======================================================
   UTILIDADES
====================================================== */

function toObjectId(
  id: string
) {
  if (
    !mongoose.Types.ObjectId.isValid(
      id
    )
  ) {
    throw new Error(
      `ID inválido: ${id}`
    );
  }

  return new mongoose.Types.ObjectId(
    id
  );
}

function redondear(
  valor: number
) {
  return Number(
    Number(valor || 0).toFixed(2)
  );
}

function obtenerId(
  valor: any
): string {
  if (!valor) {
    return "";
  }

  if (
    typeof valor === "string"
  ) {
    return valor;
  }

  if (valor._id) {
    return String(valor._id);
  }

  return String(valor);
}

function obtenerNombrePersona(
  perfil: any
): string {
  if (!perfil) {
    return "Sin responsable";
  }

  const nombre =
    [
      perfil.nombres,
      perfil.apellidos,
    ]
      .filter(Boolean)
      .join(" ")
      .trim();

  return nombre || "Sin nombre";
}

function obtenerNombreProducto(
  producto: any
): string {
  if (!producto) {
    return "Producto sin nombre";
  }

  const nombre =
    [
      producto.nombre,
      producto.marca,
    ]
      .filter(Boolean)
      .join(" - ")
      .trim();

  return nombre || "Producto sin nombre";
}

function obtenerNombreAlmacen(
  almacen: any
): string {
  if (!almacen) {
    return "Sin almacén";
  }

  return almacen.nombre || "Sin almacén";
}

function obtenerEstadoArqueo(
  diferencia: number
) {
  if (diferencia === 0) {
    return "cuadrado";
  }

  if (diferencia > 0) {
    return "sobrante";
  }

  return "faltante";
}

function agruparPorCampo(
  items: any[],
  campo: string
) {
  const mapa =
    new Map<string, any[]>();

  for (const item of items) {
    const id =
      obtenerId(item[campo]);

    if (!mapa.has(id)) {
      mapa.set(id, []);
    }

    mapa.get(id)!.push(item);
  }

  return mapa;
}

/* ======================================================
   FECHA DE CIERRE
====================================================== */

function construirFechaCierre({
  fechaApertura,
  fechaCierre,
  fecha,
  horaCierre,
}: {
  fechaApertura: Date;
  fechaCierre?: unknown;
  fecha?: unknown;
  horaCierre?: unknown;
}): Date {
  if (
    typeof fechaCierre === "string"
  ) {
    const directa =
      new Date(fechaCierre);

    if (
      !Number.isNaN(
        directa.getTime()
      )
    ) {
      return directa;
    }
  }

  const formatterFecha =
    new Intl.DateTimeFormat(
      "en-CA",
      {
        timeZone:
          "America/La_Paz",
        year:
          "numeric",
        month:
          "2-digit",
        day:
          "2-digit",
      }
    );

  const formatterHora =
    new Intl.DateTimeFormat(
      "en-GB",
      {
        timeZone:
          "America/La_Paz",
        hour:
          "2-digit",
        minute:
          "2-digit",
        hour12:
          false,
      }
    );

  const fechaAperturaLocal =
    formatterFecha.format(
      fechaApertura
    );

  const horaAperturaLocal =
    formatterHora.format(
      fechaApertura
    );

  const fechaBase =
    typeof fecha === "string"
      ? fecha.slice(0, 10)
      : fechaAperturaLocal;

  const hora =
    typeof horaCierre === "string"
      ? horaCierre
      : formatterHora.format(
        new Date()
      );

  let cierre =
    new Date(
      `${fechaBase}T${hora}:00-04:00`
    );

  if (
    Number.isNaN(
      cierre.getTime()
    )
  ) {
    throw new Error(
      "La fecha u hora de cierre no es válida."
    );
  }

  /*
    Si se abrió de noche y se cerró después de medianoche,
    el cierre pertenece al día siguiente.
  */
  if (
    fechaBase === fechaAperturaLocal &&
    hora < horaAperturaLocal
  ) {
    cierre =
      new Date(
        cierre.getTime() +
        24 * 60 * 60 * 1000
      );
  }

  return cierre;
}

/* ======================================================
   INGRESOS POR MESERO
====================================================== */

function construirIngresosPorMesero(
  ventasPagadas: any[]
) {
  const mapa =
    new Map<string, any>();

  for (const venta of ventasPagadas) {
    const idPerfil =
      obtenerId(venta.idPerfil);

    const nombreMesero =
      obtenerNombrePersona(
        venta.idPerfil
      );

    if (!mapa.has(idPerfil)) {
      mapa.set(idPerfil, {
        idPerfil,
        nombreMesero,
        cantidadVentas: 0,
        efectivo: 0,
        qr: 0,
        transferencia: 0,
        mixto: 0,
        totalVentas: 0,
        ventas: [],
      });
    }

    const item =
      mapa.get(idPerfil);

    const total =
      Number(venta.total || 0);

    item.cantidadVentas += 1;
    item.totalVentas =
      redondear(
        item.totalVentas + total
      );

    if (
      venta.metodoPago === "efectivo"
    ) {
      item.efectivo =
        redondear(
          item.efectivo + total
        );
    }

    if (
      venta.metodoPago === "qr"
    ) {
      item.qr =
        redondear(
          item.qr + total
        );
    }

    if (
      venta.metodoPago ===
      "transferencia"
    ) {
      item.transferencia =
        redondear(
          item.transferencia + total
        );
    }

    if (
      venta.metodoPago === "mixto"
    ) {
      item.mixto =
        redondear(
          item.mixto + total
        );
    }

    item.ventas.push({
      idVenta:
        String(venta._id),
      numeroVenta:
        venta.numeroVenta || "",
      idComanda:
        obtenerId(venta.idComanda),
      numeroComanda:
        venta.idComanda
          ?.numeroComanda || "",
      fechaVenta:
        venta.fechaVenta,
      metodoPago:
        venta.metodoPago,
      subtotal:
        redondear(venta.subtotal),
      descuento:
        redondear(venta.descuento),
      total:
        redondear(venta.total),
      observacion:
        venta.observacion || "",
    });
  }

  return Array.from(
    mapa.values()
  );
}

/* ======================================================
   VENTAS ANULADAS
====================================================== */

function construirVentasAnuladas(
  ventasAnuladas: any[]
) {
  return ventasAnuladas.map(
    (venta) => ({
      idVenta:
        String(venta._id),
      numeroVenta:
        venta.numeroVenta || "",
      idComanda:
        obtenerId(venta.idComanda),
      numeroComanda:
        venta.idComanda
          ?.numeroComanda || "",
      mesero:
        obtenerNombrePersona(
          venta.idPerfil
        ),
      fechaVenta:
        venta.fechaVenta,
      metodoPago:
        venta.metodoPago,
      total:
        redondear(venta.total),
      motivo:
        venta.observacion ||
        "Sin motivo registrado",
      eliminadoPor:
        venta.eliminadoPor || "",
      fechaEliminado:
        venta.fechaEliminado || null,
    })
  );
}

/* ======================================================
   EGRESOS
====================================================== */

function construirEgresosDetalle(
  egresos: any[],
  detallesPorEgreso: Map<string, any[]>
) {
  return egresos.map(
    (egreso) => {
      const idEgreso =
        String(egreso._id);

      const detalles =
        detallesPorEgreso.get(
          idEgreso
        ) || [];

      return {
        idEgreso,
        numeroEgreso:
          egreso.numeroEgreso || "",
        responsable:
          obtenerNombrePersona(
            egreso.idPerfil
          ),
        fechaEgreso:
          egreso.fechaEgreso,
        tipoEgreso:
          egreso.tipoEgreso,
        metodoPago:
          egreso.metodoPago,
        total:
          redondear(egreso.total),
        estado:
          egreso.estado,
        observacion:
          egreso.observacion || "",
        eliminadoPor:
          egreso.eliminadoPor || "",
        fechaEliminado:
          egreso.fechaEliminado || null,
        items:
          detalles.map(
            (detalle) => ({
              idDetalleEgreso:
                String(detalle._id),
              idProducto:
                obtenerId(
                  detalle.idProducto
                ),
              producto:
                detalle.idProducto
                  ? obtenerNombreProducto(
                    detalle.idProducto
                  )
                  : detalle.descripcion,
              idAlmacen:
                obtenerId(
                  detalle.idAlmacen
                ),
              almacen:
                obtenerNombreAlmacen(
                  detalle.idAlmacen
                ),
              descripcion:
                detalle.descripcion,
              tipoItem:
                detalle.tipoItem,
              cantidad:
                Number(
                  detalle.cantidad || 0
                ),
              costoUnitario:
                redondear(
                  detalle.costoUnitario
                ),
              subtotal:
                redondear(
                  detalle.subtotal
                ),
            })
          ),
      };
    }
  );
}

/* ======================================================
   COMANDAS
====================================================== */

function construirComandasResumen(
  comandas: any[],
  detallesPorComanda: Map<string, any[]>
) {
  return comandas.map(
    (comanda) => {
      const idComanda =
        String(comanda._id);

      const detalles =
        detallesPorComanda.get(
          idComanda
        ) || [];

      const totalReferencial =
        detalles
          .filter(
            (detalle) =>
              detalle.estado ===
              "activo"
          )
          .reduce(
            (
              total,
              detalle
            ) =>
              total +
              Number(
                detalle.subtotal || 0
              ),
            0
          );

      return {
        idComanda,
        numeroComanda:
          comanda.numeroComanda || "",
        mesero:
          obtenerNombrePersona(
            comanda.idPerfil
          ),
        estado:
          comanda.estado,
        fechaApertura:
          comanda.fechaApertura,
        fechaCierre:
          comanda.fechaCierre || null,
        observacion:
          comanda.observacion || "",
        eliminadoPor:
          comanda.eliminadoPor || "",
        fechaEliminado:
          comanda.fechaEliminado || null,
        totalReferencial:
          redondear(
            totalReferencial
          ),
        productos:
          detalles.map(
            (detalle) => ({
              idDetalleComanda:
                String(detalle._id),
              idProducto:
                obtenerId(
                  detalle.idProducto
                ),
              producto:
                obtenerNombreProducto(
                  detalle.idProducto
                ),
              idInventario:
                obtenerId(
                  detalle.idInventario
                ),
              idAlmacen:
                obtenerId(
                  detalle.idAlmacen
                ),
              almacen:
                obtenerNombreAlmacen(
                  detalle.idAlmacen
                ),
              cantidad:
                Number(
                  detalle.cantidad || 0
                ),
              precioUnitario:
                redondear(
                  detalle.precioUnitario
                ),
              subtotal:
                redondear(
                  detalle.subtotal
                ),
              estado:
                detalle.estado,
              observacion:
                detalle.observacion || "",
              eliminadoPor:
                detalle.eliminadoPor || "",
              fechaEliminado:
                detalle.fechaEliminado ||
                null,
            })
          ),
      };
    }
  );
}

/* ======================================================
   CORTESÍAS
====================================================== */

function construirCortesias(
  cortesias: any[],
  detallesPorVenta: Map<string, any[]>
) {
  return cortesias.map(
    (venta) => {
      const idVenta =
        String(venta._id);

      const detalles =
        detallesPorVenta.get(
          idVenta
        ) || [];

      return {
        idVenta,
        numeroVenta:
          venta.numeroVenta || "",
        idComanda:
          obtenerId(venta.idComanda),
        numeroComanda:
          venta.idComanda
            ?.numeroComanda || "",
        mesero:
          obtenerNombrePersona(
            venta.idPerfil
          ),
        fechaVenta:
          venta.fechaVenta,
        valorReferencial:
          redondear(
            venta.subtotal
          ),
        totalDinero:
          0,
        observacion:
          venta.observacion || "",
        productos:
          detalles.map(
            (detalle) => ({
              idProducto:
                obtenerId(
                  detalle.idProducto
                ),
              producto:
                obtenerNombreProducto(
                  detalle.idProducto
                ),
              idInventario:
                obtenerId(
                  detalle.idInventario
                ),
              idAlmacen:
                obtenerId(
                  detalle.idAlmacen
                ),
              almacen:
                obtenerNombreAlmacen(
                  detalle.idAlmacen
                ),
              cantidad:
                Number(
                  detalle.cantidad || 0
                ),
              precioUnitario:
                redondear(
                  detalle.precioUnitario
                ),
              costoUnitario:
                redondear(
                  detalle.costoUnitario
                ),
              subtotal:
                redondear(
                  detalle.subtotal
                ),
            })
          ),
      };
    }
  );
}

/* ======================================================
   PRODUCTOS VENDIDOS / CORTESÍA / INVENTARIO AFECTADO
====================================================== */

function construirProductosDesdeVentas(
  ventas: any[],
  detallesPorVenta: Map<string, any[]>
) {
  const mapa =
    new Map<string, any>();

  for (const venta of ventas) {
    const detalles =
      detallesPorVenta.get(
        String(venta._id)
      ) || [];

    for (const detalle of detalles) {
      const idProducto =
        obtenerId(detalle.idProducto);

      const idInventario =
        obtenerId(
          detalle.idInventario
        );

      const key =
        `${idProducto}-${idInventario}`;

      if (!mapa.has(key)) {
        mapa.set(key, {
          idProducto,
          producto:
            obtenerNombreProducto(
              detalle.idProducto
            ),
          idInventario,
          idAlmacen:
            obtenerId(
              detalle.idAlmacen
            ),
          almacen:
            obtenerNombreAlmacen(
              detalle.idAlmacen
            ),
          cantidad: 0,
          totalVenta: 0,
          costoTotal: 0,
        });
      }

      const item =
        mapa.get(key);

      const cantidad =
        Number(
          detalle.cantidad || 0
        );

      item.cantidad += cantidad;

      item.totalVenta =
        redondear(
          item.totalVenta +
          Number(
            detalle.subtotal || 0
          )
        );

      item.costoTotal =
        redondear(
          item.costoTotal +
          cantidad *
          Number(
            detalle.costoUnitario ||
            0
          )
        );
    }
  }

  return Array.from(
    mapa.values()
  );
}

function construirInventarioAfectado(
  ventasPagadas: any[],
  cortesias: any[],
  detallesPorVenta: Map<string, any[]>
) {
  const mapa =
    new Map<string, any>();

  const procesar =
    (
      ventas: any[],
      tipo: "venta" | "cortesia"
    ) => {
      for (const venta of ventas) {
        const detalles =
          detallesPorVenta.get(
            String(venta._id)
          ) || [];

        for (const detalle of detalles) {
          const idProducto =
            obtenerId(
              detalle.idProducto
            );

          const idInventario =
            obtenerId(
              detalle.idInventario
            );

          const key =
            `${idProducto}-${idInventario}`;

          if (!mapa.has(key)) {
            mapa.set(key, {
              idProducto,
              producto:
                obtenerNombreProducto(
                  detalle.idProducto
                ),
              idInventario,
              idAlmacen:
                obtenerId(
                  detalle.idAlmacen
                ),
              almacen:
                obtenerNombreAlmacen(
                  detalle.idAlmacen
                ),
              cantidadVendida: 0,
              cantidadCortesia: 0,
              cantidadTotal: 0,
            });
          }

          const item =
            mapa.get(key);

          const cantidad =
            Number(
              detalle.cantidad || 0
            );

          if (tipo === "venta") {
            item.cantidadVendida +=
              cantidad;
          }

          if (tipo === "cortesia") {
            item.cantidadCortesia +=
              cantidad;
          }

          item.cantidadTotal =
            item.cantidadVendida +
            item.cantidadCortesia;
        }
      }
    };

  procesar(
    ventasPagadas,
    "venta"
  );

  procesar(
    cortesias,
    "cortesia"
  );

  return Array.from(
    mapa.values()
  );
}

/* ======================================================
   SERVICIO INTERNO CENTRALIZADO
====================================================== */

async function generarReporteCierreCaja({
  idCaja,
  idSucursal,
  idPerfil,
  montoReal = 0,
  fechaCierre,
  idAperturaCaja,
  fechaAperturaForzada,
}: {
  idCaja: string;
  idSucursal: string;
  idPerfil: string;
  montoReal?: number;
  fechaCierre?: Date;
  idAperturaCaja?: string;
  fechaAperturaForzada?: Date;
}) {
  const idCajaObj =
    toObjectId(idCaja);

  const idSucursalObj =
    toObjectId(idSucursal);

  const idPerfilObj =
    toObjectId(idPerfil);

  let aperturaActiva = null;

if (idAperturaCaja) {
  aperturaActiva =
    await AperturaCaja.findById(
      idAperturaCaja
    );
} else {
  aperturaActiva =
    await AperturaCaja.findOne({
      idCaja:
        idCajaObj,
      idSucursal:
        idSucursalObj,
      estado:
        "abierta",
    });
}

if (!aperturaActiva) {
  throw new Error(
    "No se encontró la apertura de caja para generar el reporte."
  );
}

const fechaFin =
  fechaCierre || new Date();

const fechaInicio =
  fechaAperturaForzada ||
  aperturaActiva.fechaApertura;

  const [
    caja,
    sucursal,
    responsableCierre,
    ventas,
    egresos,
    comandas,
  ] = await Promise.all([
    Caja.findById(idCajaObj)
      .lean(),

    Sucursal.findById(idSucursalObj)
      .lean(),

    PerfilUsuario.findById(idPerfilObj)
      .select(
        "nombres apellidos email"
      )
      .lean(),

    Venta.find({
      idCaja:
        idCajaObj,
      idSucursal:
        idSucursalObj,
      fechaVenta: {
        $gte:
          fechaInicio,
        $lte:
          fechaFin,
      },
    })
      .populate(
        "idPerfil",
        "nombres apellidos"
      )
      .populate(
        "idComanda",
        "numeroComanda estado observacion"
      )
      .lean(),

    Egreso.find({
      idCaja:
        idCajaObj,
      idSucursal:
        idSucursalObj,
      fechaEgreso: {
        $gte:
          fechaInicio,
        $lte:
          fechaFin,
      },
    })
      .populate(
        "idPerfil",
        "nombres apellidos"
      )
      .lean(),

    Comanda.find({
      idSucursal:
        idSucursalObj,
      fechaApertura: {
        $gte:
          fechaInicio,
        $lte:
          fechaFin,
      },
    })
      .populate(
        "idPerfil",
        "nombres apellidos"
      )
      .lean(),
  ]);

  const idsVentas =
    ventas.map(
      (venta: any) => venta._id
    );

  const idsEgresos =
    egresos.map(
      (egreso: any) => egreso._id
    );

  const idsComandas =
    comandas.map(
      (comanda: any) => comanda._id
    );

  const [
    detallesVentas,
    detallesEgresos,
    detallesComandas,
  ] = await Promise.all([
    DetalleVenta.find({
      idVenta: {
        $in:
          idsVentas,
      },
      estado:
        "activo",
    })
      .populate(
        "idProducto",
        "nombre marca descripcion"
      )
      .populate(
        "idAlmacen",
        "nombre tipo"
      )
      .lean(),

    DetalleEgreso.find({
      idEgreso: {
        $in:
          idsEgresos,
      },
    })
      .populate(
        "idProducto",
        "nombre marca descripcion"
      )
      .populate(
        "idAlmacen",
        "nombre tipo"
      )
      .lean(),

    DetalleComanda.find({
      idComanda: {
        $in:
          idsComandas,
      },
    })
      .populate(
        "idProducto",
        "nombre marca descripcion"
      )
      .populate(
        "idAlmacen",
        "nombre tipo"
      )
      .lean(),
  ]);

  const detallesPorVenta =
    agruparPorCampo(
      detallesVentas,
      "idVenta"
    );

  const detallesPorEgreso =
    agruparPorCampo(
      detallesEgresos,
      "idEgreso"
    );

  const detallesPorComanda =
    agruparPorCampo(
      detallesComandas,
      "idComanda"
    );

  const ventasPagadas =
    ventas.filter(
      (venta: any) =>
        venta.estado === "pagado"
    );

  const ventasAnuladas =
    ventas.filter(
      (venta: any) =>
        venta.estado === "anulado"
    );

  const cortesias =
    ventas.filter(
      (venta: any) =>
        venta.estado === "cortesia"
    );

  const egresosRegistrados =
    egresos.filter(
      (egreso: any) =>
        egreso.estado === "registrado"
    );

  const egresosAnulados =
    egresos.filter(
      (egreso: any) =>
        egreso.estado === "anulado"
    );

  const comandasActivas =
    comandas.filter(
      (comanda: any) =>
        comanda.estado !== "anulado"
    );

  const comandasAnuladas =
    comandas.filter(
      (comanda: any) =>
        comanda.estado === "anulado"
    );

  const totalVentas =
    redondear(
      ventasPagadas.reduce(
        (
          total: number,
          venta: any
        ) =>
          total +
          Number(venta.total || 0),
        0
      )
    );

  const totalVentasEfectivo =
    redondear(
      ventasPagadas
        .filter(
          (venta: any) =>
            venta.metodoPago ===
            "efectivo"
        )
        .reduce(
          (
            total: number,
            venta: any
          ) =>
            total +
            Number(
              venta.total || 0
            ),
          0
        )
    );

  const totalVentasQr =
    redondear(
      ventasPagadas
        .filter(
          (venta: any) =>
            venta.metodoPago === "qr"
        )
        .reduce(
          (
            total: number,
            venta: any
          ) =>
            total +
            Number(
              venta.total || 0
            ),
          0
        )
    );

  const totalVentasTransferencia =
    redondear(
      ventasPagadas
        .filter(
          (venta: any) =>
            venta.metodoPago ===
            "transferencia"
        )
        .reduce(
          (
            total: number,
            venta: any
          ) =>
            total +
            Number(
              venta.total || 0
            ),
          0
        )
    );

  const totalVentasMixto =
    redondear(
      ventasPagadas
        .filter(
          (venta: any) =>
            venta.metodoPago === "mixto"
        )
        .reduce(
          (
            total: number,
            venta: any
          ) =>
            total +
            Number(
              venta.total || 0
            ),
          0
        )
    );

  /*
    Cortesía:
    - No entra como ingreso real.
    - Se muestra como valor referencial.
    - Sí afecta inventario.
  */
  const totalCortesias =
    redondear(
      cortesias.reduce(
        (
          total: number,
          venta: any
        ) =>
          total +
          Number(
            venta.subtotal || 0
          ),
        0
      )
    );

  const totalVentasAnuladas =
    redondear(
      ventasAnuladas.reduce(
        (
          total: number,
          venta: any
        ) =>
          total +
          Number(
            venta.total || 0
          ),
        0
      )
    );

  const totalEgresos =
    redondear(
      egresosRegistrados.reduce(
        (
          total: number,
          egreso: any
        ) =>
          total +
          Number(
            egreso.total || 0
          ),
        0
      )
    );

  const totalEgresosEfectivo =
    redondear(
      egresosRegistrados
        .filter(
          (egreso: any) =>
            egreso.metodoPago ===
            "efectivo"
        )
        .reduce(
          (
            total: number,
            egreso: any
          ) =>
            total +
            Number(
              egreso.total || 0
            ),
          0
        )
    );

  /*
    Esta es TU lógica:
    El método de pago es informativo.
    La suma total vendida por mesero entra al control.
  */
  const totalEsperadoGeneral =
    redondear(
      Number(
        aperturaActiva.montoInicial ||
        0
      ) +
      totalVentas -
      totalEgresos
    );

  const diferencia =
    redondear(
      Number(montoReal || 0) -
      totalEsperadoGeneral
    );

  const estado =
    obtenerEstadoArqueo(
      diferencia
    );

  const productosVendidos =
    construirProductosDesdeVentas(
      ventasPagadas,
      detallesPorVenta
    );

  const productosCortesia =
    construirProductosDesdeVentas(
      cortesias,
      detallesPorVenta
    );

  const cantidadProductosVendidos =
    productosVendidos.reduce(
      (
        total: number,
        item: any
      ) =>
        total +
        Number(item.cantidad || 0),
      0
    );

  return {
    message:
      "Reporte de cierre de caja generado correctamente.",

    general: {
      idAperturaCaja:
        String(aperturaActiva._id),
      idCaja:
        String(idCaja),
      caja:
        caja?.nombre || "Caja",
      idSucursal:
        String(idSucursal),
      sucursal:
        sucursal?.nombreSucursal ||
        "Sucursal",
      idPerfil:
        String(idPerfil),
      responsableCierre:
        obtenerNombrePersona(
          responsableCierre
        ),
      fechaApertura:
        aperturaActiva.fechaApertura,
      fechaCierre:
        fechaFin,
      duracionMinutos:
        Math.round(
          (
            fechaFin.getTime() -
            aperturaActiva
              .fechaApertura
              .getTime()
          ) / 60000
        ),
    },

    resumen: {
      montoInicial:
        redondear(
          aperturaActiva.montoInicial
        ),

      totalVentas,
      totalVentasEfectivo,
      totalVentasQr,
      totalVentasTransferencia,
      totalVentasMixto,

      totalCortesias,
      totalVentasAnuladas,

      totalEgresos,
      totalEgresosEfectivo,

      /*
        Se mantiene este nombre porque tu modelo ya lo tiene.
        En tu caso representa el total esperado general.
      */
      totalEsperadoEfectivo:
        totalEsperadoGeneral,

      totalEsperadoGeneral,

      montoReal:
        redondear(montoReal),

      diferencia,
      estado,

      cantidadVentas:
        ventasPagadas.length,

      cantidadVentasAnuladas:
        ventasAnuladas.length,

      cantidadCortesias:
        cortesias.length,

      cantidadEgresos:
        egresosRegistrados.length,

      cantidadEgresosAnulados:
        egresosAnulados.length,

      cantidadComandas:
        comandas.length,

      cantidadComandasActivas:
        comandasActivas.length,

      cantidadComandasAnuladas:
        comandasAnuladas.length,

      cantidadProductosVendidos:
        redondear(
          cantidadProductosVendidos
        ),
    },

    ingresosPorMesero:
      construirIngresosPorMesero(
        ventasPagadas
      ),

    ventasAnuladas:
      construirVentasAnuladas(
        ventasAnuladas
      ),

    cortesias:
      construirCortesias(
        cortesias,
        detallesPorVenta
      ),

    egresos:
      construirEgresosDetalle(
        egresosRegistrados,
        detallesPorEgreso
      ),

    egresosAnulados:
      construirEgresosDetalle(
        egresosAnulados,
        detallesPorEgreso
      ),

    comandas:
      construirComandasResumen(
        comandasActivas,
        detallesPorComanda
      ),

    comandasAnuladas:
      construirComandasResumen(
        comandasAnuladas,
        detallesPorComanda
      ),

    productosVendidos,

    productosCortesia,

    inventarioAfectado:
      construirInventarioAfectado(
        ventasPagadas,
        cortesias,
        detallesPorVenta
      ),
  };
}

/* ======================================================
   CONTROLLER
====================================================== */

export class CierreCajaController {
  /* ======================================================
     PREVIEW: SOLO GENERA REPORTE, NO CIERRA LA CAJA
  ====================================================== */

  static previewCierre = async (
    req: Request,
    res: Response
  ) => {
    try {
      const {
        cajaId,
      } = req.params;

      const {
        idSucursal,
        idPerfil,
        montoReal,
        fechaCierre,
      } = req.query;

      if (!cajaId) {
        return res.status(400).json({
          message:
            "El id de la caja es obligatorio.",
        });
      }

      if (!idSucursal) {
        return res.status(400).json({
          message:
            "El id de la sucursal es obligatorio.",
        });
      }

      if (!idPerfil) {
        return res.status(400).json({
          message:
            "El id del perfil es obligatorio.",
        });
      }

      const reporte =
        await generarReporteCierreCaja({
          idCaja:
            String(cajaId),
          idSucursal:
            String(idSucursal),
          idPerfil:
            String(idPerfil),
          montoReal:
            Number(montoReal || 0),
          fechaCierre:
            fechaCierre
              ? new Date(
                String(fechaCierre)
              )
              : new Date(),
        });

      return res.json(reporte);
    } catch (error) {
      return res.status(400).json({
        message:
          error instanceof Error
            ? error.message
            : "Error al generar el reporte de cierre.",
      });
    }
  };

  /* ======================================================
     CREATE: CIERRA CAJA DEFINITIVAMENTE
  ====================================================== */

  static createCierre = async (
    req: Request,
    res: Response
  ) => {
    const session =
      await mongoose.startSession();

    session.startTransaction();

    try {
      const {
        idPerfil,
        idCaja,
        idSucursal,
        montoReal,
        fechaCierre,
        fecha,
        horaCierre,
        observacion,
        creadoPor,
      } = req.body;

      if (!idPerfil) {
        throw new Error(
          "El perfil es obligatorio."
        );
      }

      if (!idCaja) {
        throw new Error(
          "La caja es obligatoria."
        );
      }

      if (!idSucursal) {
        throw new Error(
          "La sucursal es obligatoria."
        );
      }

      const idCajaObj =
        toObjectId(String(idCaja));

      const idSucursalObj =
        toObjectId(
          String(idSucursal)
        );

      const idPerfilObj =
        toObjectId(
          String(idPerfil)
        );

      const aperturaActiva =
        await AperturaCaja.findOne({
          idCaja:
            idCajaObj,
          idSucursal:
            idSucursalObj,
          estado:
            "abierta",
        }).session(session);

      if (!aperturaActiva) {
        throw new Error(
          "La caja no tiene una apertura activa."
        );
      }

      const cierreFecha =
        construirFechaCierre({
          fechaApertura:
            aperturaActiva.fechaApertura,
          fechaCierre,
          fecha,
          horaCierre,
        });

      const cierreExistente =
        await CierreCaja.findOne({
          idAperturaCaja:
            aperturaActiva._id,
        }).session(session);

      if (cierreExistente) {
        throw new Error(
          "Esta apertura de caja ya tiene un cierre registrado."
        );
      }

      /*
        Generamos todo el reporte centralizado.
      */
      const reporte =
        await generarReporteCierreCaja({
          idCaja:
            String(idCaja),
          idSucursal:
            String(idSucursal),
          idPerfil:
            String(idPerfil),
          montoReal:
            Number(montoReal || 0),
          fechaCierre:
            cierreFecha,
        });

      /*
        Guardamos cierre con los campos que ya tiene tu modelo.
      */
      const cierre =
        new CierreCaja({
          idAperturaCaja:
            aperturaActiva._id,

          idPerfil:
            idPerfilObj,

          idSucursal:
            idSucursalObj,

          idCaja:
            idCajaObj,

          fechaApertura:
            aperturaActiva.fechaApertura,

          fechaCierre:
            cierreFecha,

          montoInicial:
            reporte.resumen.montoInicial,

          totalVentas:
            reporte.resumen.totalVentas,

          totalVentasEfectivo:
            reporte.resumen
              .totalVentasEfectivo,

          totalVentasQr:
            reporte.resumen
              .totalVentasQr,

          totalVentasTransferencia:
            reporte.resumen
              .totalVentasTransferencia,

          totalVentasMixto:
            reporte.resumen
              .totalVentasMixto,

          totalCortesias:
            reporte.resumen
              .totalCortesias,

          totalVentasAnuladas:
            reporte.resumen
              .totalVentasAnuladas,

          totalEgresos:
            reporte.resumen
              .totalEgresos,

          totalEgresosEfectivo:
            reporte.resumen
              .totalEgresosEfectivo,

          /*
            En tu lógica representa:
            montoInicial + totalVentas - totalEgresos.
          */
          totalEsperadoEfectivo:
            reporte.resumen
              .totalEsperadoGeneral,

          montoReal:
            reporte.resumen.montoReal,

          diferencia:
            reporte.resumen.diferencia,

          cantidadVentas:
            reporte.resumen
              .cantidadVentas,

          cantidadProductosVendidos:
            reporte.resumen
              .cantidadProductosVendidos,

          cantidadEgresos:
            reporte.resumen
              .cantidadEgresos,

          estado:
            reporte.resumen.estado,

          observacion:
            observacion || "",

          creadoPor:
            creadoPor ||
            String(idPerfil),
        });

      await cierre.save({
        session,
      });

      /*
        Cerramos la apertura activa.
      */
      aperturaActiva.estado =
        "cerrada";

      aperturaActiva.fechaActualizacion =
        new Date();

      aperturaActiva.actualizadoPor =
        creadoPor ||
        String(idPerfil);

      await aperturaActiva.save({
        session,
      });

      await session.commitTransaction();

      session.endSession();

      return res.status(201).json({
        message:
          "Cierre de caja generado correctamente.",
        cierre,
        resumen:
          reporte.resumen,
        general:
          reporte.general,
        ingresosPorMesero:
          reporte.ingresosPorMesero,
        ventasAnuladas:
          reporte.ventasAnuladas,
        cortesias:
          reporte.cortesias,
        egresos:
          reporte.egresos,
        egresosAnulados:
          reporte.egresosAnulados,
        comandas:
          reporte.comandas,
        comandasAnuladas:
          reporte.comandasAnuladas,
        productosVendidos:
          reporte.productosVendidos,
        productosCortesia:
          reporte.productosCortesia,
        inventarioAfectado:
          reporte.inventarioAfectado,
      });
    } catch (error) {
      await session.abortTransaction();

      session.endSession();

      return res.status(400).json({
        message:
          error instanceof Error
            ? error.message
            : "No se pudo cerrar la caja.",
      });
    }
  };

  /* ======================================================
     LISTAR CIERRES POR CAJA
  ====================================================== */

  static getCierresByCaja = async (
    req: Request,
    res: Response
  ) => {
    try {
      const {
        cajaId,
      } = req.params;

      if (!cajaId) {
        return res.status(400).json({
          message:
            "El id de la caja es obligatorio.",
        });
      }

      const cierres =
        await CierreCaja.find({
          idCaja:
            cajaId,
        })
          .populate(
            "idPerfil",
            "nombres apellidos"
          )
          .populate(
            "idCaja",
            "nombre"
          )
          .populate(
            "idSucursal",
            "nombreSucursal ubicacionSucursal"
          )
          .sort({
            fechaCierre:
              -1,
          });

      return res.json(cierres);
    } catch (error) {
      return res.status(500).json({
        message:
          error instanceof Error
            ? error.message
            : "Error al obtener cierres de caja.",
      });
    }
  };

  /* ======================================================
     OBTENER CIERRE POR ID
  ====================================================== */

  static getCierreById = async (
    req: Request,
    res: Response
  ) => {
    try {
      const {
        cierreId,
      } = req.params;

      if (!cierreId) {
        return res.status(400).json({
          message:
            "El id del cierre es obligatorio.",
        });
      }

      const cierre =
        await CierreCaja.findById(
          cierreId
        )
          .populate(
            "idPerfil",
            "nombres apellidos"
          )
          .populate(
            "idCaja",
            "nombre"
          )
          .populate(
            "idSucursal",
            "nombreSucursal ubicacionSucursal"
          )
          .populate(
            "idAperturaCaja"
          );

      if (!cierre) {
        return res.status(404).json({
          message:
            "Cierre de caja no encontrado.",
        });
      }

      return res.json(cierre);
    } catch (error) {
      return res.status(500).json({
        message:
          error instanceof Error
            ? error.message
            : "Error al obtener el cierre de caja.",
      });
    }
  };

  // static getReporteCierreById = async (
  //   req: Request,
  //   res: Response
  // ) => {
  //   try {
  //     const {
  //       cierreId,
  //     } = req.params;

  //     if (!cierreId) {
  //       return res.status(400).json({
  //         message:
  //           "El id del cierre es obligatorio.",
  //       });
  //     }

  //     const cierre =
  //       await CierreCaja.findById(
  //         cierreId
  //       );

  //     if (!cierre) {
  //       return res.status(404).json({
  //         message:
  //           "Cierre de caja no encontrado.",
  //       });
  //     }

  //     const reporte =
  //       await generarReporteCierreCaja({
  //         idCaja:
  //           String(cierre.idCaja),
  //         idSucursal:
  //           String(cierre.idSucursal),
  //         idPerfil:
  //           String(cierre.idPerfil),
  //         montoReal:
  //           Number(cierre.montoReal || 0),
  //         fechaCierre:
  //           cierre.fechaCierre,
  //       });

  //     return res.json({
  //       ...reporte,
  //       cierre,
  //     });
  //   } catch (error) {
  //     return res.status(400).json({
  //       message:
  //         error instanceof Error
  //           ? error.message
  //           : "Error obteniendo reporte del cierre.",
  //     });
  //   }
  // };
  static getReporteCierreById = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      cierreId,
    } = req.params;

    if (!cierreId) {
      return res.status(400).json({
        message:
          "El id del cierre es obligatorio.",
      });
    }

    const cierre =
      await CierreCaja.findById(
        cierreId
      );

    if (!cierre) {
      return res.status(404).json({
        message:
          "Cierre de caja no encontrado.",
      });
    }

    const reporte =
      await generarReporteCierreCaja({
        idCaja:
          String(cierre.idCaja),

        idSucursal:
          String(cierre.idSucursal),

        idPerfil:
          String(cierre.idPerfil),

        montoReal:
          Number(cierre.montoReal || 0),

        fechaCierre:
          cierre.fechaCierre,

        idAperturaCaja:
          String(cierre.idAperturaCaja),

        fechaAperturaForzada:
          cierre.fechaApertura,
      });

    /*
      El detalle se recalcula por rango,
      pero los montos principales se toman del cierre guardado,
      para respetar el histórico contable.
    */
    return res.json({
      ...reporte,

      cierre,

      resumen: {
        ...reporte.resumen,

        montoInicial:
          Number(cierre.montoInicial || 0),

        totalVentas:
          Number(cierre.totalVentas || 0),

        totalVentasEfectivo:
          Number(cierre.totalVentasEfectivo || 0),

        totalVentasQr:
          Number(cierre.totalVentasQr || 0),

        totalVentasTransferencia:
          Number(cierre.totalVentasTransferencia || 0),

        totalVentasMixto:
          Number(cierre.totalVentasMixto || 0),

        totalCortesias:
          Number(cierre.totalCortesias || 0),

        totalVentasAnuladas:
          Number(cierre.totalVentasAnuladas || 0),

        totalEgresos:
          Number(cierre.totalEgresos || 0),

        totalEgresosEfectivo:
          Number(cierre.totalEgresosEfectivo || 0),

        totalEsperadoEfectivo:
          Number(cierre.totalEsperadoEfectivo || 0),

        totalEsperadoGeneral:
          Number(cierre.totalEsperadoEfectivo || 0),

        montoReal:
          Number(cierre.montoReal || 0),

        diferencia:
          Number(cierre.diferencia || 0),

        cantidadVentas:
          Number(cierre.cantidadVentas || 0),

        cantidadProductosVendidos:
          Number(cierre.cantidadProductosVendidos || 0),

        cantidadEgresos:
          Number(cierre.cantidadEgresos || 0),

        estado:
          cierre.estado,
      },

      general: {
        ...reporte.general,

        idAperturaCaja:
          String(cierre.idAperturaCaja),

        idCaja:
          String(cierre.idCaja),

        idSucursal:
          String(cierre.idSucursal),

        idPerfil:
          String(cierre.idPerfil),

        fechaApertura:
          cierre.fechaApertura,

        fechaCierre:
          cierre.fechaCierre,

        duracionMinutos:
          Math.round(
            (
              cierre.fechaCierre.getTime() -
              cierre.fechaApertura.getTime()
            ) / 60000
          ),
      },
    });
  } catch (error) {
    return res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Error obteniendo reporte del cierre.",
    });
  }
};
  /* ======================================================
     ANULAR CIERRE
  ====================================================== */

  static anularCierre = async (
    req: Request,
    res: Response
  ) => {
    try {
      const {
        cierreId,
      } = req.params;

      const {
        eliminadoPor,
        observacion,
      } = req.body;

      const cierre =
        await CierreCaja.findById(
          cierreId
        );

      if (!cierre) {
        return res.status(404).json({
          message:
            "Cierre de caja no encontrado.",
        });
      }

      cierre.estado =
        "anulado";

      cierre.fechaEliminado =
        new Date();

      cierre.eliminadoPor =
        eliminadoPor || "sistema";

      cierre.observacion =
        observacion ||
        cierre.observacion ||
        "Cierre anulado.";

      await cierre.save();

      return res.json({
        message:
          "Cierre de caja anulado correctamente.",
        cierre,
      });
    } catch (error) {
      return res.status(400).json({
        message:
          error instanceof Error
            ? error.message
            : "No se pudo anular el cierre.",
      });
    }
  };
}


export default CierreCajaController;