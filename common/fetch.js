import regeneratorRuntime from '../utils/runtime.js';

/**
 * HttpMethod
 */
const HttpMethod = {
  GET: 'GET',
  POST: 'POST',
  DELETE: 'DELETE',
  UPLOAD_FILE: 'UPLOAD_FILE'
};

function request(api, succeed, failed) {
  console.log("request: " + JSON.stringify(api));
  let url = api.host + api.path;
  let urlParams = {};
  let bodyParams = {};
  let formDatas = {};

  switch (api.method) {
    case HttpMethod.GET:
    case HttpMethod.DELETE:
      urlParams = api.params;
      break;
    case HttpMethod.POST:
      bodyParams = api.params;
      break;
    case HttpMethod.UPLOAD_FILE:
      formDatas = api.params;
      break;
  }

  //URL参数编辑
  let lastUrlParams = [];
  if (urlParams) {
    Object.keys(urlParams)
      .forEach(key => lastUrlParams.push(key + '=' + urlParams[key]));
  }

  if (url.search(/\?/) === -1) {
    url += '?' + lastUrlParams.join('&')
  } else {
    url += '&' + lastUrlParams.join('&')
  }

  switch (api.method) {
    case HttpMethod.GET:
    case HttpMethod.DELETE:
    case HttpMethod.POST:
      wx.request({
        url: url,
        method: api.method,
        header: {
          'content-type': api.header.contentType,
          'token': api.header.token
        },
        data: bodyParams,
        success(res) {
          succeed(res);
        },
        fail(error) {
          failed(error);
        }

      });
      break;
    case HttpMethod.UPLOAD_FILE:
      wx.uploadFile({
        url: url,
        header: {
          'content-type': api.header.contentType,
          'token': api.header.token
        },
        filePath: api.filePath,
        name: 'file',
        formData: formDatas,
        success(res) {
          succeed(res);
        },
        fail(error) {
          failed(error);
        }
      });
      break;
  }

};

export {
  HttpMethod,
  request
};