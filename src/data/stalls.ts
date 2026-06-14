import { Stall } from '@/types';

let _stalls: Stall[] = [
  { id: 's001', stallNo: 'A01', zone: 'A', row: 1, col: 1, width: 120, height: 100, status: 'rented', price: 120, vendorId: 'v001', vendorName: '张建国', category: '熟食小吃', leaseStart: '2026-06-01', leaseEnd: '2026-06-30' },
  { id: 's002', stallNo: 'A02', zone: 'A', row: 1, col: 2, width: 120, height: 100, status: 'rented', price: 120, vendorId: 'v002', vendorName: '李秀英', category: '水果零售', leaseStart: '2026-06-01', leaseEnd: '2026-06-30' },
  { id: 's003', stallNo: 'A03', zone: 'A', row: 1, col: 3, width: 120, height: 100, status: 'available', price: 120 },
  { id: 's004', stallNo: 'A04', zone: 'A', row: 1, col: 4, width: 120, height: 100, status: 'maintenance', price: 120 },
  { id: 's005', stallNo: 'A05', zone: 'A', row: 1, col: 5, width: 120, height: 100, status: 'rented', price: 120, vendorId: 'v003', vendorName: '王大伟', category: '服饰百货', leaseStart: '2026-06-05', leaseEnd: '2026-07-05' },
  { id: 's006', stallNo: 'A06', zone: 'A', row: 1, col: 6, width: 120, height: 100, status: 'available', price: 120 },
  { id: 's007', stallNo: 'B01', zone: 'B', row: 2, col: 1, width: 150, height: 120, status: 'rented', price: 180, vendorId: 'v004', vendorName: '赵美玲', category: '生鲜蔬菜', leaseStart: '2026-06-01', leaseEnd: '2026-06-30' },
  { id: 's008', stallNo: 'B02', zone: 'B', row: 2, col: 2, width: 150, height: 120, status: 'rented', price: 180, vendorId: 'v005', vendorName: '孙志强', category: '日用百货', leaseStart: '2026-06-03', leaseEnd: '2026-07-03' },
  { id: 's009', stallNo: 'B03', zone: 'B', row: 2, col: 3, width: 150, height: 120, status: 'available', price: 180 },
  { id: 's010', stallNo: 'B04', zone: 'B', row: 2, col: 4, width: 150, height: 120, status: 'occupied', price: 180, vendorId: 'v006', vendorName: '周文华', category: '早餐早点' },
  { id: 's011', stallNo: 'B05', zone: 'B', row: 2, col: 5, width: 150, height: 120, status: 'rented', price: 180, vendorId: 'v007', vendorName: '吴丽娟', category: '手工艺品', leaseStart: '2026-06-10', leaseEnd: '2026-07-10' },
  { id: 's012', stallNo: 'B06', zone: 'B', row: 2, col: 6, width: 150, height: 120, status: 'available', price: 180 },
  { id: 's013', stallNo: 'C01', zone: 'C', row: 3, col: 1, width: 100, height: 100, status: 'rented', price: 100, vendorId: 'v008', vendorName: '郑海涛', category: '冰饮奶茶', leaseStart: '2026-06-01', leaseEnd: '2026-08-31' },
  { id: 's014', stallNo: 'C02', zone: 'C', row: 3, col: 2, width: 100, height: 100, status: 'rented', price: 100, vendorId: 'v009', vendorName: '陈小红', category: '鲜花绿植', leaseStart: '2026-06-08', leaseEnd: '2026-07-08' },
  { id: 's015', stallNo: 'C03', zone: 'C', row: 3, col: 3, width: 100, height: 100, status: 'available', price: 100 },
  { id: 's016', stallNo: 'C04', zone: 'C', row: 3, col: 4, width: 100, height: 100, status: 'available', price: 100 },
  { id: 's017', stallNo: 'C05', zone: 'C', row: 3, col: 5, width: 100, height: 100, status: 'maintenance', price: 100 },
  { id: 's018', stallNo: 'C06', zone: 'C', row: 3, col: 6, width: 100, height: 100, status: 'rented', price: 100, vendorId: 'v010', vendorName: '黄志明', category: '玩具饰品', leaseStart: '2026-06-01', leaseEnd: '2026-06-30' },
];

export const mockStalls = _stalls;

export const getStallById = (id: string): Stall | undefined => {
  return _stalls.find(s => s.id === id);
};

export const getStallsByZone = (zone: string): Stall[] => {
  return _stalls.filter(s => s.zone === zone);
};

export const getStallsByStatus = (status: string): Stall[] => {
  return _stalls.filter(s => s.status === status);
};

export const getStallsByVendor = (vendorId: string): Stall[] => {
  return _stalls.filter(s => s.vendorId === vendorId);
};

export const updateStall = (id: string, updates: Partial<Stall>): boolean => {
  const stall = _stalls.find(s => s.id === id);
  if (!stall) return false;
  Object.assign(stall, updates);
  return true;
};

export const extendStallLease = (stallId: string, months: number = 1): boolean => {
  const stall = _stalls.find(s => s.id === stallId);
  if (!stall || !stall.leaseEnd) return false;
  const endDate = new Date(stall.leaseEnd);
  endDate.setMonth(endDate.getMonth() + months);
  const year = endDate.getFullYear();
  const month = String(endDate.getMonth() + 1).padStart(2, '0');
  const day = String(endDate.getDate()).padStart(2, '0');
  stall.leaseEnd = `${year}-${month}-${day}`;
  return true;
};

export const changeStallVendor = (oldStallId: string, newStallId: string): boolean => {
  const oldStall = _stalls.find(s => s.id === oldStallId);
  const newStall = _stalls.find(s => s.id === newStallId);
  if (!oldStall || !newStall || !oldStall.vendorId) return false;
  if (newStall.status !== 'available') return false;

  const vendorId = oldStall.vendorId;
  const vendorName = oldStall.vendorName;
  const category = oldStall.category;
  const leaseStart = oldStall.leaseStart;
  const leaseEnd = oldStall.leaseEnd;

  newStall.vendorId = vendorId;
  newStall.vendorName = vendorName;
  newStall.category = category;
  newStall.leaseStart = leaseStart;
  newStall.leaseEnd = leaseEnd;
  newStall.status = 'rented';

  oldStall.vendorId = undefined;
  oldStall.vendorName = undefined;
  oldStall.category = undefined;
  oldStall.leaseStart = undefined;
  oldStall.leaseEnd = undefined;
  oldStall.status = 'available';

  return true;
};
