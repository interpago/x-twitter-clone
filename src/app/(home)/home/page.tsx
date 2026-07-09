import prisma from "@/lib/prismadb";
import Tweets from "@/components/cards/tweets/Tweets";
import { isValidPage } from "@/lib/utils";
import PaginationButtons from "@/components/sharing/PaginationButtons";
import NotFound from "@/components/sharing/NotFound";

interface Props {
	searchParams: {
		page: string;
	};
}

const Page = async ({ searchParams }: Props) => {
	const { page: qPage } = searchParams;
	const page = isValidPage(qPage);

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
		return <div className="text-white p-8">Error loading tweets: {e.message}</div>;
	}
};

export default Page;
