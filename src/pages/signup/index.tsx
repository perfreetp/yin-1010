import React, { useState, useMemo } from 'react';
import { View, Text, Input, Textarea } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { getStallById } from '@/data/stalls';
import styles from './index.module.scss';

const categories = ['熟食小吃', '水果零售', '服饰百货', '生鲜蔬菜', '日用百货', '手工艺品', '冰饮奶茶', '鲜花绿植', '玩具饰品', '特色小吃', '农副产品', '早餐早点'];

const SignupPage: React.FC = () => {
  const router = useRouter();
  const stallId = router.params.stallId as string;
  const stall = useMemo(() => stallId ? getStallById(stallId) : null, [stallId]);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    idCard: '',
    category: '',
    remark: ''
  });

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSelectCategory = () => {
    console.log('[SignupPage] 选择经营品类');
    Taro.showActionSheet({
      itemList: categories,
      success: (res) => {
        updateField('category', categories[res.tapIndex]);
      }
    });
  };

  const handleUpload = (type: string) => {
    console.log('[SignupPage] 上传证件:', type);
    Taro.showToast({ title: '上传功能开发中', icon: 'none' });
  };

  const handleSubmit = () => {
    console.log('[SignupPage] 提交报名:', formData);
    if (!formData.name || !formData.phone || !formData.idCard || !formData.category) {
      Taro.showToast({ title: '请填写完整信息', icon: 'none' });
      return;
    }
    Taro.showModal({
      title: '提交确认',
      content: '确认提交报名申请？提交后管理员将在1-3个工作日内审核。',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '提交成功', icon: 'success' });
          setTimeout(() => Taro.navigateBack(), 1500);
        }
      }
    });
  };

  return (
    <View className={styles.page}>
      {stall && (
        <View className={styles.formSection}>
          <View className={styles.stallInfo}>
            <View className={styles.stallDetail}>
              <Text className={styles.stallNo}>摊位 {stall.stallNo}</Text>
              <Text className={styles.stallPrice}>日租金 ¥{stall.price} · {stall.zone}区</Text>
            </View>
            <View className={styles.stallStatus}>可租</View>
          </View>
        </View>
      )}

      <View className={styles.formSection}>
        <View className={styles.sectionTitle}>
          <View className={styles.titleBar} />
          <Text>基本信息</Text>
        </View>
        <View className={styles.formItem}>
          <Text className={styles.label}>
            <Text className={styles.required}>*</Text>摊主姓名
          </Text>
          <Input
            className={styles.input}
            placeholder="请输入真实姓名"
            value={formData.name}
            onInput={(e) => updateField('name', e.detail.value)}
          />
        </View>
        <View className={styles.formItem}>
          <Text className={styles.label}>
            <Text className={styles.required}>*</Text>联系电话
          </Text>
          <Input
            className={styles.input}
            placeholder="请输入手机号码"
            type="phone"
            value={formData.phone}
            onInput={(e) => updateField('phone', e.detail.value)}
          />
        </View>
        <View className={styles.formItem}>
          <Text className={styles.label}>
            <Text className={styles.required}>*</Text>身份证号
          </Text>
          <Input
            className={styles.input}
            placeholder="请输入身份证号码"
            value={formData.idCard}
            onInput={(e) => updateField('idCard', e.detail.value)}
          />
        </View>
        <View className={styles.formItem}>
          <Text className={styles.label}>
            <Text className={styles.required}>*</Text>经营品类
          </Text>
          <View className={styles.pickerBox} onClick={handleSelectCategory}>
            <Text className={formData.category ? styles.pickerValue : styles.pickerPlaceholder}>
              {formData.category || '请选择经营品类'}
            </Text>
            <Text style={{ color: '#86909c' }}>›</Text>
          </View>
        </View>
        <View className={styles.formItem}>
          <Text className={styles.label}>备注说明</Text>
          <Textarea
            className={styles.textarea}
            placeholder="请输入备注信息（选填）"
            value={formData.remark}
            onInput={(e) => updateField('remark', e.detail.value)}
          />
        </View>
      </View>

      <View className={styles.formSection}>
        <View className={styles.sectionTitle}>
          <View className={styles.titleBar} />
          <Text>证件上传</Text>
        </View>
        <View className={styles.uploadSection}>
          <View className={styles.uploadItem}>
            <View className={styles.uploadInfo}>
              <View className={styles.uploadIcon}>📄</View>
              <View className={styles.uploadText}>
                <Text className={styles.uploadLabel}>营业执照</Text>
                <Text className={styles.uploadHint}>支持JPG/PNG格式</Text>
              </View>
            </View>
            <View className={styles.uploadBtn} onClick={() => handleUpload('license')}>上传</View>
          </View>
          <View className={styles.uploadItem}>
            <View className={styles.uploadInfo}>
              <View className={styles.uploadIcon}>🪪</View>
              <View className={styles.uploadText}>
                <Text className={styles.uploadLabel}>身份证正面</Text>
                <Text className={styles.uploadHint}>支持JPG/PNG格式</Text>
              </View>
            </View>
            <View className={styles.uploadBtn} onClick={() => handleUpload('idFront')}>上传</View>
          </View>
          <View className={styles.uploadItem}>
            <View className={styles.uploadInfo}>
              <View className={styles.uploadIcon}>🪪</View>
              <View className={styles.uploadText}>
                <Text className={styles.uploadLabel}>身份证反面</Text>
                <Text className={styles.uploadHint}>支持JPG/PNG格式</Text>
              </View>
            </View>
            <View className={styles.uploadBtn} onClick={() => handleUpload('idBack')}>上传</View>
          </View>
        </View>
      </View>

      <View className={styles.bottomBar}>
        <View className={styles.btnCancel} onClick={() => Taro.navigateBack()}>取消</View>
        <View className={styles.btnSubmit} onClick={handleSubmit}>提交申请</View>
      </View>
    </View>
  );
};

export default SignupPage;
