import { currentUser } from "@clerk/nextjs";
import prisma from "@/lib/prismadb";
import Tweets from "@/components/cards/tweets/Tweets";
import NotFound from "@/components/sharing/NotFound";

const PAGE_SIZE = 30;

const Page = async ({ searchParams: _ }: any) => {
	const clerkUser = await currentUser().catch(() => null);
	const userId = clerkUser?.id || "";

	const tweets = await prisma.thread.findMany({
		where: { parentId: null },
		include: {
			user: {
				select: { id: true, imageUrl: true, name: true, username: true, followers: true, followings: true },
			},
			bookmarks: true,
			likes: true,
			_count: { select: { replies: true } },
		},
		orderBy: { createdAt: "desc" },
		take: PAGE_SIZE,
	});

	if (!tweets.length) {
		return <NotFound description="No posts yet" />;
	}

	return (
		<>
			{tweets.map((tweet: any) => (
				<Tweets key={tweet.id} tweet={tweet} userId={userId} />
			))}
		</>
	);
};

export default Page;
