import React, { useMemo } from 'react';
import { View, Text } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import StatusTag from '@/components/StatusTag';
import { useUser } from '@/store/user-context';
import { getVendorById } from '@/data/vendors';
import { getStallsByVendor } from '@/data/stalls';
import { getPaymentsByVendor } from '@/data/payments';
import { getInspectionsByVendor } from '@/data/inspections';
import styles from './index.module.scss';

const NOW = new Date('2026-06-14');
const THIRTY_DAYS_MS = 30 * 24 * 3600 * 1000;

const RENEWAL_STATUS_MAP: Record<string, { text: string; type: 'success' | 'pending' | 'warning' | 'info' }> = {
  none: { text: '未续期', type: 'info' },
  pending: { text: '续期中', type: 'pending' },
  renewed: { text: '已续期', type: 'success' },
  changed: { text: '已变更', type: 'warning' },
};

const getLicenseStatus = (expireDate?: string) => {
  if (!expireDate) return { text: '未知', type: 'default' as const };
  const d = new Date(expireDate);
  if (d < NOW) return { text: '已过期', type: 'error' as const };
  if (d.getTime() - NOW.getTime() < THIRTY_DAYS_MS) return { text: '即将到期', type: 'warning' as const };
  return { text: '有效', type: 'success' as const };
};

const VendorDetailPage: React.FC = () => {
  const router = useRouter();
  const { currentUser } = useUser();
  const vendorId = router.params.id || (currentUser.role === 'vendor' ? 'v001' : '');

  const vendor = useMemo(() => getVendorById(vendorId), [vendorId]);
  const stalls = useMemo(() => vendor ? getStallsByVendor(vendor.id) : [], [vendor]);
  const payments = useMemo(() => vendor ? getPaymentsByVendor(vendor.id).slice(0, 5) : [], [vendor]);
  const inspections = useMemo(() => vendor ? getInspectionsByVendor(vendor.id).slice(0, 3) : [], [vendor]);

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
    Taro.showModal({
      title: '拨打电话',
      content: `确认拨打 ${vendor.name} 的电话 ${vendor.phone}？`,
      success: (res) => {
        if (res.confirm) {
          Taro.makePhoneCall({ phoneNumber: vendor.phone });
        }
      }
    });
  };

  const handleChangeStall = () => {
    Taro.showModal({
      title: '调整摊位',
      content: `确认为 ${vendor.name} 调整摊位？调整后将通知摊主。`,
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '摊位调整申请已提交', icon: 'success' });
        }
      }
    });
  };

  const handleRemindLicense = () => {
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

  const handleContactAdmin = () => {
    Taro.showModal({
      title: '联系管理员',
      content: '确认拨打市场管理员电话？',
      success: (res) => {
        if (res.confirm) {
          Taro.makePhoneCall({ phoneNumber: '010-12345678' });
        }
      }
    });
  };

  const licenseStatus = getLicenseStatus(vendor.licenseExpireDate);
  const healthCertStatus = getLicenseStatus(vendor.healthCertExpireDate);

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
              <Text className={styles.infoValue}>{vendor.idCard}</Text>
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
            {vendor.renewalStatus && vendor.renewalStatus !== 'none' && (
              <View className={styles.infoItem}>
                <Text className={styles.infoLabel}>续期状态</Text>
                <Text className={styles.infoValue}>
                  <StatusTag
                    text={RENEWAL_STATUS_MAP[vendor.renewalStatus]?.text || '未知'}
                    type={RENEWAL_STATUS_MAP[vendor.renewalStatus]?.type || 'default'}
                    size="sm"
                  />
                </Text>
              </View>
            )}
            {vendor.lastRemindDate && (
              <View className={styles.infoItem}>
                <Text className={styles.infoLabel}>上次提醒</Text>
                <Text className={styles.infoValue}>{vendor.lastRemindDate}</Text>
              </View>
            )}
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
                    租金：¥{stall.price.toLocaleString()}/月 | {stall.width}×{stall.height}cm
                  </Text>
                  {stall.leaseStart && stall.leaseEnd && (
                    <Text className={styles.stallMeta}>
                      租期：{stall.leaseStart} ~ {stall.leaseEnd}
                    </Text>
                  )}
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
                  text={licenseStatus.text}
                  type={licenseStatus.type}
                  size="sm"
                  style={{ marginLeft: '16rpx' }}
                />
              </Text>
              <Text className={styles.licenseExpiry}>
                有效期至：{vendor.licenseExpireDate || '未上传'}
              </Text>
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
              <Text className={styles.licenseName}>
                健康证
                <StatusTag
                  text={healthCertStatus.text}
                  type={healthCertStatus.type}
                  size="sm"
                  style={{ marginLeft: '16rpx' }}
                />
              </Text>
              <Text className={styles.licenseExpiry}>
                有效期至：{vendor.healthCertExpireDate || '未上传'}
              </Text>
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
                    className={classnames(styles.paymentAmount, {
                      [styles.paymentPaid]: payment.status === 'paid',
                      [styles.paymentUnpaid]: payment.status === 'unpaid',
                    })}
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
                    {record.hygieneScore ? ` · 评分${record.hygieneScore}/10` : ''}
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
            <View className={styles.btnSecondary} onClick={handleContactAdmin}>
              <Text>💬 联系管理员</Text>
            </View>
            <View className={styles.btnPrimary} onClick={() => Taro.navigateTo({ url: '/pages/payment/index' })}>
              <Text>查看缴费</Text>
            </View>
            <View className={styles.btnSuccess} onClick={() => Taro.navigateTo({ url: '/pages/license/index' })}>
              <Text>我的证照</Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

export default VendorDetailPage;
