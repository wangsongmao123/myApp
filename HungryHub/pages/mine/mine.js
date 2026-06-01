// pages/mine/mine.js
const app = getApp();

Page({
  data: {
    userInfo: {},
    pendingCount: 0,
    deliveringCount: 0
  },

  onLoad() {
    this.loadUserInfo();
    this.countOrders();
  },

  onShow() {
    this.loadUserInfo();
    this.countOrders();
  },

  // 加载用户信息
  loadUserInfo() {
    const userInfo = wx.getStorageSync('userInfo') || {};
    this.setData({ userInfo });
  },

  // 获取用户信息（登录）
  getUserProfile() {
    wx.getUserProfile({
      desc: '用于完善用户信息',
      success: (res) => {
        const userInfo = res.userInfo;
        this.setData({ userInfo });
        wx.setStorageSync('userInfo', userInfo);
        app.globalData.userInfo = userInfo;
        wx.showToast({ title: '登录成功', icon: 'success' });
      },
      fail: () => {
        wx.showToast({ title: '已取消登录', icon: 'none' });
      }
    });
  },

  // 统计订单
  countOrders() {
    const orders = wx.getStorageSync('orders') || [];
    const pendingCount = orders.filter(o => o.status === 'pending').length;
    const deliveringCount = orders.filter(o => o.status === 'delivering').length;
    this.setData({ pendingCount, deliveringCount });
  },

  // 跳转订单页
  goOrders(e) {
    const tab = e.currentTarget.dataset.tab || 'all';
    wx.switchTab({
      url: '/pages/order/order'
    });
    // 存储要展示的Tab
    wx.setStorageSync('orderTab', tab);
  },

  // 跳转地址页
  goAddress() {
    wx.navigateTo({
      url: '/pages/address/address'
    });
  },

  // 退出登录
  logout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({ userInfo: {} });
          wx.removeStorageSync('userInfo');
          app.globalData.userInfo = null;
          wx.showToast({ title: '已退出', icon: 'success' });
        }
      }
    });
  },

  // 分享
  onShareAppMessage() {
    return {
      title: '美味外卖 - 美食送到家',
      path: '/pages/index/index'
    };
  }
});
