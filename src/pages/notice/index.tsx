import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import StatusTag from '@/components/StatusTag';
import { useUser } from '@/store/user-context';
import { mockNotices } from '@/data/notices';
import { Notice, NoticeType } from '@/types';
import styles from './index.module.scss';

const typeLabel: Record<NoticeType, string> = {
  market_close: '停市通知',
  stall_change: '摊位调整',
  general: '普通公告'
};

const NoticePage: React.FC = () => {
  const { currentUser } = useUser();
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  const notices = useMemo(() => {
    return [...mockNotices].sort((a, b) => {
      if (a.isTop !== b.isTop) return b.isTop ? 1 : -1;
      return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
    });
  }, []);

  const handleNoticeClick = (notice: Notice) => {
    console.log('[NoticePage] 查看公告:', notice.id);
    setSelectedNotice(notice);
  };

  const handlePublish = () => {
    console.log('[NoticePage] 发布新公告');
    Taro.showToast({ title: '发布功能开发中', icon: 'none' });
  };

  const getTypeClass = (type: NoticeType) => {
    if (type === 'market_close') return styles.typeClose;
    if (type === 'stall_change') return styles.typeChange;
    return styles.typeGeneral;
  };

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.title}>通知公告</Text>
        {currentUser.role === 'admin' && (
          <View className={styles.publishBtn} onClick={handlePublish}>
            + 发布公告
          </View>
        )}
      </View>

      {notices.length === 0 ? (
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>📢</Text>
          <Text className={styles.emptyText}>暂无通知公告</Text>
        </View>
      ) : (
        <ScrollView scrollY>
          <View className={styles.noticeList}>
            {notices.map(notice => (
              <View
                key={notice.id}
                className={styles.noticeCard}
                onClick={() => handleNoticeClick(notice)}
              >
                {notice.isTop && <View className={styles.topBadge}>置顶</View>}
                <View className={styles.noticeHeader}>
                  <Text className={styles.noticeTitle}>{notice.title}</Text>
                  <View className={classnames(styles.typeTag, getTypeClass(notice.type))}>
                    {typeLabel[notice.type]}
                  </View>
                </View>
                <Text
                  style={{
                    fontSize: '28rpx',
                    color: '#4e5969',
                    lineHeight: 1.6,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}
                >
                  {notice.content}
                </Text>
                <View className={styles.noticeMeta}>
                  <Text className={styles.publisher}>{notice.publisher}</Text>
                  <Text className={styles.publishDate}>{notice.publishDate}</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      {selectedNotice && (
        <View className={styles.modalMask} onClick={() => setSelectedNotice(null)}>
          <View className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <View className={styles.modalHeader}>
              <Text className={styles.modalTitle}>公告详情</Text>
              <View className={styles.closeBtn} onClick={() => setSelectedNotice(null)}>✕</View>
            </View>
            <ScrollView scrollY className={styles.modalBody}>
              <Text className={styles.detailTitle}>{selectedNotice.title}</Text>
              <View className={styles.detailMeta}>
                <StatusTag text={typeLabel[selectedNotice.type]} type={selectedNotice.type === 'market_close' ? 'error' : selectedNotice.type === 'stall_change' ? 'warning' : 'info'} size="sm" />
                <Text style={{ fontSize: '24rpx', color: '#86909c' }}>{selectedNotice.publisher}</Text>
                <Text style={{ fontSize: '24rpx', color: '#86909c' }}>{selectedNotice.publishDate}</Text>
              </View>
              <Text className={styles.detailContent}>{selectedNotice.content}</Text>
            </ScrollView>
          </View>
        </View>
      )}
    </View>
  );
};

export default NoticePage;
