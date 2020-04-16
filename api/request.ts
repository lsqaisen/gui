import JSEncrypt from 'jsencrypt';

export let encrypt = new JSEncrypt();
(async () => {
  const key: any = await request(`/api/auth/keys`);
  encrypt.setPublicKey((key.data || {}).encrypt_password);
})();

export type ResType = {
  data?: any;
  err?: any;
};

function ab2str(buf: BufferSource | Blob | string) {
  return new Promise((resolve, reject) => {
    let b = new Blob([buf], {
      type: 'text/plain'
    });
    var reader: any = new FileReader();
    reader.readAsText(b, 'utf-8');
    reader.onload = function() {
      try {
        resolve(JSON.parse(reader.result));
      } catch (error) {
        resolve(reader.result);
      }
    };
  });
}

async function parseJSON(response: Response) {
  const X_Total_Count = response.headers.get('X-Total-Count');
  let buf = await response.arrayBuffer();
  if (X_Total_Count !== null && X_Total_Count !== undefined) {
    return {
      list: await ab2str(buf),
      total: X_Total_Count
    };
  }
  return ab2str(buf);
}

function errorParse(response: Response) {
  return new Promise(async (resolve, reject) => {
    let buf = await response.arrayBuffer();
    let data: any = await ab2str(buf);
    resolve(
      typeof data === 'object' ? data.error || JSON.stringify(data) : data
    );
  });
}

async function checkStatus(response: Response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  let error = await errorParse(response);
  if (!error) {
    error = response.statusText;
  }
  throw error;
}

interface RequestOptions extends RequestInit {
  body?: any;
}

export default function request(
  url: string,
  options?: RequestOptions,
  upload?: boolean
) {
  const defaultOptions = {
    credentials: 'include',
    mode: 'cors'
  };
  const newOptions: any = {...defaultOptions, ...options};
  if (
    (newOptions.method || '').toLocaleUpperCase() === 'POST' ||
    (newOptions.method || '').toLocaleUpperCase() === 'PUT' ||
    (newOptions.method || '').toLocaleUpperCase() === 'PATCH' ||
    (newOptions.method || '').toLocaleUpperCase() === 'DELETE'
  ) {
    if (!!upload) {
      newOptions.headers = {
        ...newOptions.headers
      };
    } else {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8;',
        ...newOptions.headers
      };
      newOptions.body = JSON.stringify(newOptions.body);
    }
  }

  return fetch(`${url}`, newOptions)
    .then(checkStatus)
    .then(parseJSON)
    .then((data: any) => ({data}))
    .catch((err: any) => {
      return {err};
    });
}
