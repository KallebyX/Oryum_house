import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import {
  ReportDateRangeDto,
  TimeSeriesReportDto,
  TicketReportDto,
  OverviewReportDto,
  TicketStatsReportDto,
  BookingStatsReportDto,
  MaintenanceStatsReportDto,
  FinancialReportDto,
  DeliveryStatsReportDto,
  IncidentStatsReportDto,
  ActivityReportDto,
  UserEngagementReportDto,
  TimeSeriesDataPointDto,
  ReportGroupBy,
} from './dto/report.dto';

@Injectable()
export class ReportService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get overview dashboard statistics
   */
  async getOverview(condominiumId: string): Promise<OverviewReportDto> {
    // Verify condominium exists
    const condominium = await this.prisma.condominium.findUnique({
      where: { id: condominiumId },
    });

    if (!condominium) {
      throw new NotFoundException('Condominium not found');
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalUnits,
      totalResidents,
      openTickets,
      ticketsResolvedThisMonth,
      pendingBookings,
      pendingDeliveries,
      activeMaintenancePlans,
      openIncidents,
      satisfactionScores,
    ] = await Promise.all([
      // Total units
      this.prisma.unit.count({
        where: { condominiumId, isActive: true },
      }),

      // Total active residents (unique users with active memberships)
      this.prisma.membership.count({
        where: { condominiumId, isActive: true },
      }),

      // Open tickets
      this.prisma.ticket.count({
        where: {
          condominiumId,
          status: { notIn: ['CONCLUIDA', 'CANCELADA'] },
        },
      }),

      // Tickets resolved this month
      this.prisma.ticket.count({
        where: {
          condominiumId,
          status: 'CONCLUIDA',
          closedAt: { gte: startOfMonth },
        },
      }),

      // Pending bookings
      this.prisma.booking.count({
        where: {
          condominiumId,
          status: 'PENDING',
        },
      }),

      // Pending deliveries
      this.prisma.delivery.count({
        where: {
          condominiumId,
          pickedUpAt: null,
        },
      }),

      // Active maintenance plans
      this.prisma.maintenancePlan.count({
        where: {
          condominiumId,
          isActive: true,
        },
      }),

      // Open incidents
      this.prisma.incident.count({
        where: {
          condominiumId,
          status: { in: ['OPEN', 'IN_PROGRESS'] },
        },
      }),

      // Satisfaction scores
      this.prisma.ticket.aggregate({
        where: {
          condominiumId,
          satisfactionScore: { not: null },
        },
        _avg: {
          satisfactionScore: true,
        },
      }),
    ]);

    return {
      totalUnits,
      totalResidents,
      openTickets,
      ticketsResolvedThisMonth,
      pendingBookings,
      pendingDeliveries,
      activeMaintenancePlans,
      openIncidents,
      averageSatisfactionScore: satisfactionScores._avg.satisfactionScore || 0,
    };
  }

  /**
   * Get ticket statistics
   */
  async getTicketStats(
    condominiumId: string,
    query: TicketReportDto,
  ): Promise<TicketStatsReportDto> {
    const where: any = {
      condominiumId,
      ...(query.startDate && {
        createdAt: { gte: new Date(query.startDate) },
      }),
      ...(query.endDate && {
        createdAt: {
          ...((query.startDate && { gte: new Date(query.startDate) }) || {}),
          lte: new Date(query.endDate),
        },
      }),
      ...(query.category && { category: query.category }),
      ...(query.priority && { priority: query.priority }),
    };

    const [total, tickets, completedTickets] = await Promise.all([
      this.prisma.ticket.count({ where }),
      this.prisma.ticket.findMany({
        where,
        select: {
          status: true,
          priority: true,
          category: true,
          satisfactionScore: true,
          createdAt: true,
          closedAt: true,
          slaHours: true,
        },
      }),
      this.prisma.ticket.findMany({
        where: {
          ...where,
          status: 'CONCLUIDA',
          closedAt: { not: null },
        },
        select: {
          createdAt: true,
          closedAt: true,
          slaHours: true,
        },
      }),
    ]);

    // Group by status
    const byStatus: Record<string, number> = {};
    const byPriority: Record<string, number> = {};
    const byCategory: Record<string, number> = {};
    let totalSatisfaction = 0;
    let satisfactionCount = 0;

    tickets.forEach((ticket) => {
      byStatus[ticket.status] = (byStatus[ticket.status] || 0) + 1;
      byPriority[ticket.priority] = (byPriority[ticket.priority] || 0) + 1;
      byCategory[ticket.category] = (byCategory[ticket.category] || 0) + 1;

      if (ticket.satisfactionScore) {
        totalSatisfaction += ticket.satisfactionScore;
        satisfactionCount++;
      }
    });

    // Calculate average resolution time
    let totalResolutionHours = 0;
    let slaCompliantCount = 0;

    completedTickets.forEach((ticket) => {
      if (ticket.closedAt) {
        const resolutionHours =
          (ticket.closedAt.getTime() - ticket.createdAt.getTime()) / (1000 * 60 * 60);
        totalResolutionHours += resolutionHours;

        if (resolutionHours <= ticket.slaHours) {
          slaCompliantCount++;
        }
      }
    });

    const averageResolutionTimeHours =
      completedTickets.length > 0 ? totalResolutionHours / completedTickets.length : 0;
    const averageSatisfactionScore =
      satisfactionCount > 0 ? totalSatisfaction / satisfactionCount : 0;
    const slaComplianceRate =
      completedTickets.length > 0 ? (slaCompliantCount / completedTickets.length) * 100 : 0;

    return {
      total,
      byStatus,
      byPriority,
      byCategory,
      averageResolutionTimeHours: Math.round(averageResolutionTimeHours * 10) / 10,
      averageSatisfactionScore: Math.round(averageSatisfactionScore * 10) / 10,
      slaComplianceRate: Math.round(slaComplianceRate * 10) / 10,
    };
  }

  /**
   * Get booking statistics
   */
  async getBookingStats(
    condominiumId: string,
    query: ReportDateRangeDto,
  ): Promise<BookingStatsReportDto> {
    const where: any = {
      condominiumId,
      ...(query.startDate && {
        createdAt: { gte: new Date(query.startDate) },
      }),
      ...(query.endDate && {
        createdAt: {
          ...((query.startDate && { gte: new Date(query.startDate) }) || {}),
          lte: new Date(query.endDate),
        },
      }),
    };

    const [total, bookings, bookingsWithArea] = await Promise.all([
      this.prisma.booking.count({ where }),
      this.prisma.booking.findMany({
        where,
        select: {
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prisma.booking.groupBy({
        by: ['areaId'],
        where,
        _count: true,
        orderBy: {
          _count: {
            areaId: 'desc',
          },
        },
        take: 5,
      }),
    ]);

    // Group by status
    const byStatus: Record<string, number> = {};
    let totalApprovalTime = 0;
    let approvalCount = 0;
    let approvedCount = 0;

    bookings.forEach((booking) => {
      byStatus[booking.status] = (byStatus[booking.status] || 0) + 1;

      if (booking.status === 'APPROVED' || booking.status === 'REJECTED') {
        const approvalTime =
          (booking.updatedAt.getTime() - booking.createdAt.getTime()) / (1000 * 60 * 60);
        totalApprovalTime += approvalTime;
        approvalCount++;
      }

      if (booking.status === 'APPROVED') {
        approvedCount++;
      }
    });

    // Get area names for top areas
    const topAreas = await Promise.all(
      bookingsWithArea.map(async (item) => {
        const area = await this.prisma.area.findUnique({
          where: { id: item.areaId },
          select: { name: true },
        });
        return {
          areaName: area?.name || 'Unknown',
          count: item._count,
        };
      }),
    );

    const averageApprovalTimeHours = approvalCount > 0 ? totalApprovalTime / approvalCount : 0;
    const approvalRate = total > 0 ? (approvedCount / total) * 100 : 0;

    return {
      total,
      byStatus,
      topAreas,
      approvalRate: Math.round(approvalRate * 10) / 10,
      averageApprovalTimeHours: Math.round(averageApprovalTimeHours * 10) / 10,
    };
  }

  /**
   * Get maintenance statistics
   */
  async getMaintenanceStats(
    condominiumId: string,
    query: ReportDateRangeDto,
  ): Promise<MaintenanceStatsReportDto> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const where: any = {
      plan: { condominiumId },
      ...(query.startDate && {
        executedAt: { gte: new Date(query.startDate) },
      }),
      ...(query.endDate && {
        executedAt: {
          ...((query.startDate && { gte: new Date(query.startDate) }) || {}),
          lte: new Date(query.endDate),
        },
      }),
    };

    const [totalPlans, activePlans, totalExecutions, completedExecutions, executionsThisMonth] =
      await Promise.all([
        this.prisma.maintenancePlan.count({
          where: { condominiumId },
        }),
        this.prisma.maintenancePlan.count({
          where: { condominiumId, isActive: true },
        }),
        this.prisma.maintenanceExecution.count({ where }),
        this.prisma.maintenanceExecution.count({
          where: { ...where, completed: true },
        }),
        this.prisma.maintenanceExecution.count({
          where: {
            plan: { condominiumId },
            executedAt: { gte: startOfMonth },
          },
        }),
      ]);

    const completionRate = totalExecutions > 0 ? (completedExecutions / totalExecutions) * 100 : 0;

    // Note: overdueExecutions calculation would require RRULE parsing and scheduling logic
    // For now, we'll return 0 as a placeholder
    const overdueExecutions = 0;

    return {
      totalPlans,
      activePlans,
      totalExecutions,
      completedExecutions,
      completionRate: Math.round(completionRate * 10) / 10,
      executionsThisMonth,
      overdueExecutions,
    };
  }

  /**
   * Get financial report (placeholder)
   */
  async getFinancialReport(
    condominiumId: string,
    query: ReportDateRangeDto,
  ): Promise<FinancialReportDto> {
    // Verify condominium exists
    const condominium = await this.prisma.condominium.findUnique({
      where: { id: condominiumId },
    });

    if (!condominium) {
      throw new NotFoundException('Condominium not found');
    }

    // Placeholder: Financial module not implemented yet
    return {
      totalRevenue: 0,
      totalExpenses: 0,
      balance: 0,
      note: 'Financial module not implemented yet. This is a placeholder.',
    };
  }

  /**
   * Get delivery statistics
   */
  async getDeliveryStats(
    condominiumId: string,
    query: ReportDateRangeDto,
  ): Promise<DeliveryStatsReportDto> {
    const where: any = {
      condominiumId,
      ...(query.startDate && {
        receivedAt: { gte: new Date(query.startDate) },
      }),
      ...(query.endDate && {
        receivedAt: {
          ...((query.startDate && { gte: new Date(query.startDate) }) || {}),
          lte: new Date(query.endDate),
        },
      }),
    };

    const [total, pending, deliveries, topUnitsData] = await Promise.all([
      this.prisma.delivery.count({ where }),
      this.prisma.delivery.count({
        where: { ...where, pickedUpAt: null },
      }),
      this.prisma.delivery.findMany({
        where: {
          ...where,
          pickedUpAt: { not: null },
        },
        select: {
          receivedAt: true,
          pickedUpAt: true,
        },
      }),
      this.prisma.delivery.groupBy({
        by: ['unitId'],
        where,
        _count: true,
        orderBy: {
          _count: {
            unitId: 'desc',
          },
        },
        take: 5,
      }),
    ]);

    const pickedUp = total - pending;

    // Calculate average pickup time
    let totalPickupTime = 0;
    deliveries.forEach((delivery) => {
      if (delivery.pickedUpAt) {
        const pickupHours =
          (delivery.pickedUpAt.getTime() - delivery.receivedAt.getTime()) / (1000 * 60 * 60);
        totalPickupTime += pickupHours;
      }
    });

    const averagePickupTimeHours = deliveries.length > 0 ? totalPickupTime / deliveries.length : 0;

    // Get unit identifiers for top units
    const topUnits = await Promise.all(
      topUnitsData.map(async (item) => {
        const unit = await this.prisma.unit.findUnique({
          where: { id: item.unitId },
          select: { identifier: true },
        });
        return {
          unitId: item.unitId,
          identifier: unit?.identifier || 'Unknown',
          count: item._count,
        };
      }),
    );

    return {
      total,
      pending,
      pickedUp,
      averagePickupTimeHours: Math.round(averagePickupTimeHours * 10) / 10,
      topUnits,
    };
  }

  /**
   * Get incident statistics
   */
  async getIncidentStats(
    condominiumId: string,
    query: ReportDateRangeDto,
  ): Promise<IncidentStatsReportDto> {
    const where: any = {
      condominiumId,
      ...(query.startDate && {
        createdAt: { gte: new Date(query.startDate) },
      }),
      ...(query.endDate && {
        createdAt: {
          ...((query.startDate && { gte: new Date(query.startDate) }) || {}),
          lte: new Date(query.endDate),
        },
      }),
    };

    const [total, incidents, resolvedIncidents] = await Promise.all([
      this.prisma.incident.count({ where }),
      this.prisma.incident.findMany({
        where,
        select: {
          status: true,
          type: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prisma.incident.findMany({
        where: {
          ...where,
          status: { in: ['RESOLVED', 'CLOSED'] },
        },
        select: {
          createdAt: true,
          updatedAt: true,
        },
      }),
    ]);

    // Group by status and type
    const byStatus: Record<string, number> = {};
    const byType: Record<string, number> = {};

    incidents.forEach((incident) => {
      byStatus[incident.status] = (byStatus[incident.status] || 0) + 1;
      byType[incident.type] = (byType[incident.type] || 0) + 1;
    });

    // Calculate average resolution time
    let totalResolutionTime = 0;
    resolvedIncidents.forEach((incident) => {
      const resolutionHours =
        (incident.updatedAt.getTime() - incident.createdAt.getTime()) / (1000 * 60 * 60);
      totalResolutionTime += resolutionHours;
    });

    const averageResolutionTimeHours =
      resolvedIncidents.length > 0 ? totalResolutionTime / resolvedIncidents.length : 0;

    return {
      total,
      byStatus,
      byType,
      averageResolutionTimeHours: Math.round(averageResolutionTimeHours * 10) / 10,
    };
  }

  /**
   * Get activity time series report
   */
  async getActivityReport(
    condominiumId: string,
    query: TimeSeriesReportDto,
  ): Promise<ActivityReportDto> {
    // This would require complex date grouping logic
    // For now, we'll return empty arrays as placeholders
    // In a real implementation, you would use raw SQL or aggregation pipelines

    return {
      ticketsCreated: [],
      ticketsResolved: [],
      bookings: [],
      notices: [],
    };
  }

  /**
   * Get user engagement report
   */
  async getUserEngagement(
    condominiumId: string,
    query: ReportDateRangeDto,
  ): Promise<UserEngagementReportDto> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [totalMembers, activeUsers, notices, readConfirmations, assemblies, votes, topUsers] =
      await Promise.all([
        // Total members
        this.prisma.membership.count({
          where: { condominiumId, isActive: true },
        }),

        // Active users (logged in last 30 days)
        this.prisma.user.count({
          where: {
            memberships: {
              some: { condominiumId, isActive: true },
            },
            lastLoginAt: { gte: thirtyDaysAgo },
          },
        }),

        // Total notices published
        this.prisma.notice.count({
          where: {
            condominiumId,
            publishedAt: { not: null },
          },
        }),

        // Total notice read confirmations
        this.prisma.noticeReadConfirmation.count({
          where: {
            notice: { condominiumId },
          },
        }),

        // Total assemblies
        this.prisma.assembly.count({
          where: { condominiumId },
        }),

        // Total votes
        this.prisma.vote.count({
          where: {
            assembly: { condominiumId },
          },
        }),

        // Top users by points
        this.prisma.userPoints.findMany({
          where: { condominiumId },
          orderBy: { points: 'desc' },
          take: 10,
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        }),
      ]);

    const engagementRate = totalMembers > 0 ? (activeUsers / totalMembers) * 100 : 0;
    const noticeReadRate =
      notices > 0 && totalMembers > 0 ? (readConfirmations / (notices * totalMembers)) * 100 : 0;
    const assemblyParticipationRate =
      assemblies > 0 && totalMembers > 0 ? (votes / (assemblies * totalMembers)) * 100 : 0;

    return {
      activeUsers,
      engagementRate: Math.round(engagementRate * 10) / 10,
      noticeReadRate: Math.round(noticeReadRate * 10) / 10,
      assemblyParticipationRate: Math.round(assemblyParticipationRate * 10) / 10,
      topUsersByPoints: topUsers.map((up) => ({
        userId: up.userId,
        name: up.user.name,
        points: up.points,
        level: up.level,
      })),
    };
  }
}
