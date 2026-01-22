import { google } from "googleapis";

/**
 * Initialise le client Google Sheets avec un compte de service
 */
function getSheetsClient() {
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL!,
    key: process.env.GOOGLE_SHEETS_PRIVATE_KEY!.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
}

/**
 * Récupère toutes les lignes existantes
 */
export async function getAllRows() {
  const sheets = getSheetsClient();

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
    range: "A2:L", // saute l'en-tête
  });

  return res.data.values ?? [];
}

/**
 * Ajoute une ligne à la première ligne vide
 */
export async function appendRow(values: string[]) {
  const sheets = getSheetsClient();

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
    range: "A:L",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [values],
    },
  });
}

export async function isPaymentAlreadyProcessed(paymentIntentId: string) {
  const rows = await getAllRows();

  return rows.some((row: string[]) => row[0] === paymentIntentId);
}
