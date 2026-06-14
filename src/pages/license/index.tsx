import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import StatusTag from '@/components/StatusTag';
import { useUser } from '@/store/user-context';
import { mockVendors, getExpiringLicenses, getPendingVendors } from '@/data/vendors';
import { Vendor } from '@/types';
import styles from './index.module.scss';

type FilterType = 'all' | 'pending' | 'expiring' | 'approved';

const LicensePage: React.FC = () => {
  const { currentUser } = useUser();
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredVendors = useMemo(() => {
    if (filter === 'pending') return getPendingVendors();
    if (filter === 'expiring') return getExpiringLicenses(30);
    if (filter === 'approved') return mockVendors.filter(v => v.licenseStatus === 'approved');
    return mockVendors;
  }, [filter]);

  const handleApprove = (vendor: Vendor) => {
    console.log('[LicensePage] 审核通过:', vendor.id);
    Taro.showToast({ title: '已通过审核', icon: 'success' });
  };

  const handleReject = (vendor: Vendor) => {
    console.log('[LicensePage] 审核拒绝:', vendor.id);
    Taro.showModal({
      title: '拒绝原因',
      editable: true,
      placeholderText: '请输入拒绝原因',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '已拒绝', icon: 'none' });
        }
      }
    });
  };

  const handleRemind = (vendor: Vendor) => {
    console.log('[LicensePage] 提醒到期:', vendor.id);
    Taro.showToast({ title: '已发送提醒', icon: 'success' });
  };

  const handleView = (vendor: Vendor) => {
    console.log('[LicensePage] 查看证照:', vendor.id);
    Taro.showToast({ title: '证照预览开发中', icon: 'none' });
  };

  const checkExpireStatus = (date?: string) => {
    if (!date) return 'normal';
    const now = new Date('2026-06-14');
    const expire = new Date(date);
    const diff = (expire.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    if (diff < 0) return 'expired';
    if (diff <= 30) return 'soon';
    return 'normal';
  };

  return (
    <View className={styles.page}>
      <View className={styles.filterTabs}>
        {[
          { key: 'all' as FilterType, label: '全部' },
          { key: 'pending' as FilterType, label: '待审核' },
          { key: 'expiring' as FilterType, label: '即将到期' },
          { key: 'approved' as FilterType, label: '已通过' }
        ].map(tab => (
          <View
            key={tab.key}
            className={classnames(styles.filterTab, filter === tab.key && styles.filterTabActive)}
            onClick={() => setFilter(tab.key)}
          >
            <Text className={classnames(styles.filterText, filter === tab.key && styles.filterTextActive)}>
              {tab.label}
            </Text>
          </View>
        ))}
      </View>

      {filteredVendors.length === 0 ? (
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>📋</Text>
          <Text className={styles.emptyText}>暂无相关证照记录</Text>
        </View>
      ) : (
        <ScrollView scrollY>
          <View className={styles.vendorList}>
            {filteredVendors.map(vendor => {
              const expireStatus = checkExpireStatus(vendor.licenseExpireDate);
              return (
                <View key={vendor.id} className={styles.vendorCard}>
                  <View className={styles.vendorHeader}>
                    <View className={styles.vendorInfo}>
                      <View className={styles.vendorAvatar}>👤</View>
                      <View className={styles.vendorDetail}>
                        <Text className={styles.vendorName}>{vendor.name}</Text>
                        <Text className={styles.vendorMeta}>
                          {vendor.stallNo ? `摊位${vendor.stallNo} · ` : ''}{vendor.category}
                        </Text>
                      </View>
                    </View>
                    <StatusTag
                      text={vendor.licenseStatus === 'approved' ? '已通过' : vendor.licenseStatus === 'pending' ? '审核中' : '已拒绝'}
                      type={vendor.licenseStatus === 'approved' ? 'success' : vendor.licenseStatus === 'pending' ? 'warning' : 'error'}
                      size="sm"
                    />
                  </View>
                  <View className={styles.infoGrid}>
                    <View className={styles.infoItem}>
                      <Text className={styles.infoLabel}>联系电话</Text>
                      <Text className={styles.infoValue}>{vendor.phone}</Text>
                    </View>
                    <View className={styles.infoItem}>
                      <Text className={styles.infoLabel}>申请日期</Text>
                      <Text className={styles.infoValue}>{vendor.applyDate}</Text>
                    </View>
                    <View className={styles.infoItem}>
                      <Text className={styles.infoLabel}>证照有效期</Text>
                      <Text className={classnames(
                        styles.infoValue,
                        expireStatus === 'soon' && styles.expireSoon,
                        expireStatus === 'expired' && styles.expired
                      )}>
                        {vendor.licenseExpireDate || '未上传'}
                        {expireStatus === 'soon' && ' ⚠️'}
                        {expireStatus === 'expired' && ' ❌'}
                      </Text>
                    </View>
                    <View className={styles.infoItem}>
                      <Text className={styles.infoLabel}>审核状态</Text>
                      <Text className={styles.infoValue}>
                        {vendor.auditStatus === 'approved' ? '已通过' : vendor.auditStatus === 'pending' ? '审核中' : '已拒绝'}
                      </Text>
                    </View>
                  </View>
                  {vendor.auditRemark && (
                    <View style={{ marginTop: '24rpx', padding: '16rpx', background: '#fff4e8', borderRadius: '12rpx' }}>
                      <Text style={{ fontSize: '24rpx', color: '#ff7d00' }}>备注：{vendor.auditRemark}</Text>
                    </View>
                  )}
                  <View className={styles.cardActions}>
                    {currentUser.role === 'admin' && vendor.licenseStatus === 'pending' && (
                      <>
                        <View className={classnames(styles.actionBtn, styles.btnApprove)} onClick={() => handleApprove(vendor)}>通过</View>
                        <View className={classnames(styles.actionBtn, styles.btnReject)} onClick={() => handleReject(vendor)}>拒绝</View>
                      </>
                    )}
                    {currentUser.role === 'admin' && expireStatus !== 'normal' && vendor.licenseStatus === 'approved' && (
                      <View className={classnames(styles.actionBtn, styles.btnRemind)} onClick={() => handleRemind(vendor)}>
                        提醒续期
                      </View>
                    )}
                    <View className={classnames(styles.actionBtn, styles.btnView)} onClick={() => handleView(vendor)}>
                      查看证照
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default LicensePage;
