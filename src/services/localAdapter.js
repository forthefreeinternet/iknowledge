var settle = require('../daxios/lib/core/settle.js');
import clientListener from './clientListener';
import serverListener from '../server/serverListener'


const  myAdapter =  (config) => {
  // At this point:
  //  - config has been merged with defaults
  //  - request transformers have already run
  //  - request interceptors have already run
  
  // Make the request using config provided
  // Upon response settle the Promise

  return new Promise(function(resolve, reject) {
    // var requestData = config.data;
    // var requestHeaders = config.headers;

    // if (utils.isFormData(requestData)) {
    //   delete requestHeaders['Content-Type']; // Let the browser set it
    // }

    // var request = new XMLHttpRequest();

    // // HTTP basic authentication
    // if (config.auth) {
    //   var username = config.auth.username || '';
    //   var password = config.auth.password || '';
    //   requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    // }

    // var fullPath = buildFullPath(config.baseURL, config.url);
    // request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // // Set the request timeout in MS
    // request.timeout = config.timeout;

    
    


    // Listen for ready state
    clientListener.localDB.on(config.url, function handleLoad(response) {
      // if (!request || request.readyState !== 4) {
      //   return;
      // }

      // // The request errored out and we didn't get a response, this will be
      // // handled by onerror instead
      // // With one exception: request that using file: protocol, most browsers
      // // will return status as 0 even though it's a successful request
      // if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
      //   return;
      // }

      //   // Prepare the response
      //   var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      //   var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      //   var response = {
      //       data: responseData,
      //       status: request.status,
      //       statusText: request.statusText,
      //       headers: responseHeaders,
      //       config: config,
      //       request: request
      //   };
    
        settle(resolve, reject, response);
        });

        console.log(serverListener.localDB)
        // Send the request to the local server
        serverListener.localDB.emit('clientRequest', config);
    });


}
export default myAdapter;
