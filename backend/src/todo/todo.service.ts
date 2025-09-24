import { Injectable, ConflictException } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { Todo, Prisma } from "@prisma/client";
import { CreateTodoDto, UpdateTodoDto } from "./dto";

@Injectable()
export class TodoService {
  constructor(private prisma: PrismaService) {}

  async getAllTodos(userId: number): Promise<Todo[]> {
    return this.prisma.todo.findMany({
      where: {
        authorId: userId,
      },
      orderBy: [
        { executionDate: "asc" },
        { priority: "desc" },
        { createdAt: "desc" },
      ],
    });
  }

  async getTodoById(id: number): Promise<Todo | null> {
    return this.prisma.todo.findUnique({
      where: { id },
    });
  }

  async createTodo(
    userId: number,
    createTodoDto: CreateTodoDto
  ): Promise<Todo> {
    // Check if a todo with the same title already exists for this user
    const existingTodo = await this.prisma.todo.findFirst({
      where: {
        title: createTodoDto.title,
        authorId: userId,
      },
    });

    if (existingTodo) {
      throw new ConflictException(
        `A todo with title "${createTodoDto.title}" already exists`
      );
    }

    return this.prisma.todo.create({
      data: {
        ...createTodoDto,
        authorId: userId,
      },
    });
  }

  async updateTodo(id: number, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    return this.prisma.todo.update({
      where: { id },
      data: updateTodoDto,
    });
  }

  async deleteTodo(id: number): Promise<void> {
    await this.prisma.todo.delete({
      where: { id },
    });
  }
}
