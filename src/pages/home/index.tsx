import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import RoleSwitcher from '@/components/RoleSwitcher';
import StatusTag from '@/components/StatusTag';
import { mockStalls, getStallsByZone } from '@/data/stalls';
import { mockNotices } from '@/data/notices';
import { Stall, StallStatus } from '@/types';
import styles from './index.module.scss';

const statusFilterOptions: { key: StallStatus | 'all'; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'available', label: '空闲' },
  { key: 'rented', label: '已租' },
  { key: 'maintenance', label: '维修' },
  { key: 'occupied', label: '占用' }
];

const statusText: Record<StallStatus, string> = {
  available: '空闲',
  rented: '已租',
  maintenance: '维修',
  occupied: '占用'
};

const HomePage: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState<StallStatus | 'all'>('all');
  const [selectedStall, setSelectedStall] = useState<Stall | null>(null);
  const today = '2026年6月14日 星期日';

  const stats = useMemo(() => ({
    total: mockStalls.length,
    available: mockStalls.filter(s => s.status === 'available').length,
    rented: mockStalls.filter(s => s.status === 'rented').length,
    maintenance: mockStalls.filter(s => s.status === 'maintenance').length
  }), []);

  const zones = useMemo(() => {
    const zoneMap = new Map<string, Stall[]>();
    mockStalls.forEach(stall => {
      if (filterStatus !== 'all' && stall.status !== filterStatus) return;
      if (!zoneMap.has(stall.zone)) {
        zoneMap.set(stall.zone, []);
      }
      zoneMap.get(stall.zone)!.push(stall);
    });
    return Array.from(zoneMap.entries());
  }, [filterStatus]);

  const handleStallClick = (stall: Stall) => {
    setSelectedStall(stall);
    console.log('[HomePage] 点击摊位:', stall.stallNo);
  };

  const handleSignup = () => {
    if (selectedStall) {
      console.log('[HomePage] 前往报名摊位:', selectedStall.stallNo);
      Taro.navigateTo({ url: '/pages/signup/index?stallId=' + selectedStall.id });
    }
    setSelectedStall(null);
  };

  const goToNotice = () => {
    Taro.navigateTo({ url: '/pages/notice/index' });
  };

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <View className={styles.headerTop}>
          <View>
            <Text className={styles.title}>中心集市</Text>
            <View className={styles.date}>{today}</View>
          </View>
          <View className={styles.noticeBtn} onClick={goToNotice}>
            <Text className={styles.noticeIcon}>📢</Text>
            <View className={styles.noticeBadge}>2</View>
          </View>
        </View>
        <View className={styles.statsRow}>
          <View className={styles.statItem}>
            <Text className={styles.statNum}>{stats.total}</Text>
            <Text className={styles.statLabel}>总摊位</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statNum}>{stats.available}</Text>
            <Text className={styles.statLabel}>空闲</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statNum}>{stats.rented}</Text>
            <Text className={styles.statLabel}>已租</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statNum}>{stats.maintenance}</Text>
            <Text className={styles.statLabel}>维修</Text>
          </View>
        </View>
      </View>

      <View className={styles.content}>
        <RoleSwitcher />

        <View className={styles.filterTabs}>
          {statusFilterOptions.map(opt => (
            <View
              key={opt.key}
              className={classnames(styles.filterTab, filterStatus === opt.key && styles.filterTabActive)}
              onClick={() => setFilterStatus(opt.key)}
            >
              <Text className={classnames(styles.filterText, filterStatus === opt.key && styles.filterTextActive)}>
                {opt.label}
              </Text>
            </View>
          ))}
        </View>

        <View className={styles.legend}>
          <View className={styles.legendItem}>
            <View className={styles.legendDot} style={{ background: '#00b42a' }} />
            <Text className={styles.legendText}>空闲可租</Text>
          </View>
          <View className={styles.legendItem}>
            <View className={styles.legendDot} style={{ background: '#165dff' }} />
            <Text className={styles.legendText}>已出租</Text>
          </View>
          <View className={styles.legendItem}>
            <View className={styles.legendDot} style={{ background: '#ff7d00' }} />
            <Text className={styles.legendText}>维修中</Text>
          </View>
          <View className={styles.legendItem}>
            <View className={styles.legendDot} style={{ background: '#f53f3f' }} />
            <Text className={styles.legendText}>违规占用</Text>
          </View>
        </View>

        <ScrollView scrollY style={{ height: 'calc(100vh - 700rpx)' }}>
          {zones.map(([zone, stalls]) => (
            <View key={zone} className={styles.zoneSection}>
              <View className={styles.zoneHeader}>
                <View className={styles.zoneTitle}>
                  <View className={styles.zoneBadge}>{zone}</View>
                  <Text>{zone}区摊位</Text>
                </View>
                <Text className={styles.zoneInfo}>{stalls.length}个摊位</Text>
              </View>
              <View className={styles.stallGrid}>
                {stalls.map(stall => (
                  <View
                    key={stall.id}
                    className={classnames(
                      styles.stallItem,
                      styles[`stall${stall.status.charAt(0).toUpperCase() + stall.status.slice(1)}`]
                    )}
                    onClick={() => handleStallClick(stall)}
                  >
                    <Text className={styles.stallNo}>{stall.stallNo}</Text>
                    <Text className={styles.stallStatus}>{statusText[stall.status]}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {selectedStall && (
        <View className={styles.modalMask} onClick={() => setSelectedStall(null)}>
          <View className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <View className={styles.modalHeader}>
              <Text className={styles.modalTitle}>摊位 {selectedStall.stallNo} 详情</Text>
              <View className={styles.closeBtn} onClick={() => setSelectedStall(null)}>✕</View>
            </View>
            <StatusTag
              text={statusText[selectedStall.status]}
              type={selectedStall.status === 'available' ? 'success' : selectedStall.status === 'rented' ? 'info' : selectedStall.status === 'maintenance' ? 'warning' : 'error'}
            />
            <View className={styles.modalInfo} style={{ marginTop: '24rpx' }}>
              <View className={styles.infoRow}>
                <Text className={styles.infoLabel}>摊位编号</Text>
                <Text className={styles.infoValue}>{selectedStall.stallNo}</Text>
              </View>
              <View className={styles.infoRow}>
                <Text className={styles.infoLabel}>所属区域</Text>
                <Text className={styles.infoValue}>{selectedStall.zone}区</Text>
              </View>
              <View className={styles.infoRow}>
                <Text className={styles.infoLabel}>日租金</Text>
                <Text className={styles.infoValue} style={{ color: '#f53f3f' }}>¥{selectedStall.price}/天</Text>
              </View>
              {selectedStall.vendorName && (
                <View className={styles.infoRow}>
                  <Text className={styles.infoLabel}>当前摊主</Text>
                  <Text className={styles.infoValue}>{selectedStall.vendorName}</Text>
                </View>
              )}
              {selectedStall.category && (
                <View className={styles.infoRow}>
                  <Text className={styles.infoLabel}>经营品类</Text>
                  <Text className={styles.infoValue}>{selectedStall.category}</Text>
                </View>
              )}
              {selectedStall.leaseStart && selectedStall.leaseEnd && (
                <View className={styles.infoRow}>
                  <Text className={styles.infoLabel}>租期</Text>
                  <Text className={styles.infoValue}>{selectedStall.leaseStart} ~ {selectedStall.leaseEnd}</Text>
                </View>
              )}
            </View>
            <View className={styles.modalActions}>
              <View className={classnames(styles.actionBtn, styles.btnOutline)} onClick={() => setSelectedStall(null)}>
                关闭
              </View>
              {selectedStall.status === 'available' && (
                <View className={classnames(styles.actionBtn, styles.btnPrimary)} onClick={handleSignup}>
                  立即报名
                </View>
              )}
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default HomePage;
