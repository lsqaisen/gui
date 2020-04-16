import * as React from 'react';
import {Modal, message, Radio} from 'antd';
import {Inputs} from 'library';
import LabelsInput from './labels';
import YamlInput from './yaml';
import {Label} from './labels/label-input';

const RadioGroup = Radio.Group;

const Labels = Inputs.Wapper({
  load: value => {
    return Object.entries(value).map(([key, yaml]: any) => {
      return {key, yaml};
    });
  },
  dump: (value: Label[]) => {
    let data: {[key: string]: string} = {};
    value.forEach(({key, yaml}) => {
      data[key] = yaml;
    });
    return data;
  }
})(LabelsInput);

export type ContentInputProps = {
  value: {[key: string]: string};
  onChange: (value: {[key: string]: string}) => void;
};

class ContentInput extends React.PureComponent<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      data: null,
      contentType: 'yaml'
    };
  }

  readFiles = () => {
    const {
      form: {getFieldValue, setFieldsValue}
    } = this.props;
    const value = getFieldValue('data');
    let files = (document.getElementById(`yaml`) as any).files[0];
    if (files.size > 0 && files.size <= 1024 * 1024) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        Modal.confirm({
          title: '请选择数据添加方式',
          okText: '追加',
          cancelText: '覆盖',
          onOk: () =>
            setFieldsValue({
              data: `${value ? `${value}\n` : ''}${e.target.result}`
            }),
          onCancel: () => setFieldsValue({data: `${e.target.result}`})
        });
        this.setState({loading: false}, () => {
          (document.getElementById(`yaml`) as any).value = '';
        });
      };
      reader.readAsText(files);
      this.setState({loading: true});
    } else {
      message.error('文件大小不能超过1M');
    }
  };

  render() {
    const {value, onChange} = this.props;
    const {contentType} = this.state;
    return (
      <>
        <RadioGroup
          key="type"
          value={contentType}
          onChange={e => this.setState({contentType: e.target.value})}
        >
          <Radio value="yaml">YAML</Radio>
          <Radio value="data">可视化</Radio>
        </RadioGroup>
        <div key="loadfile">
          <label style={{lineHeight: '32px'}}>
            <input
              id="yaml"
              type="file"
              style={{display: 'none'}}
              onChange={this.readFiles}
            />
            <a>加载本地文件</a>
            <span>(不超过1M)</span>
          </label>
        </div>

        {contentType === 'yaml' ? (
          <YamlInput {...this.props} />
        ) : (
          <Labels {...this.props} />
        )}
      </>
    );
  }
}

export default ContentInput;
