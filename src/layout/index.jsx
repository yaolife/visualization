// src/layout/index.jsx
import Header from '@/components/Navbar';
import { ConfigProvider, TabBar, Image } from 'antd-mobile';
import { useHistory, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { KeepAlive } from 'react-activation';
import { history } from 'umi';
import index from '@/images/index.png';
import activeIndex from '@/images/activeIndex.png';
import activePersonnel from '@/images/activePersonnel.png';
import personnel from '@/images/personnel.png';
import ticket from '@/images/ticket.png';
import activeTicket from '@/images/activeTicket.png';
import my from '@/images/my.png';
import activeMy from '@/images/activeMy.png';
import './index.less';

const Bottom = ({ activeKey, setActiveTab }) => {
  const history = useHistory();

  const setRouteActive = (value) => {
    history.push(value);
    setActiveTab(value);
  };

  const tabs = [
    {
      key: '/',
      title: '首页',
      icon: (active) =>
        active ? <Image src={activeIndex} width={32} height={32} /> : <Image src={index} width={32} height={32} />,
    },
    {
      key: '/personnel',
      title: '人员车辆',
      icon: (active) =>
        active ? <Image src={activePersonnel} width={32} height={32} /> : <Image src={personnel} width={32} height={32} />,
    },
    {
      key: '/myTickets',
      title: '作业票',
      icon: (active) =>
        active ? <Image src={activeTicket} width={32} height={32} /> : <Image src={ticket} width={32} height={32} />,
    },
    {
      key: '/my',
      title: '我的',
      icon: (active) =>
        active ? <Image src={activeMy} width={32} height={32} /> : <Image src={my} width={32} height={32} />,
    },
  ];

  return (
    <TabBar activeKey={activeKey} onChange={(value) => setRouteActive(value)}>
      {tabs.map((item) => (
        <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
      ))}
    </TabBar>
  );
};

const Layout = (props) => {
  const [title, setTitle] = useState('');
  const location = useLocation();
  const { pathname, state } = location; // 获取 state 参数
  const { children, route } = props;
  const isKeepAlive = route?.routes?.find((item) => item?.path === pathname)?.keepAlive || false;
  const [activeTab, setActiveTab] = useState(state?.activeTab || pathname); // 使用 state 中的 activeTab 或者 pathname

  useEffect(() => {
    if (children) {
      setTimeout(() => {
        setTitle(document.title);
      }, 100);
    }
  }, [children]);

  useEffect(() => {
    setActiveTab(state?.activeTab || pathname); // 更新 activeTab
  }, [pathname, state]);

  return (
    <>
      {/* <Header title={title} /> */}
      <ConfigProvider>
        <KeepAlive
          name={pathname}
          id={`${pathname}`}
          when={isKeepAlive}
          saveScrollPosition="screen"
        >
          {children}
        </KeepAlive>
      </ConfigProvider>
      <div className='bottom'>
        <Bottom activeKey={activeTab} setActiveTab={setActiveTab} />
      </div>
    </>
  );
};

export default Layout;