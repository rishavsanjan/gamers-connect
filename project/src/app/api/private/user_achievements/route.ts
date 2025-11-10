import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export async function GET(req: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const [allAchievements, user] = await Promise.all([
        prisma.achievement.findMany(),
        await prisma.user.findUnique({
            where: { id: userId },
            include: {
                _count: {
                    select: {
                        Rating: true,
                        Comment: true,
                        Collection: true,
                    },
                },
                MyGame: {
                    select: {
                        owned_platform: true,
                    },
                },
            },
        })
    ]);

    console.log(allAchievements);


    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    console.log(user)

    // Get user's unlocked achievements
    const userAchievements = await prisma.userAchievement.findMany({
        where: { userId },
    });
    const unlockedIds = new Set(userAchievements.map((ua) => ua.achievementId));

    // Calculate progress dynamically
    const achievementsWithProgress = allAchievements.map((a) => {
        let current = 0;

        switch (a.metric) {
            case "ratings":
                current = user._count.Rating;
                break;
            case "androidgames":
                current = user.MyGame.filter(
                    (g) => g.owned_platform === "ANDROID"
                ).length;
                break;
            case "comments":
                current = user._count.Comment;
                break;
            case "collection":
                current = user._count.Collection;
                break;
            default:
                current = 0;
        }

        const progress = a.goalValue
            ? Math.min((current / a.goalValue) * 100, 100)
            : 0;

        return {
            ...a,
            unlocked: unlockedIds.has(a.id),
            currentValue: current,
            progress,
        };
    });


    return NextResponse.json({
        total: allAchievements.length,
        achievements: achievementsWithProgress,
    });
}
