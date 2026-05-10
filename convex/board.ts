import { v } from "convex/values";
import type { Doc } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

const ADMIN_ROLES = new Set(["org:admin", "admin"]);

// Non-author org admins are authorized via JWT claims on the Convex identity.
// Add these to your Clerk JWT template used for Convex (see Clerk dashboard → JWT templates):
//   "org_id": "{{org.id}}"
//   "org_role": "{{org.role}}"

function orgClaimsFromIdentity(identity: Record<string, unknown>) {
    return {
        orgId: (identity.org_id ?? identity.orgId) as string | undefined,
        orgRole: (identity.org_role ?? identity.orgRole) as string | undefined,
    };
}

function canManageBoard(
    identity: Record<string, unknown> & { subject: string },
    board: Doc<"boards">,
): boolean {
    if (board.authorId === identity.subject) return true;
    const { orgId, orgRole } = orgClaimsFromIdentity(identity);
    if (
        orgId != null &&
        orgRole != null &&
        orgId === board.orgId &&
        ADMIN_ROLES.has(orgRole)
    ) {
        return true;
    }
    return false;
}

const images = [
    "/placeholders/1.svg",
    "/placeholders/2.svg",
    "/placeholders/3.svg",
    "/placeholders/4.svg",
    "/placeholders/5.svg",
    "/placeholders/6.svg",
    "/placeholders/7.svg",
    "/placeholders/8.svg",
    "/placeholders/9.svg",
    "/placeholders/10.svg",
]

export const create = mutation({
    args: {
        title: v.string(),
        orgId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if(!identity){
            throw new Error("Unauthorized");
        }

        const randomImage = images[Math.floor(Math.random() * images.length)];

        const board = await ctx.db.insert("boards", {
            title: args.title,
            orgId: args.orgId,
            authorId: identity.subject,
            authorName: identity.name!,
            imageUrl: randomImage,
        });

        return board;
    },
});

export const remove = mutation({
    args: { id: v.id("boards") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if(!identity){
            throw new Error("Unauthorized");
        }

        const board = await ctx.db.get(args.id);
        if (!board) {
            throw new Error("Board not found");
        }

        if (!canManageBoard(identity as Record<string, unknown> & { subject: string }, board)) {
            throw new Error("Forbidden");
        }

        const userId = identity.subject;

        const existingFavorite = await ctx.db
            .query("userFavorites")
            .withIndex("by_user_board", (q) => q
                .eq("userId", userId)
                .eq("boardId", args.id)
            ).unique();

        if(existingFavorite){
            await ctx.db.delete(existingFavorite._id);
        }

        await ctx.db.delete(args.id);
    }
});

export const update = mutation({
    args: {
        id: v.id("boards"),
        title: v.string(),
    },
    handler: async (ctx, args) => {

        const identity = await ctx.auth.getUserIdentity();

        if(!identity){  
            throw new Error("Unauthorized");
        }

        const title = args.title.trim();
        
        if(!title){
            throw new Error("Title is required");
        }

        if(title.length > 60){
            throw new Error("Title must be less than 60 characters");
        }

        const existing = await ctx.db.get(args.id);
        if (!existing) {
            throw new Error("Board not found");
        }

        if (!canManageBoard(identity as Record<string, unknown> & { subject: string }, existing)) {
            throw new Error("Forbidden");
        }

        const board = await ctx.db.patch(args.id, {
            title,
        });

        return board;
    }
});

export const Favorite = mutation({
    args: { id: v.id("boards") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if(!identity){
            throw new Error("Unauthorized");
        }

        const board = await ctx.db.get(args.id);

        if(!board){
            throw new Error("Board not found");
        }

        const userId = identity.subject;

        const existingFavorite = await ctx.db
            .query("userFavorites")
            .withIndex("by_user_board", (q) => q
                .eq("userId", userId)
                .eq("boardId", args.id)
            ).unique();

        if(existingFavorite){
            throw new Error("Board is already in your favorites");
        }

        await ctx.db.insert("userFavorites", {
            userId,
            boardId: board._id,
            orgId: board.orgId,
        });

        return board;
    }
});

export const Unfavorite = mutation({
    args: { id: v.id("boards") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if(!identity){
            throw new Error("Unauthorized");
        }

        const board = await ctx.db.get(args.id);

        if(!board){
            throw new Error("Board not found");
        }

        const userId = identity.subject;

        const existingFavorite = await ctx.db
            .query("userFavorites")
            .withIndex("by_user_board_org", (q) => q
                .eq("userId", userId)
                .eq("boardId", args.id)
                .eq("orgId", board.orgId))
            .unique();

        if(!existingFavorite){
            throw new Error("Board is not in your favorites");
        }

        await ctx.db.delete(existingFavorite._id);

        return board;
    }
});

export const get = query({
    args: { id: v.id("boards") },
    handler: async (ctx, args) => {
        const board = ctx.db.get(args.id);

        return board;
    }
});