import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import RoleSwitcher from '@/components/RoleSwitcher';
import StatusTag from '@/components/StatusTag';
import { useUser } from '@/store/user-context';
import { mockStalls, extendStallLease, updateStall } from '@/data/stalls';
import {
  mockVendors,
  getExpiringLicenses,
  getPendingVendors,
  getExpiringLeases,
  getAllCategories,
  setVendorRenewalStatus,
  addReminder,
  updateVendor
} from '@/data/vendors';
import { mockPayments, getMonthRevenue, getTodayRevenue } from '@/data/payments';
import { Vendor } from '@/types';
import styles from './index.module.scss';

type TabType = 'overview' | 'vendors' | 'lease';

const NOW_DATE = '2026-06-14';
const NOW_TIME = '2026-06-14 10:30';

const getStallZone = (vendor: Vendor): string => {
  if (!vendor.stallId) return '-';
  const stall = mockStalls.find(s => s.id === vendor.stallId);
  return stall ? stall.zone : '-';
};

const getStallNoSafe = (vendor: Vendor): string => {
  return vendor.stallNo || '未分配';
};

const getStatusText = (status: string): string => {
  return status === 'approved' ? '已通过' : status === 'pending' ? '审核中' : '已拒绝';
};

const StatsPage: React.FC = () => {
  const { currentUser } = useUser();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [zoneFilter, setZoneFilter] = useState<string>('all');
  const [showExportModal, setShowExportModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const stats = useMemo(() => ({
    totalStalls: mockStalls.length,
    rentedStalls: mockStalls.filter(s => s.status === 'rented').length,
    availableStalls: mockStalls.filter(s => s.status === 'available').length,
    todayRevenue: getTodayRevenue() || 7200,
    monthRevenue: getMonthRevenue() || 45800,
    activeVendors: mockVendors.filter(v => v.auditStatus === 'approved').length,
    expiringLicenses: getExpiringLicenses(30).length,
    pendingAudits: getPendingVendors().length
  }), [refreshKey]);

  const categories = useMemo(() => getAllCategories(), [refreshKey]);
  const zones = useMemo(() => [...new Set(mockStalls.map(s => s.zone))], []);
  const expiringLeases = useMemo(() => getExpiringLeases(30), [refreshKey]);

  const filteredVendors = useMemo(() => {
    let list = mockVendors;
    if (statusFilter !== 'all') list = list.filter(v => v.auditStatus === statusFilter);
    if (categoryFilter !== 'all') list = list.filter(v => v.category === categoryFilter);
    if (zoneFilter !== 'all') {
      const zoneStallIds = mockStalls.filter(s => s.zone === zoneFilter && s.vendorId).map(s => s.vendorId);
      list = list.filter(v => zoneStallIds.includes(v.id));
    }
    return list;
  }, [statusFilter, categoryFilter, zoneFilter, refreshKey]);

  const recentPayments = useMemo(() => mockPayments.slice(0, 4), [refreshKey]);

  const triggerRefresh = () => {
    setRefreshKey(k => k + 1);
  };

  const handleExport = () => {
    console.log('[StatsPage] 导出摊主名单', filteredVendors.length, '条');
    setShowExportModal(true);
  };

  const handleSendRenewal = (vendorId: string, vendorName: string, stallId: string, stallNo: string) => {
    console.log('[StatsPage] 发送续租提醒:', vendorId);
    Taro.showModal({
      title: '发送续租提醒',
      content: `确认向 ${vendorName}（摊位${stallNo}）发送续租提醒？`,
      success: (res) => {
        if (res.confirm) {
          setVendorRenewalStatus(vendorId, 'pending', NOW_DATE);
          const stall = mockStalls.find(s => s.id === stallId);
          addReminder({
            vendorId,
            vendorName,
            type: 'lease',
            title: '摊位租期到期提醒',
            content: `您的摊位${stallNo}租期将于${stall?.leaseEnd || ''}到期，请及时办理续租手续。`,
            sendDate: NOW_TIME,
            auditStatus: 'pending',
            auditRemark: '待确认是否续租'
          });
          triggerRefresh();
          Taro.showToast({ title: '提醒已发送', icon: 'success' });
        }
      }
    });
  };

  const handleRegisterRenewal = (vendorId: string, vendorName: string, stallId: string, stallNo: string) => {
    console.log('[StatsPage] 登记续租:', vendorId);
    Taro.showModal({
      title: '登记续租',
      content: `确认为 ${vendorName} 登记续租1个月？租期将自动延长。`,
      success: (res) => {
        if (res.confirm) {
          const stall = mockStalls.find(s => s.id === stallId);
          const oldEnd = stall?.leaseEnd;
          extendStallLease(stallId, 1);
          setVendorRenewalStatus(vendorId, 'renewed');
          updateVendor(vendorId, { lastRenewDate: NOW_DATE });
          const updatedStall = mockStalls.find(s => s.id === stallId);
          addReminder({
            vendorId,
            vendorName,
            type: 'lease',
            title: '摊位续租成功',
            content: `您的摊位${stallNo}续租1个月已登记。原租期至${oldEnd || ''}，已延长至${updatedStall?.leaseEnd || ''}。`,
            sendDate: NOW_TIME,
            auditStatus: 'approved',
            auditDate: NOW_TIME,
            auditRemark: '续租手续已完成',
            operator: currentUser.name
          });
          triggerRefresh();
          Taro.showToast({ title: '续租已登记', icon: 'success' });
        }
      }
    });
  };

  const handleRegisterChange = (vendorId: string, vendorName: string, stallNo: string) => {
    console.log('[StatsPage] 登记换位:', vendorId);
    const availableStalls = mockStalls.filter(s => s.status === 'available');
    if (availableStalls.length === 0) {
      Taro.showToast({ title: '暂无空摊位可调', icon: 'none' });
      return;
    }
    Taro.showActionSheet({
      itemList: availableStalls.map(s => `摊位${s.stallNo} · ${s.zone}区 · ¥${s.price}/月`),
      success: (res) => {
        const targetStall = availableStalls[res.tapIndex];
        if (!targetStall) return;
        Taro.showModal({
          title: '确认换位',
          content: `确认将 ${vendorName} 从摊位${stallNo} 调整至摊位${targetStall.stallNo}？`,
          success: (modalRes) => {
            if (modalRes.confirm) {
              const oldStall = mockStalls.find(s => s.vendorId === vendorId);
              if (!oldStall) {
                Taro.showToast({ title: '未找到原摊位', icon: 'none' });
                return;
              }

              updateStall(targetStall.id, {
                vendorId: oldStall.vendorId,
                vendorName: oldStall.vendorName,
                category: oldStall.category,
                leaseStart: oldStall.leaseStart,
                leaseEnd: oldStall.leaseEnd,
                status: 'rented'
              });

              updateStall(oldStall.id, {
                vendorId: undefined,
                vendorName: undefined,
                category: undefined,
                leaseStart: undefined,
                leaseEnd: undefined,
                status: 'available'
              });

              updateVendor(vendorId, {
                stallId: targetStall.id,
                stallNo: targetStall.stallNo,
                renewalStatus: 'changed',
                lastChangeDate: NOW_TIME
              });

              addReminder({
                vendorId,
                vendorName,
                type: 'lease',
                title: '摊位调整通知',
                content: `您的摊位已完成调整，从摊位${stallNo}调换至摊位${targetStall.stallNo}（${targetStall.zone}区），请按新位置布摊。`,
                sendDate: NOW_TIME,
                auditStatus: 'approved',
                auditDate: NOW_TIME,
                auditRemark: '换位手续已完成',
                operator: currentUser.name
              });

              triggerRefresh();
              Taro.showToast({ title: '换位已登记', icon: 'success' });
            }
          }
        });
      }
    });
  };

  const goToVendorDetail = (vendorId: string) => {
    Taro.navigateTo({ url: '/pages/vendor-detail/index?id=' + vendorId });
  };

  const tabs: { key: TabType; label: string }[] = [
    { key: 'overview', label: '数据概览' },
    { key: 'vendors', label: '摊主名单' },
    { key: 'lease', label: '租期管理' }
  ];

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.headerTitle}>经营中心</Text>
        <Text className={styles.headerSub}>数据概览与经营管理</Text>
        <View className={styles.revenueCard}>
          <Text className={styles.revenueLabel}>本月收入</Text>
          <View className={styles.revenueAmount}>
            ¥{stats.monthRevenue.toLocaleString()}
            <Text className={styles.revenueUnit}>元</Text>
          </View>
          <View className={styles.revenueRow}>
            <View className={styles.revenueItem}>
              <Text className={styles.revenueItemLabel}>今日收入</Text>
              <Text className={styles.revenueItemValue}>¥{stats.todayRevenue.toLocaleString()}</Text>
            </View>
            <View className={styles.revenueItem}>
              <Text className={styles.revenueItemLabel}>出租率</Text>
              <Text className={styles.revenueItemValue}>
                {Math.round(stats.rentedStalls / stats.totalStalls * 100)}%
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View className={styles.content}>
        <RoleSwitcher />

        <View className={styles.tabBar}>
          {tabs.map(tab => (
            <View
              key={tab.key}
              className={classnames(styles.tabItem, activeTab === tab.key && styles.tabItemActive)}
              onClick={() => setActiveTab(tab.key)}
            >
              <Text className={classnames(styles.tabText, activeTab === tab.key && styles.tabTextActive)}>
                {tab.label}
              </Text>
            </View>
          ))}
        </View>

        {activeTab === 'overview' && (
          <>
            <View className={styles.statsGrid}>
              <View className={classnames(styles.statCard, styles.colorPrimary)}>
                <Text className={styles.statValue}>{stats.totalStalls}<Text className={styles.statUnit}>个</Text></Text>
                <Text className={styles.statLabel}>总摊位</Text>
              </View>
              <View className={classnames(styles.statCard, styles.colorSuccess)}>
                <Text className={styles.statValue}>{stats.rentedStalls}<Text className={styles.statUnit}>个</Text></Text>
                <Text className={styles.statLabel}>已出租</Text>
              </View>
              <View className={classnames(styles.statCard, styles.colorWarning)}>
                <Text className={styles.statValue}>{stats.pendingAudits}<Text className={styles.statUnit}>个</Text></Text>
                <Text className={styles.statLabel}>待审核</Text>
              </View>
              <View className={classnames(styles.statCard, styles.colorError)}>
                <Text className={styles.statValue}>{stats.expiringLicenses}<Text className={styles.statUnit}>个</Text></Text>
                <Text className={styles.statLabel}>证照到期</Text>
              </View>
            </View>

            {expiringLeases.length > 0 && (
              <View className={styles.card}>
                <View className={styles.sectionHeader}>
                  <View className={styles.sectionTitle}>
                    <View className={styles.titleBar} />
                    <Text>租期即将到期</Text>
                  </View>
                  <Text className={styles.moreBtn} onClick={() => setActiveTab('lease')}>查看全部</Text>
                </View>
                {expiringLeases.slice(0, 3).map(item => (
                  <View key={item.stall.id} className={styles.leaseItem} onClick={() => goToVendorDetail(item.vendor.id)}>
                    <View className={styles.leaseLeft}>
                      <Text className={styles.leaseVendor}>{item.vendor.name}</Text>
                      <Text className={styles.leaseStall}>摊位{item.stall.stallNo} · {item.stall.zone}区 | 到期：{item.stall.leaseEnd}</Text>
                    </View>
                    <StatusTag
                      text={item.daysLeft <= 3 ? `${item.daysLeft}天后到期` : `${item.daysLeft}天`}
                      type={item.daysLeft <= 3 ? 'error' : item.daysLeft <= 7 ? 'warning' : 'info'}
                      size="sm"
                    />
                  </View>
                ))}
              </View>
            )}

            <View className={styles.card}>
              <View className={styles.sectionHeader}>
                <View className={styles.sectionTitle}>
                  <View className={styles.titleBar} />
                  <Text>最近缴费</Text>
                </View>
                <Text className={styles.moreBtn} onClick={() => Taro.navigateTo({ url: '/pages/payment/index' })}>查看全部</Text>
              </View>
              {recentPayments.map(payment => (
                <View key={payment.id} className={styles.listItem}>
                  <View className={styles.listLeft}>
                    <Text className={styles.listTitle}>{payment.vendorName} · 摊位{payment.stallNo}</Text>
                    <Text className={styles.listSub}>{payment.period}</Text>
                  </View>
                  <View className={styles.listRight}>
                    <Text className={styles.listAmount}>¥{payment.amount.toLocaleString()}</Text>
                    <View className={styles.listStatus}>
                      <StatusTag
                        text={payment.status === 'paid' ? '已支付' : payment.status === 'unpaid' ? '待支付' : payment.status === 'refunding' ? '退款中' : '已退款'}
                        type={payment.status === 'paid' ? 'success' : payment.status === 'unpaid' ? 'warning' : payment.status === 'refunding' ? 'info' : 'error'}
                        size="sm"
                      />
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}

        {activeTab === 'vendors' && (
          <>
            <View className={styles.card}>
              <View className={styles.filterRow}>
                <View className={styles.filterItem}>
                  <Text className={styles.filterLabel}>状态</Text>
                  <View className={styles.filterOptions}>
                    {[{ k: 'all', l: '全部' }, { k: 'approved', l: '已通过' }, { k: 'pending', l: '审核中' }, { k: 'rejected', l: '已拒绝' }].map(o => (
                      <View
                        key={o.k}
                        className={classnames(styles.filterOpt, statusFilter === o.k && styles.filterOptActive)}
                        onClick={() => setStatusFilter(o.k)}
                      >
                        <Text className={classnames(styles.filterOptText, statusFilter === o.k && styles.filterOptTextActive)}>{o.l}</Text>
                      </View>
                    ))}
                  </View>
                </View>
                <View className={styles.filterItem}>
                  <Text className={styles.filterLabel}>品类</Text>
                  <View className={styles.filterScroll}>
                    <View
                      className={classnames(styles.filterOpt, categoryFilter === 'all' && styles.filterOptActive)}
                      onClick={() => setCategoryFilter('all')}
                    >
                      <Text className={classnames(styles.filterOptText, categoryFilter === 'all' && styles.filterOptTextActive)}>全部</Text>
                    </View>
                    {categories.map(c => (
                      <View
                        key={c}
                        className={classnames(styles.filterOpt, categoryFilter === c && styles.filterOptActive)}
                        onClick={() => setCategoryFilter(c)}
                      >
                        <Text className={classnames(styles.filterOptText, categoryFilter === c && styles.filterOptTextActive)}>{c}</Text>
                      </View>
                    ))}
                  </View>
                </View>
                <View className={styles.filterItem}>
                  <Text className={styles.filterLabel}>区域</Text>
                  <View className={styles.filterOptions}>
                    {[{ k: 'all', l: '全部' }, ...zones.map(z => ({ k: z, l: z + '区' }))].map(o => (
                      <View
                        key={o.k}
                        className={classnames(styles.filterOpt, zoneFilter === o.k && styles.filterOptActive)}
                        onClick={() => setZoneFilter(o.k)}
                      >
                        <Text className={classnames(styles.filterOptText, zoneFilter === o.k && styles.filterOptTextActive)}>{o.l}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </View>

            <View className={styles.card}>
              <View className={styles.sectionHeader}>
                <View className={styles.sectionTitle}>
                  <View className={styles.titleBar} />
                  <Text>摊主名单</Text>
                  <Text className={styles.countTag}>{filteredVendors.length}人</Text>
                </View>
                <View className={styles.exportBtn} onClick={handleExport}>
                  <Text className={styles.exportBtnText}>📤 导出</Text>
                </View>
              </View>
              {filteredVendors.length === 0 ? (
                <View className={styles.emptyState}>
                  <Text className={styles.emptyText}>暂无匹配的摊主</Text>
                </View>
              ) : (
                filteredVendors.map(vendor => (
                  <View key={vendor.id} className={styles.vendorItem} onClick={() => goToVendorDetail(vendor.id)}>
                    <View className={styles.vendorAvatar}>
                      <Text className={styles.vendorAvatarText}>{vendor.name.charAt(0)}</Text>
                    </View>
                    <View className={styles.vendorInfo}>
                      <View className={styles.vendorNameRow}>
                        <Text className={styles.vendorName}>{vendor.name}</Text>
                        <StatusTag
                          text={vendor.auditStatus === 'approved' ? '已通过' : vendor.auditStatus === 'pending' ? '审核中' : '已拒绝'}
                          type={vendor.auditStatus === 'approved' ? 'success' : vendor.auditStatus === 'pending' ? 'warning' : 'error'}
                          size="sm"
                        />
                      </View>
                      <Text className={styles.vendorMeta}>
                        {vendor.stallNo ? `摊位${vendor.stallNo}` : '未分配'} | {vendor.category} | {vendor.phone}
                      </Text>
                    </View>
                    <Text className={styles.vendorArrow}>›</Text>
                  </View>
                ))
              )}
            </View>
          </>
        )}

        {activeTab === 'lease' && (
          <View className={styles.card}>
            <View className={styles.sectionHeader}>
              <View className={styles.sectionTitle}>
                <View className={styles.titleBar} />
                <Text>租期管理</Text>
              </View>
            </View>
            {expiringLeases.length === 0 ? (
              <View className={styles.emptyState}>
                <Text className={styles.emptyText}>暂无即将到期的租约</Text>
              </View>
            ) : (
              expiringLeases.map(item => (
                <View key={item.stall.id + '_' + refreshKey} className={styles.leaseCard}>
                  <View className={styles.leaseCardHeader}>
                    <View className={styles.leaseCardLeft}>
                      <Text className={styles.leaseCardVendor}>{item.vendor.name}</Text>
                      <Text className={styles.leaseCardStall}>摊位{item.stall.stallNo} · {item.stall.zone}区</Text>
                    </View>
                    <StatusTag
                      text={item.daysLeft <= 3 ? '即将到期' : item.daysLeft <= 7 ? '临近到期' : '待续租'}
                      type={item.daysLeft <= 3 ? 'error' : item.daysLeft <= 7 ? 'warning' : 'info'}
                      size="sm"
                    />
                  </View>
                  <View className={styles.leaseCardInfo}>
                    <View className={styles.leaseInfoItem}>
                      <Text className={styles.leaseInfoLabel}>租期</Text>
                      <Text className={styles.leaseInfoValue}>{item.stall.leaseStart} ~ {item.stall.leaseEnd}</Text>
                    </View>
                    <View className={styles.leaseInfoItem}>
                      <Text className={styles.leaseInfoLabel}>剩余天数</Text>
                      <Text className={classnames(styles.leaseInfoValue, item.daysLeft <= 3 && styles.textError)}>{item.daysLeft}天</Text>
                    </View>
                    <View className={styles.leaseInfoItem}>
                      <Text className={styles.leaseInfoLabel}>续租状态</Text>
                      <Text className={styles.leaseInfoValue}>
                        {item.vendor.renewalStatus === 'renewed' ? '已续租' : item.vendor.renewalStatus === 'pending' ? '待续租' : item.vendor.renewalStatus === 'changed' ? '已换位' : '未处理'}
                      </Text>
                    </View>
                  </View>
                  <View className={styles.leaseCardActions}>
                    <View
                      className={styles.leaseActionBtn}
                      onClick={() => handleSendRenewal(item.vendor.id, item.vendor.name, item.stall.id, item.stall.stallNo)}
                    >
                      <Text className={styles.leaseActionText}>发送提醒</Text>
                    </View>
                    <View
                      className={classnames(styles.leaseActionBtn, styles.leaseActionPrimary)}
                      onClick={() => handleRegisterRenewal(item.vendor.id, item.vendor.name, item.stall.id, item.stall.stallNo)}
                    >
                      <Text className={classnames(styles.leaseActionText, styles.leaseActionTextPrimary)}>登记续租</Text>
                    </View>
                    <View
                      className={classnames(styles.leaseActionBtn, styles.leaseActionSuccess)}
                      onClick={() => handleRegisterChange(item.vendor.id, item.vendor.name, item.stall.stallNo)}
                    >
                      <Text className={classnames(styles.leaseActionText, styles.leaseActionTextSuccess)}>换位</Text>
                    </View>
                  </View>
                </View>
              ))
            )}
            <View className={styles.leaseSummary}>
              <Text className={styles.leaseSummaryText}>
                共 {expiringLeases.length} 个摊位将在30天内到期
              </Text>
            </View>
          </View>
        )}
      </View>

      {showExportModal && (
        <View className={styles.modalOverlay} onClick={() => setShowExportModal(false)}>
          <View className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <View className={styles.modalHeader}>
              <Text className={styles.modalTitle}>导出摊主名单</Text>
              <Text className={styles.modalClose} onClick={() => setShowExportModal(false)}>×</Text>
            </View>
            <View className={styles.modalSubtitle}>
              共 {filteredVendors.length} 条记录 · 含状态/品类/区域/摊位号
            </View>
            <ScrollView scrollY className={styles.exportScroll}>
              <View className={styles.exportTable}>
                <View className={styles.exportHeaderRow}>
                  <Text className={styles.exportCellHeader}>姓名</Text>
                  <Text className={styles.exportCellHeader}>电话</Text>
                  <Text className={styles.exportCellHeader}>摊位</Text>
                  <Text className={styles.exportCellHeader}>区域</Text>
                  <Text className={styles.exportCellHeader}>品类</Text>
                  <Text className={styles.exportCellHeader}>状态</Text>
                </View>
                {filteredVendors.map((vendor, idx) => (
                  <View key={vendor.id} className={classnames(styles.exportRow, idx % 2 === 1 && styles.exportRowAlt)}>
                    <Text className={styles.exportCell}>{vendor.name}</Text>
                    <Text className={styles.exportCell}>{vendor.phone}</Text>
                    <Text className={styles.exportCell}>{getStallNoSafe(vendor)}</Text>
                    <Text className={styles.exportCell}>{getStallZone(vendor)}区</Text>
                    <Text className={styles.exportCell}>{vendor.category}</Text>
                    <Text className={styles.exportCell}>
                      <StatusTag
                        text={getStatusText(vendor.auditStatus)}
                        type={vendor.auditStatus === 'approved' ? 'success' : vendor.auditStatus === 'pending' ? 'warning' : 'error'}
                        size="sm"
                      />
                    </Text>
                  </View>
                ))}
              </View>
            </ScrollView>
            <View className={styles.modalFooter}>
              <View className={styles.modalBtnSecondary} onClick={() => setShowExportModal(false)}>
                <Text>取消</Text>
              </View>
              <View className={styles.modalBtnPrimary} onClick={() => {
                Taro.showToast({ title: '名单已导出', icon: 'success' });
                setShowExportModal(false);
              }}>
                <Text>确认导出</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default StatsPage;
