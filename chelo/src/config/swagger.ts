import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.2",
    info: {
      title: "REST API Node.js / Express / TypeScript",
      version: "1.0.0",
      description: "API Docs for Sucursal",
    },
    tags: [
      {
        name: "Usuario",
        description: "Operaciones relacionados con Usuario",
      },
       {
        name: "Rol",
        description: "Operaciones relacionados con Rol",
      },
      {
        name: "Sucursal",
        description: "Operaciones relacionadas con Sucursal",
      },
       {
        name: "PerfilUsuario",
        description: "Operaciones relacionados con Perfil Usuario",
      },
       {
        name: "CategoriaProducto",
        description: "Operaciones relacionados con Categoria Producto",
      },
      {
        name: "Producto",
        description: "Operaciones relacionados con  Producto",
      },
      {
        name: "ConversionProducto",
        description: "Operaciones relacionados con Conversion Producto",
      },
       {
        name: "Comanda",
        description: "Operaciones relacionados con Comanda ",
      },
       {
        name: "DetalleComanda",
        description: "Operaciones relacionados con DetalleComanda ",
      },
       {
        name: "Caja",
        description: "Operaciones relacionados con Caja ",
      },
        {
        name: "AperturaCaja",
        description: "Operaciones relacionados con AperturaCaja ",
      },
       {
        name: "CierreCaja",
        description: "Operaciones relacionados con CierreCaja ",
      },
       {
        name: "Venta",
        description: "Operaciones relacionados con Venta ",
      },
       {
        name: "DetalleVenta",
        description: "Operaciones relacionados con DetalleVenta ",
      },
       {
        name: "Egreso",
        description: "Operaciones relacionados con Egreso ",
      },
          {
        name: "DetalleEgreso",
        description: "Operaciones relacionados con DetalleEgreso ",
      },
       {
        name: "Almacen",
        description: "Operaciones relacionados con Almacen ",
      },
         {
        name: "Solicitud",
        description: "Operaciones relacionados con Solicitud ",
      },
       {
        name: "DetalleSolicitud",
        description: "Operaciones relacionados con DetalleSolicitud ",
      },
       {
        name: "TransferenciaInventario",
        description: "Operaciones relacionados con TransferanciaInventario ",
      },
       {
        name: "DetalleTransferencia",
        description: "Operaciones relacionados con Detalletransferencia ",
      },
       {
        name: "Inventario",
        description: "Operaciones relacionados con Inventario ",
      },
      
      {
        name: "Movimiento",
        description: "Operaciones relacionados con Movimientos  ",
      }
      
    ],
  },
  apis: ['./src/routes/**/*.ts'],
  
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;