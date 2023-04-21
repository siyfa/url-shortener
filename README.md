# Indicina Project - URL Shortener API

This API shortens long URLs into short and easy-to-remember ones. The API is built with Node.js, Express.js, and MongoDB.

## Installation
Clone the repository: git clone https://github.com/siyfa/url-shortener.git.
Navigate to the project directory: cd url-shortener-api.
Install dependencies by running npm install.
```bash
npm install
```

## Start application
```bash
npm run start
```
### Create a .env file in the root directory and set the following environment variables:
```bash
DATABASE_URL=mongodb://localhost:27017/url-shortener-db
PORT=3000
BASE_URL=http://localhost:3000
```

## Endpoints
The API has four endpoints:

POST /encode - Shorten a URL    
POST /decode - Decode a shortened URL   
GET /:pathId - Redirect to the original URL   
GET /statistics/:pathId - Get statistics for a shortened URL

### POST /encode
Shortens a long URL
```javascript
Request Body:
{
  "url": "https://example.com/very/long/url/that/i/want/to/shorten"
}
Response Body:
{
  "message": "Url encoded succesfully",
  "data": "http://localhost:3000/KsH23E"
}
```
### POST /decode
Decodes a shortened URL
```javascript
Request Body:
{
  "url": "http://localhost:3000/KsH23E"
}
Response Body:
{
  "message": "Url decoded successfully",
  "data": "https://example.com/very/long/url/that/i/want/to/shorten"
}
```
### GET /:pathId 
Redirects to the original URL
```javascript
Response: A redirect to the original URL
```
### GET /statistics/:pathId
Returns statistics for a shortened URL
```javascript
Request Body:

Response Body:
{
  "message": "Url successfully fetched",
  "data": {
    "originalUrl": "https://example.com/very/long/url/that/i/want/to/shorten",
    "shortUrl": "http://localhost:3000/KsH23E",
    "visits": 3,
    "createdAt": "2023-04-21T18:25:43.401Z",
    "updatedAt": "2023-04-21T19:13:22.230Z",
    "pathId": "KsH23E",
    "_id": "61545f4c4e4e9f8e0640f7d4"
  }
}
```

## Testing

To test the API, run the following command: npm test.
The test suite uses Jest and Supertest to test the endpoints.
```bash
npm test
```

## Author - Siyanbola Faruk