import {
  Body,
  Controller,
  Get,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Todo } from '@prisma/client';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { LoginPayload, LoginResponse } from './auth/entities/login.interface';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService
  ) {}

  @Post('login')
  async login(@Body() loginPayload: LoginPayload): Promise<LoginResponse> {
    const user = await this.authService.validateUser(loginPayload);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    else return this.authService.login(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('todos')
  getTodos(): Promise<Todo[]> {
    return this.appService.getAllTodo();
  }
}
