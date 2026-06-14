import React, { useState, useMemo } from 'react';
import { View, Text, Input, Textarea, Image } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import StatusTag from '@/components/StatusTag';
import { mockStalls } from '@/data/stalls';
import { mockInspections, getTodayInspections } from '@/data/inspections';
import { ViolationType } from '@/types';
import styles from './index.module.scss';

const types: { key: ViolationType; label: string; icon: string; iconClass: string }[] = [
  { key: 'absent', label: '缺席', icon: '❌', iconClass: 'iconAbsent' },
  { key: 'occupying', label: '占道', icon: '🚧', iconClass: 'iconOccupying' },
  { key: 'unhygienic', label: '卫生', icon: '🧹', iconClass: 'iconHygiene' },
  { key: 'other', label: '其他', icon: '📋', iconClass: 'iconOther' }
];

const InspectionPage: React.FC = () => {
  const router = useRouter();
  const initialType = (router.params.type as ViolationType) || 'absent';

  const [formData, setFormData] = useState({
    type: initialType as ViolationType,
    stallId: '',
    description: '',
    hygieneScore: 0,
    photos: [] as string[]
  });

  const todayRecords = useMemo(() => getTodayInspections(), []);

  const updateField = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSelectStall = () => {
    console.log('[InspectionPage] 选择摊位');
    const stallNos = mockStalls.map(s => `${s.stallNo} - ${s.status === 'rented' ? (s.vendorName || '已租') : s.status}`);
    Taro.showActionSheet({
      itemList: stallNos,
      success: (res) => {
        updateField('stallId', mockStalls[res.tapIndex].id);
      }
    });
  };

  const handleAddPhoto = () => {
    console.log('[InspectionPage] 添加照片');
    Taro.chooseImage({
      count: 3 - formData.photos.length,
      success: (res) => {
        updateField('photos', [...formData.photos, ...res.tempFilePaths]);
      },
      fail: () => {
        Taro.showToast({ title: '拍照功能模拟', icon: 'none' });
        if (formData.photos.length < 3) {
          updateField('photos', [...formData.photos, 'https://picsum.photos/id/201/300/200']);
        }
      }
    });
  };

  const handleRemovePhoto = (index: number) => {
    const newPhotos = formData.photos.filter((_, i) => i !== index);
    updateField('photos', newPhotos);
  };

  const handleSubmit = () => {
    console.log('[InspectionPage] 提交检查记录:', formData);
    if (!formData.stallId) {
      Taro.showToast({ title: '请选择摊位', icon: 'none' });
      return;
    }
    if (!formData.description) {
      Taro.showToast({ title: '请填写问题描述', icon: 'none' });
      return;
    }
    Taro.showModal({
      title: '提交确认',
      content: '确认提交该检查记录？',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '提交成功', icon: 'success' });
          setTimeout(() => Taro.navigateBack(), 1500);
        }
      }
    });
  };

  const selectedStall = mockStalls.find(s => s.id === formData.stallId);
  const typeInfo = types.find(t => t.key === formData.type)!;

  return (
    <View className={styles.page}>
      <View className={styles.typeSelector}>
        {types.map(type => (
          <View
            key={type.key}
            className={classnames(styles.typeItem, formData.type === type.key && styles.typeItemActive)}
            onClick={() => updateField('type', type.key)}
          >
            <View className={classnames(styles.typeIcon, styles[type.iconClass])}>
              <Text>{type.icon}</Text>
            </View>
            <Text className={classnames(styles.typeLabel, formData.type === type.key && styles.typeLabelActive)}>
              {type.label}
            </Text>
          </View>
        ))}
      </View>

      <View className={styles.formSection}>
        <View className={styles.sectionTitle}>
          <View className={styles.titleBar} />
          <Text>{typeInfo.label}登记</Text>
        </View>
        <View className={styles.formItem}>
          <Text className={styles.label}>
            <Text className={styles.required}>*</Text>选择摊位
          </Text>
          <View className={styles.pickerBox} onClick={handleSelectStall}>
            <Text className={selectedStall ? styles.pickerValue : styles.pickerPlaceholder}>
              {selectedStall ? `${selectedStall.stallNo}${selectedStall.vendorName ? ' - ' + selectedStall.vendorName : ''}` : '请选择摊位'}
            </Text>
            <Text style={{ color: '#86909c' }}>›</Text>
          </View>
        </View>
        <View className={styles.formItem}>
          <Text className={styles.label}>
            <Text className={styles.required}>*</Text>问题描述
          </Text>
          <Textarea
            className={styles.textarea}
            placeholder="请详细描述检查发现的问题"
            value={formData.description}
            onInput={(e) => updateField('description', e.detail.value)}
          />
        </View>
        {formData.type === 'unhygienic' && (
          <View className={styles.formItem}>
            <View className={styles.hygieneSection}>
              <Text className={styles.hygieneLabel}>卫生评分</Text>
              <View className={styles.hygieneStars}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(score => (
                  <View
                    key={score}
                    className={styles.star}
                    onClick={() => updateField('hygieneScore', score)}
                  >
                    <Text style={{ opacity: score <= formData.hygieneScore ? 1 : 0.3 }}>
                      {score <= formData.hygieneScore ? '⭐' : '☆'}
                    </Text>
                  </View>
                ))}
              </View>
              <Text style={{ marginTop: '16rpx', fontSize: '24rpx', color: '#86909c' }}>
                当前评分：{formData.hygieneScore}/10
              </Text>
            </View>
          </View>
        )}
        <View className={styles.formItem}>
          <View className={styles.photoSection}>
            <Text className={styles.photoLabel}>拍照取证（{formData.photos.length}/3）</Text>
            <View className={styles.photoGrid}>
              {formData.photos.map((photo, index) => (
                <View key={index} className={styles.photoItem} onClick={() => handleRemovePhoto(index)}>
                  <Image src={photo} className={styles.photoImg} mode="aspectFill" />
                </View>
              ))}
              {formData.photos.length < 3 && (
                <View className={classnames(styles.photoItem, styles.photoAdd)} onClick={handleAddPhoto}>
                  <Text className={styles.photoAddIcon}>📷</Text>
                  <Text className={styles.photoAddText}>添加照片</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>

      <View className={styles.historySection}>
        <View className={styles.sectionTitle}>
          <View className={styles.titleBar} />
          <Text>今日记录</Text>
          <Text style={{ marginLeft: '16rpx', fontSize: '24rpx', color: '#86909c' }}>
            共{todayRecords.length}条
          </Text>
        </View>
        {todayRecords.length === 0 ? (
          <View style={{ padding: '48rpx 0', textAlign: 'center' }}>
            <Text style={{ fontSize: '28rpx', color: '#86909c' }}>今日暂无记录</Text>
          </View>
        ) : (
          todayRecords.slice(0, 5).map(record => (
            <View key={record.id} className={styles.historyItem}>
              <View className={styles.historyIcon}>
                <Text>{record.type === 'absent' ? '❌' : record.type === 'occupying' ? '🚧' : record.type === 'unhygienic' ? '🧹' : '📋'}</Text>
              </View>
              <View className={styles.historyContent}>
                <Text className={styles.historyTitle}>
                  摊位{record.stallNo}
                  <StatusTag
                    text={record.type === 'absent' ? '缺席' : record.type === 'occupying' ? '占道' : record.type === 'unhygienic' ? '卫生' : '其他'}
                    type={record.type === 'absent' ? 'error' : record.type === 'occupying' ? 'warning' : record.type === 'unhygienic' ? 'success' : 'info'}
                    size="sm"
                    style={{ marginLeft: '16rpx' }}
                  />
                </Text>
                <Text className={styles.historyDesc}>{record.description}</Text>
                <Text className={styles.historyDate}>{record.date} · {record.inspectorName}</Text>
              </View>
            </View>
          ))
        )}
      </View>

      <View className={styles.bottomBar}>
        <View className={styles.btnCancel} onClick={() => Taro.navigateBack()}>取消</View>
        <View className={styles.btnSubmit} onClick={handleSubmit}>提交记录</View>
      </View>
    </View>
  );
};

export default InspectionPage;
