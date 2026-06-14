import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';

type StatusType = 'success' | 'warning' | 'error' | 'info' | 'pending' | 'default';

interface StatusTagProps {
  text: string;
  type?: StatusType;
  size?: 'sm' | 'md';
}

const StatusTag: React.FC<StatusTagProps> = ({ text, type = 'default', size = 'md' }) => {
  return (
    <View className={classnames(styles.tag, styles[type], styles[size])}>
      <Text className={styles.tagText}>{text}</Text>
    </View>
  );
};

export default StatusTag;
