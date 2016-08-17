import rp from 'request-promise-native';
import rpio from 'rpio';

class RPISenser {
  constructor(boardId, boardPin, serverUrl) {
    this.boardId = boardId;
    this.boardPin = boardPin;
    this.serverUrl = serverUrl;
    this.boardValue = -1;

    rpio.open(this.boardPin, rpio.INPUT, rpio.PULL_DOWN);
    this.onCheck();
    rpio.poll(this.boardPin, (cbpin) => {this.pollcb(cbpin);});
    this.log('開始監控');
  }

  pollcb(cbpin) {
    this.onCheck();
  }

  onCheck() {
    // kill timer to prevent bad call(status of lock change too frequently).
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout( () => {this.check();}, 2000);
  }

  check() {
    let initBoardValue = this.boardValue;
    this.boardValue = rpio.read(this.boardPin);

    if (initBoardValue != -1) {
      this.log('boardValue: ' + this.boardValue);
      this.sendStatus()
        .then(message => {
          this.log( 'sendStatus 成功: ' + JSON.stringify(message) );
        })
        .catch(error => {
          this.log( 'sendStatus 失敗: ' + JSON.stringify(error) );
        });
    }
  }

  getBoardId() {
    return this.boardId;
  }

  getBoardValue() {
    return this.boardValue;
  }

  sendStatus() {
    let options = {
      method: 'POST',
      uri: `http://${this.serverUrl}/updateStatus`,
      body: {
        boardId: this.boardId,
        boardValue: this.boardValue
      },
      json: true // Automatically stringifies the body to JSON
    };

    return rp(options);
  }

  log(text) {
    const d = new Date();
    const date = d.toLocaleDateString();
    const time = d.toLocaleTimeString();
    console.log(`${date} ${time}: ${text}`);
  }
}

export { RPISenser as default };
