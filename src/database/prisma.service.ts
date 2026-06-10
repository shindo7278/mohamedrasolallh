import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {

  async onModuleInit() {
    // connection handled by Prisma automatically
  }

  async onModuleDestroy() {
    // cleanup handled by Prisma automatically
  }
}