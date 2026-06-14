import React, { useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import RoleSwitcher from '@/components/RoleSwitcher';
import StatusTag from '@/components/StatusTag';
import { mockStalls } from '@/data/stalls';
import { mockVendors, getExpiringLicenses, getPendingVendors } from '@/data/vendors';
import { mockPayments, getMonthRevenue, getTodayRevenue, getPaymentsByStatus } from '@/data/payments';
import styles from './index.module.scss';

const quickActions = [
  { icon: '📋', text: '证照核验', path: '/pages/license/index', iconClass: 'icon1' },
  { icon: '💰', text: '费用管理', path: '/pages/payment/index', iconClass: 'icon2' },
  { icon: '📢', text: '通知公告', path: '/pages/notice/index', iconClass: 'icon3' },
  { icon: '👥', text: '摊主名单', path: '', iconClass: 'icon4' },
  { icon: '📊', text: '收入统计', path: '', iconClass: 'icon5' },
  { icon: '🏪', text: '租期管理', path: '', iconClass: 'icon6' },
  { icon: '↩️', text: '退费申请', path: '/pages/refund/index', iconClass: 'icon7' },
  { icon: '📤', text: '导出数据', path: '', iconClass: 'icon8' }
];

const StatsPage: React.FC = () => {
  const stats = useMemo(() => ({
    totalStalls: mockStalls.length,
    rentedStalls: mockStalls.filter(s => s.status === 'rented').length,
    availableStalls: mockStalls.filter(s => s.status === 'available').length,
    todayRevenue: getTodayRevenue() || 7200,
    monthRevenue: getMonthRevenue() || 45800,
    activeVendors: mockVendors.filter(v => v.auditStatus === 'approved').length,
    expiringLicenses: getExpiringLicenses(30).length,
    pendingAudits: getPendingVendors().length
  }), []);

  const recentPayments = useMemo(() => {
    return mockPayments.slice(0, 4);
  }, []);

  const handleAction = (action: typeof quickActions[0]) => {
    console.log('[StatsPage] 点击功能:', action.text);
    if (action.path) {
      Taro.navigateTo({ url: action.path });
    } else {
      Taro.showToast({ title: '功能开发中', icon: 'none' });
    }
  };

  const exportVendors = () => {
    console.log('[StatsPage] 导出摊主名单');
    Taro.showToast({ title: '已导出摊主名单', icon: 'success' });
  };

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

        <View className={styles.statsGrid}>
          <View className={classnames(styles.statCard, styles.colorPrimary)}>
            <Text className={styles.statValue}>
              {stats.totalStalls}
              <Text className={styles.statUnit}>个</Text>
            </Text>
            <Text className={styles.statLabel}>总摊位</Text>
          </View>
          <View className={classnames(styles.statCard, styles.colorSuccess)}>
            <Text className={styles.statValue}>
              {stats.rentedStalls}
              <Text className={styles.statUnit}>个</Text>
            </Text>
            <Text className={styles.statLabel}>已出租</Text>
          </View>
          <View className={classnames(styles.statCard, styles.colorWarning)}>
            <Text className={styles.statValue}>
              {stats.pendingAudits}
              <Text className={styles.statUnit}>个</Text>
            </Text>
            <Text className={styles.statLabel}>待审核</Text>
          </View>
          <View className={classnames(styles.statCard, styles.colorError)}>
            <Text className={styles.statValue}>
              {stats.expiringLicenses}
              <Text className={styles.statUnit}>个</Text>
            </Text>
            <Text className={styles.statLabel}>证照到期</Text>
          </View>
        </View>

        <View className={styles.quickActions}>
          <View className={styles.sectionHeader}>
            <View className={styles.sectionTitle}>
              <View className={styles.titleBar} />
              <Text>管理功能</Text>
            </View>
          </View>
          <View className={styles.actionGrid}>
            {quickActions.map((action, index) => (
              <View
                key={action.text}
                className={styles.actionItem}
                onClick={() => handleAction(action)}
              >
                <View className={classnames(styles.actionIcon, styles[`icon${index + 1}`])}>
                  <Text>{action.icon}</Text>
                </View>
                <Text className={styles.actionText}>{action.text}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.listSection}>
          <View className={styles.sectionHeader}>
            <View className={styles.sectionTitle}>
              <View className={styles.titleBar} />
              <Text>最近缴费</Text>
            </View>
            <Text className={styles.moreBtn} onClick={() => Taro.navigateTo({ url: '/pages/payment/index' })}>
              查看全部
            </Text>
          </View>
          {recentPayments.map(payment => (
            <View key={payment.id} className={styles.listItem}>
              <View className={styles.listLeft}>
                <Text className={styles.listTitle}>
                  {payment.vendorName} · 摊位{payment.stallNo}
                </Text>
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
      </View>
    </View>
  );
};

export default StatsPage;
