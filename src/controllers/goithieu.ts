import { Request, Response } from 'express';
import { Logger } from '../utils/logger';
import { ResponseHandler } from '../utils/response';

const info = {
  avatar: 'https://thichtrangtri.com/wp-content/uploads/2025/05/anh-meo-gian-cute-3.jpg',
  name: 'Nguyễn Thạc Mậu',
  bio: 'Lập trình viên, yêu thích công nghệ, thiết kế và sáng tạo.',
  contact: {
    email: 'ntmdz@gmail.com',
    phone: '0935877156',
    facebook: 'https://facebook.com/ntmdz08',
    github: 'https://github.com/mavrixdev',
    zalo: 'https://zalo.me/+84935877156'
  },
  skills: ['Node.js', 'React', 'UI/UX', 'Animation', 'TypeScript'],
  location: 'Đắk Lắk, Việt Nam',
  website: 'https://mavrixdev.vercel.app/'
};

export class GioiThieuController {
  static getGioiThieu(_req: Request, res: Response) {
    try {
      Logger.info('GET /gioithieu - Fetching personal info');
      return ResponseHandler.success(res, info, 'Lấy thông tin giới thiệu cá nhân thành công');
    } catch (err) {
      Logger.error('Error in getGioiThieu:', err);
      return ResponseHandler.error(res, 'Lỗi khi lấy thông tin giới thiệu', 500);
    }
  }
}
