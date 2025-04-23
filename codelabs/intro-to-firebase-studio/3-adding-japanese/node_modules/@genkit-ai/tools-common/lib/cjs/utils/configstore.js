"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUserSettings = exports.getUserSettings = exports.configstore = void 0;
const configstore_1 = __importDefault(require("configstore"));
const package_1 = require("./package");
const USER_SETTINGS_TAG = 'userSettings';
exports.configstore = new configstore_1.default(package_1.toolsPackage.name);
function getUserSettings() {
    return exports.configstore.get(USER_SETTINGS_TAG) || {};
}
exports.getUserSettings = getUserSettings;
function setUserSettings(s) {
    exports.configstore.set(USER_SETTINGS_TAG, s);
}
exports.setUserSettings = setUserSettings;
//# sourceMappingURL=configstore.js.map