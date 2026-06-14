import React, { useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import RoleSwitcher from '@/components/RoleSwitcher';
import StatusTag from '@/components/StatusTag';
import { mockInspections, getTodayInspections } from '@/data/inspections';
import { Inspection, ViolationType } from '@/types';
import styles from './index.module.scss';

const iconClassMap: Record<ViolationType, string> = {
  absent: styles.typeAbsent,
  occupying: styles.typeOccupying,
  unhygienic: styles.typeUnhygienic,
  other: styles.typeOther
};

const quickActions = [
  { icon: '❌', title: '缺席记录', desc: '登记摊主缺席', type: 'absent' as ViolationType, iconClass: 'iconAbsent' },
  { icon: '🚧', title: '占道经营', desc: '拍照登记占道', type: 'occupying' as ViolationType, iconClass: 'iconOccupying' },
  { icon: '🧹', title: '卫生检查', desc: '评价卫生情况', type: 'unhygienic' as ViolationType, iconClass: 'iconHygiene' },
  { icon: '📋', title: '其他违规', desc: '记录其他问题', type: 'other' as ViolationType, iconClass: 'iconOther' }
];

const typeText: Record<ViolationType, string> = {
  absent: '缺席',
  occupying: '占道',
  unhygienic: '卫生',
  other: '其他'
};

const PatrolPage: React.FC = () => {
  const todayRecords = useMemo(() => getTodayInspections(), []);
  const stats = useMemo(() => ({
    today: todayRecords.length,
    absent: todayRecords.filter(r => r.type === 'absent').length,
    occupying: todayRecords.filter(r => r.type === 'occupying').length,
    hygiene: todayRecords.filter(r => r.type === 'unhygienic').length
  }), [todayRecords]);

  const handleAction = (action: typeof quickActions[0]) => {
    console.log('[PatrolPage] 点击巡场功能:', action.title);
    Taro.navigateTo({ url: '/pages/inspection/index?type=' + action.type });
  };

  const goToDetail = (record: Inspection) => {
    console.log('[PatrolPage] 查看记录详情:', record.id);
  };

  const goToAll = () => {
    Taro.navigateTo({ url: '/pages/inspection/index' });
  };

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.headerTitle}>巡场管理</Text>
        <Text className={styles.headerSub}>今日巡场记录与检查情况</Text>
        <View className={styles.statsRow}>
          <View className={styles.statItem}>
            <Text className={styles.statNum}>{stats.today}</Text>
            <Text className={styles.statLabel}>今日记录</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statNum}>{stats.absent}</Text>
            <Text className={styles.statLabel}>缺席</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statNum}>{stats.occupying}</Text>
            <Text className={styles.statLabel}>占道</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statNum}>{stats.hygiene}</Text>
            <Text className={styles.statLabel}>卫生检查</Text>
          </View>
        </View>
      </View>

      <View className={styles.content}>
        <RoleSwitcher />

        <View className={styles.quickActions}>
          <View className={styles.actionGrid}>
            {quickActions.map(action => (
              <View
              key={action.type}
              className={styles.actionItem}
              onClick={() => handleAction(action)}
            >
              <View className={`${styles.actionIconBox} ${styles[action.iconClass]}`}>
                <Text>{action.icon}</Text>
              </View>
              <View className={styles.actionInfo}>
                <Text className={styles.actionTitle}>{action.title}</Text>
                <Text className={styles.actionDesc}>{action.desc}</Text>
              </View>
            </View>
            ))}
          </View>
        </View>

        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <View className={styles.sectionTitle}>
              <View className={styles.titleBar} />
              <Text>今日巡场记录</Text>
            </View>
            <Text className={styles.moreBtn} onClick={goToAll}>全部记录</Text>
          </View>
          {todayRecords.length === 0 ? (
            <View className={styles.emptyState}>
              <Text className={styles.emptyIcon}>📋</Text>
              <Text className={styles.emptyText}>今日暂无巡场记录</Text>
            </View>
          ) : (
            todayRecords.map(record => (
              <View key={record.id} className={styles.recordItem} onClick={() => goToDetail(record)}>
                <View className={styles.recordLeft}>
                  <View className={classnames(styles.recordIcon, iconClassMap[record.type])}>
                    <Text>{record.type === 'absent' ? '❌' : record.type === 'occupying' ? '🚧' : record.type === 'unhygienic' ? '🧹' : '📋'}</Text>
                  </View>
                </View>
                <View className={styles.recordContent}>
                  <View className={styles.recordHeader}>
                    <Text className={styles.recordTitle}>
                      摊位{record.stallNo} - {typeText[record.type]}
                    </Text>
                    <Text className={styles.recordDate}>{record.date}</Text>
                  </View>
                  <Text className={styles.recordDesc}>{record.description}</Text>
                  <View className={styles.recordMeta}>
                    {record.vendorName && <StatusTag text={record.vendorName} type="info" size="sm" />}
                    {record.hygieneScore !== undefined && (
                      <StatusTag
                        text={`卫生${record.hygieneScore >= 8 ? '优秀' : record.hygieneScore >= 6 ? '合格' : '不合格'}`}
                        type={record.hygieneScore >= 8 ? 'success' : record.hygieneScore >= 6 ? 'warning' : 'error'}
                        size="sm"
                      />
                    )}
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      </View>
    </View>
  );
};

export default PatrolPage;
