import {
  queryPhoto
} from '../../common/request.js';
var Time = require('../../utils/time.js');

const app = getApp();

let timeFormat = 'Y-M-D h:m:s';
let col1H = 0;
let col2H = 0;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    emptyUrl: '../../assets/imgs/state_empty.png',
    isEmpty: false,
    hasPhoto: false,
    imgWidth: 0,
    scrollH: 0,
    loadingCount: 0,
    images: [],
    col1: [],
    refreshing: false,
    loading: false, //"上拉加载"的变量，默认false，隐藏  
    loaded: false, //“没有数据”的变量，默认false，隐藏 
    isLoading: true, //第一次加载，设置true ,进入该界面时就开始加载
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
    })

    this.setData({
      imgWidth: 0.96 * app.globalData.systemInfo.screenWidth,
      scrollH: app.globalData.screenHeight - 50,
    });

    this.queryPhotos();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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
    console.log("onPullDownRefresh");
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    console.log("onReachBottom");

    let that = this;

    that.setData({
      isLoading: false, // 上拉触发后，不再是初始数据加载，按页码加载
      loading: true, //把"上拉加载"的变量设为false，显示 
    });

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  loadImage: function(e) {
    let imageId = e.currentTarget.id;
    let oImgW = e.detail.width; //图片原始宽度
    let oImgH = e.detail.height; //图片原始高度
    let imgWidth = this.data.imgWidth; //图片设置的宽度
    let scale = imgWidth / oImgW;
    let imgHeight = oImgH * scale; //自适应高度

    let images = this.data.images;
    let imageObj = null;

    for (let i = 0; i < images.length; i++) {
      let img = images[i];
      if (img.id === imageId) {
        imageObj = img;
        break;
      }
    }

    imageObj.height = imgHeight;

    let loadingCount = this.data.loadingCount - 1;
    let col1 = this.data.col1;

    if (col1H <= col2H) {
      col1H += imgHeight;
      col1.push(imageObj);
    } else {
      col2H += imgHeight;
    }

    let data = {
      loadingCount: loadingCount,
      col1: col1,
    };

    if (!loadingCount) {
      data.images = [];
    }

    this.setData(data);
  },

  queryPhotos: function() {
    queryPhoto(this.queryPhotosSucceed, this.queryPhotosFailed);
  },

  queryPhotosSucceed: function(res) {
    if (!res) {
      return;
    }

    let pictures = res.data.detail.pictures;
    let photos = [];

    if (pictures) {
      pictures.forEach(function(item, index) {
        let photoItem = {
          url: item.url,
          createTime: Time.timeToSecond(item.createAt / 1000, timeFormat)
        };
        photos.push(photoItem);
      });
    }

    this.setData({
      hasPhoto: photos.length > 0 ? true : false,
      isEmpty: photos.length > 0 ? false : true,
      loadingCount: photos.length,
      images: this.doSort(photos)
    });

    wx.hideLoading();

  },

  queryPhotosFailed: function(error) {
    console.log("queryPhotosFailed: " + JSON.stringify(error));
  },

  queryLocalImages: function() {
    let that = this;

    wx.getSavedFileList({
      success(res) {
        let photos = [];

        if (res.fileList) {
          res.fileList.forEach(function(item, index) {
            let photoItem = {
              url: item.filePath,
              createTime: Time.timeToSecond(item.createTime, timeFormat)
            };
            photos.push(photoItem);
          });
        }

        that.setData({
          hasPhoto: photos.length > 0 ? true : false,
          isEmpty: photos.length > 0 ? false : true,
          loadingCount: photos.length,
          images: that.doSort(photos)
        });

        wx.hideLoading();

      }
    });

  },

  /**
   * 按照createTime降序
   */
  doSort: function(array) {
    let newArray = array;
    let s = "";
    for (let i = 1; i < newArray.length; i++) {
      for (var j = i; j > 0; j--) {
        if (newArray[j].createTime > newArray[j - 1].createTime) {
          s = newArray[j];
          newArray[j] = newArray[j - 1];
          newArray[j - 1] = s;
        }
      }
    }
    return newArray;
  }

})