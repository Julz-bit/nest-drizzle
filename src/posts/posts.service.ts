import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DRIZZLE } from '../db/db.module';
import { DrizzleService } from '../db/types/drizzle';
import { posts } from '../db/schema';
import { eq } from 'drizzle-orm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(@Inject(DRIZZLE) private db: DrizzleService) { }

  async create(createPostDto: CreatePostDto) {
    return await this.db.insert(posts)
      .values(createPostDto)
      .returning()
  }

  async findAll() {
    return await this.db.query.posts
      .findMany({
        with: {
          user: true
        }
      })
  }

  async findOne(id: number) {
    const post = await this.db.query.posts
      .findFirst({ where: eq(posts.id, id) })
    if (!post) throw new NotFoundException('post not found!')
    return post
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    await this.findOne(id)
    return await this.db.update(posts)
      .set(updatePostDto)
      .where(eq(posts.id, id))
      .returning()
  }

  async remove(id: number) {
    await this.findOne(id)
    return await this.db.delete(posts)
      .where(eq(posts.id, id))
      .returning()
  }
}
