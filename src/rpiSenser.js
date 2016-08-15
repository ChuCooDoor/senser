import rp from 'request-promise-native';
import rpio from 'rpio';

class RPISenser {
  constructor(boardId, serverUrl) {
    this.boardId = boardId;
    this.boardPin = boardPin;
    this.serverUrl = serverUrl;
    this.boardValue = -1;

    rpio.open(this.boardPin, rpio.INPUT, rpio.PULL_DOWN);
    this.onCheck();
    rpio.poll(this.boardPin, (cbpin) => {this.pollcb(cbpin);});
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
    this.boardValue = rpio.read(this.boardPin);
    this.log('boardValue: ' + this.boardValue);

    this.sendStatus()
      .then(function (message) {
        this.log('sendStatus 成功: ' + message);
      })
      .catch(function (error) {
        this.log('sendStatus 失敗: ' + error);
      });
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
