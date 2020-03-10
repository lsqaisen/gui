import { PureComponent } from 'react';
import * as reqwest from 'reqwest';
import InfiniteScroller from './index';

const fakeDataUrl = 'https://randomuser.me/api/?results=10&inc=name,gender,email,nat&noinfo';

class Test extends PureComponent<any, any> {
  state = {
    data: []
  }
  fetchData = (page: number) => {
    reqwest({
      url: fakeDataUrl,
      type: 'json',
      method: 'get',
      contentType: 'application/json',
      success: (res: any) => {
        console.log(page)
        this.setState({ data: this.state.data.concat(res.results.map((v: any) => ({ value: v.email, label: v.email, key: v.email }))) });
      },
    });
  };
  componentDidMount() {
    this.fetchData(0);
  }
  render() {
    return (
      <InfiniteScroller
        loadMore={this.fetchData}
        hasMore={true}
      >
        {this.state.data.map((v: any) => <div key={v.key}>{v.value}</div>)}
      </InfiniteScroller>
    )
  }
}

export default Test;