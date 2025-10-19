import fs from "fs";
import path from "path";

const logDir = path.join(process.cwd(), "logs");
const logFile = path.join(logDir, "mail.log");

// Crée le dossier logs s’il n’existe pas
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

export function logMail(message: string) {
  const timestamp = new Date().toISOString();
  const line = `[${timestamp}] ${message}\n`;
  fs.appendFileSync(logFile, line, "utf8");
}
