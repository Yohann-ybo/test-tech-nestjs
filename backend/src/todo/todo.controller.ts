import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
  ForbiddenException,
  NotFoundException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { TodoService } from "./todo.service";
import { CreateTodoDto, UpdateTodoDto } from "./dto";

@Controller("todos")
@UseGuards(AuthGuard("jwt"))
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  async getTodos(@Req() req: any) {
    return this.todoService.getAllTodos(req.user.userId);
  }

  @Post()
  async createTodo(@Body() createTodoDto: CreateTodoDto, @Req() req: any) {
    return this.todoService.createTodo(req.user.userId, createTodoDto);
  }

  @Patch(":id")
  async updateTodo(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateTodoDto: UpdateTodoDto,
    @Req() req: any
  ) {
    const todo = await this.todoService.getTodoById(id);
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    if (todo.authorId !== req.user.userId) {
      throw new ForbiddenException("You do not have access to this todo");
    }

    return this.todoService.updateTodo(id, updateTodoDto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTodo(@Param("id", ParseIntPipe) id: number, @Req() req: any) {
    const todo = await this.todoService.getTodoById(id);
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    if (todo.authorId !== req.user.userId) {
      throw new ForbiddenException("You do not have access to this todo");
    }

    await this.todoService.deleteTodo(id);
  }
}
