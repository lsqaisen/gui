import * as React from 'react';
import {Collapse, Icon} from 'antd';
import {ArrayInput, FormInput} from 'library';
import ContainerInput from './container-input';
import {Container} from 'api/type/app/';

const customPanelStyle = {
  background: '#f7f7f7',
  borderRadius: 4,
  marginBottom: 24,
  border: 0,
  overflow: 'hidden'
};

const Input = ({canBeDeleted, actions, children}: any) => (
  <Collapse
    style={{width: '100%'}}
    bordered={false}
    defaultActiveKey={['1']}
    expandIcon={({isActive}) => (
      <Icon type="caret-right" rotate={isActive ? 90 : 0} />
    )}
  >
    <Collapse.Panel
      header={name || '容器配置'}
      key="1"
      style={customPanelStyle}
      extra={canBeDeleted ? actions : undefined}
    >
      {children}
    </Collapse.Panel>
  </Collapse>
);

@(FormInput.create({
  onValuesChange: ({onChange}, _, allValues) => {
    onChange(allValues['containers-input']);
  }
}) as any)
export default class extends React.PureComponent<any, any> {
  static readonly defaultProps = {
    form: {},
    value: [{}],
    labels: [
      'args',
      'command',
      'env',
      'image',
      'liveness_probe',
      'name',
      'privileged',
      'resources',
      'volume_mounts',
      'working_dir'
    ],
    onChange: () => null
  };

  render() {
    const {value, volumes, labels, form} = this.props;
    const {getFieldDecorator} = form;
    return (
      <FormInput>
        {getFieldDecorator('containers-input', {
          initialValue: value,
          rules: []
        })(
          <ArrayInput<Container>
            btnType="dashed"
            actionTypes={labels > 3 ? ['add'] : []}
            others={value}
            input={ContainerInput}
            inputProps={{volumes, labels}}
            btnText="添加容器"
            actions={[<a>删除</a>]}
            itemWapper={<Input canBeDeleted={value.length > 1} />}
          />
        )}
      </FormInput>
    );
  }
}
