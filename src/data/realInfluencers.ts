/**
 * 加载真实小红书数据并转换为应用模型
 * 数据来源：data/crawl_20260330，已合并为静态 JSON
 * 更新数据时运行：npm run merge-data
 */
import { transformCrawledData } from './transformCrawledData';
import rawData from './influencers.json';

export const REAL_INFLUENCERS = transformCrawledData(rawData as any[]);
