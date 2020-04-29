import express = require("express");
import { JsonResult } from "./result";

function controller(prefix: string) {
  return function (target: any) {
    let router = express.Router();
    target.router = router;
    let controller = new target();
    (router as any).prefix = controller.prefix + (prefix ? prefix.replace(/\/+$/g, "") : '');
    let properties = Object.getOwnPropertyDescriptors(target.prototype);
    for (let key in properties) {
      if (key === "constructor") {
        continue;
      }
      let func = properties[key].value;
      if (typeof func !== "function") {
        continue;
      }
      func.call(controller, router, target);
    }
  }
}

class ControllerBase {
  public request!: express.Request;
  public response!: express.Response;
  public prefix = "";

  public json(data: any, code = 200) {
    return new JsonResult(this.response, data, code);
  }

  public error(message: string) {
    return this.json(message, 500);
  }
}

class ApiControllerBase extends ControllerBase {
  public prefix = "/api";
}

export { controller, ControllerBase, ApiControllerBase };
