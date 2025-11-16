/**
 * Ticket checklist item
 */
export interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  completedAt?: Date;
  completedBy?: string;
}

/**
 * Ticket checklist structure
 */
export interface TicketChecklist {
  items: ChecklistItem[];
  completedCount: number;
  totalCount: number;
  progress: number; // 0-100
}

/**
 * Ticket attachment
 */
export interface TicketAttachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedBy: string;
  uploadedAt: Date;
}

/**
 * Ticket comment mention
 */
export interface TicketMention {
  userId: string;
  userName: string;
  position: number;
}

/**
 * Ticket status transition
 */
export interface StatusTransition {
  from: string | null;
  to: string;
  transitionedAt: Date;
  transitionedBy: string;
  note?: string;
}
