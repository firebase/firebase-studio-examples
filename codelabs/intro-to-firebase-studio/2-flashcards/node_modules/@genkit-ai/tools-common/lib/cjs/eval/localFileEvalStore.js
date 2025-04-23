"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalFileEvalStore = void 0;
const fs_1 = __importDefault(require("fs"));
const promises_1 = require("fs/promises");
const path_1 = __importDefault(require("path"));
const logger_1 = require("../utils/logger");
const eval_1 = require("../types/eval");
class LocalFileEvalStore {
    storeRoot;
    indexFile;
    INDEX_DELIMITER = '\n';
    static cachedEvalStore = null;
    constructor() {
        this.storeRoot = this.generateRootPath();
        this.indexFile = this.getIndexFilePath();
        fs_1.default.mkdirSync(this.storeRoot, { recursive: true });
        if (!fs_1.default.existsSync(this.indexFile)) {
            fs_1.default.writeFileSync(path_1.default.resolve(this.indexFile), '');
        }
        logger_1.logger.info(`Initialized local file eval store at root: ${this.storeRoot}`);
    }
    static getEvalStore() {
        if (!this.cachedEvalStore) {
            this.cachedEvalStore = new LocalFileEvalStore();
        }
        return this.cachedEvalStore;
    }
    static reset() {
        this.cachedEvalStore = null;
    }
    async save(evalRun) {
        const fileName = this.generateFileName(evalRun.key.evalRunId);
        logger_1.logger.info(`Saving EvalRun ${evalRun.key.evalRunId} to ` +
            path_1.default.resolve(this.storeRoot, fileName));
        await (0, promises_1.writeFile)(path_1.default.resolve(this.storeRoot, fileName), JSON.stringify(evalRun));
        logger_1.logger.debug(`Save EvalRunKey ${JSON.stringify(evalRun.key)} to ` +
            path_1.default.resolve(this.indexFile));
        await (0, promises_1.appendFile)(path_1.default.resolve(this.indexFile), JSON.stringify(evalRun.key) + this.INDEX_DELIMITER);
    }
    async load(evalRunId) {
        const filePath = path_1.default.resolve(this.storeRoot, this.generateFileName(evalRunId));
        if (!fs_1.default.existsSync(filePath)) {
            return undefined;
        }
        return await (0, promises_1.readFile)(filePath, 'utf8').then((data) => eval_1.EvalRunSchema.parse(JSON.parse(data)));
    }
    async list(query) {
        let keys = await (0, promises_1.readFile)(this.indexFile, 'utf8').then((data) => {
            if (!data) {
                return [];
            }
            return data
                .slice(0, -1)
                .split(this.INDEX_DELIMITER)
                .map(this.parseLineToKey);
        });
        logger_1.logger.debug(`Found keys: ${JSON.stringify(keys)}`);
        if (query?.filter?.actionRef) {
            keys = keys.filter((key) => key.actionRef === query?.filter?.actionRef);
            logger_1.logger.debug(`Filtered keys: ${JSON.stringify(keys)}`);
        }
        return {
            evalRunKeys: keys,
        };
    }
    generateFileName(evalRunId) {
        return `${evalRunId}.json`;
    }
    getIndexFilePath() {
        return path_1.default.resolve(this.storeRoot, 'index.txt');
    }
    parseLineToKey(key) {
        return eval_1.EvalRunKeySchema.parse(JSON.parse(key));
    }
    generateRootPath() {
        return path_1.default.resolve(process.cwd(), `.genkit/evals`);
    }
}
exports.LocalFileEvalStore = LocalFileEvalStore;
//# sourceMappingURL=localFileEvalStore.js.map