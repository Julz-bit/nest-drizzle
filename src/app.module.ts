import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { FastifyMulterModule } from '@nest-lab/fastify-multer';
import { RouterModule } from '@nestjs/core';
import { PostsModule } from './posts/posts.module';
import { DbModule } from './db/db.module';
import { GroupsModule } from './groups/groups.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    FastifyMulterModule,
    RouterModule.register([
      {
        path: 'api',
        children: [
          {
            path: 'post',
            module: PostsModule
          },
          {
            path: 'group',
            module: GroupsModule
          },
          {
            path: 'auth',
            module: AuthModule
          }
        ]
      }
    ]),
    PostsModule,
    DbModule,
    GroupsModule,
    AuthModule,
    UsersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
