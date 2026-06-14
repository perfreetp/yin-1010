import { Vendor, Reminder } from '@/types';

let _vendors: Vendor[] = [
  { id: 'v001', name: '张建国', phone: '138****1234', idCard: '110101********1234', category: '熟食小吃', stallId: 's001', stallNo: 'A01', auditStatus: 'approved', licenseStatus: 'approved', licenseExpireDate: '2026-12-31', healthCertExpireDate: '2026-09-15', businessLicense: 'https://picsum.photos/id/1/300/200', idCardFront: 'https://picsum.photos/id/2/300/200', idCardBack: 'https://picsum.photos/id/3/300/200', applyDate: '2026-05-20', renewalStatus: 'none' },
  { id: 'v002', name: '李秀英', phone: '139****5678', idCard: '110101********5678', category: '水果零售', stallId: 's002', stallNo: 'A02', auditStatus: 'approved', licenseStatus: 'approved', licenseExpireDate: '2026-09-15', healthCertExpireDate: '2026-11-20', applyDate: '2026-05-22', renewalStatus: 'none' },
  { id: 'v003', name: '王大伟', phone: '136****9012', idCard: '110101********9012', category: '服饰百货', stallId: 's005', stallNo: 'A05', auditStatus: 'approved', licenseStatus: 'pending', licenseExpireDate: '2026-06-20', healthCertExpireDate: '2026-07-10', applyDate: '2026-06-01', renewalStatus: 'none', lastRemindDate: '2026-06-12' },
  { id: 'v004', name: '赵美玲', phone: '137****3456', idCard: '110101********3456', category: '生鲜蔬菜', stallId: 's007', stallNo: 'B01', auditStatus: 'approved', licenseStatus: 'approved', licenseExpireDate: '2027-03-10', healthCertExpireDate: '2026-12-01', applyDate: '2026-05-15', renewalStatus: 'renewed' },
  { id: 'v005', name: '孙志强', phone: '135****7890', idCard: '110101********7890', category: '日用百货', stallId: 's008', stallNo: 'B02', auditStatus: 'approved', licenseStatus: 'approved', licenseExpireDate: '2026-11-20', healthCertExpireDate: '2026-08-30', applyDate: '2026-05-28', renewalStatus: 'none' },
  { id: 'v006', name: '周文华', phone: '138****2345', idCard: '110101********2345', category: '早餐早点', stallId: 's010', stallNo: 'B04', auditStatus: 'pending', licenseStatus: 'pending', healthCertExpireDate: '2026-07-15', applyDate: '2026-06-10', auditRemark: '请补充健康证照片', renewalStatus: 'none' },
  { id: 'v007', name: '吴丽娟', phone: '139****6789', idCard: '110101********6789', category: '手工艺品', stallId: 's011', stallNo: 'B05', auditStatus: 'approved', licenseStatus: 'approved', licenseExpireDate: '2026-08-05', healthCertExpireDate: '2026-10-20', applyDate: '2026-06-05', renewalStatus: 'pending', lastRemindDate: '2026-06-13' },
  { id: 'v008', name: '郑海涛', phone: '136****0123', idCard: '110101********0123', category: '冰饮奶茶', stallId: 's013', stallNo: 'C01', auditStatus: 'approved', licenseStatus: 'approved', licenseExpireDate: '2027-01-15', healthCertExpireDate: '2027-02-28', applyDate: '2026-05-10', renewalStatus: 'none' },
  { id: 'v009', name: '陈小红', phone: '137****4567', idCard: '110101********4567', category: '鲜花绿植', stallId: 's014', stallNo: 'C02', auditStatus: 'approved', licenseStatus: 'approved', licenseExpireDate: '2026-10-01', healthCertExpireDate: '2026-09-15', applyDate: '2026-06-02', renewalStatus: 'none' },
  { id: 'v010', name: '黄志明', phone: '135****8901', idCard: '110101********8901', category: '玩具饰品', stallId: 's018', stallNo: 'C06', auditStatus: 'approved', licenseStatus: 'rejected', licenseExpireDate: '2026-06-18', healthCertExpireDate: '2026-07-01', applyDate: '2026-05-25', auditRemark: '营业执照已过期，请重新办理', renewalStatus: 'changed', lastRemindDate: '2026-06-10' },
  { id: 'v011', name: '马晓燕', phone: '138****3456', idCard: '110101********3456', category: '特色小吃', auditStatus: 'pending', licenseStatus: 'pending', applyDate: '2026-06-12', renewalStatus: 'none' },
  { id: 'v012', name: '林建军', phone: '139****7890', idCard: '110101********7890', category: '农副产品', auditStatus: 'pending', licenseStatus: 'pending', applyDate: '2026-06-13', renewalStatus: 'none' },
];

export const mockVendors = _vendors;

