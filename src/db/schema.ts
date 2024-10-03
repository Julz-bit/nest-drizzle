import { pgTable, serial, text, timestamp, jsonb, integer, primaryKey, index } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    password: text('password').notNull()
})

export const profile = pgTable('profile', {
    id: serial('id').primaryKey(),
    metadata: jsonb('metadata'),
    userId: integer('userId').references(() => users.id).notNull(),
    createdAt: timestamp('created_at').notNull().notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull()
})

export const posts = pgTable('posts', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    content: text('content').notNull(),
    userId: integer('userId').references(() => users.id).notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
})

export const comments = pgTable('comments', {
    id: serial('id').primaryKey(),
    text: text('text').notNull(),
    userId: integer('userId').references(() => users.id).notNull(),
    postId: integer('postId').references(() => posts.id).notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
})

export const groups = pgTable('groups', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
})

export const userToGroups = pgTable('userToGroups', {
    userId: integer('userId').references(() => users.id).notNull(),
    groupId: integer('groupId').references(() => groups.id).notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
},
    (table) => ({
        pk: primaryKey({ columns: [table.groupId, table.userId] }),
        userIdIndex: index('userIdIndex').on(table.userId)
    })
)

export const userRelations = relations(users, ({ one, many }) => ({
    profile: one(profile),
    posts: many(posts),
    comments: many(comments),
    userToGroups: many(userToGroups)
}))

export const postRelations = relations(posts, ({ one, many }) => ({
    user: one(users, {
        fields: [posts.userId],
        references: [users.id]
    }),
    comments: many(comments)
}))

export const userToGroupsRelations = relations(userToGroups, ({ one }) => ({
    user: one(users, {
        fields: [userToGroups.userId],
        references: [users.id]
    }),
    group: one(groups, {
        fields: [userToGroups.groupId],
        references: [groups.id]
    })
}))