# Robot Routing Endpoint
Intakes POST request, fetching a list of 100 robots from an external API, providing their ID, current position on an xy-plane, and battery life. The endpoint returns which robot is the best to transport the load based on which is closest to the load's location. If there is more than 1 robot within 10 distance units of the load, the robot with the highest battery level is returned.

## Table of Contents

- [Technologies](#technologies)
- [Installation](#installation)
- [Testing](#testing)
- [Future Development](#future-development)
- [Created By](#created-by)
- [License](#license)

## Technologies

- JavaScript
- NodeJS/NPM
- Netlify

## Installation

To use this project, first clone and navigate to the project repo in your terminal using the commands below:

```
$ git clone https://github.com/eaclumpkens/robot-routing.git
$ cd ./robot-routing
```

Once the repo is cloned and you've ensured you are in the correct directory, if not previously installed, run the following code to install NPM & Netlify's CLI:

```
$ npm install npm -g
$ npm install netlify-cli -g
```

Install NPM packages & run locally:

```
$ npm i
$ ntl dev
```

Ensure server is running locally at http://localhost:8888/ or appropriate port

![Run Locally](media/localhost.gif)

## Testing

Send POST request to endpoint ```http://localhost:8888/.netlify/functions/handleRouting``` using API Platform such as Postman, ensuring the request body is valid JSON.

**Example POST Request Payload**
```
{
  "loadId": 321,
  "x": 40,
  "y": 35
}
```

**Example Response Payload**
```
{
  "robotId": 62,
  "batteryLevel": 70,
  "distanceToGoal": 7.2
}
```

**Example Using Postman**

![Postman](media/postman.gif)

## Future Development

**Automated Testing**

Implement a library such as JestJS to facilitate automated testing. 

**Prod Endpoint**

POST API requests to live URL rather than necessitating local hosting which would additionally allow developers to 
view prod function logs for lambda functions.

**.Net**

I'd like to be able to recreate this project using the .Net framework.

**Additional & More Communicative Error Handlings**

Ensure all edge cases are handled and try/catches used appropriately. I feel as if there are always more to be accounted for. 
Additional error catches would also allow for more communicative logs for developers when error patching, so I'd definitely like
to include more error logs. If it was a larger scale project, something liek Sentry's error tracking software would be nice to 
integrate.

**Basic FrontEnd**

It would be nice to implement a basic frontend rendering to be able to input and test robot routing; Completing a form
to test robot routing.

## Created by

[Elisabeth Clumpkens](mailto:eaclumpkens@gmail.com)

## License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
