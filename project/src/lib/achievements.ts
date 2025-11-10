import { prisma } from "@/lib/db";

export async function checkAndUnlockAchievements(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            Rating: true,
            MyGame: true,
            Collection: true,
            Post: true,
            Comment: true,
            userAchievements: { include: { achievement: true } },
        },
    });

    if (!user) return;

    const unlockedTitles = user.userAchievements.map((ua) => ua.achievement.id);

    const achievements = [
        {
            id: 'cmhtgbat8000004jxd7at0cf1',
            title: "Rated 5 Games",
            description: "Rate 5 or more games.",
            xpReward: 50,
            condition: user.Rating.length >= 5,
            goalValue: 5,
            metric: 'ratings'
        },
        {
            id: 'cmhtgcdcj000104jx51ixcpxk',
            title: "Mobile Gamer",
            description: "Play 5 or more games on Android.",
            xpReward: 50,
            condition:
                user.MyGame.filter((g) => g.owned_platform === "ANDROID").length >= 5,
            goalValue: 5,
            metric: 'mobilegames'
        },
        {
            id: 'cmhtgdd9e000304jx7z02ffb9',
            title: "Collector",
            description: "Create your first collection.",
            xpReward: 25,
            condition: user.Collection.length >= 1,
            goalValue: 1,
            metric: 'collections'
        },
        {
            id: 'cmhtgcxs0000204jx701zfyx8',
            title: "Active Commenter",
            description: "Post 10 or more comments.",
            xpReward: 50,
            condition: user.Comment.length >= 10,
            goalValue: 10,
            metric: 'comments'
        },
    ];

    for (const a of achievements) {
        if (a.condition && !unlockedTitles.includes(a.id)) {
            // Check if exists in DB, else create
            let achievement = await prisma.achievement.findUnique({
                where: { id: a.id },
            });

            if (!achievement) {
                achievement = await prisma.achievement.create({
                    data: {
                        title: a.title,
                        description: a.description,
                        xpReward: a.xpReward,
                    },
                });
            }

            // Create UserAchievement
            await prisma.userAchievement.create({
                data: {
                    userId,
                    achievementId: achievement.id,
                    
                },
            });

            // Update XP
            await prisma.user.update({
                where: { id: userId },
                data: { xp: { increment: a.xpReward } },
            });

            console.log(`🏆 Achievement unlocked: ${a.title}`);
        }
    }
}
