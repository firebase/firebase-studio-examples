"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadAndExtractUiAssets = void 0;
const adm_zip_1 = __importDefault(require("adm-zip"));
const axios_1 = __importDefault(require("axios"));
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
async function downloadAndExtractUiAssets({ fileUrl, extractPath, zipFileName, }) {
    try {
        const downloadedFilePath = path_1.default.join(extractPath, zipFileName);
        if (!(0, fs_1.existsSync)(downloadedFilePath)) {
            const response = await (0, axios_1.default)({
                url: fileUrl,
                method: 'GET',
                responseType: 'arraybuffer',
            });
            (0, fs_1.mkdirSync)(extractPath, { recursive: true });
            (0, fs_1.writeFileSync)(downloadedFilePath, response.data);
        }
        const zip = new adm_zip_1.default(downloadedFilePath);
        zip.extractAllTo(extractPath, true);
    }
    catch (error) {
        console.error('Error downloading or extracting UI assets zip: ', error);
    }
}
exports.downloadAndExtractUiAssets = downloadAndExtractUiAssets;
//# sourceMappingURL=ui-assets.js.map