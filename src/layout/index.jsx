import Header from '@/components/Navbar';
import { ConfigProvider, TabBar } from 'antd-mobile';
import { useHistory, useLocation, BrowserRouter as Router } from 'react-router-dom';
import { AppOutline, MessageOutline, UnorderedListOutline, UserOutline } from 'antd-mobile-icons';
import { useEffect, useState } from 'react';
import { KeepAlive } from 'react-activation';
import { history } from 'umi';
import  './index.less';

const Bottom = () => {
  const history = useHistory();
  const location = useLocation();
  const { pathname } = location;

  const setRouteActive = (value) => {
    history.push(value);
  };

  const tabs = [
    {
      key: '/index',
      title: '首页',
      icon: <AppOutline />,
    },
    {
      key: '/personnel',
      title: '人员车辆',
      icon: <UnorderedListOutline />,
    },
    {
      key: '/job',
      title: '作业票',
      icon: <MessageOutline />,
    },
    {
      key: '/my',
      title: '我的',
      icon: <UserOutline />,
    },
  ];

  return (
    <TabBar activeKey={pathname} onChange={(value) => setRouteActive(value)}>
      {tabs.map((item) => (
        <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
      ))}
    </TabBar>
  );
};

const Layout = (props) => {
  const [title, setTitle] = useState('');
  const {
    location: { pathname, search },
  } = history;
  const { children, route } = props;
  const isKeepAlive = route?.routes?.find((item) => item?.path === pathname)?.keepAlive || false;

  useEffect(() => {
    if (children) {
      setTimeout(() => {
        setTitle(document.title);
      }, 100);
    }
  }, [children]);
  return (
    <>
      {/* <Header title={title} /> */}
      <ConfigProvider>
        <KeepAlive
          name={pathname}
          id={`${pathname}${search}`}
          when={isKeepAlive}
          saveScrollPosition="screen"
        >
          {children}
        </KeepAlive>
      </ConfigProvider>
      <div className='bottom'>
        <Bottom />
      </div>
    </>
  );
};

export default Layout;
