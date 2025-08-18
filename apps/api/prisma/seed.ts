import { PrismaClient, UserRole, TicketStatus, TicketPriority, TicketCategory } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Limpar dados existentes (cuidado em produção!)
  await prisma.ticketComment.deleteMany();
  await prisma.ticketStatusHistory.deleteMany();
  await prisma.ticketAttachment.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.noticeReadConfirmation.deleteMany();
  await prisma.notice.deleteMany();
  await prisma.vote.deleteMany();
  await prisma.assemblyItem.deleteMany();
  await prisma.assembly.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.area.deleteMany();
  await prisma.delivery.deleteMany();
  await prisma.visitorPass.deleteMany();
  await prisma.document.deleteMany();
  await prisma.maintenanceExecution.deleteMany();
  await prisma.maintenancePlan.deleteMany();
  await prisma.incident.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.membership.deleteMany();
  await prisma.unit.deleteMany();
  await prisma.user.deleteMany();
  await prisma.condominium.deleteMany();

  console.log('🏢 Criando condomínio demo...');

  // Criar condomínio demo
  const condominium = await prisma.condominium.create({
    data: {
      name: 'Residencial Horizonte',
      cnpj: '12.345.678/0001-90',
      street: 'Rua das Flores',
      number: '123',
      district: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      cep: '01234-567',
      settings: {
        allowVisitorSelfRegistration: true,
        requireBookingApproval: false,
        maxBookingDays: 7,
        slaHours: {
          ELETRICA: 24,
          HIDRAULICA: 12,
          LIMPEZA: 48,
          SEGURANCA: 6,
          OUTROS: 72,
        },
      },
    },
  });

  console.log('👥 Criando usuários...');

  // Hash padrão para senhas (senha123)
  const passwordHash = await bcrypt.hash('senha123', 12);

  // Criar usuários
  const adminGlobal = await prisma.user.create({
    data: {
      email: 'admin@oryumhouse.com',
      passwordHash,
      name: 'Admin Global',
      phone: '+5511999999999',
    },
  });

  const sindico = await prisma.user.create({
    data: {
      email: 'sindico@residencialhorizonte.com',
      passwordHash,
      name: 'Maria Silva',
      phone: '+5511888888888',
    },
  });

  const zelador = await prisma.user.create({
    data: {
      email: 'zelador@residencialhorizonte.com',
      passwordHash,
      name: 'João Santos',
      phone: '+5511777777777',
    },
  });

  const porteiro = await prisma.user.create({
    data: {
      email: 'porteiro@residencialhorizonte.com',
      passwordHash,
      name: 'Carlos Oliveira',
      phone: '+5511666666666',
    },
  });

  // Criar moradores
  const moradores = [];
  for (let i = 1; i <= 12; i++) {
    const morador = await prisma.user.create({
      data: {
        email: `morador${i}@exemplo.com`,
        passwordHash,
        name: `Morador ${i}`,
        phone: `+551155555${i.toString().padStart(4, '0')}`,
      },
    });
    moradores.push(morador);
  }

  console.log('🏠 Criando unidades...');

  // Criar unidades
  const units = [];
  for (let bloco = 1; bloco <= 2; bloco++) {
    for (let apto = 1; apto <= 5; apto++) {
      const unit = await prisma.unit.create({
        data: {
          condominiumId: condominium.id,
          block: `Bloco ${bloco}`,
          number: `${bloco}0${apto}`,
          areaM2: 75.5,
          ownerId: moradores[units.length]?.id,
        },
      });
      units.push(unit);
    }
  }

  console.log('🔐 Criando memberships (papéis)...');

  // Criar memberships
  await prisma.membership.create({
    data: {
      userId: adminGlobal.id,
      condominiumId: condominium.id,
      role: UserRole.ADMIN_GLOBAL,
    },
  });

  await prisma.membership.create({
    data: {
      userId: sindico.id,
      condominiumId: condominium.id,
      role: UserRole.SINDICO,
    },
  });

  await prisma.membership.create({
    data: {
      userId: zelador.id,
      condominiumId: condominium.id,
      role: UserRole.ZELADOR,
    },
  });

  await prisma.membership.create({
    data: {
      userId: porteiro.id,
      condominiumId: condominium.id,
      role: UserRole.PORTARIA,
    },
  });

  for (const morador of moradores) {
    await prisma.membership.create({
      data: {
        userId: morador.id,
        condominiumId: condominium.id,
        role: UserRole.MORADOR,
      },
    });
  }

  console.log('🎯 Criando áreas comuns...');

  // Criar áreas comuns
  const areas = await Promise.all([
    prisma.area.create({
      data: {
        condominiumId: condominium.id,
        name: 'Salão de Festas',
        description: 'Salão com capacidade para 50 pessoas',
        capacity: 50,
        requiresApproval: true,
        feePlaceholder: 150.0,
      },
    }),
    prisma.area.create({
      data: {
        condominiumId: condominium.id,
        name: 'Churrasqueira',
        description: 'Área de churrasqueira com mesas',
        capacity: 20,
        requiresApproval: false,
      },
    }),
    prisma.area.create({
      data: {
        condominiumId: condominium.id,
        name: 'Piscina',
        description: 'Piscina adulto e infantil',
        capacity: 30,
        requiresApproval: false,
      },
    }),
  ]);

  console.log('📋 Criando demandas (tickets)...');

  // Criar tickets demo
  const tickets = [
    {
      title: 'Vazamento no banheiro',
      description: 'Há um vazamento no registro do banheiro que está causando infiltração.',
      category: TicketCategory.HIDRAULICA,
      priority: TicketPriority.ALTA,
      status: TicketStatus.EM_ANDAMENTO,
      unitId: units[0].id,
      openedById: moradores[0].id,
      assignedToId: zelador.id,
      location: 'Banheiro social',
      tags: ['urgente', 'infiltração'],
      slaHours: 12,
    },
    {
      title: 'Lâmpada queimada no corredor',
      description: 'A lâmpada do corredor do 2º andar está queimada há 3 dias.',
      category: TicketCategory.ELETRICA,
      priority: TicketPriority.MEDIA,
      status: TicketStatus.NOVA,
      openedById: moradores[1].id,
      location: '2º andar - corredor',
      tags: ['iluminação'],
      slaHours: 24,
    },
    {
      title: 'Limpeza da piscina',
      description: 'A piscina precisa de limpeza e tratamento da água.',
      category: TicketCategory.LIMPEZA,
      priority: TicketPriority.MEDIA,
      status: TicketStatus.EM_AVALIACAO,
      openedById: moradores[2].id,
      assignedToId: zelador.id,
      location: 'Área de lazer - piscina',
      tags: ['piscina', 'manutenção'],
      slaHours: 48,
    },
    {
      title: 'Portão da garagem com defeito',
      description: 'O portão automático da garagem não está abrindo corretamente.',
      category: TicketCategory.OUTROS,
      priority: TicketPriority.ALTA,
      status: TicketStatus.AGUARDANDO_MORADOR,
      unitId: units[3].id,
      openedById: moradores[3].id,
      assignedToId: zelador.id,
      location: 'Garagem - portão principal',
      tags: ['portão', 'automação'],
      slaHours: 24,
    },
    {
      title: 'Interfone não funciona',
      description: 'O interfone do apartamento 201 não está funcionando.',
      category: TicketCategory.ELETRICA,
      priority: TicketPriority.MEDIA,
      status: TicketStatus.CONCLUIDA,
      unitId: units[4].id,
      openedById: moradores[4].id,
      assignedToId: zelador.id,
      location: 'Apartamento 201',
      tags: ['interfone', 'comunicação'],
      slaHours: 48,
      satisfactionScore: 5,
      closedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 dias atrás
    },
    {
      title: 'Barulho excessivo',
      description: 'Vizinho do andar de cima fazendo muito barulho após 22h.',
      category: TicketCategory.SEGURANCA,
      priority: TicketPriority.MEDIA,
      status: TicketStatus.EM_ANDAMENTO,
      unitId: units[5].id,
      openedById: moradores[5].id,
      assignedToId: sindico.id,
      location: 'Apartamento 102',
      tags: ['barulho', 'vizinhança'],
      slaHours: 12,
    },
    {
      title: 'Elevador fazendo ruído',
      description: 'O elevador está fazendo um ruído estranho durante o funcionamento.',
      category: TicketCategory.OUTROS,
      priority: TicketPriority.ALTA,
      status: TicketStatus.NOVA,
      openedById: moradores[6].id,
      location: 'Elevador principal',
      tags: ['elevador', 'manutenção', 'urgente'],
      slaHours: 6,
    },
    {
      title: 'Torneira da área comum pingando',
      description: 'A torneira próxima à churrasqueira está pingando constantemente.',
      category: TicketCategory.HIDRAULICA,
      priority: TicketPriority.BAIXA,
      status: TicketStatus.EM_AVALIACAO,
      openedById: moradores[7].id,
      assignedToId: zelador.id,
      location: 'Área de churrasqueira',
      tags: ['torneira', 'área comum'],
      slaHours: 72,
    },
  ];

  for (const ticketData of tickets) {
    const ticket = await prisma.ticket.create({
      data: ticketData,
    });

    // Criar histórico de status
    await prisma.ticketStatusHistory.create({
      data: {
        ticketId: ticket.id,
        fromStatus: null,
        toStatus: TicketStatus.NOVA,
        byUserId: ticketData.openedById,
        note: 'Demanda criada',
        createdAt: new Date(ticket.createdAt.getTime() + 1000),
      },
    });

    if (ticket.status !== TicketStatus.NOVA) {
      await prisma.ticketStatusHistory.create({
        data: {
          ticketId: ticket.id,
          fromStatus: TicketStatus.NOVA,
          toStatus: ticket.status,
          byUserId: ticketData.assignedToId || sindico.id,
          note: `Status alterado para ${ticket.status}`,
          createdAt: new Date(ticket.createdAt.getTime() + 60000),
        },
      });
    }

    // Adicionar alguns comentários
    if (Math.random() > 0.5) {
      await prisma.ticketComment.create({
        data: {
          ticketId: ticket.id,
          authorId: ticketData.assignedToId || sindico.id,
          message: 'Vou verificar esta demanda hoje pela manhã.',
          createdAt: new Date(ticket.createdAt.getTime() + 120000),
        },
      });
    }
  }

  console.log('📅 Criando reservas...');

  // Criar algumas reservas
  const now = new Date();
  const reservas = [
    {
      condominiumId: condominium.id,
      areaId: areas[0].id, // Salão de festas
      unitId: units[0].id,
      requestedById: moradores[0].id,
      startAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // Próxima semana
      endAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000), // 4h depois
      status: 'PENDING' as const,
      notes: 'Aniversário de 15 anos',
    },
    {
      condominiumId: condominium.id,
      areaId: areas[1].id, // Churrasqueira
      unitId: units[1].id,
      requestedById: moradores[1].id,
      startAt: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // Em 3 dias
      endAt: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000), // 3h depois
      status: 'APPROVED' as const,
      notes: 'Churrasco da família',
    },
    {
      condominiumId: condominium.id,
      areaId: areas[2].id, // Piscina
      unitId: units[2].id,
      requestedById: moradores[2].id,
      startAt: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000), // Amanhã
      endAt: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 2h depois
      status: 'APPROVED' as const,
      notes: 'Festa na piscina para as crianças',
    },
  ];

  for (const reserva of reservas) {
    await prisma.booking.create({ data: reserva });
  }

  console.log('📢 Criando comunicados...');

  // Criar comunicados
  const comunicados = [
    {
      condominiumId: condominium.id,
      title: 'Manutenção do elevador programada',
      content: 'Informamos que haverá manutenção preventiva do elevador no dia 15/01/2024, das 08h às 12h. Pedimos a compreensão de todos os moradores.',
      audience: 'ALL',
      pinned: true,
      publishedAt: new Date(),
    },
    {
      condominiumId: condominium.id,
      title: 'Nova regra para uso da piscina',
      content: 'A partir de agora, o uso da piscina será permitido até às 22h. Após este horário, a área ficará fechada para manutenção.',
      audience: 'ALL',
      pinned: false,
      publishedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      condominiumId: condominium.id,
      title: 'Assembleia Geral Ordinária',
      content: 'Convocamos todos os condôminos para a Assembleia Geral Ordinária que será realizada no dia 20/01/2024, às 19h, no salão de festas.',
      audience: 'ALL',
      pinned: true,
      publishedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      condominiumId: condominium.id,
      title: 'Limpeza dos reservatórios',
      content: 'Será realizada limpeza dos reservatórios de água no dia 25/01/2024. Haverá interrupção no fornecimento das 8h às 16h.',
      audience: 'ALL',
      pinned: false,
      publishedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      condominiumId: condominium.id,
      title: 'Obras no Bloco 1',
      content: 'Informamos aos moradores do Bloco 1 que haverá obras de reparo na fachada. Os trabalhos serão realizados das 8h às 17h.',
      audience: 'BLOCK',
      audienceFilter: { blocks: ['Bloco 1'] },
      pinned: false,
      publishedAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
    },
  ];

  for (const comunicado of comunicados) {
    await prisma.notice.create({ data: comunicado });
  }

  console.log('🗳️ Criando assembleia demo...');

  // Criar assembleia
  const assembly = await prisma.assembly.create({
    data: {
      condominiumId: condominium.id,
      title: 'Assembleia Geral Ordinária 2024',
      agenda: {
        items: [
          'Prestação de contas do exercício anterior',
          'Aprovação do orçamento para 2024',
          'Eleição do novo síndico',
          'Discussão sobre reformas nas áreas comuns',
        ],
      },
      startAt: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
      endAt: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
      quorumTarget: 60, // 60% dos condôminos
      status: 'SCHEDULED',
    },
  });

  // Criar itens de votação
  const assemblyItems = await Promise.all([
    prisma.assemblyItem.create({
      data: {
        assemblyId: assembly.id,
        title: 'Aprovação das contas de 2023',
        description: 'Aprovação da prestação de contas do exercício de 2023',
        order: 1,
        options: [
          { id: 'approve', label: 'Aprovar', description: 'Aprovar as contas apresentadas' },
          { id: 'reject', label: 'Rejeitar', description: 'Rejeitar as contas apresentadas' },
          { id: 'abstain', label: 'Abster-se', description: 'Não opinar sobre as contas' },
        ],
      },
    }),
    prisma.assemblyItem.create({
      data: {
        assemblyId: assembly.id,
        title: 'Orçamento 2024',
        description: 'Aprovação do orçamento previsto para o ano de 2024',
        order: 2,
        options: [
          { id: 'approve', label: 'Aprovar', description: 'Aprovar o orçamento proposto' },
          { id: 'reject', label: 'Rejeitar', description: 'Rejeitar o orçamento proposto' },
          { id: 'modify', label: 'Aprovar com modificações', description: 'Aprovar com as modificações discutidas' },
        ],
      },
    }),
  ]);

  console.log('📦 Criando entregas...');

  // Criar entregas
  const entregas = [
    {
      condominiumId: condominium.id,
      unitId: units[0].id,
      code: 'ENT001',
      carrier: 'Correios',
      description: 'Encomenda dos Correios',
      receivedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2h atrás
    },
    {
      condominiumId: condominium.id,
      unitId: units[1].id,
      code: 'ENT002',
      carrier: 'Mercado Livre',
      description: 'Produto do Mercado Livre',
      receivedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 dia atrás
      pickedUpAt: new Date(now.getTime() - 20 * 60 * 60 * 1000), // 20h atrás
      pickedById: moradores[1].id,
    },
    {
      condominiumId: condominium.id,
      unitId: units[2].id,
      code: 'ENT003',
      carrier: 'Amazon',
      description: 'Encomenda da Amazon',
      receivedAt: new Date(now.getTime() - 30 * 60 * 1000), // 30 min atrás
    },
  ];

  for (const entrega of entregas) {
    await prisma.delivery.create({ data: entrega });
  }

  console.log('🔑 Criando passes de visitante...');

  // Criar passes de visitante
  const visitantes = [
    {
      condominiumId: condominium.id,
      unitId: units[0].id,
      visitorName: 'José da Silva',
      document: '123.456.789-00',
      qrToken: 'QR001',
      validFrom: new Date(now.getTime() + 2 * 60 * 60 * 1000), // Em 2h
      validTo: new Date(now.getTime() + 8 * 60 * 60 * 1000), // Em 8h
    },
    {
      condominiumId: condominium.id,
      unitId: units[1].id,
      visitorName: 'Ana Costa',
      document: '987.654.321-00',
      qrToken: 'QR002',
      validFrom: new Date(now.getTime() - 1 * 60 * 60 * 1000), // 1h atrás
      validTo: new Date(now.getTime() + 3 * 60 * 60 * 1000), // Em 3h
      usedAt: new Date(now.getTime() - 30 * 60 * 1000), // 30 min atrás
    },
  ];

  for (const visitante of visitantes) {
    await prisma.visitorPass.create({ data: visitante });
  }

  console.log('📄 Criando documentos...');

  // Criar documentos
  const documentos = [
    {
      condominiumId: condominium.id,
      title: 'Regulamento Interno',
      version: '2.0',
      fileUrl: 'https://s3.example.com/docs/regulamento-interno-v2.pdf',
      fileSize: 1024000,
      mimeType: 'application/pdf',
      visibility: 'ALL',
      createdById: sindico.id,
    },
    {
      condominiumId: condominium.id,
      title: 'Ata da Assembleia 2023',
      version: '1.0',
      fileUrl: 'https://s3.example.com/docs/ata-assembleia-2023.pdf',
      fileSize: 512000,
      mimeType: 'application/pdf',
      visibility: 'ALL',
      createdById: sindico.id,
    },
    {
      condominiumId: condominium.id,
      title: 'Manual do Síndico',
      version: '1.0',
      fileUrl: 'https://s3.example.com/docs/manual-sindico.pdf',
      fileSize: 2048000,
      mimeType: 'application/pdf',
      visibility: 'ROLE',
      visibilityFilter: { roles: ['SINDICO'] },
      createdById: adminGlobal.id,
    },
  ];

  for (const documento of documentos) {
    await prisma.document.create({ data: documento });
  }

  console.log('🔧 Criando planos de manutenção...');

  // Criar planos de manutenção
  const manutencoes = [
    {
      condominiumId: condominium.id,
      title: 'Limpeza da Piscina',
      description: 'Limpeza e tratamento químico da piscina',
      schedule: 'FREQ=WEEKLY;BYDAY=MO,WE,FR', // Segunda, quarta e sexta
      tasks: {
        items: [
          'Aspirar o fundo da piscina',
          'Limpar as bordas',
          'Verificar pH da água',
          'Adicionar cloro se necessário',
        ],
      },
      responsibleId: zelador.id,
      nextRunAt: new Date(now.getTime() + 24 * 60 * 60 * 1000), // Amanhã
    },
    {
      condominiumId: condominium.id,
      title: 'Manutenção do Elevador',
      description: 'Manutenção preventiva do elevador',
      schedule: 'FREQ=MONTHLY;BYMONTHDAY=15', // Todo dia 15 do mês
      tasks: {
        items: [
          'Verificar funcionamento dos botões',
          'Lubrificar trilhos',
          'Testar sistema de emergência',
          'Limpar cabine',
        ],
      },
      responsibleId: zelador.id,
      nextRunAt: new Date(2024, 0, 15), // 15 de janeiro de 2024
    },
  ];

  for (const manutencao of manutencoes) {
    await prisma.maintenancePlan.create({ data: manutencao });
  }

  console.log('⚠️ Criando ocorrências...');

  // Criar ocorrências
  const ocorrencias = [
    {
      condominiumId: condominium.id,
      type: 'SEGURANCA',
      title: 'Pessoa suspeita no prédio',
      description: 'Foi vista uma pessoa estranha rondando o prédio durante a madrugada.',
      reportedById: porteiro.id,
      status: 'OPEN',
      attachments: [],
    },
    {
      condominiumId: condominium.id,
      type: 'VAZAMENTO',
      title: 'Vazamento no subsolo',
      description: 'Detectado vazamento de água no subsolo, próximo à casa de máquinas.',
      reportedById: zelador.id,
      status: 'IN_PROGRESS',
      attachments: [],
    },
  ];

  for (const ocorrencia of ocorrencias) {
    await prisma.incident.create({ data: ocorrencia });
  }

  console.log('✅ Seed concluído com sucesso!');
  console.log('');
  console.log('🔑 Credenciais para teste:');
  console.log('');
  console.log('👑 Admin Global:');
  console.log('   Email: admin@oryumhouse.com');
  console.log('   Senha: senha123');
  console.log('');
  console.log('🏢 Síndico:');
  console.log('   Email: sindico@residencialhorizonte.com');
  console.log('   Senha: senha123');
  console.log('');
  console.log('🔧 Zelador:');
  console.log('   Email: zelador@residencialhorizonte.com');
  console.log('   Senha: senha123');
  console.log('');
  console.log('🚪 Porteiro:');
  console.log('   Email: porteiro@residencialhorizonte.com');
  console.log('   Senha: senha123');
  console.log('');
  console.log('🏠 Moradores:');
  console.log('   Email: morador1@exemplo.com até morador12@exemplo.com');
  console.log('   Senha: senha123 (para todos)');
  console.log('');
  console.log('📊 Dados criados:');
  console.log(`   • 1 condomínio (${condominium.name})`);
  console.log(`   • ${moradores.length + 4} usuários`);
  console.log(`   • ${units.length} unidades`);
  console.log(`   • ${tickets.length} demandas`);
  console.log(`   • ${areas.length} áreas comuns`);
  console.log(`   • ${reservas.length} reservas`);
  console.log(`   • ${comunicados.length} comunicados`);
  console.log(`   • 1 assembleia com ${assemblyItems.length} itens de votação`);
  console.log(`   • ${entregas.length} entregas`);
  console.log(`   • ${visitantes.length} passes de visitante`);
  console.log(`   • ${documentos.length} documentos`);
  console.log(`   • ${manutencoes.length} planos de manutenção`);
  console.log(`   • ${ocorrencias.length} ocorrências`);
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
