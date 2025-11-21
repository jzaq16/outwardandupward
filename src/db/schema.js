import { pgTable, serial, text, timestamp, boolean } from 'drizzle-orm/pg-core';

export const comments = pgTable('comments', {
    id: serial('id').primaryKey(),
    postSlug: text('post_slug').notNull(),
    author: text('author').notNull(),
    content: text('content').notNull(),
    isApproved: boolean('is_approved').default(false),
    createdAt: timestamp('created_at').defaultNow(),
});
