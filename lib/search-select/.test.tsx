import {PureComponent} from 'react';
import * as reqwest from 'reqwest';
import SearchSelect, {SearchSelectProps} from './index';

const fakeDataUrl =
  'https://randomuser.me/api/?results=10&inc=name,gender,email,nat&noinfo';

class Test extends PureComponent<SearchSelectProps, any> {
  fetchData = (page: number, callback: any) => {
    reqwest({
      url: fakeDataUrl,
      type: 'json',
      method: 'get',
      contentType: 'application/json',
      success: (res: any) => {
        callback({
          results: res.results.map((v: any) => ({
            value: v.email,
            label: v.email,
            key: v.email
          })),
          total: 100
        });
      }
    });
  };
  render() {
    return <SearchSelect {...this.props} asyncSearch={this.fetchData} />;
  }
}

export default Test;
