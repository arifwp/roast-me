import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();

  console.log("Received data:", data);

  return NextResponse.json({
    success: true,
    message: "Data received",
    receivedData: data,
  });
}
