# PikaPlayer - Next.js Streaming Application

A modern streaming application built with Next.js that supports Xtream Codes, M3U/M3U8 playlists, and Stalker Portal.

## Features

- Profile management with multiple connection types
- Live TV streaming with favorites
- Movies and Series playback
- Real-time search functionality
- Modern Netflix-like UI
- VLC player integration
- Mobile and desktop responsive design

## Getting Started

### Prerequisites

- Docker
- Docker Compose

### Development

1. Clone the repository
2. Run the development server:

```bash
docker-compose up
```

The application will be available at http://localhost:3000

### Production

To build and run for production:

```bash
docker build -t pikaplayer .
docker run -p 3000:3000 pikaplayer
```

## Tech Stack

- Next.js 14
- React 18
- Framer Motion
- Video.js
- TailwindCSS
- TypeScript

## License

MIT
