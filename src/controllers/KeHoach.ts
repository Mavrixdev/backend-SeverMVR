import { Request, Response } from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { ResponseHandler } from '../utils/response';
import { Logger } from '../utils/logger';

export class KeHoachController {
  static async getKeHoach(_req: Request, res: Response) {
    try {
      Logger.info('GET /kehoach - Scraping kế hoạch page');

      const targetUrl = 'https://ttgdnn-gdtxcumgar.edu.vn/categories/lich-ke-hoach-15.html';

      // Fetch HTML content
      const response = await axios.get(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        timeout: 10000
      });

      // Load HTML into cheerio
      const $ = cheerio.load(response.data);

      // Extract items
      const items: any[] = [];

      $('.categoryList .article-item').each((index, element) => {
        const $article = $(element);

        // Extract data (structure similar to news)
        const title = $article.find('h4 a').text().trim() || $article.find('h3 a').text().trim();
        const link = $article.find('h4 a').attr('href') || $article.find('h3 a').attr('href');
        const description = $article.find('.text-justify').text().trim() || $article.find('p').text().trim();
        const imageSrc = $article.find('img').attr('src');
        const imageAlt = $article.find('img').attr('alt') || title;

        // Convert relative URLs to absolute URLs
        const baseUrl = 'https://ttgdnn-gdtxcumgar.edu.vn';
        const fullLink = link ? (link.startsWith('http') ? link : baseUrl + link) : '';
        const fullImageSrc = imageSrc ? (imageSrc.startsWith('http') ? imageSrc : baseUrl + imageSrc) : '';

        if (title) {
          items.push({
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

      Logger.success(`Successfully scraped ${items.length} kehoach items`);

      ResponseHandler.success(res, {
        // source: targetUrl,
        totalItems: items.length,
        items,
        scrapedAt: new Date().toISOString()
      }, 'Lấy kế hoạch thành công');

    } catch (error) {
      Logger.error('Error scraping kehoach:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      ResponseHandler.error(res, 'Không thể lấy dữ liệu kế hoạch', 500, errorMessage);
    }
  }
}
