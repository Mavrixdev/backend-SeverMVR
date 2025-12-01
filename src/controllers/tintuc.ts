import { Request, Response } from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { ResponseHandler } from '../utils/response';
import { Logger } from '../utils/logger';

export class NewsController {
  static async getNews(_req: Request, res: Response) {
    try {
      Logger.info('GET /news - Scraping news data');

      const targetUrl = 'https://ttgdnn-gdtxcumgar.edu.vn/categories/tin-tuc-2.html';

      // Fetch HTML content
      const response = await axios.get(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        timeout: 10000
      });

      // Load HTML into cheerio
      const $ = cheerio.load(response.data);

      // Extract news articles
      const articles: any[] = [];

      $('.categoryList .article-item').each((index, element) => {
        const $article = $(element);

        // Extract article data
        const title = $article.find('h4 a').text().trim();
        const link = $article.find('h4 a').attr('href');
        const description = $article.find('.text-justify').text().trim();
        const imageSrc = $article.find('img').attr('src');
        const imageAlt = $article.find('img').attr('alt') || title;

        // Convert relative URLs to absolute URLs
        const baseUrl = 'https://ttgdnn-gdtxcumgar.edu.vn';
        const fullLink = link ? (link.startsWith('http') ? link : baseUrl + link) : '';
        const fullImageSrc = imageSrc ? (imageSrc.startsWith('http') ? imageSrc : baseUrl + imageSrc) : '';

        if (title) {
          articles.push({
            id: index + 1,
            title,
            description,
            link: fullLink,
            image: {
              src: fullImageSrc,
              alt: imageAlt
            },
            publishedAt: new Date().toISOString() // Since we don't have actual publish dates
          });
        }
      });

      Logger.success(`Successfully scraped ${articles.length} news articles`);

      ResponseHandler.success(res, {
        // source: targetUrl,
        totalArticles: articles.length,
        articles,
        scrapedAt: new Date().toISOString()
      }, 'Lấy tin tức thành công');

    } catch (error) {
      Logger.error('Error scraping news:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      ResponseHandler.error(res, 'Không thể lấy dữ liệu tin tức', 500, errorMessage);
    }
  }
}
