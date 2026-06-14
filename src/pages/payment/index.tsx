import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import StatusTag from '@/components/StatusTag';
import { useUser } from '@/store/user-context';
import { mockPayments, getPaymentsByVendor, getPaymentsByStatus } from '@/data/payments';
import { mockVendors } from '@/data/vendors';
import { Payment, PaymentStatus } from '@/types';
import styles from './index.module.scss';

type FilterType = 'all' | PaymentStatus;

const statusText: Record<PaymentStatus, string> = {
  unpaid: '待支付',
  paid: '已支付',
  refunding: '退款中',
  refunded: '已退款'
};

const PaymentPage: React.FC = () => {
  const { currentUser } = useUser();
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredPayments = useMemo(() => {
    let list = mockPayments;
    if (currentUser.role === 'vendor') {
      const myVendor = mockVendors.find(v => v.name === currentUser.name);
      if (myVendor) list = getPaymentsByVendor(myVendor.id);
    }
    if (filter !== 'all') {
      list = list.filter(p => p.status === filter);
    }
    return list.sort((a, b) => new Date(b.createDate).getTime() - new Date(a.createDate).getTime());
  }, [filter, currentUser.name, currentUser.role]);

  const unpaid = useMemo(() => getPaymentsByStatus('unpaid'), []);
  const totalUnpaid = useMemo(() => unpaid.reduce((sum, p) => sum + p.amount, 0), [unpaid]);

  const handlePay = (payment: Payment) => {
    console.log('[PaymentPage] 支付订单:', payment.id);
    Taro.showModal({
      title: '确认支付',
      content: `确认支付 ¥${payment.amount}？`,
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '支付成功', icon: 'success' });
        }
      }
    });
  };

  const handleRefund = (payment: Payment) => {
    console.log('[PaymentPage] 申请退款:', payment.id);
    Taro.navigateTo({ url: '/pages/refund/index?paymentId=' + payment.id });
  };

  const handleDetail = (payment: Payment) => {
    console.log('[PaymentPage] 查看详情:', payment.id);
    Taro.showToast({ title: '详情功能开发中', icon: 'none' });
  };

  const handleExport = () => {
    console.log('[PaymentPage] 导出缴费记录');
    Taro.showToast({ title: '已导出缴费名单', icon: 'success' });
  };

  const handlePayAll = () => {
    console.log('[PaymentPage] 一键支付所有');
    if (totalUnpaid === 0) {
      Taro.showToast({ title: '暂无待支付', icon: 'none' });
      return;
    }
    Taro.showModal({
      title: '确认支付',
      content: `确认支付所有待缴费用 ¥${totalUnpaid}？`,
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '支付成功', icon: 'success' });
        }
      }
    });
  };

  return (
    <View className={styles.page}>
      <View className={styles.summaryCard}>
        <Text className={styles.summaryLabel}>
          {currentUser.role === 'vendor' ? '待缴费用' : '本月待收'}
        </Text>
        <View className={styles.summaryAmount}>
          ¥{totalUnpaid.toLocaleString()}
          <Text className={styles.summaryUnit}>元</Text>
        </View>
        <View className={styles.summaryRow}>
          <View className={styles.summaryItem}>
            <Text className={styles.summaryItemLabel}>待处理笔数</Text>
            <Text className={styles.summaryItemValue}>{unpaid.length}笔</Text>
          </View>
          <View className={styles.summaryItem}>
            <Text className={styles.summaryItemLabel}>已支付</Text>
            <Text className={styles.summaryItemValue}>¥{(mockPayments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0)).toLocaleString()}</Text>
          </View>
        </View>
      </View>

      <View className={styles.filterTabs}>
        {[
          { key: 'all' as FilterType, label: '全部' },
          { key: 'unpaid' as FilterType, label: '待支付' },
          { key: 'paid' as FilterType, label: '已支付' },
          { key: 'refunding' as FilterType, label: '退款中' }
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

      {filteredPayments.length === 0 ? (
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>💰</Text>
          <Text className={styles.emptyText}>暂无缴费记录</Text>
        </View>
      ) : (
        <ScrollView scrollY>
          <View className={styles.paymentList}>
            {filteredPayments.map(payment => (
              <View key={payment.id} className={styles.paymentCard}>
                <View className={styles.paymentHeader}>
                  <Text className={styles.paymentTitle}>
                    {payment.vendorName} · 摊位{payment.stallNo}
                  </Text>
                  <Text className={classnames(
                    styles.paymentAmount,
                    payment.status === 'unpaid' && styles.amountUnpaid,
                    payment.status === 'paid' && styles.amountPaid,
                    payment.status === 'refunding' && styles.amountRefunding,
                    payment.status === 'refunded' && styles.amountRefunded
                  )}>
                    {payment.status === 'refunded' ? '-' : ''}¥{payment.amount.toLocaleString()}
                  </Text>
                </View>
                <StatusTag
                  text={statusText[payment.status]}
                  type={payment.status === 'paid' ? 'success' : payment.status === 'unpaid' ? 'warning' : payment.status === 'refunding' ? 'info' : 'default'}
                  size="sm"
                />
                <View className={styles.paymentInfo}>
                  <View className={styles.infoItem}>
                    <Text className={styles.infoLabel}>缴费周期</Text>
                    <Text className={styles.infoValue}>{payment.period}</Text>
                  </View>
                  <View className={styles.infoItem}>
                    <Text className={styles.infoLabel}>创建时间</Text>
                    <Text className={styles.infoValue}>{payment.createDate}</Text>
                  </View>
                  {payment.payDate && (
                    <View className={styles.infoItem}>
                      <Text className={styles.infoLabel}>支付时间</Text>
                      <Text className={styles.infoValue}>{payment.payDate}</Text>
                    </View>
                  )}
                  {payment.refundReason && (
                    <View className={styles.infoItem}>
                      <Text className={styles.infoLabel}>退款原因</Text>
                      <Text className={styles.infoValue}>{payment.refundReason}</Text>
                    </View>
                  )}
                </View>
                <View className={styles.paymentActions}>
                  {payment.status === 'unpaid' && (
                    <View className={classnames(styles.actionBtn, styles.btnPay)} onClick={() => handlePay(payment)}>
                      立即支付
                    </View>
                  )}
                  {payment.status === 'paid' && currentUser.role === 'vendor' && (
                    <View className={classnames(styles.actionBtn, styles.btnRefund)} onClick={() => handleRefund(payment)}>
                      申请退费
                    </View>
                  )}
                  <View className={classnames(styles.actionBtn, styles.btnDetail)} onClick={() => handleDetail(payment)}>
                    查看详情
                  </View>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      <View className={styles.bottomBar}>
        {currentUser.role === 'admin' && (
          <View className={styles.btnExport} onClick={handleExport}>导出名单</View>
        )}
        <View
          className={currentUser.role === 'admin' ? styles.btnExport : styles.btnPayAll}
          style={currentUser.role !== 'admin' ? undefined : { flex: 2, background: 'linear-gradient(135deg, #165dff 0%, #4080ff 100%)', color: '#fff', border: 'none' }}
          onClick={currentUser.role === 'admin' ? handleExport : handlePayAll}
        >
          {currentUser.role === 'vendor' ? `一键支付 ¥${totalUnpaid.toLocaleString()}` : '导出数据'}
        </View>
      </View>
    </View>
  );
};

export default PaymentPage;
