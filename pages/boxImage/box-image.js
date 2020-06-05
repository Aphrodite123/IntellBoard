// pages/1.js
const app = getApp();
import {
  Auths
} from '../../common/global.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    image: '../../assets/imgs/lotto_image.png',
    picUrl: '../../assets/imgs/image_share.png',
    isShowShare: false,
    isShowDialog: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let title = '盲盒';
    wx.setNavigationBarTitle({
      title
    });
    var ctx = wx.createCanvasContext('shareCanvas');
    ctx.drawImage(this.data.picUrl, 0, 0, app.globalData.systemInfo.windowWidth * 550 / 750, app.globalData.systemInfo.windowWidth * 900 / 750);
    ctx.draw();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  goShare() {
    this.setData({
      isShowShare: true,
    });
  },

  saveImage() {
    wx.showLoading({
      title: '正在保存',
    })
    wx.canvasToTempFilePath({
      canvasId: 'shareCanvas',
      fileType: 'jpg',
      success: function (res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            wx.hideLoading();
            wx.showToast({
              title: '保存成功',
            });
          },
          fail() {
            wx.hideLoading()
          }
        })
      }
    })
  },

  showDialog() {
    this.setData({
      isShowDialog: true,
    });
  },

  closeDialog() {
    this.setData({
      isShowDialog: false
    });
  }

})