let _reminders: Reminder[] = [
  { id: 'r001', vendorId: 'v003', vendorName: '王大伟', type: 'license', title: '营业执照到期提醒', content: '您的营业执照将于2026-06-20到期，请及时办理续期。', sendDate: '2026-06-12 10:30', auditStatus: 'pending', auditRemark: '材料审核中' },
  { id: 'r002', vendorId: 'v007', vendorName: '吴丽娟', type: 'lease', title: '摊位租期到期提醒', content: '您的摊位B05租期将于2026-07-10到期，请及时办理续租。', sendDate: '2026-06-13 09:15', auditStatus: 'pending', auditRemark: '待确认是否续租' },
  { id: 'r003', vendorId: 'v010', vendorName: '黄志明', type: 'license', title: '营业执照到期提醒', content: '您的营业执照即将到期，请重新办理后上传审核。', sendDate: '2026-06-10 14:20', auditStatus: 'rejected', auditRemark: '上传材料不符合要求，请重新提交', auditDate: '2026-06-11 16:00' },
  { id: 'r004', vendorId: 'v001', vendorName: '张建国', type: 'violation', title: '卫生违规提醒', content: '您的摊位卫生检查评分6分，请及时整改。', sendDate: '2026-06-14 10:05' },
  { id: 'r005', vendorId: 'v007', vendorName: '吴丽娟', type: 'license', title: '健康证到期提醒', content: '您的健康证将于2026-10-20到期，请提前办理。', sendDate: '2026-06-08 11:00', auditStatus: 'approved', auditRemark: '已提交新证，审核通过', auditDate: '2026-06-09 15:30' },
  { id: 'r006', vendorId: 'v001', vendorName: '张建国', type: 'payment', title: '费用缴纳提醒', content: '您有一笔待缴费用，请及时缴纳。', sendDate: '2026-05-28 09:00', auditStatus: 'approved', auditRemark: '已完成缴费', auditDate: '2026-05-28 14:20' },
];

export const mockReminders = _reminders;

export const getVendorById = (id: string): Vendor | undefined => {
  return _vendors.find(v => v.id === id);
};

export const getVendorsByStatus = (status: string): Vendor[] => {
  return _vendors.filter(v => v.auditStatus === status);
};

export const getVendorsByCategory = (category: string): Vendor[] => {
  return _vendors.filter(v => v.category === category);
};

export const getPendingVendors = (): Vendor[] => {
  return _vendors.filter(v => v.auditStatus === 'pending' || v.licenseStatus === 'pending');
};

export const getExpiringLicenses = (days: number = 30, vendorId?: string): Vendor[] => {
  const now = new Date('2026-06-14');
  const future = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  return _vendors.filter(v => {
    if (vendorId && v.id !== vendorId) return false;
    if (!v.licenseExpireDate) return false;
    const expireDate = new Date(v.licenseExpireDate);
    return expireDate >= now && expireDate <= future;
  });
};

