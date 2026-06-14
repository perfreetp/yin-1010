import { Inspection } from '@/types';

export const mockInspections: Inspection[] = [
  { id: 'i001', inspectorId: 'p001', inspectorName: '李巡查', stallId: 's010', stallNo: 'B04', vendorId: 'v006', vendorName: '周文华', type: 'absent', description: '摊主未按时到岗，摊位空置超过2小时', photos: ['https://picsum.photos/id/8/300/200'], date: '2026-06-14 08:30' },
  { id: 'i002', inspectorId: 'p001', inspectorName: '李巡查', stallId: 's007', stallNo: 'B01', vendorId: 'v004', vendorName: '赵美玲', type: 'occupying', description: '占道经营，物品超出摊位范围约0.5米', photos: ['https://picsum.photos/id/9/300/200', 'https://picsum.photos/id/119/300/200'], date: '2026-06-14 09:15' },
  { id: 'i003', inspectorId: 'p002', inspectorName: '王巡查', stallId: 's001', stallNo: 'A01', vendorId: 'v001', vendorName: '张建国', type: 'unhygienic', description: '摊位周边有垃圾堆放，清洁不到位', hygieneScore: 6, photos: ['https://picsum.photos/id/160/300/200'], date: '2026-06-14 10:00' },
  { id: 'i004', inspectorId: 'p001', inspectorName: '李巡查', stallId: 's013', stallNo: 'C01', vendorId: 'v008', vendorName: '郑海涛', type: 'unhygienic', description: '卫生情况良好', hygieneScore: 9, date: '2026-06-14 10:30' },
  { id: 'i005', inspectorId: 'p002', inspectorName: '王巡查', stallId: 's002', stallNo: 'A02', vendorId: 'v002', vendorName: '李秀英', type: 'unhygienic', description: '摊位整洁，物品摆放有序', hygieneScore: 10, date: '2026-06-14 11:00' },
  { id: 'i006', inspectorId: 'p001', inspectorName: '李巡查', stallId: 's018', stallNo: 'C06', vendorId: 'v010', vendorName: '黄志明', type: 'other', description: '营业执照未在醒目位置公示', date: '2026-06-13 15:20' },
  { id: 'i007', inspectorId: 'p002', inspectorName: '王巡查', stallId: 's005', stallNo: 'A05', vendorId: 'v003', vendorName: '王大伟', type: 'unhygienic', description: '地面有污渍需要清理', hygieneScore: 7, date: '2026-06-13 14:00' },
  { id: 'i008', inspectorId: 'p001', inspectorName: '李巡查', stallId: 's008', stallNo: 'B02', vendorId: 'v005', vendorName: '孙志强', type: 'unhygienic', description: '卫生状况良好', hygieneScore: 9, date: '2026-06-13 10:45' },
];

export const getInspectionById = (id: string): Inspection | undefined => {
  return mockInspections.find(i => i.id === id);
};

export const getInspectionsByStall = (stallId: string): Inspection[] => {
  return mockInspections.filter(i => i.stallId === stallId);
};

export const getInspectionsByVendor = (vendorId: string): Inspection[] => {
  return mockInspections.filter(i => i.vendorId === vendorId);
};

export const getTodayInspections = (): Inspection[] => {
  return mockInspections.filter(i => i.date.startsWith('2026-06-14'));
};
