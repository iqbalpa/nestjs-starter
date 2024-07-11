import {
  Controller,
  Get,
  Param,
  UseGuards,
  Request,
  Body,
  Patch,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';
import { IsPublic } from 'src/common/decorator/isPublic';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @IsPublic()
  @Get()
  async getUsersWithPagination(
    @Query('skip', ParseIntPipe) skip: number,
    @Query('take', ParseIntPipe) take: number,
  ): Promise<User[]> {
    return this.usersService.getUserWithPagination(skip, take);
  }

  @IsPublic()
  @Get('/all')
  async getAll(): Promise<User[]> {
    return this.usersService.getAll();
  }

  @IsPublic()
  @Get('/count')
  async getUsersCount(): Promise<number> {
    return this.usersService.getUsersCount();
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<User | null> {
    return this.usersService.getUserById(id);
  }

  @Patch()
  async updateUser(
    @Request() request,
    @Body('name') name: string,
  ): Promise<User> {
    return this.usersService.updateUser(request, name);
  }

  @Delete()
  async deleteUser(@Request() request): Promise<User> {
    return this.usersService.deleteUser(request);
  }
}
