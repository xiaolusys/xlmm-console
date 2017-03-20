export default [{
  name: '商城运维',
  link: '/',
  icon: 'home',
  external: false,
  sub: [
    {
      name: '商城活动',
      link: '/activities',
      icon: 'star',
      external: false,
    },
    {
      name: 'App推送',
      link: '/apppushmsgs',
      icon: 'star',
      external: false,
    },
    {
      name: '九张图',
      link: '/ninepics',
      icon: 'pay-circle-o',
      external: false,
    },
    {
      name: '推广设置',
      link: '/operations',
      icon: 'inbox',
      external: false,
    },
    {
      name: '排期',
      link: '/schedule',
      icon: 'calendar',
      external: false,
    },
  ],
}, {
  name: '用户管理',
  link: '/#1',
  icon: 'user',
  external: false,
  sub: [
    {
      name: '小鹿妈妈',
      link: '/admin/xiaolumm/',
      icon: 'star',
      external: true,
    },
    {
      name: '用户列表',
      link: '/admin/pay/customer/',
      icon: 'star',
      external: true,
    },
    {
      name: '地址列表',
      link: '/admin/pay/useraddress/',
      icon: 'star',
      external: true,
    },
    {
      name: '微信推广',
      link: '/admin/weixin/',
      icon: 'star',
      external: true,
    },
  ],
}, {
  name: '商品管理',
  link: '/#2',
  icon: 'folder',
  external: false,
  sub: [
    {
      name: '商品列表',
      link: '/stockproducts',
      icon: 'star',
      external: false,
    },
    {
      name: '类目列表',
      link: '/categories',
      icon: 'star',
      external: false,
    },
  ],
}, {
  name: '订单管理',
  link: '/#3',
  icon: 'folder',
  external: false,
  sub: [
    {
      name: '订单列表',
      link: '/admin/pay/saletrade/',
      icon: 'star',
      external: true,
    },
    {
      name: '快递列表',
      link: '/admin/logistics/logisticscompany/',
      icon: 'star',
      external: true,
    },
  ],
}, {
  name: '数据统计',
  link: '/statistics',
  icon: 'line-chart',
  external: false,
  sub: [
    {
      name: '商城统计',
      link: '/sale/daystats/yunying/',
      icon: 'star',
      external: true,
    },
    {
      name: '类目销售',
      link: '/statistics/sales',
      icon: 'pay-circle-o',
      external: false,
    },
    {
      name: '发货速度',
      link: '/statistics/delivery',
      icon: 'inbox',
      external: false,
    },
  ],
}, {
  name: '供应链对接',
  link: '/#4',
  icon: 'folder',
  external: false,
  sub: [
    {
      name: '蜂巢',
      link: '/admin/outware/',
      icon: 'star',
      external: true,
    },
  ],
}];
