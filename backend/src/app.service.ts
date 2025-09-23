import { Injectable } from "@nestjs/common";
import { Todo } from "@prisma/client";
import { PrismaService } from "./prisma.service";

@Injectable()
export class AppService {
  constructor() {}
}
