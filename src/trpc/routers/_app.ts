import { createTRPCRouter } from "../init";
import { usersRouter } from "@/modules/users/server/procedure";
import { videosRouter } from "@/modules/videos/server/procedure";
import { studioRouter } from "@/modules/studio/server/procedure";
import { searchRouter } from "@/modules/search/server/procedure";
import { commentsRouter } from "@/modules/comments/server/procedure";
import { playlistRouter } from "@/modules/playlists/server/procedure";
import { categoriesRouter } from "@/modules/categories/server/procedure";
import { videoViewRouter } from "@/modules/video-views/server/procedure";
import { suggestionsRouter } from "@/modules/suggestions/server/procedure";
import { subscriptionsRouter } from "@/modules/subscriptions/server/procedure";
import { videoReactionsRouter } from "@/modules/video-reactions/server/procedure";
import { commentReactionsRouter } from "@/modules/comment-reactions/server/procedure";
export const appRouter = createTRPCRouter({
  users: usersRouter,
  search: searchRouter,
  videos: videosRouter,
  studio: studioRouter,
  comments: commentsRouter,
  playlist: playlistRouter,
  videoViews: videoViewRouter,
  categories: categoriesRouter,
  suggestions: suggestionsRouter,
  subscriptions: subscriptionsRouter,
  videoReactions: videoReactionsRouter,
  commentReactions: commentReactionsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
