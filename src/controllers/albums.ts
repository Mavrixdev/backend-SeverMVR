import axios from 'axios';
import * as cheerio from 'cheerio';
import { Request, Response } from 'express';
import { Logger } from '../utils/logger';
import { ResponseHandler } from '../utils/response';

export class AlbumsController {
  static async getAlbums(_req: Request, res: Response) {
    const targetUrl = 'https://ttgdnn-gdtxcumgar.edu.vn/albums.html';

    try {
      Logger.info(`Fetching albums from ${targetUrl}`);

      const response = await axios.get(targetUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        timeout: 10000,
      });

      const $ = cheerio.load(response.data);
      const albums: Array<{
        title: string;
        link: string;
        image: string;
        description?: string;
      }> = [];

      // Parse albums from .album_box container with .row > .col-sm-4.col-6.img-album-item structure
      const albumBoxes = $('.album_box');

      albumBoxes.each((_index, box) => {
        const $box = $(box);
        
        // Get all album items within this album_box
        const items = $box.find('.row .col-sm-4.col-6.img-album-item');
        
        items.each((_itemIndex, item) => {
          const $item = $(item);
          
          // Get title from .text-center.title-albums <a> tag
          const titleEl = $item.find('.text-center.title-albums a').first();
          const title = titleEl.text().trim();
          
          // Get link from .text-center.title-albums <a> tag
          const link = titleEl.attr('href') || '';
          
          // Try to get image from <img> tag
          const imgEl = $item.find('img').first();
          const image = imgEl.attr('src') || '';
          
          // Try to get description from <p> tag
          const descEl = $item.find('p').first();
          const description = descEl.text().trim();
          
          // Normalize relative URLs to absolute URLs
          const absoluteLink = link.startsWith('http')
            ? link
            : `https://ttgdnn-gdtxcumgar.edu.vn${link.startsWith('/') ? '' : '/'}${link}`;
          
          const absoluteImage = image.startsWith('http')
            ? image
            : `https://ttgdnn-gdtxcumgar.edu.vn${image.startsWith('/') ? '' : '/'}${image}`;
          
          if (title || link || image) {
            albums.push({
              title,
              link: absoluteLink,
              image: absoluteImage,
              ...(description && { description }),
            });
          }
        });
      });

      Logger.info(`Successfully fetched ${albums.length} albums`);

      ResponseHandler.success(
        res,
        albums,
        'Lấy album thành công'
      );
    } catch (error) {
      Logger.error('Error fetching albums:', error);
      ResponseHandler.error(res, 'Lỗi khi lấy album', 500);
    }
  }
}
