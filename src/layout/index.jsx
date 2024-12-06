import Header from '@/components/Navbar';
import { ConfigProvider, TabBar,Image } from 'antd-mobile';
import { useHistory, useLocation, BrowserRouter as Router } from 'react-router-dom';
import { AppOutline, MessageOutline, UnorderedListOutline, UserOutline } from 'antd-mobile-icons';
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
import  './index.less';
import Index from '@/pages/personnel';

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
      key: '/job',
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
