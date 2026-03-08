import { postsTable } from '@backend/database/schema';
import { db } from '@backend/lib/db';

export const seed = async () => {
  await db
    .insert(postsTable)
    .values([
      { title: 'Hello World', body: 'This is a test post' },
      { title: 'Hello World 2', body: 'This is a test post 2' },
    ])
    .onConflictDoNothing();
};

seed().finally(() => {
  process.exit(0);
});
