import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { DbModule } from './db/db.module';
import { ConfigModule } from '@nestjs/config';
import { GroupsModule } from './groups/groups.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PostsModule,
    DbModule,
    GroupsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
