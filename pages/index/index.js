import {
  Auths
} from '../../common/global.js';
import {
  login,
  uploadUserInfo
} from '../../common/request.js';

//获取应用实例
const app = getApp();
const QRCode = require('../../utils/weapp-qrcode');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    previewUrl: "../../assets/imgs/photo_preview.png",
    switchUrl: '../../assets/imgs/btn_photo_select.png',
    saveUrl: '../../assets/imgs/btn_photo_save.png',
    showPopup: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSystemInfo({
      success: function (res) {
        app.globalData.systemInfo = res;
      },
    });

    this.login();
  },

  /**
   * 生命周期函数--监听被展示时调用
   */
  onShow: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  login: function () {
    let that = this;

    wx.login({
      success(res) {
        login(res.code, that.loginSucceed, that.loginFailed);
      }
    });
  },

  loginSucceed: function (res) {
    console.log("Login succeed.\nresponse:" + JSON.stringify(res));

    app.globalData.loginInfo = res.data.detail;
  },

  loginFailed: function (error) {
    console.log("Login failed." + JSON.stringify(error));
  },

  /**
   * 跳转到拍照界面
   */
  takePhoto: function () {
    wx.navigateTo({
      url: '../takePhoto/takePhoto'
    })

    wx.getSystemInfo({
      success(res) {
        console.log(JSON.stringify(res))
      }
    })

    wx.getLaunchOptionsSync({
      success(res) {
        console.log(JSON.stringify(res))
      }
    });

    wx.loadFontFace({
      family: 'Bitstream Vera Serif Bold',
      source: 'url("https://sungd.github.io/Pacifico.ttf")',
      success: console.log
    })

    wx.setTopBarText({
      text: 'hello, world!'
    })

    wx.updateShareMenu({
      withShareTicket: true,
      success() {}
    })

    wx.showShareMenu({
      withShareTicket: true
    })

  },

  /**
   * 正常的盲盒
   */
  goNormalBox() {
    wx.navigateTo({
      url: '../boxImage/box-image',
    })
  },

  /**
   * 隐式的盲盒
   */
  goInvisibleBox() {
    wx.navigateTo({
      url: '../boxVideo/box-video',
    })
  },

  /**
   * 作品预览
   */
  scanPhoto: function () {
    let that = this;

    wx.getSetting({
      success(res) {
        if (res.authSetting[Auths.USER_INFO]) {
          //允许获取用户信息
          wx.getUserInfo({
            success(res) {
              uploadUserInfo(res.userInfo, that.authSucceed, that.authFailed);
            },
            fail() {
              wx.navigateTo({
                url: '../scanPhoto/scanPhoto',
              });
            }
          });
        } else {
          //未授权
          that.setData({
            showPopup: true,
          });
        }
      }
    });

  },

  /**
   * 验证用户信息权限
   */
  bindGetUserInfo: function (e) {
    let that = this;

    if (e.detail.userInfo) {
      uploadUserInfo(e.detail.userInfo, that.authSucceed, that.authFailed);
    }

    this.setData({
      showPopup: false,
    });

  },

  /**
   * 验证用户信息权限，拒绝
   */
  authDialogBack: function () {
    this.setData({
      showPopup: false,
    });
  },

  authSucceed: function (res) {
    wx.navigateTo({
      url: '../scanPhoto/scanPhoto',
    });

  },

  authFailed: function (error) {
    wx.navigateTo({
      url: '../scanPhoto/scanPhoto',
    });
  },

  createQRCode: function () {
    wx.request({
      url: 'https://testwxapp.jiqid.net/miboard/index?id=1',
      method: 'POST',
      data: {},
      success: function (res) {
        if (res.data.data) {
          if (qrcode) {
            that.setData({
              qrcode: that.data.qrcode.makeCode(res.data.data),
              showLoading: false
            })
          } else {
            that.setData({
              qrcode: new QRCode('canvas', {
                text: res.data.data,
                width: 220,
                height: 220,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H,
              })
            })
            that.setData({
              showLoading: false
            })
          }
        }
      }
    })
  },


  save: function () {
    let that = this;
    wx.showActionSheet({
      itemList: ['保存图片'],
      success: function (res) {
        if (res.tapIndex == 0) {
          that.data.qrcode.exportImage(function (path) {
            wx.saveImageToPhotosAlbum({
              filePath: path,
              success: function () {
                wx.showToast({
                  title: '保存成功'
                })
              }
            })
          })
        }
      }
    })
  },


})