// pages/shop/shop.js
const { shops } = require('../../utils/mock');
const app = getApp();

Page({
  data: {
    shop: {},
    shopId: null,
    activeCate: 0,
    cartItems: {},
    cartTotalCount: 0,
    cartTotalPrice: '0.00',
    cartList: [],
    showCart: false
  },

  onLoad(options) {
    const shopId = parseInt(options.id);
    this.setData({ shopId });
    this.loadShop(shopId);
  },

  onShow() {
    this.refreshCart();
  },

  // 加载商家数据
  loadShop(shopId) {
    const shop = shops.find(s => s.id === shopId);
    if (shop) {
      this.setData({ shop });
      app.globalData.currentShop = shop;
    } else {
      wx.showToast({ title: '商家不存在', icon: 'none' });
      setTimeout(() => wx.navigateBack(), 1500);
    }
  },

  // 切换分类
  switchCate(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({ activeCate: index });
  },

  // 添加商品
  addFood(e) {
    const food = e.currentTarget.dataset.food;
    app.addToCart(this.data.shopId, food);
    this.refreshCart();
    // 震动反馈
    wx.vibrateShort({ type: 'light' });
  },

  // 减少商品
  reduceFood(e) {
    const food = e.currentTarget.dataset.food;
    app.reduceFromCart(this.data.shopId, food);
    this.refreshCart();
  },

  // 刷新购物车
  refreshCart() {
    const shopId = this.data.shopId;
    const shop = this.data.shop;
    const cart = app.globalData.cart;
    const cartItems = cart[shopId] || {};
    const cartTotalCount = app.getCartTotalCount(shopId);
    const cartTotalPrice = app.getCartTotalPrice(shopId);
    // 预计算起送差值（WXML不支持toFixed）
    const priceDiff = (shop.minPrice - parseFloat(cartTotalPrice)).toFixed(2);
    // 预计算每项商品小计（WXML不支持toFixed）
    const cartList = Object.values(cartItems).map(item => ({
      ...item,
      subtotal: (item.price * item.count).toFixed(2)
    }));

    this.setData({
      cartItems,
      cartTotalCount,
      cartTotalPrice,
      priceDiff,
      cartList
    });
  },

  // 显示/隐藏购物车
  toggleCart() {
    this.setData({ showCart: !this.data.showCart });
  },

  hideCart() {
    this.setData({ showCart: false });
  },

  // 清空购物车
  clearCart() {
    app.clearCart(this.data.shopId);
    this.refreshCart();
    this.setData({ showCart: false });
  },

  // 去结算
  goPayment() {
    const { cartTotalPrice, shop } = this.data;
    if (parseFloat(cartTotalPrice) < shop.minPrice) {
      wx.showToast({ title: `还差¥${(shop.minPrice - cartTotalPrice).toFixed(2)}起送`, icon: 'none' });
      return;
    }
    wx.navigateTo({
      url: `/pages/payment/payment?shopId=${this.data.shopId}`
    });
  },

  // 分享
  onShareAppMessage() {
    return {
      title: `${this.data.shop.name} - 美味外卖`,
      path: `/pages/shop/shop?id=${this.data.shopId}`
    };
  }
});
