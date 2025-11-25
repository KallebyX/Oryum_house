import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import {
  CreateMaintenancePlanDto,
  UpdateMaintenancePlanDto,
  CreateMaintenanceExecutionDto,
  UpdateMaintenanceExecutionDto,
  QueryMaintenancePlanDto,
  QueryMaintenanceExecutionDto,
  MaintenanceStatsDto,
} from './dto/maintenance.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class MaintenanceService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a maintenance plan
   */
  async createPlan(
    condominiumId: string,
    createMaintenancePlanDto: CreateMaintenancePlanDto,
  ) {
    // Check if condominium exists
    const condominium = await this.prisma.condominium.findUnique({
      where: { id: condominiumId },
    });

    if (!condominium) {
      throw new NotFoundException('Condominium not found');
    }

    // Validate responsible if provided
    if (createMaintenancePlanDto.responsibleId) {
      const user = await this.prisma.user.findUnique({
        where: { id: createMaintenancePlanDto.responsibleId },
      });

      if (!user) {
        throw new NotFoundException('Responsible user not found');
      }
    }

    const plan = await this.prisma.maintenancePlan.create({
      data: {
        ...createMaintenancePlanDto,
        condominiumId,
      },
      include: {
        responsible: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return plan;
  }

  /**
   * Find all maintenance plans
   */
  async findAllPlans(condominiumId: string, query: QueryMaintenancePlanDto) {
    const { search, isActive, page = 1, limit = 10 } = query;

    const where: Prisma.MaintenancePlanWhereInput = {
      condominiumId,
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(isActive !== undefined && { isActive }),
    };

    const [plans, total] = await Promise.all([
      this.prisma.maintenancePlan.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          responsible: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              executions: true,
            },
          },
        },
      }),
      this.prisma.maintenancePlan.count({ where }),
    ]);

    return {
      data: plans,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Find one maintenance plan
   */
  async findOnePlan(condominiumId: string, id: string) {
    const plan = await this.prisma.maintenancePlan.findFirst({
      where: {
        id,
        condominiumId,
      },
      include: {
        responsible: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        executions: {
          orderBy: { executedAt: 'desc' },
          take: 20,
        },
        _count: {
          select: {
            executions: true,
          },
        },
      },
    });

    if (!plan) {
      throw new NotFoundException('Maintenance plan not found');
    }

    return plan;
  }

  /**
   * Update a maintenance plan
   */
  async updatePlan(
    condominiumId: string,
    id: string,
    updateMaintenancePlanDto: UpdateMaintenancePlanDto,
  ) {
    const existingPlan = await this.prisma.maintenancePlan.findFirst({
      where: {
        id,
        condominiumId,
      },
    });

    if (!existingPlan) {
      throw new NotFoundException('Maintenance plan not found');
    }

    // Validate responsible if changing
    if (updateMaintenancePlanDto.responsibleId) {
      const user = await this.prisma.user.findUnique({
        where: { id: updateMaintenancePlanDto.responsibleId },
      });

      if (!user) {
        throw new NotFoundException('Responsible user not found');
      }
    }

    const plan = await this.prisma.maintenancePlan.update({
      where: { id },
      data: updateMaintenancePlanDto,
      include: {
        responsible: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return plan;
  }

  /**
   * Delete a maintenance plan
   */
  async removePlan(condominiumId: string, id: string) {
    const plan = await this.prisma.maintenancePlan.findFirst({
      where: {
        id,
        condominiumId,
      },
    });

    if (!plan) {
      throw new NotFoundException('Maintenance plan not found');
    }

    await this.prisma.maintenancePlan.delete({
      where: { id },
    });

    return { message: 'Maintenance plan deleted successfully' };
  }

  /**
   * Create a maintenance execution
   */
  async createExecution(
    condominiumId: string,
    createMaintenanceExecutionDto: CreateMaintenanceExecutionDto,
  ) {
    // Check if plan exists and belongs to condominium
    const plan = await this.prisma.maintenancePlan.findFirst({
      where: {
        id: createMaintenanceExecutionDto.planId,
        condominiumId,
      },
    });

    if (!plan) {
      throw new NotFoundException('Maintenance plan not found');
    }

    if (!plan.isActive) {
      throw new BadRequestException('Maintenance plan is not active');
    }

    const execution = await this.prisma.maintenanceExecution.create({
      data: createMaintenanceExecutionDto,
      include: {
        plan: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
      },
    });

    return execution;
  }

  /**
   * Find all maintenance executions
   */
  async findAllExecutions(
    condominiumId: string,
    query: QueryMaintenanceExecutionDto,
  ) {
    const { completed, startDate, endDate, page = 1, limit = 10 } = query;

    const where: Prisma.MaintenanceExecutionWhereInput = {
      plan: {
        condominiumId,
      },
      ...(completed !== undefined && { completed }),
      ...(startDate && {
        executedAt: { gte: new Date(startDate) },
      }),
      ...(endDate && {
        executedAt: { lte: new Date(endDate) },
      }),
    };

    const [executions, total] = await Promise.all([
      this.prisma.maintenanceExecution.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { executedAt: 'desc' },
        include: {
          plan: {
            select: {
              id: true,
              title: true,
              description: true,
              tasks: true,
            },
          },
        },
      }),
      this.prisma.maintenanceExecution.count({ where }),
    ]);

    return {
      data: executions,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Find one maintenance execution
   */
  async findOneExecution(condominiumId: string, id: string) {
    const execution = await this.prisma.maintenanceExecution.findFirst({
      where: {
        id,
        plan: {
          condominiumId,
        },
      },
      include: {
        plan: {
          include: {
            responsible: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!execution) {
      throw new NotFoundException('Maintenance execution not found');
    }

    return execution;
  }

  /**
   * Update a maintenance execution
   */
  async updateExecution(
    condominiumId: string,
    id: string,
    updateMaintenanceExecutionDto: UpdateMaintenanceExecutionDto,
  ) {
    const existingExecution = await this.prisma.maintenanceExecution.findFirst({
      where: {
        id,
        plan: {
          condominiumId,
        },
      },
    });

    if (!existingExecution) {
      throw new NotFoundException('Maintenance execution not found');
    }

    const execution = await this.prisma.maintenanceExecution.update({
      where: { id },
      data: updateMaintenanceExecutionDto,
      include: {
        plan: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return execution;
  }

  /**
   * Delete a maintenance execution
   */
  async removeExecution(condominiumId: string, id: string) {
    const execution = await this.prisma.maintenanceExecution.findFirst({
      where: {
        id,
        plan: {
          condominiumId,
        },
      },
    });

    if (!execution) {
      throw new NotFoundException('Maintenance execution not found');
    }

    await this.prisma.maintenanceExecution.delete({
      where: { id },
    });

    return { message: 'Maintenance execution deleted successfully' };
  }

  /**
   * Get maintenance statistics
   */
  async getStats(condominiumId: string): Promise<MaintenanceStatsDto> {
    const condominium = await this.prisma.condominium.findUnique({
      where: { id: condominiumId },
    });

    if (!condominium) {
      throw new NotFoundException('Condominium not found');
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const [
      totalActivePlans,
      totalExecutions,
      completedExecutions,
      executionsThisMonth,
    ] = await Promise.all([
      // Active plans
      this.prisma.maintenancePlan.count({
        where: {
          condominiumId,
          isActive: true,
        },
      }),

      // Total executions
      this.prisma.maintenanceExecution.count({
        where: {
          plan: { condominiumId },
        },
      }),

      // Completed executions
      this.prisma.maintenanceExecution.count({
        where: {
          plan: { condominiumId },
          completed: true,
        },
      }),

      // Executions this month
      this.prisma.maintenanceExecution.count({
        where: {
          plan: { condominiumId },
          executedAt: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
      }),
    ]);

    return {
      totalActivePlans,
      totalExecutions,
      completedExecutions,
      pendingExecutions: totalExecutions - completedExecutions,
      executionsThisMonth,
    };
  }
}
