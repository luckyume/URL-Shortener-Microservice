# URL Shortener Microservice

This is the boilerplate code for the URL Shortener Microservice project. Instructions for building your project can be found at https://www.freecodecamp.org/learn/back-end-development-and-apis/back-end-development-and-apis-projects/url-shortener-microservice.

## Setup

1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Copy `sample.env` to `.env` and set your environment variables (e.g., PORT=3000).
4. Run `npm start` to start the server.

## API Endpoints

- `GET /`: Serves the main page.
- `POST /api/shorturl`: Shortens a URL. Body: `{ "url": "https://example.com" }`
- `GET /api/shorturl/:key`: Redirects to the original URL.
