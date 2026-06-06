// pages/shop/shop.js
const { shops: mockShops } = require('../../utils/mock');
const { getShopById, getCategories, getFoods } = require('../../utils/supabase');
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

  // 加载商家数据（优先从Supabase，失败降级到mock）
  loadShop(shopId) {
    wx.showLoading({ title: '加载中...' });

    Promise.all([
      getShopById(shopId),
      getCategories(shopId),
      getFoods(shopId)
    ])
      .then(([supabaseShop, supabaseCates, supabaseFoods]) => {
        if (!supabaseShop) {
          throw new Error('商家不存在');
        }

        // 转换 Supabase 字段名
        const shop = {
          id: supabaseShop.id,
          name: supabaseShop.name,
          logo: supabaseShop.logo,
          rating: supabaseShop.rating,
          monthlySales: supabaseShop.monthly_sales,
          minPrice: supabaseShop.min_price,
          deliveryFee: supabaseShop.delivery_fee,
          deliveryTime: supabaseShop.delivery_time,
          distance: supabaseShop.distance,
          tags: supabaseShop.tags,
          notice: supabaseShop.notice,
          categories: supabaseCates.map(c => c.name),
          foods: supabaseFoods.map(f => ({
            id: f.id,
            name: f.name,
            price: f.price,
            sales: f.sales,
            img: f.img,
            desc: f.description,
            cate: f.category_name
          }))
        };

        this.setData({ shop });
        app.globalData.currentShop = shop;
        wx.hideLoading();
      })
      .catch(err => {
        console.warn('Supabase 加载失败，降级使用 mock 数据:', err);
        // 降级到 mock 数据
        const shop = mockShops.find(s => s.id === shopId);
        if (shop) {
          this.setData({ shop });
          app.globalData.currentShop = shop;
        } else {
          wx.showToast({ title: '商家不存在', icon: 'none' });
          setTimeout(() => wx.navigateBack(), 1500);
        }
        wx.hideLoading();
      });
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
