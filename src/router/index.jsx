const route = [
  { path: '/', component: '@/pages/index', title: '' },

  {
    path: '/login',
    component: '@/pages/login',
    title: '登录',
  },
  {
    path: '/personnel',
    exact: true,
    component: '@/pages/personnel',
    title: ''
  },
  {
    path: '/vehicleList',
    exact: true,
    component: '@/pages/vehicleList',
    title: '车辆列表'
  },
  {
    path: '/personnelList',
    exact: true,
    component: '@/pages/personnelList',
    title: '人员列表'
  },
  {
    path: '/electronicFenceList',
    exact: true,
    component: '@/pages/electronicFenceList',
    title: '电子围栏列表'
  },
  {
    path: '/collectionTickets',
    exact: true,
    component: '@/pages/collectionTickets',
    title: '作业票领取'
  },
  {
    path: '/personnel/:id',
    exact: true,
    component: '@/pages/personnel',
  },
  {
    path: '/job',
    exact: true,
    component: '@/pages/job',
    title: ''
  },
  {
    path: '/my',
    component: '@/pages/my',
  },
  {
    path: '/index',
    component: '@/pages/index',
  },
];

export default route;
