import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpRequestDto } from './dto/signup.dto';
import { User } from '@prisma/client';
import { SignInRequestDto } from './dto/sigin.dto';
import { IsPublic } from 'src/common/decorator/isPublic';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @IsPublic()
  @Post('signup')
  async signUp(@Body() dto: SignUpRequestDto): Promise<User> {
    return this.authService.signUp(dto);
  }

  @IsPublic()
  @Post('signin')
  async signIn(
    @Body() dto: SignInRequestDto,
  ): Promise<{ access_token: string }> {
    return this.authService.signIn(dto.email, dto.password);
  }

  @Get('profile')
  getProfile(@Request() request) {
    return request.user;
  }
}
