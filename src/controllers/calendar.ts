import axios from 'axios';
import { Request, Response } from 'express';
import { Logger } from '../utils/logger';
import { ResponseHandler } from '../utils/response';

export class CalendarController {
  static async getCalendarEvents(_req: Request, res: Response) {
    try {
      Logger.info('GET /calendar/events - Fetching calendar events data');

      const targetUrl = 'https://am-lich.com/api/web/v1/calendar/2/events';

      // Fetch JSON data from the API
      const response = await axios.get(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        timeout: 10000
      });

      Logger.success(`Successfully fetched calendar events data`);

      // Return the data as is, wrapped in our response format
      ResponseHandler.success(res, response.data, 'Lấy dữ liệu sự kiện lịch thành công');

    } catch (error) {
      Logger.error('Error fetching calendar events:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      ResponseHandler.error(res, 'Không thể lấy dữ liệu sự kiện lịch', 500, errorMessage);
    }
  }
}
