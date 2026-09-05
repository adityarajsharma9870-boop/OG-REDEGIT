import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const isSubdirectory =
    typeof window !== "undefined" &&
    window.location.pathname.startsWith("/OG-REDEGIT");

  const router = createRouter({
    routeTree,
    context: { queryClient },
    basepath: isSubdirectory ? "/OG-REDEGIT" : "/",
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
