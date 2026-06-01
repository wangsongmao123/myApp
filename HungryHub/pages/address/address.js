// pages/address/address.js
const app = getApp();

Page({
  data: {
    addresses: [],
    showPopup: false,
    editingId: null,
    formData: {
      name: '',
      phone: '',
      address: '',
      isDefault: false
    }
  },

  onLoad() {
    this.loadAddresses();
  },

  // 加载地址列表
  loadAddresses() {
    let addresses = wx.getStorageSync('addresses') || [];
    this.setData({ addresses });
  },

  // 选择地址
  selectAddress(e) {
    const id = e.currentTarget.dataset.id;
    const address = this.data.addresses.find(a => a.id === id);
    if (address) {
      app.globalData.address = address;
      wx.setStorageSync('address', address);
      wx.navigateBack();
    }
  },

  // 新增地址
  addAddress() {
    this.setData({
      showPopup: true,
      editingId: null,
      formData: {
        name: '',
        phone: '',
        address: '',
        isDefault: false
      }
    });
  },

  // 编辑地址
  editAddress(e) {
    const id = e.currentTarget.dataset.id;
    const address = this.data.addresses.find(a => a.id === id);
    if (address) {
      this.setData({
        showPopup: true,
        editingId: id,
        formData: {
          name: address.name,
          phone: address.phone,
          address: address.address,
          isDefault: address.isDefault
        }
      });
    }
  },

  // 关闭弹窗
  closePopup() {
    this.setData({ showPopup: false });
  },

  // 表单字段变化
  onFieldChange(e) {
    const field = e.currentTarget.dataset.field;
    const value = e.detail.value;
    this.setData({
      [`formData.${field}`]: value
    });
  },

  // 默认地址切换
  onDefaultChange(e) {
    this.setData({
      'formData.isDefault': e.detail.value
    });
  },

  // 保存地址
  saveAddress() {
    const { formData, editingId } = this.data;

    // 验证
    if (!formData.name.trim()) {
      wx.showToast({ title: '请输入联系人', icon: 'none' });
      return;
    }
    if (!formData.phone.trim() || !/^1\d{10}$/.test(formData.phone)) {
      wx.showToast({ title: '请输入正确的手机号', icon: 'none' });
      return;
    }
    if (!formData.address.trim()) {
      wx.showToast({ title: '请输入地址', icon: 'none' });
      return;
    }

    let addresses = this.data.addresses;

    // 如果设为默认，取消其他默认
    if (formData.isDefault) {
      addresses.forEach(a => { a.isDefault = false; });
    }

    if (editingId) {
      // 编辑
      const idx = addresses.findIndex(a => a.id === editingId);
      if (idx > -1) {
        addresses[idx] = { ...addresses[idx], ...formData };
      }
    } else {
      // 新增
      const newAddr = {
        id: Date.now(),
        ...formData
      };
      // 如果是第一个地址，自动设为默认
      if (addresses.length === 0) {
        newAddr.isDefault = true;
      }
      addresses.push(newAddr);
    }

    this.setData({ addresses, showPopup: false });
    wx.setStorageSync('addresses', addresses);

    // 更新全局地址
    const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];
    if (defaultAddr) {
      app.globalData.address = defaultAddr;
      wx.setStorageSync('address', defaultAddr);
    }

    wx.showToast({ title: '保存成功', icon: 'success' });
  }
});
