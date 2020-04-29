import express = require("express");

function buildAction(httpMethod: string, url: string, action: Function, constructor: new () => any, router: any) {
  const handler = async function (req: express.Request, res: express.Response, next: express.NextFunction) {
    let controller = new constructor();
    controller.request = req;
    controller.response = res;
    let result;
    try {
      result = await action.call(controller, req, res);
    }
    catch (e) {
      result = await controller.error.call(controller, e.message);
    }
    result.execute();
  };
  router[httpMethod](router.prefix + url, handler);
}

function httpGet(url: string) {
  return function (target: any, key: string, desc: TypedPropertyDescriptor<any>) {
    let method = desc.value;
    desc.value = function (router: express.Router, constructor: new () => any) {
      buildAction("get", url, method, constructor, router);
    };
  }
}

function httpPost(url: string) {
  return function (target: any, key: string, desc: TypedPropertyDescriptor<any>) {
    let method = desc.value;
    desc.value = function (router: express.Router, constructor: new () => any) {
      buildAction("post", url, method, constructor, router);
    };
  }
}

function httpPut(url: string) {
  return function (target: any, key: string, desc: TypedPropertyDescriptor<any>) {
    let method = desc.value;
    desc.value = function (router: express.Router, constructor: new () => any) {
      buildAction("put", url, method, constructor, router);
    };
  }
}

function httpDelete(url: string) {
  return function (target: any, key: string, desc: TypedPropertyDescriptor<any>) {
    let method = desc.value;
    desc.value = function (router: express.Router, constructor: new () => any) {
      buildAction("delete", url, method, constructor, router);
    };
  }
}

export { httpGet, httpPost, httpPut, httpDelete };
