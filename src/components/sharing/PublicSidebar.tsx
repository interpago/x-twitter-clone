"use client";

import { Home, Search, Hash, Bookmark, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
	{ href: "/home", icon: Home, label: "Home" },
	{ href: "/explore", icon: Hash, label: "Explore" },
];

const PublicSidebar = () => {
	const pathname = usePathname();

	return (
		<aside className="w-fit max-w-[280px] h-screen p-3 max-sm:hidden sm:flex max-h-screen sticky top-0">
			<section className="overflow-y-auto space-y-20 flex flex-col justify-between">
				<ul className="flex flex-col space-y-3">
					<li className="w-fit rounded-full overflow-hidden">
						<Link href="/home" className="flex items-center gap-5 p-3 hover:bg-gray-800 rounded-full transition-colors">
							<Image src="/assets/small-x-logo.svg" alt="X" width={28} height={28} className="object-contain" />
						</Link>
					</li>
					{navItems.map((item) => {
						const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
						return (
							<li key={item.href} className={cn("w-fit rounded-full overflow-hidden", isActive && "font-extrabold")}>
								<Link href={item.href} className="flex items-center gap-5 p-3 hover:bg-gray-800 rounded-full transition-colors">
									<item.icon className="w-6 h-6" />
									<span className="text-xl max-xl:hidden">{item.label}</span>
								</Link>
							</li>
						);
					})}
					<li className="mt-4">
						<Link href="/sign-in">
							<Button variant="primary" className="rounded-full font-bold text-sm px-8 max-xl:px-4">
								Sign In
							</Button>
						</Link>
					</li>
				</ul>
			</section>
		</aside>
	);
};

export default PublicSidebar;
