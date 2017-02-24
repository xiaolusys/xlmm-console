export default [{
  name: '排期',
  link: '/schedule',
  icon: 'calendar',
  external: false,
}, {
  name: '供应商',
  link: '/supplier',
  icon: 'solution',
  external: false,
}, {
  name: '选品类目',
  link: '/categories',
  icon: 'tags-o',
  external: false,
}, {
  name: 'App推送',
  link: '/apppushmsgs',
  icon: 'tags-o',
  external: false,
}, {
  name: '商城活动',
  link: '/activities',
  icon: 'tags-o',
  external: false,
}, {
  name: '九张图',
  link: '/ninepics',
  icon: 'tags-o',
  external: false,
}, {
  name: '运营操作',
  link: '/operations',
  icon: 'solution',
  external: false,
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
      name: '销售金额',
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
}];
