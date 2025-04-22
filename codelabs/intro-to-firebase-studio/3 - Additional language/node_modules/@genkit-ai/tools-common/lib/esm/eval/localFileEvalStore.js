import fs from 'fs';
import { appendFile, readFile, writeFile } from 'fs/promises';
import path from 'path';
import { logger } from '../utils/logger';
import { EvalRunKeySchema, EvalRunSchema, } from '../types/eval';
export class LocalFileEvalStore {
    storeRoot;
    indexFile;
    INDEX_DELIMITER = '\n';
    static cachedEvalStore = null;
    constructor() {
        this.storeRoot = this.generateRootPath();
        this.indexFile = this.getIndexFilePath();
        fs.mkdirSync(this.storeRoot, { recursive: true });
        if (!fs.existsSync(this.indexFile)) {
            fs.writeFileSync(path.resolve(this.indexFile), '');
        }
        logger.info(`Initialized local file eval store at root: ${this.storeRoot}`);
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
        logger.info(`Saving EvalRun ${evalRun.key.evalRunId} to ` +
            path.resolve(this.storeRoot, fileName));
        await writeFile(path.resolve(this.storeRoot, fileName), JSON.stringify(evalRun));
        logger.debug(`Save EvalRunKey ${JSON.stringify(evalRun.key)} to ` +
            path.resolve(this.indexFile));
        await appendFile(path.resolve(this.indexFile), JSON.stringify(evalRun.key) + this.INDEX_DELIMITER);
    }
    async load(evalRunId) {
        const filePath = path.resolve(this.storeRoot, this.generateFileName(evalRunId));
        if (!fs.existsSync(filePath)) {
            return undefined;
        }
        return await readFile(filePath, 'utf8').then((data) => EvalRunSchema.parse(JSON.parse(data)));
    }
    async list(query) {
        let keys = await readFile(this.indexFile, 'utf8').then((data) => {
            if (!data) {
                return [];
            }
            return data
                .slice(0, -1)
                .split(this.INDEX_DELIMITER)
                .map(this.parseLineToKey);
        });
        logger.debug(`Found keys: ${JSON.stringify(keys)}`);
        if (query?.filter?.actionRef) {
            keys = keys.filter((key) => key.actionRef === query?.filter?.actionRef);
            logger.debug(`Filtered keys: ${JSON.stringify(keys)}`);
        }
        return {
            evalRunKeys: keys,
        };
    }
    generateFileName(evalRunId) {
        return `${evalRunId}.json`;
    }
    getIndexFilePath() {
        return path.resolve(this.storeRoot, 'index.txt');
    }
    parseLineToKey(key) {
        return EvalRunKeySchema.parse(JSON.parse(key));
    }
    generateRootPath() {
        return path.resolve(process.cwd(), `.genkit/evals`);
    }
}
//# sourceMappingURL=localFileEvalStore.js.map