import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { PrismaModule } from "nestjs-prisma";
import config from "src/common/configs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthService } from "./auth/auth.service";
import { LocalStrategy } from "./auth/jwt.strategy";
import { PrismaService } from "./prisma.service";
import { TodoModule } from "./todo/todo.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    PrismaModule.forRoot({
      isGlobal: true,
    }),
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: "secret",
        signOptions: { expiresIn: "3600s" },
      }),
    }),
    TodoModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, AuthService, LocalStrategy],
})
export class AppModule {}
