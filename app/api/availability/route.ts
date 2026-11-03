import { NextRequest, NextResponse } from "next/server";
import { calculateDateAvailability } from "@/lib/services/availability-service";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const date = searchParams.get("date");
    const doctorId = searchParams.get("doctorId") || "default_doctor";

    if (!date) {
      return NextResponse.json(
        { success: false, error: "Query parameter 'date' (YYYY-MM-DD) is required." },
        { status: 400 }
      );
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json(
        { success: false, error: "Invalid date format. Expected YYYY-MM-DD." },
        { status: 400 }
      );
    }

    const availability = await calculateDateAvailability(date, doctorId);

    return NextResponse.json({
      success: true,
      ...availability,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("Availability API error:", err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
