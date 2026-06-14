import React, { useMemo } from 'react';
import { View, Text } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import StatusTag from '@/components/StatusTag';
import { useUser } from '@/store/user-context';
import { mockVendors, getVendorById } from '@/data/vendors';
import { getStallsByVendor } from '@/data/stalls';
import { getPaymentsByVendor } from '@/data/payments';
import { mockInspections } from '@/data/inspections';
import styles from './index.module.scss';

const VendorDetailPage: React.FC = () => {
  const router = useRouter();
  const { currentUser } = useUser();
  const vendorId = router.params.id || (currentUser.role === 'vendor' ? 'v001' : '');

  const vendor = useMemo(() => getVendorById(vendorId), [vendorId]);
  const stalls = useMemo(() => vendor ? getStallsByVendor(vendor.id) : [], [vendor]);
  const payments = useMemo(() => vendor ? getPaymentsByVendor(vendor.id).slice(0, 5) : [], [vendor]);
  const inspections = useMemo(() => {
    if (!vendor) return [];
    return mockInspections
      .filter(i => i.stallNo === stalls[0]?.stallNo)
      .slice(0, 3);
  }, [vendor, stalls]);

  if (!vendor) {
    return (
      <View className={styles.page}>
        <View style={{ padding: '100rpx', textAlign: 'center' }}>
          <Text style={{ fontSize: '28rpx', color: '#86909c' }}>未找到摊主信息</Text>
        </View>
      </View>
    );
  }

  const handleCall = () => {
    console.log('[VendorDetail] 拨打电话:', vendor.phone);
    Taro.makePhoneCall({ phoneNumber: vendor.phone });
  };

  const handleSendMessage = () => {
    console.log('[VendorDetail] 发送消息给:', vendor.name);
    Taro.showToast({ title: '消息功能开发中', icon: 'none' });
  };

  const handleChangeStall = () => {
    console.log('[VendorDetail] 调整摊位');
    Taro.showToast({ title: '摊位调整功能开发中', icon: 'none' });
  };

  const handleRemindLicense = () => {
    console.log('[VendorDetail] 提醒证照到期');
    Taro.showModal({
      title: '发送提醒',
      content: `确认向 ${vendor.name} 发送证照到期提醒？`,
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '提醒已发送', icon: 'success' });
        }
      }
    });
  };

  return (
    <View className={styles.page}>
      <View className={styles.profileHeader}>
        <View className={styles.avatar}>
          <Text>{vendor.name.charAt(0)}</Text>
        </View>
        <View className={styles.profileInfo}>
          <View className={styles.profileName}>
            {vendor.name}
            <StatusTag
              text={vendor.auditStatus === 'approved' ? '已通过' : vendor.auditStatus === 'pending' ? '审核中' : '已拒绝'}
              type={vendor.auditStatus === 'approved' ? 'success' : vendor.auditStatus === 'pending' ? 'pending' : 'error'}
              size="sm"
            />
          </View>
          <Text className={styles.profilePhone}>{vendor.phone}</Text>
        </View>
      </View>

      <View className={styles.content}>
        <View className={styles.card}>
          <View className={styles.sectionTitle}>
            <View className={styles.titleBar} />
            <Text>基本信息</Text>
          </View>
          <View className={styles.infoGrid}>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>身份证号</Text>
              <Text className={styles.infoValue}>{vendor.idCard || '310***********1234'}</Text>
            </View>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>经营品类</Text>
              <Text className={styles.infoValue}>{vendor.category}</Text>
            </View>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>申请日期</Text>
              <Text className={styles.infoValue}>{vendor.applyDate}</Text>
            </View>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>累计缴费</Text>
              <Text className={styles.infoValue}>
                ¥{payments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0).toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        <View className={styles.card}>
          <View className={styles.sectionTitle}>
            <View className={styles.titleBar} />
            <Text>摊位信息</Text>
          </View>
          {stalls.length === 0 ? (
            <View style={{ padding: '32rpx', textAlign: 'center' }}>
              <Text style={{ fontSize: '26rpx', color: '#86909c' }}>暂无摊位</Text>
            </View>
          ) : (
            stalls.map(stall => (
              <View key={stall.id} className={styles.stallCard}>
                <View className={styles.stallIcon}>
                  <Text>🏠</Text>
                </View>
                <View className={styles.stallInfo}>
                  <Text className={styles.stallNo}>
                    摊位{stall.stallNo} · {stall.zone}区
                    <StatusTag
                      text={stall.status === 'rented' ? '经营中' : stall.status === 'maintenance' ? '维修中' : stall.status === 'vacant' ? '空闲' : '占用'}
                      type={stall.status === 'rented' ? 'success' : stall.status === 'maintenance' ? 'warning' : stall.status === 'vacant' ? 'info' : 'error'}
                      size="sm"
                      style={{ marginLeft: '16rpx' }}
                    />
                  </Text>
                  <Text className={styles.stallMeta}>
                    租金：¥{stall.price.toLocaleString()}/月 | 面积：{stall.area || 6}㎡
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>

        <View className={styles.card}>
          <View className={styles.sectionTitle}>
            <View className={styles.titleBar} />
            <Text>证照信息</Text>
          </View>
          <View className={styles.licenseItem}>
            <View className={styles.licenseIcon}>
              <Text>📄</Text>
            </View>
            <View className={styles.licenseInfo}>
              <Text className={styles.licenseName}>
                营业执照
                <StatusTag
                  text={new Date(vendor.licenseExpiry) < new Date() ? '已过期' : new Date(vendor.licenseExpiry).getTime() - Date.now() < 30 * 24 * 3600 * 1000 ? '即将到期' : '有效'}
                  type={new Date(vendor.licenseExpiry) < new Date() ? 'error' : new Date(vendor.licenseExpiry).getTime() - Date.now() < 30 * 24 * 3600 * 1000 ? 'warning' : 'success'}
                  size="sm"
                  style={{ marginLeft: '16rpx' }}
                />
              </Text>
              <Text className={styles.licenseExpiry}>有效期至：{vendor.licenseExpiry}</Text>
            </View>
          </View>
          <View className={styles.licenseItem}>
            <View className={styles.licenseIcon}>
              <Text>🪪</Text>
            </View>
            <View className={styles.licenseInfo}>
              <Text className={styles.licenseName}>身份证</Text>
              <Text className={styles.licenseExpiry}>已上传（身份证正反面）</Text>
            </View>
          </View>
          <View className={styles.licenseItem}>
            <View className={styles.licenseIcon}>
              <Text>🧾</Text>
            </View>
            <View className={styles.licenseInfo}>
              <Text className={styles.licenseName}>健康证</Text>
              <Text className={styles.licenseExpiry}>有效期至：2025-08-15</Text>
            </View>
          </View>
        </View>

        <View className={styles.card}>
          <View className={styles.sectionTitle}>
            <View className={styles.titleBar} />
            <Text>最近缴费记录</Text>
          </View>
          <View className={styles.paymentHistory}>
            {payments.length === 0 ? (
              <View style={{ padding: '32rpx', textAlign: 'center' }}>
                <Text style={{ fontSize: '26rpx', color: '#86909c' }}>暂无缴费记录</Text>
              </View>
            ) : (
              payments.map(payment => (
                <View key={payment.id} className={styles.paymentRow}>
                  <View className={styles.paymentInfoLeft}>
                    <Text className={styles.paymentTitle}>{payment.period}</Text>
                    <Text className={styles.paymentDate}>{payment.payDate || payment.createDate}</Text>
                  </View>
                  <Text
                    className={styles.paymentAmount}
                    style={{
                      color: payment.status === 'paid' ? '#00b42a' : payment.status === 'unpaid' ? '#f53f3f' : '#86909c'
                    }}
                  >
                    {payment.status === 'refunded' ? '-' : ''}¥{payment.amount.toLocaleString()}
                  </Text>
                </View>
              ))
            )}
          </View>
        </View>

        <View className={styles.card}>
          <View className={styles.sectionTitle}>
            <View className={styles.titleBar} />
            <Text>巡场记录</Text>
          </View>
          {inspections.length === 0 ? (
            <View style={{ padding: '32rpx', textAlign: 'center' }}>
              <Text style={{ fontSize: '26rpx', color: '#86909c' }}>暂无巡场记录</Text>
            </View>
          ) : (
            inspections.map(record => (
              <View key={record.id} className={styles.inspectionItem}>
                <View className={styles.inspectionIcon}>
                  <Text>{record.type === 'absent' ? '❌' : record.type === 'occupying' ? '🚧' : record.type === 'unhygienic' ? '🧹' : '📋'}</Text>
                </View>
                <View className={styles.inspectionContent}>
                  <Text className={styles.inspectionDesc}>{record.description}</Text>
                  <Text className={styles.inspectionDate}>
                    {record.date} · {record.inspectorName}
                    {record.hygieneScore && ` · 评分${record.hygieneScore}/10`}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      </View>

      <View className={styles.bottomBar}>
        {currentUser.role === 'admin' ? (
          <>
            <View className={styles.btnSecondary} onClick={handleCall}>
              <Text>📞 联系</Text>
            </View>
            <View className={styles.btnPrimary} onClick={handleChangeStall}>
              <Text>调整摊位</Text>
            </View>
            <View className={styles.btnSuccess} onClick={handleRemindLicense}>
              <Text>提醒续期</Text>
            </View>
          </>
        ) : (
          <>
            <View className={styles.btnSecondary} onClick={handleSendMessage}>
              <Text>💬 联系管理员</Text>
            </View>
            <View className={styles.btnPrimary} onClick={() => Taro.navigateTo({ url: '/pages/payment/index' })}>
              <Text>查看缴费</Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

export default VendorDetailPage;
