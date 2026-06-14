import React, { useEffect } from 'react';
import { useDidShow, useDidHide } from '@tarojs/taro';
import { UserProvider } from '@/store/user-context';
import './app.scss';

function App(props) {
  useEffect(() => {
    console.log('[App] 应用启动');
  });

  useDidShow(() => {
    console.log('[App] 页面显示');
  });

  useDidHide(() => {
    console.log('[App] 页面隐藏');
  });

  return (
    <UserProvider>
      {props.children}
    </UserProvider>
  );
}

export default App;
