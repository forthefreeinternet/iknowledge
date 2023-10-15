'use strict';

var utils = require('../utils');
var settle = require('../core/settle');
var buildURL = require('../helpers/buildURL');
var buildFullPath = require('../core/buildFullPath');
var parseHeaders = require('./../helpers/parseHeaders');
var isURLSameOrigin = require('../helpers/isURLSameOrigin');
var createError = require('../core/createError');

// daxios modification
import clientListener from '../../../services/clientListener';
import serverListener from '../../../server/serverListener'
// const drequest = require('supertest');
// const superagent = require('superagent');

// const app = require('../../../server/dapp.js')
// daxios modification

const localAdapter =  (config) => {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);
    //daxios modification
    config.headers = requestHeaders;
    const time = new Date().getTime()
    config.headers['Request-ID'] = config.url + time.toString()
    config.method = config.method.toLowerCase();
    config.url = fullPath;
    config.query = config.params
    if (requestData?.headers){
      Object.assign(config.headers, requestData.headers)
    }
    console.log('client is sending', JSON.stringify(requestData) )

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    // daxios modification
    clientListener.localDB.on(config.headers['Request-ID'] , function handleLoad(res) {
      console.log('client receives response', res)

      // return the last request in case of redirects
      var lastRequest = res.req // || req;

      var response = {
        status: res.statusCode,
        statusText: res.statusMessage,
        header: res.header,
        config: config,
        request: lastRequest,
      };

      var responseData = res.data
      const contentType = res.header['Content-Type'];

      let encoding = 'utf-8'; // 默认编码为 UTF-8

      // 检查 Content-Type 是否包含编码信息
      const charsetMatch = contentType.match(/charset=([\w-]+)/);
      if (charsetMatch) {
        encoding = charsetMatch[1].toLowerCase();
      }
      // 判断 Content-Type 是否为 JSON
      if (contentType && contentType.includes('application/json')) {
        // 解码为 JSON 格式
        responseData = JSON.parse(responseData.toString(encoding));
        console.log('JSON Data:', responseData);
      } else if (contentType === 'image/jpeg') {
        // 如果是图像数据，进行图像处理
      } else {
        // 默认为文本格式
        responseData = responseData.toString(encoding);
        console.log('Text Data:', responseData);
      }

      response.data = responseData;

      
      

      settle(resolve, reject, response);
        });
    
    // superagent(app)[config.method](config.url)
    // .expect(200)
    // .end(function(err, res) {
    //   if (err) throw err;
    //   resolve(res);
    // });
        
   
      
    request.onreadystatechange = function handleLoad() {
      if (!request || request.readyState !== 4) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

     // daxios modification

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(createError(timeoutErrorMessage, config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      var cookies = require('../helpers/cookies');

      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (requestData === undefined) {
      requestData = null;
    }

    // Send the request
    // daxios modification
    // request.send(requestData);
    config.body = requestData;
    console.log('request', config);
    // Send the request to the local server
    serverListener.localDB.emit('clientRequest', config);

    // daxios modification
  });
};

export default localAdapter;