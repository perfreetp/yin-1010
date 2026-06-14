import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  color?: 'primary' | 'success' | 'warning' | 'error';
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, unit, color = 'primary', onClick }) => {
  return (
    <View className={`${styles.statCard} ${styles[color]}`} onClick={onClick}>
      <Text className={styles.value}>
        {value}
        {unit && <Text className={styles.unit}>{unit}</Text>}
      </Text>
      <Text className={styles.label}>{label}</Text>
    </View>
  );
};

export default StatCard;
