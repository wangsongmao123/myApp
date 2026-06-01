// pages/index/index.js
const { shops } = require('../../utils/mock');

Page({
  data: {
    location: '望京SOHO',
    banners: [
      { id: 1, img: '/images/banner1.png' },
      { id: 2, img: '/images/banner2.png' },
      { id: 3, img: '/images/banner3.png' }
    ],
    quickCategories: [
      { id: 1, name: '中餐', icon: '/images/cate-chinese.png' },
      { id: 2, name: '西餐', icon: '/images/cate-western.png' },
      { id: 3, name: '日料', icon: '/images/cate-japanese.png' },
      { id: 4, name: '甜品', icon: '/images/cate-dessert.png' },
      { id: 5, name: '快餐', icon: '/images/cate-fastfood.png' },
      { id: 6, name: '轻食', icon: '/images/cate-healthy.png' },
      { id: 7, name: '饮品', icon: '/images/cate-drink.png' },
      { id: 8, name: '更多', icon: '/images/cate-more.png' }
    ],
    allShops: [],
    filteredShops: [],
    filterType: 'default',
    loading: false,
    hasMore: true,
    page: 1,
    pageSize: 10
  },

  onLoad() {
    this.loadShops();
  },

  onShow() {
    // 每次显示页面时刷新数据
  },

  // 加载商家数据
  loadShops() {
    this.setData({ loading: true });
    // 模拟网络请求
    setTimeout(() => {
      this.setData({
        allShops: shops,
        loading: false
      });
      this.applyFilter();
    }, 500);
  },

  // 获取位置
  getLocation() {
    wx.chooseLocation({
      success: (res) => {
        this.setData({
          location: res.name || '已选择位置'
        });
      }
    });
  },

  // 跳转搜索页
  goSearch() {
    wx.navigateTo({
      url: '/pages/search/search'
    });
  },

  // 按分类筛选
  filterByCate(e) {
    const cate = e.currentTarget.dataset.cate;
    wx.navigateTo({
      url: `/pages/search/search?keyword=${cate}`
    });
  },

  // 设置排序方式
  setFilter(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({ filterType: type });
    this.applyFilter();
  },

  // 应用筛选和排序
  applyFilter() {
    let list = [...this.data.allShops];
    const type = this.data.filterType;

    switch (type) {
      case 'sales':
        list.sort((a, b) => b.monthlySales - a.monthlySales);
        break;
      case 'rating':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'distance':
        list.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
        break;
      default:
        // 综合排序（默认按评分和销量综合）
        list.sort((a, b) => (b.rating * b.monthlySales) - (a.rating * a.monthlySales));
        break;
    }

    this.setData({ filteredShops: list });
  },

  // 跳转商家详情
  goShop(e) {
    const shopId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/shop/shop?id=${shopId}`
    });
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.loadShops();
    wx.stopPullDownRefresh();
  },

  // 上拉加载更多
  onReachBottom() {
    // 模拟分页加载（当前数据量小，直接显示到底）
    this.setData({ hasMore: false });
  },

  // 分享
  onShareAppMessage() {
    return {
      title: '美味外卖 - 美食送到家',
      path: '/pages/index/index'
    };
  }
});
