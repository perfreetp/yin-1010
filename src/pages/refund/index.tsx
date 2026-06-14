import React, { useState, useMemo } from 'react';
import { View, Text, Textarea } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import StatusTag from '@/components/StatusTag';
import { useUser } from '@/store/user-context';
import { mockPayments, getPaymentById } from '@/data/payments';
import { Payment } from '@/types';
import styles from './index.module.scss';

const refundReasons = [
  '临时有事无法出摊',
  '身体不适',
  '天气原因',
  '摊位调整',
  '其他原因'
];

const RefundPage: React.FC = () => {
  const router = useRouter();
  const { currentUser } = useUser();
  const paymentId = router.params.paymentId || '';

  const payment = useMemo(() => getPaymentById(paymentId), [paymentId]);

  const [formData, setFormData] = useState({
    reason: '',
    description: '',
    bankAccount: ''
  });
  const [agreed, setAgreed] = useState(false);

  const updateField = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSelectReason = () => {
    console.log('[RefundPage] 选择退费原因');
    Taro.showActionSheet({
      itemList: refundReasons,
      success: (res) => {
        updateField('reason', refundReasons[res.tapIndex]);
      }
    });
  };

  const handleSubmit = () => {
    console.log('[RefundPage] 提交退费申请:', formData);
    if (!formData.reason) {
      Taro.showToast({ title: '请选择退费原因', icon: 'none' });
      return;
    }
    if (!formData.description) {
      Taro.showToast({ title: '请填写详细说明', icon: 'none' });
      return;
    }
    if (!agreed) {
      Taro.showToast({ title: '请同意退费协议', icon: 'none' });
      return;
    }
    Taro.showModal({
      title: '提交确认',
      content: '确认提交退费申请？退款将在3-5个工作日内到账。',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '申请已提交', icon: 'success' });
          setTimeout(() => Taro.navigateBack(), 1500);
        }
      }
    });
  };

  const handleApprove = () => {
    console.log('[RefundPage] 管理员批准退费');
    Taro.showModal({
      title: '批准退费',
      content: `确认批准退费 ¥${payment?.amount || 0}？`,
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '已批准退费', icon: 'success' });
          setTimeout(() => Taro.navigateBack(), 1500);
        }
      }
    });
  };

  const handleReject = () => {
    console.log('[RefundPage] 管理员拒绝退费');
    Taro.showModal({
      title: '拒绝退费',
      content: '确认拒绝该退费申请？',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '已拒绝申请', icon: 'success' });
          setTimeout(() => Taro.navigateBack(), 1500);
        }
      }
    });
  };

  const refundAmount = useMemo(() => (payment?.amount || 0) * 0.9, [payment]);

  return (
    <View className={styles.page}>
      {payment && (
        <View className={styles.paymentInfoCard}>
          <View className={styles.paymentInfoHeader}>
            <Text className={styles.paymentInfoTitle}>原缴费信息</Text>
            <Text className={styles.paymentAmount}>¥{payment.amount.toLocaleString()}</Text>
          </View>
          <View className={styles.paymentInfoRow}>
            <Text className={styles.paymentInfoLabel}>缴费订单</Text>
            <Text className={styles.paymentInfoValue}>{payment.id}</Text>
          </View>
          <View className={styles.paymentInfoRow}>
            <Text className={styles.paymentInfoLabel}>摊主</Text>
            <Text className={styles.paymentInfoValue}>{payment.vendorName} · 摊位{payment.stallNo}</Text>
          </View>
          <View className={styles.paymentInfoRow}>
            <Text className={styles.paymentInfoLabel}>缴费周期</Text>
            <Text className={styles.paymentInfoValue}>{payment.period}</Text>
          </View>
          <View className={styles.paymentInfoRow}>
            <Text className={styles.paymentInfoLabel}>支付时间</Text>
            <Text className={styles.paymentInfoValue}>{payment.payDate || '-'}</Text>
          </View>
          <View className={styles.paymentInfoRow}>
            <Text className={styles.paymentInfoLabel}>缴费状态</Text>
            <StatusTag
              text={payment.status === 'paid' ? '已支付' : payment.status}
              type={payment.status === 'paid' ? 'success' : 'info'}
              size="sm"
              style={{ marginTop: '4rpx' }}
            />
          </View>
        </View>
      )}

      <View className={styles.formSection}>
        <View className={styles.sectionTitle}>
          <View className={styles.titleBar} />
          <Text>退费信息</Text>
        </View>
        <View className={styles.formItem}>
          <Text className={styles.label}>
            <Text className={styles.required}>*</Text>退费原因
          </Text>
          <View className={styles.pickerBox} onClick={handleSelectReason}>
            <Text className={formData.reason ? styles.pickerValue : styles.pickerPlaceholder}>
              {formData.reason || '请选择退费原因'}
            </Text>
            <Text style={{ color: '#86909c' }}>›</Text>
          </View>
        </View>
        <View className={styles.formItem}>
          <Text className={styles.label}>
            <Text className={styles.required}>*</Text>详细说明
          </Text>
          <Textarea
            className={styles.textarea}
            placeholder="请详细说明退费原因，便于管理员审核"
            value={formData.description}
            onInput={(e) => updateField('description', e.detail.value)}
          />
          <Text className={styles.tip}>建议说明具体情况，如：无法出摊日期、特殊情况等</Text>
        </View>
        <View className={styles.formItem}>
          <Text className={styles.label}>退款账户（可选）</Text>
          <View className={styles.pickerBox}>
            <Text className={styles.pickerValue}>原路返回：微信支付</Text>
            <Text style={{ color: '#86909c' }}>›</Text>
          </View>
        </View>
      </View>

      <View className={styles.amountSection}>
        <View className={styles.sectionTitle}>
          <View className={styles.titleBar} />
          <Text>退费明细</Text>
        </View>
        <View className={styles.amountRow}>
          <Text className={styles.amountLabel}>原缴费金额</Text>
          <Text className={styles.amountValue}>¥{payment?.amount.toLocaleString() || 0}</Text>
        </View>
        <View className={styles.amountRow}>
          <Text className={styles.amountLabel}>手续费（10%）</Text>
          <Text className={styles.amountValue}>-¥{((payment?.amount || 0) * 0.1).toFixed(0)}</Text>
        </View>
        <View className={classnames(styles.amountRow, styles.amountTotal)}>
          <Text className={styles.amountTotalLabel}>预计退款金额</Text>
          <Text className={styles.amountTotalValue}>¥{refundAmount.toFixed(0)}</Text>
        </View>
        <Text className={styles.tip} style={{ marginTop: '24rpx' }}>
          * 退款将在审核通过后3-5个工作日内到账，手续费用于平台运营成本
        </Text>
      </View>

      <View className={styles.agreement}>
        <View
          className={classnames(styles.checkbox, agreed && styles.checkboxActive)}
          onClick={() => setAgreed(!agreed)}
        >
          {agreed && <Text className={styles.checkIcon}>✓</Text>}
        </View>
        <Text className={styles.agreementText}>
          我已阅读并同意
          <Text className={styles.agreementLink}>《集市退费协议》</Text>
          和
          <Text className={styles.agreementLink}>《退款说明》</Text>
        </Text>
      </View>

      <View className={styles.bottomBar}>
        {currentUser.role === 'admin' && payment?.status === 'refunding' ? (
          <>
            <View className={styles.btnReject} onClick={handleReject}>拒绝</View>
            <View className={styles.btnApprove} onClick={handleApprove}>批准退费</View>
          </>
        ) : (
          <>
            <View className={styles.btnCancel} onClick={() => Taro.navigateBack()}>取消</View>
            <View className={styles.btnSubmit} onClick={handleSubmit}>提交申请</View>
          </>
        )}
      </View>
    </View>
  );
};

export default RefundPage;
