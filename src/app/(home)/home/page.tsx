import { getTweetsAction } from "@/actions/tweet.action";
import { currentUser } from "@clerk/nextjs";
import { getUserAction } from "@/actions/user.action";
import { redirect } from "next/navigation";
import NotFound from "@/components/sharing/NotFound";
import Tweets from "@/components/cards/tweets/Tweets";
import { isValidPage } from "@/lib/utils";
import PaginationButtons from "@/components/sharing/PaginationButtons";
import prisma from "@/lib/prismadb";

interface Props {
	searchParams: {
		page: string;
	};
}

const Page = async ({ searchParams }: Props) => {
	const { page: qPage } = searchParams;
	const page = isValidPage(qPage);

	const clerkUser = await currentUser();

	if (!clerkUser) {
		try {
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
				take: 30,
				skip: page * 30,
			});
			const totalCount = await prisma.thread.count({ where: { parentId: null } });
			return (
				<>
					{tweets.length ? (
						<>
							{tweets.map((tweet: any) => (
								<Tweets key={tweet.id} tweet={tweet} userId="" />
							))}
							<PaginationButtons
								currentPage={page}
								currentPath={"/home"}
								hasNext={Boolean(totalCount - page * 30 - tweets.length)}
							/>
						</>
					) : (
						<NotFound description="No posts can be displayed" />
					)}
				</>
			);
		} catch (e: any) {
			console.error("[HOME_PAGE_ERROR]", e);
			return <div className="text-white p-8">Error: {e?.message || "Unknown"}</div>;
		}
	}

	const user = await getUserAction(clerkUser.id);
	if (!user) redirect("/");

	const isFollowing = false;
	const tweets = await getTweetsAction({ userId: user.id, isFollowing, page });

	return (
		<>
			{tweets?.data.length ? (
				<>
					{tweets?.data.map((tweet) => (
						<Tweets key={tweet.id} tweet={tweet} userId={user.id} />
					))}

					<PaginationButtons
						currentPage={page}
						currentPath={"/home"}
						hasNext={tweets.hasNext}
					/>
				</>
			) : (
				<NotFound description="No posts can be displayed" />
			)}
		</>
	);
};

export default Page;
