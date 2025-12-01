# 🔧 API Explorer Backend

Node.js + Express + TypeScript backend for the API Explorer project.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Server will start at: `http://localhost:3001`

## 📋 API Endpoints

### Health Check
```http
GET /health
```

### Schedule API
```http
GET /tkb
```

Response:
```json
{
  "success": true,
  "message": "Lấy thời khóa biểu thành công",
  "data": {
    "title": "Thời khóa biểu áp dùng từ 17-11-2025",
    "description": "Thời khóa biểu mới áp dụng từ ngày 17-11-2025",
    "link": "https://ttgdnn-gdtxcumgar.edu.vn/thoi-khoa-bieu-ap-dung-tu-17-11-2025-41.html"
  }
}
```

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Project Structure

```
src/
├── config/           # Configuration files
├── controllers/      # Route handlers
├── middlewares/      # Express middlewares
├── routes/          # API routes
├── types/           # TypeScript types
├── utils/           # Utility functions
├── app.ts           # Express app setup
└── server.ts        # Server entry point
```

## 🔧 Configuration

Create `.env` file from `.env.example`:

```env
PORT=:3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:8080
API_PREFIX=/api
API_VERSION=v1
```

## 🧪 Testing

```bash
# Test health endpoint
curl http://localhost:3001/health

# Test API endpoint
curl http://localhost:3001/tkb
```

## 🚀 Deployment

```bash
npm run build
npm start
```

## 📚 Technologies

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security headers
- **Morgan** - HTTP request logger
- **Compression** - Response compression

## 🤝 Contributing

1. Follow the existing code style
2. Add tests for new features
3. Update documentation
4. Create pull request

## 📄 License

MIT License
