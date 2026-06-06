// Supabase 客户端配置
// 注意：小程序环境不支持 @supabase/supabase-js 的浏览器客户端
// 这里使用 Supabase REST API 直接调用

const SUPABASE_URL = 'https://eieshvgoflwglwgaqakl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpZXNodmdvZmx3Z2x3Z2FxYWtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3MzU5ODAsImV4cCI6MjA5NjMxMTk4MH0.zgsBIfeo9NXnOO2oYRjAT0cZLFKQLpeEwpPfiYdaFyI';

/**
 * 通用 Supabase REST API 请求
 * @param {string} path - API 路径 (如 '/rest/v1/shops')
 * @param {object} options - 请求选项
 * @returns {Promise<any>}
 */
function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = SUPABASE_URL + path;
    const headers = {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      ...options.headers
    };

    wx.request({
      url: url,
      method: options.method || 'GET',
      header: headers,
      data: options.body ? JSON.stringify(options.body) : undefined,
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data);
        } else {
          reject(new Error(`Supabase error: ${res.statusCode} ${JSON.stringify(res.data)}`));
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
}

/**
 * 获取所有商家
 * @returns {Promise<Array>}
 */
function getShops() {
  return request('/rest/v1/shops?select=*&order=id.asc');
}

/**
 * 获取单个商家
 * @param {number} id - 商家ID
 * @returns {Promise<Object>}
 */
function getShopById(id) {
  return request(`/rest/v1/shops?id=eq.${id}&select=*`).then(res => res[0] || null);
}

/**
 * 获取商家分类
 * @param {number} shopId - 商家ID
 * @returns {Promise<Array>}
 */
function getCategories(shopId) {
  return request(`/rest/v1/categories?shop_id=eq.${shopId}&select=*&order=sort_order.asc`);
}

/**
 * 获取商家菜品
 * @param {number} shopId - 商家ID
 * @returns {Promise<Array>}
 */
function getFoods(shopId) {
  return request(`/rest/v1/foods?shop_id=eq.${shopId}&select=*&order=id.asc`);
}

/**
 * 搜索商家（按名称和标签）
 * @param {string} keyword - 搜索关键词
 * @returns {Promise<Array>}
 */
function searchShops(keyword) {
  const encoded = encodeURIComponent(`*${keyword}*`);
  return request(`/rest/v1/shops?or=(name.ilike.${encoded},tags.cs.{${keyword}})&select=*&order=rating.desc`);
}

/**
 * 搜索菜品
 * @param {string} keyword - 搜索关键词
 * @returns {Promise<Array>}
 */
function searchFoods(keyword) {
  const encoded = encodeURIComponent(`*${keyword}*`);
  return request(`/rest/v1/foods?or=(name.ilike.${encoded},description.ilike.${encoded})&select=*,shops(name,logo)&order=sales.desc`);
}

module.exports = {
  getShops,
  getShopById,
  getCategories,
  getFoods,
  searchShops,
  searchFoods
};
