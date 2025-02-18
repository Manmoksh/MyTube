"use client";
// <-- hooks can only be used in client components
import { trpc } from "@/trpc/client";
export function PageClient() {
  const [data] = trpc.hello.useSuspenseQuery({ text: "Manmoksh" });
  return <div>{data.greeting}</div>;
}
