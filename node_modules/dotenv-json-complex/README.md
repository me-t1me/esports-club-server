# dotenv-json-complex

Load complex enviroment variable via JSON file

## Installation

With [Nodejs](https://nodejs.org/en/) installed run the installation command in a terminal:

```bash
npm install dotenv-json-complex
```

## Usage

Create a `.env.json` file in the root of your project:
```json
{
    "my_app_env": {
      "nodeEnv": "development",
      "api": {
        "prefix": "/api"
      },
      "database": {
        "username": "foo",
        "password": "bar",
        "name": "awesome_db_name",
        "host": "my_db_host"
      }
    }
}
```

After that, load your environment variables by requiring the dotenv dotenv-json-complex and executing it:
```javascript
// here you load the json to your process.env
require("dotenv-json-complex")();

const env = JSON.parse(process.env.my_app_env);

// this will print your complex json environment!
console.log(env)

// like this
{
  "nodeEnv": "development",
  "api": {
    "prefix": "/api"
  },
  "database": {
    "username": "foo",
    "password": "bar",
    "name": "awesome_db_name",
    "host": "my_db_host"
  }
}
```

Furthermore you can provide an object to change environment filename:
```javascript
require("dotenv-json-complex")({ environment: 'qa' });
```

This will look for `.env.qa.json` file and load it in memory.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](LICENSE)