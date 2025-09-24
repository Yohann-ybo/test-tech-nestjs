import { Test, TestingModule } from "@nestjs/testing";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "nestjs-prisma";
import { AuthService } from "./auth.service";
import { User } from "./entities/login.interface";

describe("AuthService", () => {
  let service: AuthService;
  let jwtService: JwtService;
  let prismaService: PrismaService;

  const mockUser = {
    id: 1,
    email: "test@example.com",
    name: "Test User",
    password: "test123",
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue("mocked-jwt-token"),
  };

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("validateUser", () => {
    it("should return user when valid credentials are provided", async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.validateUser({
        email: "test@example.com",
        password: "test123",
      });

      expect(result?.email).toBe("test@example.com");
      expect(result?.name).toBe("Test User");
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: "test@example.com" },
      });
    });

    it("should return null when user does not exist", async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.validateUser({
        email: "nonexistent@example.com",
        password: "test123",
      });

      expect(result).toBeNull();
    });

    it("should return null when password is incorrect", async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.validateUser({
        email: "test@example.com",
        password: "wrongpassword",
      });

      expect(result).toBeNull();
    });
  });

  describe("login", () => {
    it("should return login response with token", () => {
      const user = new User(1, "test@example.com", "Test User");

      const result = service.login(user);

      expect(result.access_token).toBe("mocked-jwt-token");
      expect(result.user).toBe(user);
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        email: "test@example.com",
        name: "Test User",
        id: 1,
      });
    });
  });
});
