"use client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { APP_URL } from "@/constants";
import { SearchIcon, XIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
export const SearchInput = () => {
  return (
    <Suspense fallback={<Skeleton className="h-10 w-full" />}>
      <SearchInputSuspense />
    </Suspense>
  );
};
const SearchInputSuspense = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const categoryId = searchParams.get("categoryId") || "";
  const [value, setValue] = useState(query);
  const handlesearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const url = new URL("/search", APP_URL);
    const newQuery = value.trim();
    url.searchParams.set("query", encodeURIComponent(newQuery));
    if (categoryId) {
      url.searchParams.set("categoryId", categoryId);
    }
    if (newQuery === "") {
      url.searchParams.delete("query");
    }
    setValue(newQuery);
    router.push(url.toString());
  };
  return (
    <form className="flex w-full max-w-[600px]" onSubmit={handlesearch}>
      <div className="relative w-full flex items-center border  border-gray-400 rounded-l-full  focus-within:border-blue-500  transition-all bg-white">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          type="text"
          placeholder="Search"
          aria-label="Search"
          className="w-full pl-4 py-2 pr-12 rounded-l-full bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none"
        />
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setValue("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full "
          >
            <XIcon className="text-gray-500" />
          </Button>
        )}
      </div>
      <button
        type="submit"
        disabled={!value.trim()}
        className="px-5 py-2.5 rounded-r-full bg-zinc-300 hover:bg-gray-300 active:bg-gray-400 transition-all disabled:opacity-80 disabled:cursor-not-allowed"
        aria-label="Search"
      >
        <SearchIcon className="size-5 text-gray-700 hover:text-gray-900 transition-all" />
      </button>
    </form>
  );
};
