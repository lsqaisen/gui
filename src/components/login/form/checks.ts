export function checkPassword(rule: any, value: any, callback: Function) {
  let pattern1 = /[^\!\@\#\$\%\^\&\*\(\\\)\-\=\_\+\,\.\?\/\:\;\{\}\[\]\~\w]/g;
  let pattern2 = /[a-z]+/;
  let pattern3 = /[A-Z]+/;
  let pattern4 = /[0-9]+/;
  let pattern5 = /[\!\@\#\$\%\^\&\*\(\\\)\-\=\_\+\,\.\?\/\:\;\{\}\[\]\~]+/;
  // let a = !(pattern2.test(value));
  // let b = !(pattern3.test(value));
  // let c = !(pattern4.test(value));
  // let d = !(pattern5.test(value));
  let count = 0;
  if (pattern2.test(value)) {
    count++;
  }
  if (pattern3.test(value)) {
    count++;
  }
  if (pattern4.test(value)) {
    count++;
  }
  if (pattern5.test(value)) {
    count++;
  }
  if (!value) {
    callback();
  } else if (value.length < 8) {
    callback('必须输入8个以上的字符');
  } else if (pattern1.test(value)) {
    callback('输入的字符不能为!@#$%^&*(\)-_=+,.?/:;{}[]~字母数字之外的');
  } else if (count < 2) {
    callback('输入包含大写，小写字母，数字，字符两种及以上');
  } else {
    callback();
  }
}
