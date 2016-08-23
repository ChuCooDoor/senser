class Logger {
  log(text) {
    const date = new Date();
    const dateText = date.toLocaleString('zh-TW');

    console.log(`${dateText}: ${text}`);
  }
}

export { Logger as default };
