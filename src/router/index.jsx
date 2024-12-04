const route = [
  { path: '/', component: '@/pages/home' },

  {
    path: '/login',
    component: '@/pages/login',
    title: '登录',
  },
  {
    path: '/',
    component: '@/pages/home',
    title: '主页',
  },
  {
    path: '/personnel',
    exact: true,
    component: '@/pages/Personnel',
  },
  {
    path: '/personnel/:id',
    exact: true,
    component: '@/pages/Personnel',
  },
  {
    path: '/job',
    component: '@/pages/job',
  },
  {
    path: '/my',
    component: '@/pages/my',
  },
];

export default route;
