import {
  HttpMethod,
  request
} from '../common/fetch.js';

const app = getApp();

const HOST = 'https://bbs.jiqid.net';
const URL_PREFIX = '/wxcb/wxe59df6f1d39a8157/program';

function login(code, success, failed) {
  let api = {
    host: HOST,
    path: URL_PREFIX + '/login',
    method: HttpMethod.GET,
    header: {
      contentType: 'application/json' // 默认值
    },
    params: {
      code: code
    }
  };

  return request(api, success, failed);
};

function uploadUserInfo(userInfo, success, failed) {
  let api = {
    host: HOST,
    path: URL_PREFIX + '/userInfo',
    method: HttpMethod.POST,
    header: {
      contentType: 'application/json', // 默认值
      token: app.globalData.loginInfo.token,
    },
    params: {
      nickName: userInfo.nickName,
      gender: userInfo.gender,
      city: userInfo.city,
      province: userInfo.province,
      country: userInfo.country,
      avatarUrl: userInfo.avatarUrl
    }
  };

  return request(api, success, failed);
};

function uploadFile(filePath, success, failed) {
  let api = {
    host: HOST,
    path: '/api/upload',
    method: HttpMethod.UPLOAD_FILE,
    filePath: filePath,
    header: {
      contentType: 'multipart/form-data',
      token: app.globalData.loginInfo.token
    },
    params: {
      type: 'topic',
    }
  };

  return request(api, success, failed);
};

function publishTopic(title, content, success, failed) {
  let api = {
    host: HOST,
    path: '/api/topic',
    method: HttpMethod.POST,
    header: {
      contentType: 'application/json',
      token: app.globalData.loginInfo.token
    },
    params: {
      title: title,
      content: content
    }
  };

  return request(api, success, failed);
};

function queryPhoto(success, failed) {
  let api = {
    host: HOST,
    path: '/api/user/pictures',
    method: HttpMethod.GET,
    header: {
      contentType: 'application/json',
      token: app.globalData.loginInfo.token
    },
    params: {

    }
  };

  return request(api, success, failed);
};

function deletePhoto(id, success, failed) {
  let api = {
    host: HOST,
    path: '/api/user/pictures',
    method: HttpMethod.DELETE,
    header: {
      contentType: 'application/json' // 默认值
    },
    params: {
      id: id
    }
  };

  return request(api, success, failed);
};

export {
  login,
  uploadUserInfo,
  uploadFile,
  publishTopic,
  queryPhoto
};