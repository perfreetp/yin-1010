import { Notice } from '@/types';

export const mockNotices: Notice[] = [
  { id: 'n001', title: '关于6月20日市场临时停市的通知', type: 'market_close', content: '各位摊主：因市场基础设施维护检修，定于2026年6月20日（周六）临时停市一天，6月21日正常开市。请各位摊主提前做好准备，给您带来的不便敬请谅解。\n\n集市管理处\n2026年6月14日', publisher: '市场管理处', publishDate: '2026-06-14 09:30', isTop: true },
  { id: 'n002', title: 'B区摊位调整通知', type: 'stall_change', content: '各位摊主：为优化市场布局，B03、B04号摊位将进行位置调整。涉及摊主请于6月18日前到管理处办理相关手续。调整后摊位租金保持不变。\n\n集市管理处\n2026年6月12日', publisher: '市场管理处', publishDate: '2026-06-12 14:20', isTop: true },
  { id: 'n003', title: '夏季食品安全检查通知', type: 'general', content: '各位摊主：夏季高温来临，请各位食品经营摊主严格遵守食品安全规范，做好食材保鲜和卫生清洁工作。市场管理处将于下周开展专项检查，发现问题将按规定处理。', publisher: '市场管理处', publishDate: '2026-06-10 10:00', isTop: false },
  { id: 'n004', title: '关于开展优秀摊主评选活动的通知', type: 'general', content: '为提升市场整体经营水平，现开展月度"优秀摊主"评选活动。评选标准包括：环境卫生、合规经营、服务态度等方面。获奖摊主将获得租金减免奖励。欢迎大家积极参与！', publisher: '市场管理处', publishDate: '2026-06-08 16:45', isTop: false },
  { id: 'n005', title: '雨季防汛通知', type: 'general', content: '近期进入雨季，请各位摊主注意摊位防雨措施，及时清理排水通道，防止雨水倒灌。如遇紧急情况请联系市场管理人员。', publisher: '市场管理处', publishDate: '2026-06-05 11:30', isTop: false },
];

export const getNoticeById = (id: string): Notice | undefined => {
  return mockNotices.find(n => n.id === id);
};

export const getTopNotices = (): Notice[] => {
  return mockNotices.filter(n => n.isTop);
};
