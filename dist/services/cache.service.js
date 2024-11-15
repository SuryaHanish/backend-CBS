"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCache = exports.getCacheData = exports.cacheData = void 0;
// services/cache.service.ts
const redisClient_1 = __importDefault(require("../config/redisClient"));
const cacheData = async (key, value, ttl = null) => {
    const stringValue = JSON.stringify(value);
    if (ttl) {
        await redisClient_1.default.set(key, stringValue, 'EX', ttl); // EX sets the expiration time in seconds
    }
    else {
        await redisClient_1.default.set(key, stringValue);
    }
};
exports.cacheData = cacheData;
const getCacheData = async (key) => {
    const data = await redisClient_1.default.get(key);
    return data ? JSON.parse(data) : null;
};
exports.getCacheData = getCacheData;
const clearCache = async (key) => {
    await redisClient_1.default.del(key);
};
exports.clearCache = clearCache;
