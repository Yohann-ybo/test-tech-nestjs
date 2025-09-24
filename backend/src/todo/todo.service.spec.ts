import { Test, TestingModule } from "@nestjs/testing";
import { ConflictException } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { TodoService } from "./todo.service";
import { CreateTodoDto, UpdateTodoDto, Priority } from "./dto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

describe("TodoService", () => {
  let service: TodoService;
  let prismaService: PrismaService;

  const baseDate = new Date("2024-01-01T00:00:00.000Z");
  const executionDate = new Date("2024-01-02T10:00:00.000Z");

  const mockTodo = {
    id: 1,
    title: "Test Todo",
    content: "Test content",
    priority: Priority.HIGH,
    executionDate: null,
    createdAt: baseDate,
    updatedAt: baseDate,
    authorId: 1,
  };

  const mockCompletedTodo = {
    ...mockTodo,
    id: 2,
    title: "Completed Todo",
    executionDate: executionDate,
  };

  const mockPrismaService = {
    todo: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TodoService>(TodoService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllTodos", () => {
    it("should return todos for a specific user", async () => {
      const todos = [mockTodo, mockCompletedTodo];
      mockPrismaService.todo.findMany.mockResolvedValue(todos);

      const result = await service.getAllTodos(1);

      expect(result).toEqual(todos);
      expect(mockPrismaService.todo.findMany).toHaveBeenCalledWith({
        where: { authorId: 1 },
        orderBy: [
          { executionDate: "asc" },
          { priority: "desc" },
          { createdAt: "desc" },
        ],
      });
    });

    it("should return empty array when user has no todos", async () => {
      mockPrismaService.todo.findMany.mockResolvedValue([]);

      const result = await service.getAllTodos(1);

      expect(result).toEqual([]);
      expect(mockPrismaService.todo.findMany).toHaveBeenCalledWith({
        where: { authorId: 1 },
        orderBy: [
          { executionDate: "asc" },
          { priority: "desc" },
          { createdAt: "desc" },
        ],
      });
    });

    it("should handle database errors gracefully", async () => {
      const dbError = new Error("Database connection failed");
      mockPrismaService.todo.findMany.mockRejectedValue(dbError);

      await expect(service.getAllTodos(1)).rejects.toThrow(
        "Database connection failed"
      );
    });
  });

  describe("getTodoById", () => {
    it("should return todo when it exists", async () => {
      mockPrismaService.todo.findUnique.mockResolvedValue(mockTodo);

      const result = await service.getTodoById(1);

      expect(result).toEqual(mockTodo);
      expect(mockPrismaService.todo.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it("should return null when todo does not exist", async () => {
      mockPrismaService.todo.findUnique.mockResolvedValue(null);

      const result = await service.getTodoById(999);

      expect(result).toBeNull();
      expect(mockPrismaService.todo.findUnique).toHaveBeenCalledWith({
        where: { id: 999 },
      });
    });
  });

  describe("createTodo", () => {
    const createTodoDto: CreateTodoDto = {
      title: "New Todo",
      content: "New content",
      priority: Priority.MEDIUM,
    };

    it("should create a new todo successfully", async () => {
      mockPrismaService.todo.findFirst.mockResolvedValue(null);
      const newTodo = {
        ...mockTodo,
        ...createTodoDto,
        id: 2,
      };
      mockPrismaService.todo.create.mockResolvedValue(newTodo);

      const result = await service.createTodo(1, createTodoDto);

      expect(result).toEqual(newTodo);
      expect(mockPrismaService.todo.findFirst).toHaveBeenCalledWith({
        where: {
          title: createTodoDto.title,
          authorId: 1,
        },
      });
      expect(mockPrismaService.todo.create).toHaveBeenCalledWith({
        data: {
          ...createTodoDto,
          authorId: 1,
        },
      });
    });

    it("should throw ConflictException when todo with same title exists for same user", async () => {
      mockPrismaService.todo.findFirst.mockResolvedValue(mockTodo);

      await expect(service.createTodo(1, createTodoDto)).rejects.toThrow(
        ConflictException
      );
      await expect(service.createTodo(1, createTodoDto)).rejects.toThrow(
        `A todo with title "${createTodoDto.title}" already exists`
      );

      expect(mockPrismaService.todo.create).not.toHaveBeenCalled();
    });

    it("should allow same title for different users", async () => {
      mockPrismaService.todo.findFirst.mockResolvedValue(null);
      const newTodo = { ...mockTodo, id: 5, authorId: 2 };
      mockPrismaService.todo.create.mockResolvedValue(newTodo);

      const result = await service.createTodo(2, createTodoDto);

      expect(result).toEqual(newTodo);
      expect(mockPrismaService.todo.findFirst).toHaveBeenCalledWith({
        where: {
          title: createTodoDto.title,
          authorId: 2,
        },
      });
    });
  });

  describe("updateTodo", () => {
    const updateTodoDto: UpdateTodoDto = {
      executionDate: executionDate,
    };

    it("should update todo successfully", async () => {
      const updatedTodo = { ...mockTodo, ...updateTodoDto };
      mockPrismaService.todo.update.mockResolvedValue(updatedTodo);

      const result = await service.updateTodo(1, updateTodoDto);

      expect(result).toEqual(updatedTodo);
      expect(mockPrismaService.todo.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateTodoDto,
      });
    });

    it("should update todo to mark as completed", async () => {
      const completedTodo = { ...mockTodo, executionDate: executionDate };
      mockPrismaService.todo.update.mockResolvedValue(completedTodo);

      const result = await service.updateTodo(1, {
        executionDate: executionDate,
      });

      expect(result.executionDate).toEqual(executionDate);
      expect(mockPrismaService.todo.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { executionDate: executionDate },
      });
    });

    it("should update todo to mark as incomplete (null execution date)", async () => {
      const incompleteTodo = { ...mockCompletedTodo, executionDate: null };
      mockPrismaService.todo.update.mockResolvedValue(incompleteTodo);

      const result = await service.updateTodo(2, { executionDate: null });

      expect(result.executionDate).toBeNull();
      expect(mockPrismaService.todo.update).toHaveBeenCalledWith({
        where: { id: 2 },
        data: { executionDate: null },
      });
    });
  });

  describe("deleteTodo", () => {
    it("should delete todo successfully", async () => {
      mockPrismaService.todo.delete.mockResolvedValue(mockTodo);

      await service.deleteTodo(1);

      expect(mockPrismaService.todo.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it("should handle deletion of non-existent todo", async () => {
      const dbError = new PrismaClientKnownRequestError("Record not found", {
        code: "P2025",
        clientVersion: "5.0.0",
      });
      mockPrismaService.todo.delete.mockRejectedValue(dbError);

      await expect(service.deleteTodo(999)).rejects.toThrow(dbError);
      expect(mockPrismaService.todo.delete).toHaveBeenCalledWith({
        where: { id: 999 },
      });
    });
  });
});
