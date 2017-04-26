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
      name: 'App海报',
      link: '/appbanners',
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
      name: '排期管理',
      link: '/schedule',
      icon: 'calendar',
      external: false,
    },
    {
      name: '推广操作',
      link: '/operations',
      icon: 'inbox',
      external: false,
    },
    {
      name: '微信推广',
      link: '/admin/weixin/',
      icon: 'star',
      external: true,
    },
    {
      name: '优惠券',
      link: '/admin/coupon/',
      icon: 'star',
      external: true,
    },
  ],
}, {
  name: '用户管理',
  link: '/#1',
  icon: 'user',
  external: false,
  sub: [
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
      name: '小鹿妈妈',
      link: '/admin/xiaolumm/',
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
    {
      name: '商品库存',
      link: '/admin/items/skustock/',
      icon: 'star',
      external: true,
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
      name: '退换货',
      link: '/admin/pay/salerefund/',
      icon: 'star',
      external: true,
    },
    {
      name: '快递列表',
      link: '/admin/logistics/logisticscompany/',
      icon: 'star',
      external: true,
    },
    {
       name: '包裹列表',
       link: '/packageorder',
       icon: 'star',
       external: false,
     },
    {
       name: '包裹商品列表',
       link: '/admin/trades/packageskuitem/',
       icon: 'star',
       external: true,
     },
  ],
}, {
  name: '采购管理',
  link: '/#4',
  icon: 'folder',
  external: false,
  sub: [
    {
      name: '供应商',
      link: '/supplier',
      icon: 'solution',
      external: false,
    },
    {
      name: '订货单',
      link: '/admin/dinghuo/orderlist/',
      icon: 'solution',
      external: true,
    },
    {
      name: '预测到货单',
      link: '/admin/forecast/forecastinbound/',
      icon: 'solution',
      external: true,
    },
    {
      name: '入仓单',
      link: '/admin/dinghuo/inbound/',
      icon: 'solution',
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
      name: '用户/销售',
      link: '/admin/daystats/dailystat/',
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
  link: '/#5',
  icon: 'folder',
  external: false,
  sub: [
    {
      name: '仓库列表',
      link: '/admin/warehouse/warehouse/',
      icon: 'star',
      external: true,
    },
    {
      name: '蜂巢供应链',
      link: '/admin/outware/',
      icon: 'star',
      external: true,
    },
  ],
}];