export const getExpiringLeases = (days: number = 15): { vendor: Vendor; stall: import('@/types').Stall; daysLeft: number }[] => {
  const now = new Date('2026-06-14');
  const future = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  const result: { vendor: Vendor; stall: import('@/types').Stall; daysLeft: number }[] = [];
  const { mockStalls } = require('@/data/stalls');
  for (const stall of mockStalls) {
    if (!stall.leaseEnd || !stall.vendorId) continue;
    const endDate = new Date(stall.leaseEnd);
    const diff = Math.ceil((endDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
    if (diff >= 0 && diff <= days) {
      const vendor = _vendors.find(v => v.id === stall.vendorId);
      if (vendor) result.push({ vendor, stall, daysLeft: diff });
    }
  }
  return result.sort((a, b) => a.daysLeft - b.daysLeft);
};

export const getAllCategories = (): string[] => {
  return [...new Set(_vendors.map(v => v.category))];
};

export const updateVendor = (id: string, updates: Partial<Vendor>): boolean => {
  const idx = _vendors.findIndex(v => v.id === id);
  if (idx === -1) return false;
  const target = _vendors[idx];
  if (!target) return false;
  Object.assign(target, updates);
  return true;
};

export const setVendorRenewalStatus = (vendorId: string, status: 'none' | 'pending' | 'renewed' | 'changed', remindDate?: string): boolean => {
  const vendor = _vendors.find(v => v.id === vendorId);
  if (!vendor) return false;
  vendor.renewalStatus = status;
  if (remindDate) vendor.lastRemindDate = remindDate;
  return true;
};

export const getRemindersByVendor = (vendorId: string): Reminder[] => {
  return _reminders.filter(r => r.vendorId === vendorId).sort((a, b) => new Date(b.sendDate).getTime() - new Date(a.sendDate).getTime());
};

export const addReminder = (reminder: Omit<Reminder, 'id'>): Reminder => {
  const newId = 'r' + String(_reminders.length + 1).padStart(3, '0');
  const newReminder: Reminder = { ...reminder, id: newId };
  _reminders.unshift(newReminder);
  return newReminder;
};

export const updateReminder = (id: string, updates: Partial<Reminder>): boolean => {
  const reminder = _reminders.find(r => r.id === id);
  if (!reminder) return false;
  Object.assign(reminder, updates);
  return true;
};

export const getTimelineByVendor = (vendorId: string): import('@/types').TimelineEvent[] => {
  const events: import('@/types').TimelineEvent[] = [];
  const { getPaymentsByVendor } = require('@/data/payments');
  const { getInspectionsByVendor } = require('@/data/inspections');
  const { getStallsByVendor } = require('@/data/stalls');

  for (const r of _reminders.filter(r => r.vendorId === vendorId)) {
    const eventTypeMap: Record<string, import('@/types').TimelineEventType> = {
      license: 'license',
      lease: 'lease',
      violation: 'violation',
      payment: 'payment'
    };
    let statusText = '未处理';
    let statusType: 'success' | 'warning' | 'error' | 'info' = 'info';
    if (r.auditStatus === 'approved') {
      statusText = '已办结';
      statusType = 'success';
    } else if (r.auditStatus === 'rejected') {
      statusText = '已拒绝';
      statusType = 'error';
    } else if (r.auditStatus === 'pending') {
      statusText = '处理中';
      statusType = 'warning';
    }
    events.push({
      id: r.id,
      type: eventTypeMap[r.type] || 'license',
      title: r.title,
      description: r.content + (r.auditRemark ? `\n审核备注：${r.auditRemark}` : ''),
      date: r.sendDate,
      operator: r.operator || '管理员',
      status: statusText,
      statusType
    });
  }

  for (const p of getPaymentsByVendor(vendorId)) {
    let statusText = '待支付';
    let statusType: 'success' | 'warning' | 'error' | 'info' = 'warning';
    if (p.status === 'paid') {
      statusText = '已支付';
      statusType = 'success';
    } else if (p.status === 'refunded') {
      statusText = '已退款';
      statusType = 'info';
    } else if (p.status === 'refunding') {
      statusText = '退款中';
      statusType = 'warning';
    }
    events.push({
      id: 'pay_' + p.id,
      type: 'payment',
      title: `${p.period} 摊位费`,
      description: `摊位${p.stallNo} · ${p.period}`,
      date: p.payDate || p.createDate,
      operator: '系统',
      status: statusText,
      statusType,
      amount: p.amount
    });
  }

  for (const insp of getInspectionsByVendor(vendorId)) {
    const typeText = insp.type === 'absent' ? '缺席' : insp.type === 'occupying' ? '占道' : insp.type === 'unhygienic' ? '卫生' : '其他';
    let statusType: 'success' | 'warning' | 'error' | 'info' = 'warning';
    if (insp.type === 'unhygienic' && insp.hygieneScore && insp.hygieneScore >= 8) {
      statusType = 'success';
    } else if (insp.type === 'absent' || insp.type === 'occupying') {
      statusType = 'error';
    }
    events.push({
      id: 'insp_' + insp.id,
      type: 'violation',
      title: `巡场检查 - ${typeText}`,
      description: insp.description + (insp.hygieneScore !== undefined ? `\n卫生评分：${insp.hygieneScore}/10` : ''),
      date: insp.date,
      operator: insp.inspectorName,
      status: insp.hygieneScore !== undefined ? `评分${insp.hygieneScore}/10` : '已登记',
      statusType
    });
  }

  const vendor = getVendorById(vendorId);
  if (vendor) {
    events.push({
      id: 'audit_' + vendor.id,
      type: 'audit',
      title: '入驻申请审核',
      description: `经营品类：${vendor.category}` + (vendor.auditRemark ? `\n审核备注：${vendor.auditRemark}` : ''),
      date: vendor.applyDate,
      operator: '管理员',
      status: vendor.auditStatus === 'approved' ? '已通过' : vendor.auditStatus === 'pending' ? '审核中' : '已拒绝',
      statusType: vendor.auditStatus === 'approved' ? 'success' : vendor.auditStatus === 'pending' ? 'warning' : 'error'
    });

    if (vendor.renewalStatus === 'changed') {
      const stalls = getStallsByVendor(vendorId);
      if (stalls.length > 0) {
        events.push({
          id: 'change_' + vendor.id,
          type: 'position_change',
          title: '摊位调整',
          description: `已调整至摊位${stalls[0].stallNo}（${stalls[0].zone}区）`,
          date: vendor.lastRemindDate || NOW_DATE,
          operator: '管理员',
          status: '已完成',
          statusType: 'success'
        });
      }
    }
  }

  return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
