import { SidebarTrigger } from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import { SearchInput } from "./SearchInput";
import { Authbutton } from "@/modules/auth/ui/components/auth-button";

export const HomeNavbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white flex px-2 items-center h-16 pr-5 z-50  border-b shadow-md">
      <div className="flex items-center gap-4 w-full">
        <div className="flex items-center flex-shrink-0">
          <SidebarTrigger />
          <Link prefetch href="/" className="hidden md:block">
            <div className="flex p-4 items-center gap-1">
              <Image src="/logo.svg" alt="logo" height={32} width={32} />
              <p className="text-xl tracking-tight font-semibold">MyTube</p>
            </div>
          </Link>
        </div>

        {/* Search bar */}
        <div className="flex-1 justify-center max-w-[720px] mx-auto">
          <SearchInput />
        </div>
        <div className="flex-shrink-0 items-center flex gap-4">
          <Authbutton />
        </div>
      </div>
    </nav>
  );
};
