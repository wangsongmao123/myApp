// pages/search/search.js
const { shops } = require('../../utils/mock');

Page({
  data: {
    keyword: '',
    results: [],
    history: [],
    hotWords: ['黄焖鸡', '汉堡', '蛋糕', '麻辣香锅', '沙拉', '拉面', '奶茶', '炸鸡'],
    autoFocus: true
  },

  onLoad(options) {
    // 获取历史搜索
    const history = wx.getStorageSync('searchHistory') || [];
    this.setData({ history });

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

  // 执行搜索
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

    // 搜索匹配
    const results = shops.filter(shop => {
      return shop.name.includes(keyword) ||
        shop.tags.some(tag => tag.includes(keyword)) ||
        shop.foods.some(food => food.name.includes(keyword));
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
