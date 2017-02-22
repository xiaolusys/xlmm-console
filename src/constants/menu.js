export default [{
  name: '排期',
  link: '/schedule',
  icon: 'calendar',
}, {
  name: '供应商',
  link: '/supplier',
  icon: 'solution',
}, {
  name: '选品类目',
  link: '/categories',
  icon: 'tags-o',
}, {
  name: 'App推送',
  link: '/apppushmsgs',
  icon: 'tags-o',
}, {
  name: '商城活动',
  link: '/activities',
  icon: 'tags-o',
}, {
  name: '九张图',
  link: '/ninepics',
  icon: 'tags-o',
}, {
  name: '运营操作',
  link: '/operations',
  icon: 'solution',
}, {
  name: '数据统计',
  link: '/statistics',
  icon: 'line-chart',
  sub: [
    {
      name: '销售金额',
      link: '/statistics/sales',
      icon: 'pay-circle-o',
    },
    {
      name: '发货速度',
      link: '/statistics/delivery',
      icon: 'inbox',
    },
  ],
}];
