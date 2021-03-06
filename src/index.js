import Http from 'http';
import Moment from 'moment';
import Router from 'router';
import BodyParser from 'body-parser';
import RPIsensor from './rpiSensor.js';
import Logger from './logger.js';
import { boardId, boardPin, serverUrl, sensorPort, sensorDelayMillisecond } from './env.js';

const logger = new Logger('System');
const sensor = new RPIsensor(boardId, boardPin, serverUrl, sensorDelayMillisecond);

// server for rpi-sensor
let router = new Router();
router.use(BodyParser.json());

router.get('/boardValue/:boardId', function (request, response) {
  let boardId = request.params.boardId;
  logger.log(`收到取得狀態要求 boardId:${boardId}`);

  if ( boardId != sensor.getBoardId() ) {
    response.writeHead( 404, {
      'Content-Type' : 'application/json; charset=utf-8'
    });
    response.end( JSON.stringify({message: 'Not Found'}) );
  } else {
    let result = {
      boardValue: sensor.getBoardValue()
    }
    response.writeHead( 200, {
      'Content-Type' : 'application/json; charset=utf-8'
    });
    response.end( JSON.stringify(result) );
  }

});

const server = Http.createServer(function(request, response) {
  // router(req, res, finalhandler(req, res));
  router( request, response, function( error ) {
    if ( !error ) {
      response.writeHead( 404 );
    } else {
      // Handle errors
      console.log( error.message, error.stack );
      response.writeHead( 400 );
    }
    response.end( 'RESTful API Server is running!' );
  });
})

server.listen(sensorPort);
