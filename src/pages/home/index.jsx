import React from 'react';
import { NavBar, TabBar, Image } from 'antd-mobile';
import { Route, Switch, useHistory, useLocation, BrowserRouter as Router } from 'react-router-dom';
import { AppOutline, MessageOutline, UnorderedListOutline, UserOutline } from 'antd-mobile-icons';
import Personnel from '@/pages/personnel';
import Layout from '@/layout';
import Job from '@/pages/job';
import Home from '@/pages/home';
import Index from '@/pages/index';
import My from '@/pages/my';
import styles from './index.less';


export default () => {
  return (
    <Router initialEntries={['/index']}>
      <div className={styles.app}>
        <div className={styles.body}>
          <Switch>
            <Route exact path="/index">
              <Index />
            </Route>
            <Route exact path="/personnel">
              <Personnel />
            </Route>
            <Route exact path="/job">
              <Job />
            </Route>
            <Route exact path="/my">
              <My />
            </Route>
          </Switch>
        </div>  
        <Layout /> 
      </div>
    </Router>
  );
};
