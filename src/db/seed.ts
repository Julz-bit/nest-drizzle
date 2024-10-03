import 'dotenv/config'
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema'
import { faker } from '@faker-js/faker';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});
const db = drizzle(pool, { schema }) as NodePgDatabase<typeof schema>;

async function main() {
    const userIds = await Promise.all(
        Array(20).fill("").map(async () => {
            const user = await db.insert(schema.users).values({
                email: faker.internet.email(),
                name: `${faker.person.firstName()} ${faker.person.lastName()}`,
                password: "asdqwe123",
            }).returning();
            return user[0].id
        })
    )

    const postsIds = await Promise.all(
        Array(20).fill("").map(async () => {
            const post = await db.insert(schema.posts).values({
                title: faker.lorem.sentence(),
                content: faker.lorem.paragraph(),
                userId: faker.helpers.arrayElement(userIds)
            }).returning();
            return post[0].id
        })
    )

    await Promise.all(
        Array(20).fill("").map(async () => {
            const comment = await db.insert(schema.comments).values({
                text: faker.lorem.paragraph(),
                userId: faker.helpers.arrayElement(userIds),
                postId: faker.helpers.arrayElement(postsIds)
            }).returning();
            return comment[0].id
        })
    )

    const insertedGroups = await db.insert(schema.groups).values([
        { name: 'JS' },
        { name: 'TS' }
    ]).returning()

    const groupIds = insertedGroups.map(group => group.id)

    console.log(insertedGroups)

    await Promise.all(
        userIds.map(async (userId) => {
            return await db.insert(schema.userToGroups).values({
                userId: userId,
                groupId: faker.helpers.arrayElement(groupIds)
            }).returning()
        })
    )
}

main().then().catch(err => {
    console.error(err)
    process.exit(0)
})