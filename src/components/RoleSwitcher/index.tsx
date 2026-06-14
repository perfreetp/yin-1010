import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import { useUser } from '@/store/user-context';
import { UserRole } from '@/types';
import styles from './index.module.scss';

const RoleSwitcher: React.FC = () => {
  const { currentUser, setRole } = useUser();

  const roles: { key: UserRole; label: string }[] = [
    { key: 'vendor', label: '摊主' },
    { key: 'admin', label: '管理员' },
    { key: 'patrol', label: '巡场' }
  ];

  return (
    <View className={styles.container}>
      <Text className={styles.label}>当前角色：</Text>
      <View className={styles.tabs}>
        {roles.map(role => (
          <View
            key={role.key}
            className={classnames(styles.tab, currentUser.role === role.key && styles.active)}
            onClick={() => setRole(role.key)}
          >
            <Text className={classnames(styles.tabText, currentUser.role === role.key && styles.activeText)}>
              {role.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default RoleSwitcher;
