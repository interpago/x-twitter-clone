import { authMiddleware } from "@clerk/nextjs";
export default authMiddleware({
	publicRoutes: ["/", "/api/bots(.*)"],
});

export const config = {
	matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
