import { ReactNode } from "react";
import { currentUser } from "@clerk/nextjs";

interface Props {
	children: ReactNode;
}

const layout = async ({ children }: Props) => {
	let clerkUser: any = null;
	try {
		clerkUser = await currentUser();
	} catch (e) {
		// Clerk not available
	}

	if (!clerkUser) {
		return (
			<main className="min-h-screen">
				<section className="h-full max-w-7xl mx-auto flex justify-center">
					<section className="max-sm:border-none border-x border-x-gray-300 max-sm:pb-32 sm:pb-0 w-full max-sm:max-w-full max-w-[600px]">
						{children}
					</section>
				</section>
			</main>
		);
	}

	const { getUserAction, getUsersAction } = await import("@/actions/user.action");
	const { getTotalNotificationsAction } = await import("@/actions/notification.action");
	const Bottombar = (await import("@/components/sharing/Bottombar")).default;
	const LeftSidebar = (await import("@/components/sharing/leftsidebar/LeftSidebar")).default;
	const RightSidebar = (await import("@/components/sharing/rightsidebar/RightSidebar")).default;
	const Modal = (await import("@/components/modals/Modal")).default;
	const { redirect } = await import("next/navigation");

	const user = await getUserAction(clerkUser.id);
	if (!user) { redirect("/"); return null; }

	if (!user.isCompleted) { redirect("/onboarding"); return null; }

	const [users, totalUnreadNotifications] = await Promise.all([
		getUsersAction({ userId: user.id }),
		getTotalNotificationsAction(user.id),
	]);

	return (
		<main className="min-h-screen">
			<Modal imageUrl={user.imageUrl} userId={user.id} />
			<section className="h-full max-w-7xl mx-auto flex justify-center">
				<LeftSidebar totalUnreadNotifications={totalUnreadNotifications ?? 0} username={user.username} name={user.name} imageUrl={user.imageUrl} />
				<section className="max-sm:border-none border-x border-x-gray-300 max-sm:pb-32 sm:pb-0 w-full max-sm:max-w-full max-w-[600px]">
					{children}
				</section>
				<RightSidebar users={users?.data!} user={user} />
			</section>
			<Bottombar username={user.username} />
		</main>
	);
};

export default layout;
