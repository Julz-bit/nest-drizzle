import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DRIZZLE } from 'src/db/db.module';
import { users } from 'src/db/schema';
import { DrizzleService } from 'src/db/types/drizzle';

@Injectable()
export class UsersService {
    constructor(@Inject(DRIZZLE) private readonly db: DrizzleService) { }

    async findByEmail(email: string) {
        return await this.db.query.users.findFirst({
            where: eq(users.email, email)
        });
    }
}
