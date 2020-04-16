import {Icon} from 'antd';
import CreateAppForm from './form/app-form/';
import Context from './context';
import {makeDrawerForm} from 'library';
import {App} from 'api/type/app';

const Add = makeDrawerForm<App, any>(CreateAppForm);

export default () => (
  <Context.Consumer>
    {({namespace, createApp}) => (
      <Add
        width={720}
        btnText="添加应用"
        btnIcon={<Icon type="plus" />}
        submit={(values: any) => {
          let labels = {} as any;
          values.labels.forEach(({name, value}: any) => {
            labels[name] = value;
          });
          return createApp!({...values, labels});
        }}
        data={{namespace} as App}
      />
    )}
  </Context.Consumer>
);
