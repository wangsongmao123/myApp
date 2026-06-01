App({
  globalData: {
    userInfo: null,
    cart: {},
    currentShop: null,
    address: null
  },

  onLaunch() {
    // 获取本地存储的购物车数据
    const cart = wx.getStorageSync('cart');
    if (cart) {
      this.globalData.cart = cart;
    }
    const address = wx.getStorageSync('address');
    if (address) {
      this.globalData.address = address;
    }
  },

  // 添加商品到购物车
  addToCart(shopId, item) {
    const cart = this.globalData.cart;
    if (!cart[shopId]) {
      cart[shopId] = {};
    }
    const key = item.id + (item.spec || '');
    if (cart[shopId][key]) {
      cart[shopId][key].count++;
    } else {
      cart[shopId][key] = {
        ...item,
        count: 1
      };
    }
    this.globalData.cart = cart;
    wx.setStorageSync('cart', cart);
  },

  // 减少购物车商品数量
  reduceFromCart(shopId, item) {
    const cart = this.globalData.cart;
    if (!cart[shopId]) return;
    const key = item.id + (item.spec || '');
    if (cart[shopId][key]) {
      cart[shopId][key].count--;
      if (cart[shopId][key].count <= 0) {
        delete cart[shopId][key];
      }
    }
    if (Object.keys(cart[shopId]).length === 0) {
      delete cart[shopId];
    }
    this.globalData.cart = cart;
    wx.setStorageSync('cart', cart);
  },

  // 清空指定商家的购物车
  clearCart(shopId) {
    const cart = this.globalData.cart;
    delete cart[shopId];
    this.globalData.cart = cart;
    wx.setStorageSync('cart', cart);
  },

  // 获取购物车总数量
  getCartTotalCount(shopId) {
    const cart = this.globalData.cart;
    if (!cart[shopId]) return 0;
    let total = 0;
    Object.values(cart[shopId]).forEach(item => {
      total += item.count;
    });
    return total;
  },

  // 获取购物车总价
  getCartTotalPrice(shopId) {
    const cart = this.globalData.cart;
    if (!cart[shopId]) return 0;
    let total = 0;
    Object.values(cart[shopId]).forEach(item => {
      total += item.price * item.count;
    });
    return total.toFixed(2);
  }
});
