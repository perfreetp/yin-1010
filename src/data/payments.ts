import { Payment } from '@/types';

export const mockPayments: Payment[] = [
  { id: 'p001', vendorId: 'v001', vendorName: '张建国', stallId: 's001', stallNo: 'A01', amount: 3600, period: '2026年6月', status: 'paid', payDate: '2026-05-25', createDate: '2026-05-20' },
  { id: 'p002', vendorId: 'v002', vendorName: '李秀英', stallId: 's002', stallNo: 'A02', amount: 3600, period: '2026年6月', status: 'paid', payDate: '2026-05-26', createDate: '2026-05-22' },
  { id: 'p003', vendorId: 'v003', vendorName: '王大伟', stallId: 's005', stallNo: 'A05', amount: 3600, period: '2026年6月', status: 'paid', payDate: '2026-06-03', createDate: '2026-06-01' },
  { id: 'p004', vendorId: 'v004', vendorName: '赵美玲', stallId: 's007', stallNo: 'B01', amount: 5400, period: '2026年6月', status: 'paid', payDate: '2026-05-20', createDate: '2026-05-15' },
  { id: 'p005', vendorId: 'v005', vendorName: '孙志强', stallId: 's008', stallNo: 'B02', amount: 5400, period: '2026年6月', status: 'paid', payDate: '2026-06-01', createDate: '2026-05-28' },
  { id: 'p006', vendorId: 'v006', vendorName: '周文华', stallId: 's010', stallNo: 'B04', amount: 5400, period: '2026年6月', status: 'unpaid', createDate: '2026-06-10' },
  { id: 'p007', vendorId: 'v007', vendorName: '吴丽娟', stallId: 's011', stallNo: 'B05', amount: 5400, period: '2026年6月', status: 'paid', payDate: '2026-06-08', createDate: '2026-06-05' },
  { id: 'p008', vendorId: 'v008', vendorName: '郑海涛', stallId: 's013', stallNo: 'C01', amount: 9000, period: '2026年6-8月', status: 'paid', payDate: '2026-05-15', createDate: '2026-05-10' },
  { id: 'p009', vendorId: 'v009', vendorName: '陈小红', stallId: 's014', stallNo: 'C02', amount: 3000, period: '2026年6月', status: 'paid', payDate: '2026-06-05', createDate: '2026-06-02' },
  { id: 'p010', vendorId: 'v010', vendorName: '黄志明', stallId: 's018', stallNo: 'C06', amount: 3000, period: '2026年6月', status: 'refunding', refundReason: '个人原因提前退租', createDate: '2026-06-12' },
  { id: 'p011', vendorId: 'v006', vendorName: '周文华', stallId: 's010', stallNo: 'B04', amount: 1800, period: '2026年6月上旬', status: 'paid', payDate: '2026-06-11', createDate: '2026-06-10' },
  { id: 'p012', vendorId: 'v001', vendorName: '张建国', stallId: 's001', stallNo: 'A01', amount: 3600, period: '2026年5月', status: 'paid', payDate: '2026-04-28', createDate: '2026-04-20' },
];

export const getPaymentById = (id: string): Payment | undefined => {
  return mockPayments.find(p => p.id === id);
};

export const getPaymentsByVendor = (vendorId: string): Payment[] => {
  return mockPayments.filter(p => p.vendorId === vendorId);
};

export const getPaymentsByStatus = (status: string): Payment[] => {
  return mockPayments.filter(p => p.status === status);
};

export const getTodayRevenue = (): number => {
  return mockPayments
    .filter(p => p.payDate === '2026-06-14' && p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);
};

export const getMonthRevenue = (): number => {
  return mockPayments
    .filter(p => p.payDate?.startsWith('2026-06') && p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);
};
