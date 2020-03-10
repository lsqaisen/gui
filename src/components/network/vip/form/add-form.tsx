import { PureComponent } from 'react';
import { Form } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { INetworkVip } from '@/models/network/vip';
import AddressesInput from './input/addresses';
// import Addresses from './input/addresses/address';
import Context from '../context';
import { SearchSelect } from 'library';

const FormItem = Form.Item;

export interface ProjectFromProps {
  formItemLayout?: any;
}

@(Form.create() as any)
class AddProjectForm extends PureComponent<FormComponentProps & ProjectFromProps, any> {
  static readonly defaultProps = {
    form: {},
    formItemLayout: {
      labelCol: { xs: 24, md: 5 },
      wrapperCol: { xs: 24, md: 19 },
    },
  };

  state = {
    addresses: []
  }

  render() {
    const { formItemLayout, form } = this.props;
    const { getFieldDecorator, getFieldValue, setFieldsValue } = form;
    const { addresses } = this.state;
    return (
      <Context.Consumer>
        {({ getVips }) => (
          <Form>
            <FormItem
              {...formItemLayout}
              label="名称">
              {getFieldDecorator('name', {
                rules: [
                  { required: true, message: '子网名称不能为空!' },
                  { min: 3, max: 50, message: '名称长度为3~50！' },
                  { pattern: /^[a-z0-9]{1,}$/, message: `名称由小写字母、数字组成！` },
                  { pattern: /^[^\d]/, message: '开始字符不能是数字' }
                ],
              })(
                <SearchSelect
                  initialLoad={true}
                  placeholder="选择名称"
                  // onChangeOptions={(name, options, vips) => {
                  //   this.setState({ addresses: vips.find((vip: INetworkVip) => vip.name === name).addresses })
                  // }}
                  asyncSearch={async (page, callback) => {
                    const vips: INetworkVip[] = await getVips!();
                    callback({
                      total: vips.length,
                      results: vips.map(vip => ({
                        key: vip.name,
                        label: vip.name,
                        ...vip,
                      }))
                    })
                  }}
                />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="IP地址">
              {getFieldDecorator('addresses', {
                initialValue: [],
                rules: [],
              })(
                <AddressesInput />
              )}
            </FormItem>
          </Form>
        )}
      </Context.Consumer>
    )
  }
}

export default AddProjectForm;