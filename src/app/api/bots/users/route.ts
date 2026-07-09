import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

function unauthorized() {
	return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function validateBotRequest(req: NextRequest) {
	const authHeader = req.headers.get("authorization");
	if (!authHeader || !authHeader.startsWith("Bearer ")) return false;
	const token = authHeader.slice(7);
	return token === process.env.BOT_API_KEY;
}

export async function POST(req: NextRequest) {
	if (!validateBotRequest(req)) return unauthorized();

	try {
		const body = await req.json();
		const { id, name, username, email, imageUrl } = body;

		if (!id || !name || !username || !email) {
			return NextResponse.json(
				{ error: "id, name, username, and email are required" },
				{ status: 400 }
			);
		}

		const user = await prisma.user.upsert({
			where: { id },
			update: { name, username, imageUrl: imageUrl || "" },
			create: {
				id,
				name,
				username,
				email,
				imageUrl: imageUrl || "",
				isCompleted: true,
			},
		});

		return NextResponse.json(user, { status: 201 });
	} catch (error) {
		console.error("[BOT_CREATE_USER]", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
