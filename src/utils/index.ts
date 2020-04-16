import {useEffect, useRef} from 'react';

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

export function useInterval(callback: () => any, delay: number) {
  const savedCallback: any = useRef();

  // 保存新回调
  useEffect(() => {
    savedCallback.current = callback;
  });

  // 建立 interval
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

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

export function getIPList(
  start: string,
  number: Number,
  old_list: string[]
): string[] {
  if (!!start && number > 0) {
    let list = [start],
      select_list = old_list || [];
    for (let i = 1; i < Number(number); i++) {
      let items: any[] = start.split('.');
      items = items.map(item => parseInt(item));
      items[3] += i;
      if (items[3] >= 255) {
        items[3] = items[3] - 254;
        items[2] += 1;
        if (items[2] > 255) {
          items[2] = 0;
          items[1] += 1;
          if (items[1] > 255) {
            items[1] = 0;
            items[0] += 1;
          }
        }
      }
      list.push(items.join('.'));
    }
    for (let i = 0; i < list.length; i++) {
      select_list.indexOf(list[i]) == -1 && select_list.push(list[i]);
    }
    return select_list;
  }
  return old_list || [];
}

export default {
  delay,
  generateUUID,
  getIPList
};
