// pages/index/index.js
const { shops: mockShops } = require('../../utils/mock');
const { getShops } = require('../../utils/supabase');

const app = getApp();

Page({
  data: {
    location: '定位中...',
    locationLoading: false,
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
    // 恢复上次定位
    const savedLocation = app.globalData.location;
    if (savedLocation) {
      this.setData({ location: savedLocation.name || '已选择位置' });
    }
    this.loadShops();
    // 自动尝试 GPS 定位
    this.autoGetLocation();
  },

  onShow() {
    // 每次显示页面时检查定位是否更新
    const loc = app.globalData.location;
    if (loc && loc.name && this.data.location !== loc.name) {
      this.setData({ location: loc.name });
    }
  },

  // 加载商家数据（优先从Supabase，失败降级到mock）
  loadShops() {
    this.setData({ loading: true });

    getShops()
      .then(supabaseShops => {
        // 转换 Supabase 字段名为小程序需要的驼峰格式
        const shops = supabaseShops.map(s => ({
          id: s.id,
          name: s.name,
          logo: s.logo,
          rating: s.rating,
          monthlySales: s.monthly_sales,
          minPrice: s.min_price,
          deliveryFee: s.delivery_fee,
          deliveryTime: s.delivery_time,
          distance: s.distance,
          tags: s.tags,
          notice: s.notice
        }));
        this.setData({
          allShops: shops,
          loading: false
        });
        this.applyFilter();
      })
      .catch(err => {
        console.warn('Supabase 加载失败，降级使用 mock 数据:', err);
        this.setData({
          allShops: mockShops,
          loading: false
        });
        this.applyFilter();
      });
  },

  // 自动获取定位（静默 GPS + 上次位置恢复）
  autoGetLocation() {
    // 如果已有保存的位置信息，直接使用，不重复请求
    if (app.globalData.location && app.globalData.location.latitude) {
      return;
    }

    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        const { latitude, longitude } = res;
        // 通过腾讯地图逆地理编码获取地名
        this.reverseGeocode(latitude, longitude, (locationName) => {
          const locationInfo = {
            name: locationName,
            latitude: latitude,
            longitude: longitude,
            address: locationName,
            updateTime: Date.now()
          };
          app.setLocation(locationInfo);
          this.setData({ location: locationName });
          // 位置获取后重新排序商家列表
          this.applyFilter();
        });
      },
      fail: (err) => {
        console.warn('GPS 定位失败，保持当前显示:', err);
        // 定位失败，保持已有位置名称不变
        if (!app.globalData.location) {
          this.setData({ location: '望京SOHO' });
        }
      }
    });
  },

  // 逆地理编码：经纬度转地名
  reverseGeocode(latitude, longitude, callback) {
    wx.request({
      url: 'https://apis.map.qq.com/ws/geocoder/v1/',
      data: {
        location: `${latitude},${longitude}`,
        key: 'YOUR_TENCENT_MAP_KEY',
        get_poi: 1
      },
      success: (res) => {
        if (res.data && res.data.status === 0 && res.data.result) {
          const result = res.data.result;
          // 优先使用推荐地标或POI名称
          const name = result.formatted_addresses?.recommend
            || result.address_component?.district
            || result.address
            || '已选择位置';
          callback(name);
        } else {
          // 逆地理失败，使用坐标描述
          callback(`${latitude.toFixed(2)},${longitude.toFixed(2)}`);
        }
      },
      fail: () => {
        // 网络请求失败，使用坐标描述
        callback(`${latitude.toFixed(2)},${longitude.toFixed(2)}`);
      }
    });
  },

  // 手动选择位置（打开地图选点）
  getLocation() {
    if (this.data.locationLoading) return;

    this.setData({ locationLoading: true });

    wx.chooseLocation({
      success: (res) => {
        const locationInfo = {
          name: res.name || '已选择位置',
          latitude: res.latitude,
          longitude: res.longitude,
          address: res.address || res.name || '',
          updateTime: Date.now()
        };
        app.setLocation(locationInfo);
        this.setData({
          location: locationInfo.name,
          locationLoading: false
        });
        // 位置变更后重新排序商家列表
        this.applyFilter();
      },
      fail: (err) => {
        console.warn('手动选点取消或失败:', err);
        this.setData({ locationLoading: false });
        // 用户取消选择，保持当前定位不变
      },
      complete: () => {
        this.setData({ locationLoading: false });
      }
    });
  },

  // 计算两点间距离（Haversine 公式，返回 km）
  calcDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // 地球半径 (km)
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
      + Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2))
      * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  },

  toRad(deg) {
    return deg * (Math.PI / 180);
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

    // 如果有定位信息，为每个商家计算实时距离
    const loc = app.globalData.location;
    if (loc && loc.latitude && loc.longitude) {
      list = list.map(shop => {
        if (shop.latitude && shop.longitude) {
          const distKm = this.calcDistance(
            loc.latitude, loc.longitude,
            shop.latitude, shop.longitude
          );
          return {
            ...shop,
            _distance: distKm, // 内部距离数值（km）
            distance: distKm < 1
              ? `${(distKm * 1000).toFixed(0)}m`
              : `${distKm.toFixed(1)}km`
          };
        }
        return shop;
      });
    }

    switch (type) {
      case 'sales':
        list.sort((a, b) => b.monthlySales - a.monthlySales);
        break;
      case 'rating':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'distance':
        list.sort((a, b) => (a._distance || parseFloat(a.distance)) - (b._distance || parseFloat(b.distance)));
        break;
      default:
        // 综合排序：有真实距离时按距离优先，否则按评分和销量综合
        if (loc && loc.latitude && loc.longitude) {
          list.sort((a, b) => (a._distance || 999) - (b._distance || 999));
        } else {
          list.sort((a, b) => (b.rating * b.monthlySales) - (a.rating * a.monthlySales));
        }
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
