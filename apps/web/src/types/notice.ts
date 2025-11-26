/**
 * Notice Types and Interfaces
 */

export type NoticeAudience = 'ALL' | 'BLOCK' | 'UNIT';

export interface NoticeUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface NoticeReadConfirmation {
  id: string;
  noticeId: string;
  userId: string;
  user?: NoticeUser;
  readAt: string;
}

export interface Notice {
  id: string;
  condominiumId: string;
  title: string;
  content: string;
  audience: NoticeAudience;
  audienceFilter?: {
    blocks?: string[];
    units?: string[];
  };
  pinned: boolean;
  publishedAt?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
  readCount?: number;
  hasRead?: boolean;
  readConfirmations?: NoticeReadConfirmation[];
}

export interface NoticeStats {
  total: number;
  active: number;
  pinned: number;
  scheduled: number;
  expired: number;
  avgReadRate: number;
}

export interface NoticeFilters {
  search?: string;
  pinnedOnly?: boolean;
  publishedOnly?: boolean;
  includeExpired?: boolean;
  audience?: NoticeAudience;
  page?: number;
  limit?: number;
}

export interface CreateNoticeData {
  title: string;
  content: string;
  audience?: NoticeAudience;
  audienceFilter?: {
    blocks?: string[];
    units?: string[];
  };
  pinned?: boolean;
  publishedAt?: string;
  expiresAt?: string;
}

export interface UpdateNoticeData {
  title?: string;
  content?: string;
  audience?: NoticeAudience;
  audienceFilter?: {
    blocks?: string[];
    units?: string[];
  };
  pinned?: boolean;
  publishedAt?: string;
  expiresAt?: string;
}

// UI Helper constants
export const NOTICE_AUDIENCE_LABELS: Record<NoticeAudience, string> = {
  ALL: 'Todos',
  BLOCK: 'Por Bloco',
  UNIT: 'Por Unidade',
};

export const NOTICE_AUDIENCE_DESCRIPTIONS: Record<NoticeAudience, string> = {
  ALL: 'Visível para todos os moradores',
  BLOCK: 'Visível apenas para blocos selecionados',
  UNIT: 'Visível apenas para unidades selecionadas',
};
