import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UsersSeederService } from './seeders/users-seeder.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  providers: [UsersService, UsersSeederService],
  exports: [UsersService]
})
export class UsersModule { }
