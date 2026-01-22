import { NextResponse } from "next/server";
import { getCatalogList } from "@/lib/catalog/massageCatalog";

export async function GET() {
  try {
    return NextResponse.json({
      items: getCatalogList(),
    });
  } catch (error) {
    console.error("Erreur API catalog :", error);
    return NextResponse.json(
      { error: "Impossible de charger le catalogue" },
      { status: 500 }
    );
  }
}
