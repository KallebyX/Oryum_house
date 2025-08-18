import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: [
        {
          emit: 'event',
          level: 'query',
        },
        {
          emit: 'event',
          level: 'error',
        },
        {
          emit: 'event',
          level: 'info',
        },
        {
          emit: 'event',
          level: 'warn',
        },
      ],
    });

    // Log SQL queries in development
    if (process.env.NODE_ENV === 'development') {
      // Logging de queries desabilitado temporariamente
      // this.$on('query', (e) => {
      //   this.logger.debug(`Query: ${e.query}`);
      //   this.logger.debug(`Params: ${e.params}`);
      //   this.logger.debug(`Duration: ${e.duration}ms`);
      // });
    }

    // this.$on('error', (e) => {
    //   this.logger.error(e);
    // });

    // this.$on('warn', (e) => {
    //   this.logger.warn(e);
    // });

    // this.$on('info', (e) => {
    //   this.logger.log(e);
    // });
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Conectado ao banco de dados PostgreSQL');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Desconectado do banco de dados');
  }

  // Helper method for soft delete
  async softDelete(model: string, where: any) {
    return this[model].update({
      where,
      data: {
        isActive: false,
        updatedAt: new Date(),
      },
    });
  }

  // Helper method for pagination
  async paginate<T>(
    model: string,
    {
      page = 1,
      limit = 10,
      where = {},
      orderBy = {},
      include = {},
    }: {
      page?: number;
      limit?: number;
      where?: any;
      orderBy?: any;
      include?: any;
    },
  ): Promise<{
    data: T[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }> {
    const skip = (page - 1) * limit;
    
    const [data, total] = await Promise.all([
      this[model].findMany({
        where,
        orderBy,
        include,
        skip,
        take: limit,
      }),
      this[model].count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  // Helper method to check if user has access to condominium
  async checkCondominiumAccess(userId: string, condominiumId: string): Promise<boolean> {
    const membership = await this.membership.findUnique({
      where: {
        userId_condominiumId: {
          userId,
          condominiumId,
        },
      },
    });

    return membership?.isActive === true;
  }

  // Helper method to get user role in condominium
  async getUserRoleInCondominium(userId: string, condominiumId: string) {
    const membership = await this.membership.findUnique({
      where: {
        userId_condominiumId: {
          userId,
          condominiumId,
        },
      },
    });

    return membership?.role;
  }
}
