import { HydrateClient, trpc } from "@/trpc/server";
import { PageClient } from "./client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

const Home = async () => {
  void trpc.hello.prefetch({ text: "Manmoksh" });
  return (
    <HydrateClient>
      <Suspense fallback={<p>loading ...</p>}>
        <ErrorBoundary fallback={<p>Error</p>}>
          <PageClient />
        </ErrorBoundary>
      </Suspense>
    </HydrateClient>
  );
};

export default Home;
