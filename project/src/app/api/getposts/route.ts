// import { NextResponse } from "next/server";
// import { auth } from "@/auth";
// import { prisma } from "@/lib/db";

// export async function POST(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);

//     const page = Number(searchParams.get("page") || 1);
//     const limit = Number(searchParams.get("limit") || 10);
//     const skip = (page - 1) * limit;

//     let { filter = "latest", category } = await req.json();
//     if(category === 'ALL'){
//       category = "";
//     }

//     const session = await auth().catch(() => null);
//     const userId = session?.user?.id ?? null;

//     let followingUserIds: string[] = [];
//     let joinedGroupIds: string[] = [];

//     if (userId) {
//       const following = await prisma.follow.findMany({
//         where: { followerId: userId },
//         select: { followingId: true },
//       });

//       const groups = await prisma.group.findMany({
//         where: {
//           members: {
//             some: { id: userId },
//           },
//         },
//         select: { id: true },
//       });

//       followingUserIds = following.map(f => f.followingId);
//       joinedGroupIds = groups.map(g => g.id);
//     }

//     const whereClause: any = {
//       ...(category && { type: category }),
//       ...(userId
//         ? {
//           OR: [
//             { userId: { in: followingUserIds } },
//             { groupId: { in: joinedGroupIds } },
//             { visibility: "EVERYONE" },
//             { userId },
//           ],
//         }
//         : {
//           visibility: "EVERYONE",
//         }),
//     };

//     const posts = await prisma.post.findMany({
//       where: whereClause,
//       include: {
//         user: {
//           select: { id: true, name: true, username: true, avatar: true },
//         },
//         group: {
//           select: { id: true, name: true },
//         },
//         game: {
//           select: { name: true, igdb_id: true },
//         },
//         Like: userId ? { where: { userId } } : false,
//         bookmarks: userId
//           ? { where: { userId }, select: { postId: true } }
//           : false,
//       },
//       orderBy:
//         filter === "popular"
//           ? { likeCount: "desc" }
//           : { createdAt: "desc" },
//       skip,
//       take: limit,
//     });

//     const rankedPosts = posts.sort((a, b) => {
//       const getRank = (post: any) => {
//         if (post.userId === userId) return 1;
//         if (followingUserIds.includes(post.userId)) return 2;
//         if (post.groupId && joinedGroupIds.includes(post.groupId)) return 3;
//         if (post.visibility === "EVERYONE") return 4;
//         return 5;
//       };

//       return getRank(a) - getRank(b);
//     });

//     const result = rankedPosts.map(post => ({
//       id: post.id,
//       description: post.description,
//       createdAt: post.createdAt,
//       mediaUrls: post.mediaUrls,
//       likeCount: post.likeCount,
//       commentCount: post.commentCount,
//       hasLiked: userId ? post.Like.length > 0 : false,
//       hasBookmarked: userId ? post.bookmarks.length > 0 : false,
//       user: post.user,
//       group: post.group,
//       game: post.game,
//     }));

//     return NextResponse.json({ posts: result }, { status: 200 });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }


// export async function POST(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);

//     const page = Number(searchParams.get("page") || 1);
//     const limit = Number(searchParams.get("limit") || 10);
//     const skip = (page - 1) * limit;

//     let { filter = "latest", category, feedType = "FORYOU" } = await req.json();

//     if (category === "ALL") category = "";

//     const session = await auth().catch(() => null);
//     const userId = session?.user?.id ?? null;

//     let followingUserIds: string[] = [];
//     let joinedGroupIds: string[] = [];

//     if (userId) {
//       const following = await prisma.follow.findMany({
//         where: { followerId: userId },
//         select: { followingId: true },
//       });

//       const groups = await prisma.groupMember.findMany({
//         where: { userId },
//         select: { groupId: true },
//       });

//       followingUserIds = following.map(f => f.followingId);
//       joinedGroupIds = groups.map(g => g.groupId);
//     }

//     /* ---------------- FEED LOGIC ---------------- */

//     let whereClause: any = {
//       ...(category && { type: category }),
//     };

//     if (feedType === "FORYOU") {
//       whereClause = {
//         ...whereClause,
//         visibility: "EVERYONE",
//       };
//     }

//     if (feedType === "FOLLOWING") {
//       if (!userId) {
//         return NextResponse.json({ posts: [], nextPage: null }, { status: 200 });
//       }

//       whereClause = {
//         ...whereClause,
//         OR: [
//           { userId: { in: followingUserIds } },
//           { groupId: { in: joinedGroupIds } },
//         ],
//       };
//     }

