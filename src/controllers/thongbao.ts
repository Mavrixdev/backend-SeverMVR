import axios from 'axios';
import * as cheerio from 'cheerio';
import { Request, Response } from 'express';
import { Logger } from '../utils/logger';
import { ResponseHandler } from '../utils/response';

export class ThongBaoController {
  static async getThongBao(_req: Request, res: Response) {
    try {
      Logger.info('GET /thongbao - Scraping notices');

      const targetUrl = 'https://ttgdnn-gdtxcumgar.edu.vn/';

      // Fetch HTML content
      const response = await axios.get(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        timeout: 10000
      });

      // Load HTML into cheerio
      const $ = cheerio.load(response.data);

      // Extract notices
      const notices: any[] = [];

      $('.notice-list .notice-item').each((index, element) => {
        const $notice = $(element);

        // Extract notice data
        const title = $notice.find('h4 a').text().trim() || $notice.find('h3 a').text().trim() || $notice.find('a').first().text().trim();
        const link = $notice.find('h4 a').attr('href') || $notice.find('h3 a').attr('href') || $notice.find('a').first().attr('href');
        const description = $notice.find('.text-justify').text().trim() || $notice.find('p').text().trim() || '';
        const imageSrc = $notice.find('img').attr('src');
        const imageAlt = $notice.find('img').attr('alt') || title;

        // Convert relative URLs to absolute URLs
        const baseUrl = 'https://ttgdnn-gdtxcumgar.edu.vn';
        const fullLink = link ? (link.startsWith('http') ? link : baseUrl + link) : '';
        const fullImageSrc = imageSrc ? (imageSrc.startsWith('http') ? imageSrc : baseUrl + imageSrc) : '';

        if (title) {
          notices.push({
            id: index + 1,
            title,
            description,
            link: fullLink,
            image: {
              src: fullImageSrc,
              alt: imageAlt
            },
            publishedAt: new Date().toISOString()
          });
        }
      });

      Logger.success(`Successfully scraped ${notices.length} notices`);

      ResponseHandler.success(res, {
        source: targetUrl,
        totalNotices: notices.length,
        notices,
        scrapedAt: new Date().toISOString()
      }, 'Lấy thông báo thành công');

    } catch (error) {
      Logger.error('Error scraping notices:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      ResponseHandler.error(res, 'Không thể lấy dữ liệu thông báo', 500, errorMessage);
    }
  }
}
