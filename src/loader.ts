import { resolve } from "path";
import fs from "fs";
import express = require("express");

let entryPath = process.env.NODE_ENV === "development" ? "src" : "dist";
let controllerPath = resolve(entryPath, 'controllers');
let loader = (app: express.Express) => {
  let loadCtroller = (rootPaths: string) => {
    let allfile = fs.readdirSync(rootPaths);
    allfile.forEach((file) => {
      let filePath = resolve(rootPaths, file);
      if (fs.lstatSync(filePath).isDirectory()) {
        loadCtroller(filePath)
      } else {
        let r = require(filePath);
        if (r && r.router) {
          app.use(r.router);
        }
      }
    });
  }
  loadCtroller(controllerPath);
}

export { loader }
