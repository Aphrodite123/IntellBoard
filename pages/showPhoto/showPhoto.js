import {
  Auths
} from '../../common/global.js';
import {
  uploadFile,
  publishTopic
} from '../../common/request.js';
import {
  formatTime
} from '../../utils/time.js';

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    switchUrl: '../../assets/imgs/btn_photo_select.png',
    saveUrl: '../../assets/imgs/btn_photo_save.png',
    photoMask: '../../assets/imgs/yuan_cover.png',
    url: '',
    isIphonex: false,
    scale: 1,
    photoWidth: 0,
    photoHeight: 0,
    photoCurrentX: 0,
    photoCurrentY: 0,
    movableWidth: 0,
    movableHeight: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let tempPhotoWidth = app.globalData.imageInfo.width;
    let tempPhotoHeight = app.globalData.imageInfo.height;
    let tempPhotoRatio = tempPhotoHeight / tempPhotoWidth;

    let lastPhotoWidth = tempPhotoWidth;
    let lastPhotoHeight = tempPhotoHeight;

    if (tempPhotoWidth > app.globalData.systemInfo.windowWidth || tempPhotoHeight > app.globalData.systemInfo.windowHeight) {
      if (tempPhotoRatio > 1) {
        //长图，按照宽度进行缩放
        lastPhotoWidth = app.globalData.systemInfo.windowWidth;
        lastPhotoHeight = (app.globalData.systemInfo.windowWidth * tempPhotoRatio) >> 0;
      } else {
        //宽图，按照高度进行缩放
        lastPhotoWidth = app.globalData.systemInfo.windowHeight;
        lastPhotoHeight = (app.globalData.systemInfo.windowHeight / tempPhotoRatio) >> 0;
      }
    }

    this.setData({
      isIphonex: app.globalData.systemInfo.model.indexOf("iPhone X") != -1 ? true : false,
      url: app.globalData.imageInfo.url,
      photoWidth: lastPhotoWidth,
      photoHeight: lastPhotoHeight,
      movableWidth: app.globalData.systemInfo.windowWidth * 0.88 - 1,
      movableHeight: app.globalData.systemInfo.windowWidth * 0.88 - 1,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.context = wx.createCanvasContext('myCanvas');
    this.context.drawImage(this.data.photoMask, 0, 0, app.globalData.systemInfo.windowWidth * 0.88, app.globalData.systemInfo.windowWidth * 0.88);
    this.context.draw();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  /**
   * 选择照片
   */
  onSelectPhoto() {
    let that = this;

    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        let tempFilePaths = res.tempFilePaths[0];
        that.setData({
          url: tempFilePaths
        });
      }
    })
  },

  /**
   * 保存图片
   */
  onSavePhoto() {
    let that = this;

    that.onCreatePhoto(that);
  },

  /**
   * 生成图片
   */
  onCreatePhoto() {
    let that = this;

    //缩放后图片尺寸
    let photoEndWidth = that.data.photoWidth * that.data.scale;
    let photoEndHeight = that.data.photoHeight * that.data.scale;

    //蒙版相对于屏幕中的位置
    let coverInWindowX = app.globalData.systemInfo.windowWidth * 0.06;
    let coverInWindowY = app.globalData.systemInfo.windowWidth * 0.08;

    //将蒙版位置换算到原图片位置
    let coverInPhotoX = (0 - that.data.photoCurrentX) * that.data.scale;
    let coverInPhotoY = (0 - that.data.photoCurrentY) * that.data.scale;

    //蒙版映射到源图片中的尺寸
    let coverInPhotoWidth = app.globalData.systemInfo.windowWidth * 0.88 / that.data.photoWidth * photoEndWidth;
    let coverInPhotoHeight = app.globalData.systemInfo.windowWidth * 0.88 / that.data.photoHeight * photoEndHeight;

    that.context.setFillStyle('rgba(0,0,0,1)');

    that.context.drawImage(that.data.url, that.data.photoCurrentX - coverInWindowX, that.data.photoCurrentY - coverInWindowY, photoEndWidth, photoEndHeight);
    // that.context.drawImage(this.data.photoMask, coverInPhotoX, coverInPhotoY, coverInPhotoWidth, coverInPhotoHeight);

    that.context.draw(true, function(res) {
      wx.canvasToTempFilePath({
        canvasId: 'myCanvas',
        x: 0,
        y: 0,
        width: app.globalData.systemInfo.windowWidth * 0.88,
        height: app.globalData.systemInfo.windowWidth * 0.88,
        destWidth: app.globalData.systemInfo.windowWidth * 0.88,
        destHeight: app.globalData.systemInfo.windowWidth * 0.88,
        fileType: 'png',
        success(res) {
          that.setData({
            url: res.tempFilePath
          });

          //图片预览
          wx.previewImage({
            current: res.tempFilePath, // 当前显示图片的http链接
            urls: [res.tempFilePath] // 需要预览的图片http链接列表
          })

          that.onAuth(that, that.authSuccess, that.authFailed);
          // that.uploadPhoto(that);
        },
        fail(error) {
          console.log("Canvas to temp file failed.\nresponse:" + JSON.stringify(error));
        }
      });
    });
  },

  onAuth(context, success, failed) {
    if (!context) {
      return;
    }

    wx.getSetting({
      success(res) {
        if (!res.authSetting[Auths.WRITE_PHOTOS_ALBUM]) {
          wx.authorize({
            scope: Auths.WRITE_PHOTOS_ALBUM,
            success() {
              success(context);
            },
            fail(error) {
              failed(error);
            }
          })
        } else {
          success(context);
        }
      },
      fail(error) {
        failed(error);
      }
    });

  },

  authSuccess(context) {
    //将图片保存到相册       
    wx.saveImageToPhotosAlbum({
      filePath: context.data.url,
      success(res) {
        console.log("保存图片: " + JSON.stringify(res));
        wx.showModal({
          title: '保存成功',
          content: '图片成功保存到相册了，快去分享吧',
          showCancel: false,
          confirmText: '确认',
          confirmColor: '#818FFB',
          success: function(res) {
            context.onCachePhotoToLocal();
          }
        })
      }
    });
  },

  authFailed(error) {
    console.authFailed("authFailed." + error);
  },

  onCachePhotoToLocal() {
    let that = this;

    wx.saveFile({
      tempFilePath: that.data.url,
      success(res) {
        console.log("图片保存成功: " + res.savedFilePath);
      },
      fail(error) {
        console.log("图片保存失败: " + JSON.stringify(error));
      }
    })

  },

  /**
   * 上传图片
   */
  uploadPhoto(context) {
    if (!context) {
      return;
    }

    uploadFile(context.data.url, context.uploadSucceed, context.uploadFailed);
  },

  uploadSucceed(res) {
    let title = '米家小黑板_' + new Date().getTime();
    let data = JSON.parse(res.data);
    if (!data) {
      return;
    }

    let content = data.detail.urls[0];
    if (!content) {
      return;
    }

    publishTopic(title, content, this.publishTopicSucceed, this.publishTopicFailed);

  },

  uploadFailed(error) {
    console.log("Upload photo failed.\n" + JSON.stringify(error));
  },

  publishTopicSucceed(res) {
    console.log("Publish topic succeed.\nresponse: " + JSON.stringify(res));
  },

  publishTopicFailed(error) {
    console.log("Publish topic failed.\nresponse: " + JSON.stringify(error));
  },

  /**
   * 拖动过程中触发的事件，event.detail = {x, y, source}
   */
  onChange(event) {
    console.log("onChange: " + JSON.stringify(event));
    let that = this;
    that.setData({
      photoCurrentX: event.detail.x,
      photoCurrentY: event.detail.y
    });
  },

  /**
   * 缩放过程中触发的事件，event.detail = {x, y, scale}，x和y字段在2.1.0之后支持
   */
  onScale(event) {
    console.log("onScale: " + JSON.stringify(event));
    let that = this;
    that.setData({
      scale: event.detail.scale,
      photoCurrentX: event.detail.x,
      photoCurrentY: event.detail.y
    });
  }

})