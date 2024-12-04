import React from 'react'
import { NavBar, TabBar,Image } from 'antd-mobile'
import {
  Route,
  Switch,
  useHistory,
  useLocation,
  MemoryRouter as Router,
} from 'react-router-dom'
import {
  AppOutline,
  MessageOutline,
  UnorderedListOutline,
  UserOutline,
} from 'antd-mobile-icons'
import area from "@/images/area.png"
import Personnel from "@/pages/Personnel"
import Job from "@/pages/job"
import Home from "@/pages/home"
import My from "@/pages/my"
import styles from './index.less'

const Bottom = () => {
  const history = useHistory()
  const location = useLocation()
  const { pathname } = location

  const setRouteActive = (value) => {
    history.push(value)
  }

  const tabs = [
    {
      key: '/home',
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
  ]

  return (
    <TabBar activeKey={pathname} onChange={value => setRouteActive(value)}>
      {tabs.map(item => (
        <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
      ))}
    </TabBar>
  )
}

export default () => {
  return (
    <Router initialEntries={['/home']}>  
      <div className={styles.app}> 
      {/* <div className={styles.image}> <Image src={area} width={'100%'} height={'100%'} fit='fill' /></div> */}
        <div className={styles.body}>
      
          <Switch>       
            <Route exact path='/personnel'>
              <Personnel />
            </Route>
            <Route exact path='/job'>
              <Job />
            </Route>
            <Route exact path='/my'>
              <My />
            </Route>
          </Switch>
        </div>
        <div className={styles.bottom}>
          <Bottom />
        </div>
      </div>
    </Router>
  )
}