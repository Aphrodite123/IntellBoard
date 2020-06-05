// pages/boxVideo/boxVideo.js
const app = getApp();

function getRandomColor() {
  const rgb = []
  for (let i = 0; i < 3; ++i) {
    let color = Math.floor(Math.random() * 256).toString(16)
    color = color.length == 1 ? '0' + color : color
    rgb.push(color)
  }
  return '#' + rgb.join('')
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowShare: false,
    picUrl: '../../assets/imgs/video_image.png',
    isShowShare: false,
    isShowDialog: false,
    src: '',
    danmuList: [{
        text: '第 1s 出现的弹幕',
        color: '#ff0000',
        time: 1
      },
      {
        text: '第 3s 出现的弹幕',
        color: '#ff00ff',
        time: 3
      }
    ]
  },

  onLoad: function (options) {
    let title = '盲盒';
    wx.setNavigationBarTitle({
      title
    });
    var ctx = wx.createCanvasContext('shareCanvas');
    ctx.drawImage(this.data.picUrl, 0, 0, app.globalData.systemInfo.windowWidth * 550 / 750, app.globalData.systemInfo.windowWidth * 900 / 750);
    ctx.draw();
  },

  onReady: function (res) {
    this.videoContext = wx.createVideoContext('myVideo')
  },
  inputValue: '',

  bindInputBlur: function (e) {
    this.inputValue = e.detail.value
  },
  bindSendDanmu: function () {
    this.videoContext.sendDanmu({
      text: this.inputValue,
      color: getRandomColor()
    })
  },
  bindPlay: function () {
    this.videoContext.play()
  },
  bindPause: function () {
    this.videoContext.pause()
  },
  videoErrorCallback: function (e) {
    console.log('视频错误信息:')
    console.log(e.detail.errMsg)
  },
  goLotto: function () {
    wx.navigateTo({
      url: '../boxLotto/box-lotto',
    })
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
    });
    wx.hideLoading();
    wx.showToast({
      title: '保存成功',
    });
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