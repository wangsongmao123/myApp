// pages/payment/payment.js
const app = getApp();

Page({
  data: {
    shopId: null,
    shop: {},
    address: null,
    cartList: [],
    goodsTotal: '0.00',
    packingFee: '2.00',
    discount: 0,
    totalPrice: '0.00',
    remark: ''
  },

  onLoad(options) {
    const shopId = parseInt(options.shopId);
    this.setData({ shopId });
    this.loadData();
  },

  onShow() {
    // 刷新地址（可能从地址页返回）
    const address = wx.getStorageSync('address') || app.globalData.address;
    if (address) {
      this.setData({ address });
    }
  },

  loadData() {
    const shop = app.globalData.currentShop;
    if (!shop) {
      wx.showToast({ title: '数据异常', icon: 'none' });
      setTimeout(() => wx.navigateBack(), 1500);
      return;
    }

    const cart = app.globalData.cart;
    const cartItems = cart[this.data.shopId] || {};
    // 预计算每项商品小计价格（WXML不支持.toFixed）
    const cartList = Object.values(cartItems).map(item => ({
      ...item,
      subtotal: (item.price * item.count).toFixed(2)
    }));
    const goodsTotal = app.getCartTotalPrice(this.data.shopId);
    const address = wx.getStorageSync('address') || app.globalData.address;

    // 计算总价
    const packingFee = parseFloat(this.data.packingFee);
    const deliveryFee = shop.deliveryFee;
    const totalPrice = (parseFloat(goodsTotal) + packingFee + deliveryFee - this.data.discount).toFixed(2);

    this.setData({
      shop,
      cartList,
      goodsTotal,
      totalPrice,
      address: address || null
    });
  },

  // 备注输入
  onRemarkInput(e) {
    this.setData({ remark: e.detail.value });
  },

  // 跳转地址页
  goAddress() {
    wx.navigateTo({
      url: '/pages/address/address'
    });
  },

  // 提交订单
  submitOrder() {
    if (!this.data.address) {
      wx.showToast({ title: '请添加收货地址', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '提交中...' });

    // 模拟提交订单
    setTimeout(() => {
      wx.hideLoading();

      // 生成订单
      const orderNo = 'DD' + Date.now();
      const order = {
        id: orderNo,
        shopId: this.data.shopId,
        shopName: this.data.shop.name,
        shopLogo: this.data.shop.logo,
        goods: this.data.cartList,
        goodsTotal: this.data.goodsTotal,
        packingFee: this.data.packingFee,
        deliveryFee: this.data.shop.deliveryFee,
        discount: this.data.discount,
        totalPrice: this.data.totalPrice,
        address: this.data.address,
        remark: this.data.remark,
        status: 'pending',
        statusText: '待支付',
        createTime: new Date().toLocaleString()
      };

      // 保存订单
      let orders = wx.getStorageSync('orders') || [];
      orders.unshift(order);
      wx.setStorageSync('orders', orders);

      // 清空该商家购物车
      app.clearCart(this.data.shopId);

      wx.showToast({
        title: '下单成功',
        icon: 'success',
        duration: 2000
      });

      // 跳转到订单页
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/order/order'
        });
      }, 1500);
    }, 1000);
  }
});
