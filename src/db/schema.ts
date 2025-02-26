import { relations } from "drizzle-orm";
import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  primaryKey,
} from "drizzle-orm/pg-core";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clerkId: text("clerk_id").unique().notNull(),
    name: text("name").notNull(),
    imageUrl: text("imageUrl").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("clerk_id_idx").on(t.clerkId)]
);
export const userRelations = relations(users, ({ many }) => ({
  videos: many(videos),
  videoViews: many(videoViews),
  videoReactions: many(videoReactions),
}));
export const categories = pgTable(
  "categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull().unique(),
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("name_idx").on(t.name)]
);
export const categoryRelations = relations(categories, ({ many }) => ({
  videos: many(videos),
}));
export const videoVisibility = pgEnum("video_visibility", [
  "private",
  "public",
]);
export const videos = pgTable("videos", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  muxStatus: text("mux_status"),
  muxAssetId: text("mux_asset_id").unique(),
  muxUploadId: text("mux_upload_id").unique(),
  muxPlaybackId: text("mux_playback_id").unique(),
  muxTrackId: text("mux_track_id").unique(),
  muxTrackStatus: text("mux_track_status"),
  thumbnailUrl: text("tumbnail_url"),
  thumbnailKey: text("tumbnail_key"),
  previewUrl: text("preview_url"),
  previewKey: text("preview_key"),
  duration: integer("duration").default(0).notNull(),
  visibility: videoVisibility("visibility").default("private").notNull(),

  userId: uuid("user_id")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),
  categoryId: uuid("category_id").references(() => categories.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const videoInsertSchema = createInsertSchema(videos);
export const videoUpdateSchema = createUpdateSchema(videos);
export const videoselctSchema = createSelectSchema(videos);
export const videoRelations = relations(videos, ({ one, many }) => ({
  user: one(users, {
    fields: [videos.userId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [videos.categoryId],
    references: [categories.id],
  }),
  views: many(videoViews),
  reactions: many(videoReactions),
}));

export const videoViews = pgTable(
  "video_views",
  {
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    videoId: uuid("video_id")
      .references(() => videos.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    primaryKey({ name: "video_views_pk", columns: [t.userId, t.videoId] }),
  ]
);
export const videoViewsRelations = relations(videoViews, ({ one }) => ({
  user: one(users, {
    fields: [videoViews.userId],
    references: [users.id],
  }),
  videos: one(videos, {
    fields: [videoViews.videoId],
    references: [videos.id],
  }),
}));
export const videoViewsInsertSchema = createInsertSchema(videoViews);
export const videoViewsUpdateSchema = createUpdateSchema(videoViews);
export const videoViewsselctSchema = createSelectSchema(videoViews);
export const reactionType = pgEnum("reaction_type", ["like", "dislike"]);
export const videoReactions = pgTable(
  "video_reactions",
  {
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    videoId: uuid("video_id")
      .references(() => videos.id, { onDelete: "cascade" })
      .notNull(),
    type: reactionType("type").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    primaryKey({ name: "video_reactions_pk", columns: [t.userId, t.videoId] }),
  ]
);
export const videoReactionsRelations = relations(videoReactions, ({ one }) => ({
  user: one(users, {
    fields: [videoReactions.userId],
    references: [users.id],
  }),
  videos: one(videos, {
    fields: [videoReactions.videoId],
    references: [videos.id],
  }),
}));
export const videoReactionsInsertSchema = createInsertSchema(videoReactions);
export const videoReactionsUpdateSchema = createUpdateSchema(videoReactions);
export const videoReactionsselctSchema = createSelectSchema(videoReactions);
