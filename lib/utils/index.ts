export const delay = (timeout: number) => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
};

export function generateUUID() {
  var d = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(
    c
  ) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x7) | 0x8).toString(16);
  });
  return uuid;
}

window.Number.prototype.flowCeil = function(fractionDigits: number = 0) {
  if (Number(this.toFixed(fractionDigits)) === 0) return `0`;
  if (this / 1024 / 1024 / 1024 / 1024 >= 1) {
    return `${Number(this / 1024 / 1024 / 1024 / 1024).toFixed(
      fractionDigits
    )}T`;
  } else if (this / 1024 / 1024 / 1024 >= 1) {
    return `${Number(this / 1024 / 1024 / 1024).toFixed(fractionDigits)}G`;
  } else if (this / 1024 / 1024 >= 1) {
    return `${Number(this / 1024 / 1024).toFixed(fractionDigits)}M`;
  } else if (this / 1024 >= 1) {
    return `${Number(this / 1024).toFixed(fractionDigits)}K`;
  }
  return `${Number(this).toFixed(fractionDigits)}B`;
};

window.Number.prototype.netCeil = function(fractionDigits: number = 0) {
  if (Number(this.toFixed(fractionDigits)) === 0) return `0`;
  if (this / 1024 / 1024 / 1024 >= 1) {
    return `${Number(this / 1024 / 1024 / 1024).toFixed(fractionDigits)}GB`;
  } else if (this / 1024 / 1024 >= 1) {
    return `${Number(this / 1024 / 1024).toFixed(fractionDigits)}MB`;
  } else if (this / 1024 >= 1) {
    return `${Number(this / 1024).toFixed(fractionDigits)}KB`;
  }
  return `${Number(this).toFixed(fractionDigits)}B`;
};

export default {
  delay,
  generateUUID
};
