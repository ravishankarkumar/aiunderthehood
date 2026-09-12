import type { CollectionEntry } from "astro:content";
import { isOfficialCtoMigratedPath } from "@/data/officialCtoMigration";
import { getPath } from "./getPath";

export const isPublicBlogPost = (post: CollectionEntry<"blog">) =>
  !post.data.draft &&
  !isOfficialCtoMigratedPath(getPath(post.id, post.filePath));
