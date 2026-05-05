import { auth, currentUser } from "@clerk/nextjs/server";
import { Liveblocks } from "@liveblocks/node";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

export async function POST(request: Request) {
  const authorization = await auth();
  const user = await currentUser();

  if (!authorization?.userId || !user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { room } = (await request.json().catch(() => ({}))) as {
    room?: string;
  };

  if (!room) {
    return new Response("Missing room", { status: 400 });
  }

  const board = await convex.query(api.board.get, {
    id: room as Id<"boards">,
  });

  if (board?.orgId !== authorization.orgId) {
    return new Response("Forbidden", { status: 403 });
  }

  const userInfo = {
    name: user.firstName + " " + user.lastName,
    image: user.imageUrl,
  };

  const session = liveblocks.prepareSession(user.id, { userInfo });
  session.allow(room, session.FULL_ACCESS);

  const { status, body } = await session.authorize();

  return new Response(body, { status });
}
