import { posts, users } from "../../db/schema";

export type User = typeof users.$inferSelect;
export type Post = typeof posts.$inferInsert;
export type PostsWithUser = Post & {
    user: User
}