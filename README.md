# RapidAPI Node SDK

An open-source Node.js SDK for interacting with RapidAPI’s diverse set of APIs,
featuring built-in caching for improved performance.

## Installation

```bash
npm install rapidapi-node-sdk
```

or

```bash
yarn add rapidapi-node-sdk
```

## Usage

```javascript
import { RapidApi } from 'rapidapi-node-sdk';

const rapidApi = new RapidApi({
    rapidApiKey: 'your-rapidapi-key',
    rapidApiHost: 'api.rapidapi.com',
    baseUrl: 'https://api.example.com',
});
```

### Making API Calls

```javascript
const response = await rapidApi.call({
    method: 'get',
    uri: '/endpoint',
    params: { foo: 'bar' },
});
```

## Logging

The SDK supports logging to capture information about API requests. You can
enable logging by providing a logger when creating the `RapidApi` instance:

```javascript
import { RapidApi, Logger } from 'rapidapi-node-sdk';

// Example using console as a logger
const rapidApiWithLogger = new RapidApi({
    rapidApiKey: 'your-rapidapi-key',
    rapidApiHost: 'api.rapidapi.com',
    baseUrl: 'https://api.example.com',
    logger: console, // Use console.log as a simple logger
});
```

### Compatible Loggers

The SDK is compatible with various logging libraries, including:

- **Pino**
- **Winston**
- **Bunyan**

To use a custom logger, make sure it adheres to the following interface:

```typescript
export interface Logger {
    info(message: string, data?: Record<string, unknown>): void;
}
```

Example using Pino as a logger:

```javascript
import { RapidApi, Logger } from 'rapidapi-node-sdk';
import pino from 'pino';

const logger: Logger = pino();

const rapidApiWithCustomLogger = new RapidApi({
    rapidApiKey: 'your-rapidapi-key',
    rapidApiHost: 'api.rapidapi.com',
    baseUrl: 'https://api.example.com',
    logger: logger,
});
```

Choose the logger that best fits your application needs, ensuring it conforms to
the specified interface.

## Caching

The SDK uses [Keyv](https://www.npmjs.com/package/keyv) to provide built-in
caching, optimizing API requests and improving performance. If you want to use
the default in-memory cache provided by the SDK, there's no need to install Keyv
separately. However, if you wish to use a
different [caching adapter](https://www.npmjs.com/package/keyv#usage), you would
need to install it separately. For a list of different caching adapters, please
refer to the [Keyv npm package](https://www.npmjs.com/package/keyv).

### Caching Usage

```javascript
import { RapidApi } from 'rapidapi-node-sdk';
import { Keyv } from 'keyv';

// Create a new RapidApi instance with caching using the default in-memory cache
const rapidApiWithCaching = new RapidApi({
    rapidApiKey: 'your-rapidapi-key',
    rapidApiHost: 'api.rapidapi.com',
    baseUrl: 'https://api.example.com',
    cache: new Keyv(), // Use default in-memory cache
});
```

## Issues

If you encounter any issues or have suggestions,
please [report them here](https://github.com/angelxmoreno/rapidapi-node-sdk/issues).

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for
details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file
for details.
