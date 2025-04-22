"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toolsPackage = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const packagePath = (0, path_1.join)(__dirname, '../../../package.json');
exports.toolsPackage = JSON.parse((0, fs_1.readFileSync)(packagePath, 'utf8'));
//# sourceMappingURL=package.js.map