import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { LoginPayload, LoginResponse, User } from "./entities/login.interface";
import { PrismaService } from "nestjs-prisma";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService
  ) {}
  async validateUser({ email, password }: LoginPayload): Promise<User | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return null;
      }

      if (email !== user.email || password !== user.password) return null;
      return new User(email, password, user.name);
    } catch (e) {
      console.error(
        `An error occured during an user authentication (email: ${email})`
      );
      throw e;
    }
  }

  login(user: User): LoginResponse {
    const payload = { email: user.email };
    return new LoginResponse(this.jwtService.sign(payload), user);
  }
}
