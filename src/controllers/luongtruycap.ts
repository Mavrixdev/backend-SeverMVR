import axios from 'axios';
import { Request, Response } from 'express';
import { Logger } from '../utils/logger';
import { ResponseHandler } from '../utils/response';

export class LuongTruyCapController {
  static async getLuongTruyCap(_req: Request, res: Response) {
    try {
      Logger.info('GET /luongtruycap - Fetching traffic statistics');

      const targetUrl = 'https://ttgdnn-gdtxcumgar.edu.vn/SiteVisit/index?{}';

      // Fetch JSON data
      const response = await axios.get(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        timeout: 10000
      });

      const data = response.data;

      Logger.success('Successfully fetched traffic statistics');

      ResponseHandler.success(res, {
        source: targetUrl,
        statistics: {
          totalVisits: data.Total,
          todayVisits: data.DateNow,
          thisWeekVisits: data.DateOfWeek,
          yesterdayVisits: data.Yesterday,
          onlineUsers: data.OnlineUserCounter
        },
        rawData: data,
        fetchedAt: new Date().toISOString()
      }, 'Lấy lượng truy cập thành công');

    } catch (error) {
      Logger.error('Error fetching traffic statistics:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      ResponseHandler.error(res, 'Không thể lấy dữ liệu lượng truy cập', 500, errorMessage);
    }
  }
}
