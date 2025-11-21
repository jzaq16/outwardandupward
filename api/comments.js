import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { comments } from '../src/db/schema.js';
import { eq, desc } from 'drizzle-orm';

export default async function handler(req, res) {
    const db = drizzle(sql);

    if (req.method === 'GET') {
        const { slug } = req.query;
        if (!slug) {
            return res.status(400).json({ error: 'Missing post slug' });
        }

        try {
            const result = await db.select()
                .from(comments)
                .where(eq(comments.postSlug, slug))
                .orderBy(desc(comments.createdAt));

            return res.status(200).json(result);
        } catch (error) {
            console.error('Error fetching comments:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    if (req.method === 'POST') {
        const { postSlug, author, content } = req.body;

        if (!postSlug || !author || !content) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        try {
            const result = await db.insert(comments).values({
                postSlug,
                author,
                content,
                isApproved: true // Auto-approve for now
            }).returning();

            return res.status(201).json(result[0]);
        } catch (error) {
            console.error('Error creating comment:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
}
