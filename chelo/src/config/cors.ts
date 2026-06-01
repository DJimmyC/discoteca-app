import { CorsOptions } from "cors";
const whitelist = [
  process.env.FRONTEND_URL || "http://localhost:5173",
  "http://localhost:5173",
  "http://localhost:4001" // <-- explícitamente
];

export const corsConfig: CorsOptions = {
  origin: function (origin, callback) {
    console.log("🟡 Origin recibido:", origin);
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      console.error("❌ Origin bloqueado:", origin);
      callback(new Error("Error de cors"));
    }
  },
  credentials: true,
};
