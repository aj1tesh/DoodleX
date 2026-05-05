import { auth } from "@clerk/nextjs/server";
import { Liveblocks } from "@liveblocks/node";

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { room } = (await request.json().catch(() => ({}))) as {
    room?: string;
  };

  if (!room) {
    return new Response("Missing room", { status: 400 });
  }

  const session = liveblocks.prepareSession(userId);
  session.allow(room, session.FULL_ACCESS);

  const { status, body } = await session.authorize();

  return new Response(body, { status });
}

