// pages/order/order.js
Page({
  data: {
    activeTab: 'all',
    orders: [],
    filteredOrders: []
  },

  onLoad() {
    this.loadOrders();
  },

  onShow() {
    this.loadOrders();
  },

  // 加载订单
  loadOrders() {
    const orders = wx.getStorageSync('orders') || [];
    this.setData({ orders });
    this.filterOrders();
  },

  // 切换Tab
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab });
    this.filterOrders();
  },

  // 筛选订单
  filterOrders() {
    const { orders, activeTab } = this.data;
    let filtered;

    switch (activeTab) {
      case 'pending':
        filtered = orders.filter(o => o.status === 'pending');
        break;
      case 'delivering':
        filtered = orders.filter(o => o.status === 'delivering');
        break;
      case 'completed':
        filtered = orders.filter(o => o.status === 'completed');
        break;
      default:
        filtered = orders;
    }

    this.setData({ filteredOrders: filtered });
  },

  // 取消订单
  cancelOrder(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '确定要取消该订单吗？',
      success: (res) => {
        if (res.confirm) {
          let orders = this.data.orders;
          const idx = orders.findIndex(o => o.id === id);
          if (idx > -1) {
            orders.splice(idx, 1);
            wx.setStorageSync('orders', orders);
            this.loadOrders();
            wx.showToast({ title: '已取消', icon: 'success' });
          }
        }
      }
    });
  },

  // 支付订单
  payOrder(e) {
    const id = e.currentTarget.dataset.id;
    wx.showLoading({ title: '支付中...' });

    setTimeout(() => {
      wx.hideLoading();
      let orders = this.data.orders;
      const order = orders.find(o => o.id === id);
      if (order) {
        order.status = 'delivering';
        order.statusText = '配送中';
        wx.setStorageSync('orders', orders);
        this.loadOrders();
        wx.showToast({ title: '支付成功', icon: 'success' });
      }
    }, 1500);
  },

  // 确认收货
  confirmOrder(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '确认已收到商品？',
      success: (res) => {
        if (res.confirm) {
          let orders = this.data.orders;
          const order = orders.find(o => o.id === id);
          if (order) {
            order.status = 'completed';
            order.statusText = '已完成';
            wx.setStorageSync('orders', orders);
            this.loadOrders();
            wx.showToast({ title: '已确认收货', icon: 'success' });
          }
        }
      }
    });
  },

  // 再来一单
  reorder(e) {
    const shopId = e.currentTarget.dataset.shopid;
    wx.navigateTo({
      url: `/pages/shop/shop?id=${shopId}`
    });
  },

  // 去首页
  goHome() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  }
});
