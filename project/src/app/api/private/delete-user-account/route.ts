import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from '@/lib/db'

export async function DELETE(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;

        await prisma.$transaction(async (tx) => {
            await tx.group.updateMany({
                where: {
                    members: {
                        some: {
                            id: userId
                        }
                    }
                },
                data: {
                    memberCount: {
                        decrement: 1
                    }
                }
            });

            const userPosts = await tx.post.findMany({
                where: { userId, groupId: { not: null } },
                select: { groupId: true }
            });

            const groupIds = [...new Set(userPosts.map(p => p.groupId).filter(Boolean))];

            if (groupIds.length > 0) {
                await tx.group.updateMany({
                    where: { id: { in: groupIds as string[] } },
                    data: { postCount: { decrement: 1 } }
                });
            }

            await tx.post.updateMany({
                where: {
                    Like: {
                        some: { userId }
                    }
                },
                data: {
                    likeCount: { decrement: 1 }
                }
            });

            const userComments = await tx.comment.findMany({
                where: { userId },
                select: { postId: true }
            });

            const postIds = [...new Set(userComments.map(c => c.postId))];

            if (postIds.length > 0) {
                await tx.post.updateMany({
                    where: { id: { in: postIds } },
                    data: { commentCount: { decrement: 1 } }
                });
            }

            await tx.comment.updateMany({
                where: {
                    CommentReaction: {
                        some: { userId }
                    }
                },
                data: {
                    likeCount: { decrement: 1 }
                }
            });

            await tx.user.update({
                where: { id: userId },
                data: {
                    groupMembers : {set : []},
                }
            });


            await tx.user.delete({
                where: { id: userId }
            });
        });

        return NextResponse.json({
            success: true,
            message: "Account deleted successfully"
        }, { status: 200 });

    } catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json({
            error: "Failed to delete account",
            details: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}