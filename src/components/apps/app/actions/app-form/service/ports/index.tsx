import * as React from 'react';
import {Row, Col} from 'antd';
import {ArrayInput, FormInput} from 'library';
import PortInput from './port-input';
import {Port} from 'api/type/app/';

@(FormInput.create({
  onValuesChange: ({onChange}, _, allValues) => {
    onChange(allValues['ports-input']);
  }
}) as any)
export default class extends React.PureComponent<any, any> {
  static readonly defaultProps = {
    form: {},
    value: [],
    onChange: () => null
  };

  render() {
    const {value, required, form} = this.props;
    const {getFieldDecorator} = form;
    return (
      <FormInput>
        {getFieldDecorator('ports-input', {
          initialValue: value,
          rules: []
        })(
          <ArrayInput<Port>
            disabledRemoveLastOne={required}
            header={
              value.length <= 0 ? null : (
                <Row style={{padding: `8px`, backgroundColor: '#F7F7F7'}}>
                  <Col style={{width: 'calc(100% - 42px)', float: 'left'}}>
                    <Row gutter={8}>
                      <Col span={7}>
                        <p style={{lineHeight: '24px', margin: 0}}>协议</p>
                      </Col>
                      <Col span={8}>
                        <p style={{lineHeight: '24px', margin: 0}}>容器端口</p>
                      </Col>
                      <Col span={8} offset={1}>
                        <p style={{lineHeight: '24px', margin: 0}}>服务端口</p>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              )
            }
            others={value}
            input={PortInput}
            btnText="添加端口映射"
          />
        )}
      </FormInput>
    );
  }
}
