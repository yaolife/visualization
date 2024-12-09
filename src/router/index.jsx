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
    path: '/vehiclePositioning',
    exact: true,
    component: '@/pages/vehiclePositioning',//车辆定位点
    title: ''
  },
  {
    path: '/vehicleHistory',
    exact: true,
    component: '@/pages/vehicleHistory',//车辆历史轨迹
    title: ''
  },
  {
    path: '/personnelList',
    exact: true,
    component: '@/pages/personnelList',
    title: '人员列表'
  },
  {
    path: '/personnelTrajectory',
    exact: true,
    component: '@/pages/personnelTrajectory',//人员轨迹
    title: ''
  },
  {
    path: '/history',
    exact: true,
    component: '@/pages/history',//人员历史轨迹
    title: ''
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
    path: '/myTickets',
    exact: true,
    component: '@/pages/myTickets',
    title: ''
  },
  {
    path: '/ticketNavigation',
    exact: true,
    component: '@/pages/ticketNavigation',
    title: ''
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
