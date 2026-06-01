const express = require("express");
const cors = require("cors");
const escpos = require("escpos");

// Habilitar USB
escpos.USB = require("escpos-usb");

const app = express();
app.use(cors());
app.use(express.json());

// Ruta para imprimir
app.post("/imprimir", (req, res) => {
  const { texto } = req.body;

  if (!texto) {
    return res.status(400).send("❌ Falta el texto a imprimir");
  }

  try {
    // Conecta a la impresora USB (Epson TM-T20II)
    const device = new escpos.USB();
    const printer = new escpos.Printer(device);

    device.open((err) => {
      if (err) {
        console.error("❌ Error al abrir impresora:", err);
        return res.status(500).send("No se pudo abrir la impresora");
      }

      // Enviar texto a la impresora
      printer
        .encode("UTF-8")
        .text("=== COMANDA ===")
        .text(texto)
        .cut()
        .close();

      console.log("✅ Ticket enviado a la impresora");
      res.send("Impresión enviada con éxito");
    });
  } catch (error) {
    console.error("❌ Error general:", error);
    res.status(500).send("Fallo en la impresión");
  }
});

// Servidor en puerto 4002
const PORT = 4002;
app.listen(PORT, () =>
  console.log(`🖨️ Servidor de impresión corriendo en http://localhost:${PORT}`)
);

