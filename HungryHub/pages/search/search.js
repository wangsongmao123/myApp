// pages/search/search.js
const { shops: mockShops } = require('../../utils/mock');
const { searchShops, getShops } = require('../../utils/supabase');

Page({
  data: {
    keyword: '',
    results: [],
    history: [],
    hotWords: ['黄焖鸡', '汉堡', '蛋糕', '麻辣香锅', '沙拉', '拉面', '奶茶', '炸鸡'],
    autoFocus: true,
    allShopsCache: null  // Supabase 数据缓存
  },

  onLoad(options) {
    // 获取历史搜索
    const history = wx.getStorageSync('searchHistory') || [];
    this.setData({ history });

    // 预加载 Supabase 商家数据用于本地搜索
    getShops().then(shops => {
      const formatted = shops.map(s => ({
        id: s.id,
        name: s.name,
        logo: s.logo,
        rating: s.rating,
        monthlySales: s.monthly_sales,
        minPrice: s.min_price,
        deliveryFee: s.delivery_fee,
        deliveryTime: s.delivery_time,
        distance: s.distance,
        tags: s.tags || [],
        notice: s.notice
      }));
      this.setData({ allShopsCache: formatted });
    }).catch(() => {});

    // 如果有传入关键词，直接搜索
    if (options.keyword) {
      this.setData({ keyword: options.keyword });
      this.doSearch();
    }
  },

  onInput(e) {
    const keyword = e.detail.value;
    this.setData({ keyword });
    if (keyword.trim()) {
      this.doSearch();
    } else {
      this.setData({ results: [] });
    }
  },

  // 执行搜索（优先Supabase远程搜索，本地缓存兜底）
  doSearch() {
    const keyword = this.data.keyword.trim();
    if (!keyword) return;

    // 保存搜索历史
    let history = this.data.history;
    history = history.filter(h => h !== keyword);
    history.unshift(keyword);
    if (history.length > 10) history = history.slice(0, 10);
    this.setData({ history });
    wx.setStorageSync('searchHistory', history);

    // 优先使用 Supabase 远程搜索
    searchShops(keyword)
      .then(supabaseResults => {
        if (supabaseResults && supabaseResults.length > 0) {
          const results = supabaseResults.map(s => ({
            id: s.id,
            name: s.name,
            logo: s.logo,
            rating: s.rating,
            monthlySales: s.monthly_sales,
            minPrice: s.min_price,
            deliveryFee: s.delivery_fee,
            deliveryTime: s.delivery_time,
            distance: s.distance,
            tags: s.tags || [],
            notice: s.notice
          }));
          this.setData({ results });
        } else {
          this.localSearch(keyword);
        }
      })
      .catch(() => {
        // 降级到本地搜索
        this.localSearch(keyword);
      });
  },

  // 本地搜索（使用缓存或mock数据）
  localSearch(keyword) {
    const shops = this.data.allShopsCache || mockShops;
    const results = shops.filter(shop => {
      return shop.name.includes(keyword) ||
        (shop.tags && shop.tags.some(tag => tag.includes(keyword))) ||
        (shop.foods && shop.foods.some(food => food.name.includes(keyword)));
    });
    this.setData({ results });
  },

  // 点击搜索历史
  searchHistory(e) {
    const keyword = e.currentTarget.dataset.keyword;
    this.setData({ keyword });
    this.doSearch();
  },

  // 点击热门搜索
  searchHot(e) {
    const keyword = e.currentTarget.dataset.keyword;
    this.setData({ keyword });
    this.doSearch();
  },

  // 清空输入
  clearInput() {
    this.setData({ keyword: '', results: [] });
  },

  // 清空历史
  clearHistory() {
    this.setData({ history: [] });
    wx.removeStorageSync('searchHistory');
  },

  // 跳转商家
  goShop(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/shop/shop?id=${id}`
    });
  },

  // 返回
  goBack() {
    wx.navigateBack();
  }
});
