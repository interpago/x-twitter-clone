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
		const { userId, text, parentId } = body;

		if (!userId || !text) {
			return NextResponse.json(
				{ error: "userId and text are required" },
				{ status: 400 }
			);
		}

		const thread = await prisma.thread.create({
			data: {
				userId,
				text,
				parentId: parentId || null,
			},
		});

		return NextResponse.json(thread, { status: 201 });
	} catch (error) {
		console.error("[BOT_CREATE_THREAD]", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

export async function GET(req: NextRequest) {
	if (!validateBotRequest(req)) return unauthorized();

	try {
		const { searchParams } = new URL(req.url);
		const since = searchParams.get("since");
		const botUserId = searchParams.get("userId");
		const limit = Math.min(Number(searchParams.get("limit")) || 50, 100);

		const where: any = {
			parentId: null,
		};

		if (since) {
			where.createdAt = { gt: new Date(since) };
		}

		if (botUserId) {
			where.userId = botUserId;
		}

		const threads = await prisma.thread.findMany({
			where,
			include: {
				user: {
					select: {
						id: true,
						name: true,
						username: true,
						imageUrl: true,
					},
				},
				_count: {
					select: { replies: true, likes: true },
				},
			},
			orderBy: { createdAt: "asc" },
			take: limit,
		});

		return NextResponse.json({ data: threads });
	} catch (error) {
		console.error("[BOT_GET_THREADS]", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
