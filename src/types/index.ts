export type UserRole = 'vendor' | 'admin' | 'patrol';

export type StallStatus = 'available' | 'rented' | 'maintenance' | 'occupied';

export type AuditStatus = 'pending' | 'approved' | 'rejected';

export type PaymentStatus = 'unpaid' | 'paid' | 'refunded' | 'refunding';

export type NoticeType = 'market_close' | 'stall_change' | 'general';

export type ViolationType = 'absent' | 'occupying' | 'unhygienic' | 'other';

export interface User {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  avatar?: string;
}

export interface Stall {
  id: string;
  stallNo: string;
  zone: string;
  row: number;
  col: number;
  width: number;
  height: number;
  status: StallStatus;
  price: number;
  vendorId?: string;
  vendorName?: string;
  category?: string;
  leaseStart?: string;
  leaseEnd?: string;
}

export interface Vendor {
  id: string;
  name: string;
  phone: string;
  idCard: string;
  category: string;
  stallId?: string;
  stallNo?: string;
  auditStatus: AuditStatus;
  licenseStatus: AuditStatus;
  licenseExpireDate?: string;
  healthCertExpireDate?: string;
  businessLicense?: string;
  idCardFront?: string;
  idCardBack?: string;
  applyDate: string;
  auditRemark?: string;
  renewalStatus?: 'none' | 'pending' | 'renewed' | 'changed';
  lastRemindDate?: string;
}

export interface Payment {
  id: string;
  vendorId: string;
  vendorName: string;
  stallId: string;
  stallNo: string;
  amount: number;
  period: string;
  status: PaymentStatus;
  payDate?: string;
  refundDate?: string;
  refundReason?: string;
  createDate: string;
}

export interface Inspection {
  id: string;
  inspectorId: string;
  inspectorName: string;
  stallId: string;
  stallNo: string;
  vendorId?: string;
  vendorName?: string;
  type: ViolationType;
  description: string;
  photos?: string[];
  hygieneScore?: number;
  date: string;
}

export interface Notice {
  id: string;
  title: string;
  type: NoticeType;
  content: string;
  publisher: string;
  publishDate: string;
  isTop: boolean;
}

export interface StatSummary {
  totalStalls: number;
  rentedStalls: number;
  availableStalls: number;
  todayRevenue: number;
  monthRevenue: number;
  activeVendors: number;
  expiringLicenses: number;
  pendingInspections: number;
}

export type ReminderType = 'license' | 'lease' | 'violation' | 'payment';

export interface Reminder {
  id: string;
  vendorId: string;
  vendorName: string;
  type: ReminderType;
  title: string;
  content: string;
  sendDate: string;
  auditStatus?: 'pending' | 'approved' | 'rejected';
  auditRemark?: string;
  auditDate?: string;
  operator?: string;
}

export type TimelineEventType = 'license' | 'lease' | 'violation' | 'payment' | 'position_change' | 'audit';

export interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  title: string;
  description: string;
  date: string;
  operator?: string;
  status?: string;
  statusType?: 'success' | 'warning' | 'error' | 'info';
  amount?: number;
}
