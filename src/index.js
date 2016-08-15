import RPISenser from './rpiSenser.js';
import { boardId, boardPin, serverUrl } from './env.js';

const senser = new RPISenser(boardId, boardPin, serverUrl);
senser.onCheck();
