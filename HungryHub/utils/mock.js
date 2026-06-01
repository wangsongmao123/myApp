// 模拟商家数据
const shops = [
  {
    id: 1,
    name: '老张黄焖鸡米饭',
    logo: '/images/shop1.png',
    rating: 4.8,
    monthlySales: 3285,
    minPrice: 20,
    deliveryFee: 3,
    deliveryTime: '30分钟',
    distance: '1.2km',
    tags: ['黄焖鸡', '米饭', '热门'],
    notice: '欢迎光临，本店食材新鲜，品质保证',
    categories: ['热销推荐', '黄焖系列', '米饭套餐', '小食饮品'],
    foods: [
      { id: 101, name: '黄焖鸡米饭', price: 22, sales: 1892, img: '/images/food1.png', desc: '秘制酱料，鲜嫩鸡肉', cate: '黄焖系列' },
      { id: 102, name: '黄焖排骨饭', price: 26, sales: 1256, img: '/images/food2.png', desc: '精选排骨，软烂入味', cate: '黄焖系列' },
      { id: 103, name: '黄焖牛肉饭', price: 28, sales: 986, img: '/images/food3.png', desc: '上等牛腩，浓香四溢', cate: '黄焖系列' },
      { id: 104, name: '香菇滑鸡饭', price: 18, sales: 756, img: '/images/food4.png', desc: '嫩滑鸡肉搭配香菇', cate: '米饭套餐' },
      { id: 105, name: '红烧肉饭', price: 24, sales: 1023, img: '/images/food5.png', desc: '肥而不腻，入口即化', cate: '米饭套餐' },
      { id: 106, name: '酸梅汤', price: 8, sales: 567, img: '/images/drink1.png', desc: '冰镇解渴', cate: '小食饮品' },
      { id: 107, name: '凉拌黄瓜', price: 10, sales: 432, img: '/images/food6.png', desc: '清脆爽口', cate: '小食饮品' }
    ]
  },
  {
    id: 2,
    name: '幸福西饼屋',
    logo: '/images/shop2.png',
    rating: 4.9,
    monthlySales: 5621,
    minPrice: 15,
    deliveryFee: 2,
    deliveryTime: '25分钟',
    distance: '0.8km',
    tags: ['蛋糕', '甜品', '下午茶'],
    notice: '新鲜烘焙，每日现做',
    categories: ['热销推荐', '经典蛋糕', '面包吐司', '饮品甜点'],
    foods: [
      { id: 201, name: '草莓奶油蛋糕', price: 38, sales: 2356, img: '/images/cake1.png', desc: '新鲜草莓搭配动物奶油', cate: '经典蛋糕' },
      { id: 202, name: '巧克力慕斯', price: 32, sales: 1876, img: '/images/cake2.png', desc: '浓郁巧克力，丝滑口感', cate: '经典蛋糕' },
      { id: 203, name: '提拉米苏', price: 35, sales: 1654, img: '/images/cake3.png', desc: '经典意大利甜品', cate: '经典蛋糕' },
      { id: 204, name: '全麦吐司', price: 12, sales: 987, img: '/images/bread1.png', desc: '健康全麦，麦香浓郁', cate: '面包吐司' },
      { id: 205, name: '牛角包', price: 15, sales: 1234, img: '/images/bread2.png', desc: '酥脆外皮，层层分明', cate: '面包吐司' },
      { id: 206, name: '拿铁咖啡', price: 18, sales: 876, img: '/images/drink2.png', desc: '现磨咖啡，醇香顺滑', cate: '饮品甜点' }
    ]
  },
  {
    id: 3,
    name: '川味小馆',
    logo: '/images/shop3.png',
    rating: 4.7,
    monthlySales: 4521,
    minPrice: 25,
    deliveryFee: 4,
    deliveryTime: '35分钟',
    distance: '1.8km',
    tags: ['川菜', '麻辣', '地道'],
    notice: '正宗川味，麻辣鲜香',
    categories: ['热销推荐', '经典川菜', '麻辣香锅', '凉菜小吃', '主食'],
    foods: [
      { id: 301, name: '水煮鱼', price: 48, sales: 2134, img: '/images/food7.png', desc: '鲜嫩鱼片，麻辣鲜香', cate: '经典川菜' },
      { id: 302, name: '麻婆豆腐', price: 22, sales: 1876, img: '/images/food8.png', desc: '麻辣嫩滑，下饭神器', cate: '经典川菜' },
      { id: 303, name: '回锅肉', price: 32, sales: 1654, img: '/images/food9.png', desc: '肥而不腻，经典川味', cate: '经典川菜' },
      { id: 304, name: '麻辣香锅', price: 38, sales: 1432, img: '/images/food10.png', desc: '自选食材，麻辣过瘾', cate: '麻辣香锅' },
      { id: 305, name: '蒜泥白肉', price: 26, sales: 876, img: '/images/food11.png', desc: '蒜香浓郁，开胃爽口', cate: '凉菜小吃' },
      { id: 306, name: '蛋炒饭', price: 12, sales: 654, img: '/images/food12.png', desc: '粒粒分明，香气扑鼻', cate: '主食' }
    ]
  },
  {
    id: 4,
    name: '日式拉面屋',
    logo: '/images/shop4.png',
    rating: 4.6,
    monthlySales: 2876,
    minPrice: 25,
    deliveryFee: 3,
    deliveryTime: '30分钟',
    distance: '1.5km',
    tags: ['日料', '拉面', '寿司'],
    notice: '正宗日式风味，匠心制作',
    categories: ['热销推荐', '拉面系列', '丼饭系列', '小食饮品'],
    foods: [
      { id: 401, name: '豚骨拉面', price: 32, sales: 1567, img: '/images/noodle1.png', desc: '浓郁骨汤，筋道拉面', cate: '拉面系列' },
      { id: 402, name: '味噌拉面', price: 30, sales: 1234, img: '/images/noodle2.png', desc: '日式味噌，醇厚汤底', cate: '拉面系列' },
      { id: 403, name: '牛肉丼', price: 35, sales: 987, img: '/images/rice1.png', desc: '肥牛铺满，酱汁浓郁', cate: '丼饭系列' },
      { id: 404, name: '天妇罗定食', price: 38, sales: 756, img: '/images/food13.png', desc: '酥脆天妇罗搭配米饭', cate: '丼饭系列' },
      { id: 405, name: '日式煎饺', price: 16, sales: 654, img: '/images/food14.png', desc: '皮薄馅大，底部焦脆', cate: '小食饮品' },
      { id: 406, name: '抹茶拿铁', price: 15, sales: 432, img: '/images/drink3.png', desc: '日式抹茶，清香回甘', cate: '小食饮品' }
    ]
  },
  {
    id: 5,
    name: '汉堡大王',
    logo: '/images/shop5.png',
    rating: 4.5,
    monthlySales: 6234,
    minPrice: 18,
    deliveryFee: 2,
    deliveryTime: '20分钟',
    distance: '0.6km',
    tags: ['汉堡', '炸鸡', '快餐'],
    notice: '新鲜现做，美味快捷',
    categories: ['热销推荐', '超值套餐', '汉堡系列', '小食饮品'],
    foods: [
      { id: 501, name: '经典牛肉堡', price: 22, sales: 3456, img: '/images/burger1.png', desc: '厚实牛肉饼，新鲜蔬菜', cate: '汉堡系列' },
      { id: 502, name: '香辣鸡腿堡', price: 20, sales: 2876, img: '/images/burger2.png', desc: '香辣鸡腿，外酥里嫩', cate: '汉堡系列' },
      { id: 503, name: '巨无霸套餐', price: 36, sales: 2345, img: '/images/meal1.png', desc: '汉堡+薯条+可乐', cate: '超值套餐' },
      { id: 504, name: '鸡腿堡套餐', price: 32, sales: 1876, img: '/images/meal2.png', desc: '鸡腿堡+鸡翅+可乐', cate: '超值套餐' },
      { id: 505, name: '黄金鸡块', price: 12, sales: 1567, img: '/images/food15.png', desc: '鲜嫩多汁，金黄酥脆', cate: '小食饮品' },
      { id: 506, name: '香芋派', price: 8, sales: 1234, img: '/images/food16.png', desc: '外酥内软，甜而不腻', cate: '小食饮品' }
    ]
  },
  {
    id: 6,
    name: '健康轻食沙拉',
    logo: '/images/shop6.png',
    rating: 4.8,
    monthlySales: 2345,
    minPrice: 20,
    deliveryFee: 2,
    deliveryTime: '25分钟',
    distance: '1.0km',
    tags: ['轻食', '沙拉', '健康'],
    notice: '新鲜食材，健康每一天',
    categories: ['热销推荐', '沙拉系列', '三明治', '果蔬饮品'],
    foods: [
      { id: 601, name: '凯撒沙拉', price: 28, sales: 1234, img: '/images/salad1.png', desc: '罗马生菜配凯撒酱', cate: '沙拉系列' },
      { id: 602, name: '牛油果鸡肉沙拉', price: 35, sales: 987, img: '/images/salad2.png', desc: '牛油果搭配嫩鸡胸', cate: '沙拉系列' },
      { id: 603, name: '金枪鱼三明治', price: 25, sales: 876, img: '/images/sandwich1.png', desc: '金枪鱼配新鲜蔬菜', cate: '三明治' },
      { id: 604, name: '牛油果三明治', price: 28, sales: 765, img: '/images/sandwich2.png', desc: '牛油果搭配全麦面包', cate: '三明治' },
      { id: 605, name: '鲜榨橙汁', price: 15, sales: 654, img: '/images/drink4.png', desc: '新鲜现榨，维C满满', cate: '果蔬饮品' },
      { id: 606, name: '牛油果奶昔', price: 22, sales: 543, img: '/images/drink5.png', desc: '绵密顺滑，营养美味', cate: '果蔬饮品' }
    ]
  }
];

// 模拟订单数据
const orders = [];

// 模拟地址数据
const addresses = [
  {
    id: 1,
    name: '张三',
    phone: '13800138000',
    address: '北京市朝阳区望京SOHO T1 15层',
    isDefault: true
  }
];

module.exports = {
  shops,
  orders,
  addresses
};
