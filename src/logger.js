import Moment from 'moment';

class Logger {
  log(text) {
    const dateText = moment().format( 'YYYY/MM/DD HH:mm:ss')
    console.log(`${dateText}: ${text}`);
  }
}

export { Logger as default };
