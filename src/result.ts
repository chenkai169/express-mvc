import express = require("express");

class ActionResultBase {
  public message = "";
  public code = 200;

  protected response!: express.Response;

  constructor(response: express.Response) {
    this.response = response;
  }
}

class JsonResult extends ActionResultBase {
  public data!: any;
  public message = "";

  constructor(response: express.Response, data: any, code = 200) {
    super(response);
    if (code == 500) {
      this.message = data;
    } else {
      this.data = data;
    }
    this.code = code;
  }

  public execute() {
    this.response.status(this.code).json({ data: this.data, code: this.code, message: this.message });
  }
}

export { JsonResult };