//     /* ---------------- QUERY ---------------- */

//     const [posts, totalCount] = await Promise.all([
//       prisma.post.findMany({
//         where: whereClause,
//         include: {
//           user: {
//             select: { id: true, name: true, username: true, avatar: true },
//           },
//           group: {
//             select: { id: true, name: true },
//           },
//           game: {
//             select: { name: true, igdb_id: true },
//           },
//           Like: userId ? { where: { userId } } : false,
//           bookmarks: userId
//             ? { where: { userId }, select: { postId: true } }
//             : false,
//         },
//         orderBy:
//           filter === "popular"
//             ? { likeCount: "desc" }
//             : { createdAt: "desc" },
//         skip,
//         take: limit,
//       }),
//       prisma.post.count({ where: whereClause })
//     ]);

//     /* ---------------- RESPONSE SHAPE ---------------- */

//     const result = posts.map(post => ({
//       id: post.id,
//       description: post.description,
//       createdAt: post.createdAt,
//       mediaUrls: post.mediaUrls,
//       likeCount: post.likeCount,
//       commentCount: post.commentCount,
//       hasLiked: userId ? post.Like.length > 0 : false,
//       hasBookmarked: userId ? post.bookmarks.length > 0 : false,
//       user: post.user,
//       group: post.group,
//       game: post.game,
//     }));

//     const hasMore = skip + limit < totalCount;

//     return NextResponse.json({ 
//       posts: result, 
//       nextPage: hasMore ? page + 1 : null 
//     }, { status: 200 });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 10);
    const skip = (page - 1) * limit;

    let { filter = "latest", category, feedType = "FORYOU" } = await req.json();

    if (category === "ALL") category = "";

    const session = await auth().catch(() => null);
    const userId = session?.user?.id ?? null;

    let followingUserIds: string[] = [];
    let joinedGroupIds: string[] = [];

    /* ---------------- USER CONTEXT ---------------- */

    if (userId) {
      const following = await prisma.follow.findMany({
        where: { followerId: userId },
        select: { followingId: true },
      });

      const groups = await prisma.group.findMany({
        where: {
          members: {
            some: { userId }, // ✅ FIXED
          },
        },
        select: { id: true },
      });

      followingUserIds = following.map(f => f.followingId);
      joinedGroupIds = groups.map(g => g.id);
    }

    /* ---------------- FEED LOGIC ---------------- */

    let whereClause: any = {
      ...(category && { type: category }),
    };

    if (feedType === "FORYOU") {
      whereClause = {
        ...whereClause,
        OR: [
          { visibility: "EVERYONE" },
          ...(userId
            ? [
              {
                visibility: "ONLY_FOLLOWERS",
                userId: { in: followingUserIds },
              },
              {
                visibility: "GROUP",
                groupId: { in: joinedGroupIds },
              },
            ]
            : []),
        ],
      };
    }

    if (feedType === "FOLLOWING") {
      if (!userId) {
        return NextResponse.json(
          { posts: [], hasMore: false },
          { status: 200 }
        );
      }

      whereClause = {
        ...whereClause,
        OR: [
          {
            visibility: "EVERYONE",
            userId: { in: followingUserIds },
          },
          {
            visibility: "ONLY_FOLLOWERS",
            userId: { in: followingUserIds },
          },
          {
            visibility: "GROUP",
            groupId: { in: joinedGroupIds },
          },
        ],
      };
    }

    /* ---------------- QUERY ---------------- */

    const posts = await prisma.post.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        group: {
          select: {
            id: true,
            name: true,
          },
        },
        game: {
          select: {
            name: true,
            igdb_id: true,
          },
        },
        Like: userId ? { where: { userId } } : false,
        bookmarks: userId
          ? { where: { userId }, select: { postId: true } }
          : false,
      },
      orderBy:
        filter === "popular"
          ? { likeCount: "desc" }
          : { createdAt: "desc" },
      skip,
      take: limit,
    });

    /* ---------------- RESPONSE SHAPE ---------------- */

    const result = posts.map(post => ({
      id: post.id,
      description: post.description,
      createdAt: post.createdAt,
      mediaUrls: post.mediaUrls,
      likeCount: post.likeCount,
      commentCount: post.commentCount,
      hasLiked: userId ? post.Like.length > 0 : false,
      hasBookmarked: userId ? post.bookmarks.length > 0 : false,
      user: post.user,
      group: post.group,
      game: post.game,
      viewCount : post.viewCount
    }));

    return NextResponse.json(
      {
        posts: result,
        hasMore: posts.length === limit,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET POSTS ERROR:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}


