# HTML Cache Simulator
Simulate how a page viewed as a cached page

## Setup
### Install dependencies
```
yarn
```

## Run the server
```
node index.js
```

then open the server at http://localhost:3000

example:
http://localhost:3000/?target_url=https://google.com

query params:
- `target_url`: any url to be previewed as cached page
- `base_tag_href`: any url, will replace html base tag's href
- `force_fresh`: `true` or `false`, if true every request will refetch the original page
