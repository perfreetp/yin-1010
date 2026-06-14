import { Vendor } from '@/types';

export const mockVendors: Vendor[] = [
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

export const getVendorById = (id: string): Vendor | undefined => {
  return mockVendors.find(v => v.id === id);
};

export const getVendorsByStatus = (status: string): Vendor[] => {
  return mockVendors.filter(v => v.auditStatus === status);
};

export const getVendorsByCategory = (category: string): Vendor[] => {
  return mockVendors.filter(v => v.category === category);
};

export const getPendingVendors = (): Vendor[] => {
  return mockVendors.filter(v => v.auditStatus === 'pending' || v.licenseStatus === 'pending');
};

export const getExpiringLicenses = (days: number = 30, vendorId?: string): Vendor[] => {
  const now = new Date('2026-06-14');
  const future = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  return mockVendors.filter(v => {
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
      const vendor = mockVendors.find(v => v.id === stall.vendorId);
      if (vendor) result.push({ vendor, stall, daysLeft: diff });
    }
  }
  return result.sort((a, b) => a.daysLeft - b.daysLeft);
};

export const getAllCategories = (): string[] => {
  return [...new Set(mockVendors.map(v => v.category))];
};
