import { NextResponse } from "next/server";
import prisma from "@/utils/prismaClient";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { emailAddress, connectionType, username, password, host } = body;

    // Validate required fields
    if (!emailAddress || !connectionType || !username || !password || !host) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Save email configuration to the database
    const emailConfig = await prisma.emailIngestionConfig.create({
      data: { emailAddress, connectionType, username, password, host },
    });

    return NextResponse.json(
      { message: "Configuration saved successfully", emailConfig },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error saving email config:", error);
    return NextResponse.json(
      { error: "Failed to save configuration" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const emailConfigs = await prisma.emailIngestionConfig.findMany();

    return NextResponse.json(
      { message: "Email configurations retrieved", emailConfigs },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error fetching email configs:", error);
    return NextResponse.json(
      { error: "Failed to fetch email configurations" },
      { status: 500 }
    );
  }
}
