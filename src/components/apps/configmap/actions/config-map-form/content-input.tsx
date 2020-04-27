import * as React from 'react';
import {Modal, message, Radio} from 'antd';
import {FormInstance} from 'antd/lib/form';
import * as YAML from 'js-yaml';
import {Inputs} from 'library';

const RadioGroup = Radio.Group;

const YamlCode = Inputs.Wapper({
  load: (value) => {
    let yaml: {[key: string]: string} = {};
    Object.entries(value).forEach(([k, v]: any) => {
      yaml[k] = YAML.load(v);
    });
    return YAML.dump(yaml);
  },
  dump: (value) => {
    let yaml: {[key: string]: string} = {};
    Object.entries(YAML.load(value)).forEach(([k, v]: any) => {
      yaml[k] = YAML.dump(v);
    });
    return yaml;
  },
})<any>(Inputs.Code);

export type ContentInputProps = {
  form: FormInstance;
  value?: {[key: string]: string};
  onChange?: (value: {[key: string]: string}) => void;
};

const ContentInput = ({form, value, onChange}: ContentInputProps) => {
  const [type, setType] = React.useState('yaml');
  return (
    <>
      <RadioGroup
        key="type"
        value={type}
        onChange={(e) => setType(e.target.value)}
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
            onChange={() => {
              const value = form.getFieldValue('data');
              let files = (document.getElementById(`yaml`) as any).files[0];
              if (files.size > 0 && files.size <= 1024 * 1024) {
                const reader = new FileReader();
                reader.onload = (e: any) => {
                  Modal.confirm({
                    title: '请选择数据添加方式',
                    okText: '追加',
                    cancelText: '覆盖',
                    onOk: () =>
                      form.setFieldsValue({
                        data: `${value ? `${value}\n` : ''}${e.target.result}`,
                      }),
                    onCancel: () =>
                      form.setFieldsValue({data: `${e.target.result}`}),
                  });
                  (document.getElementById(`yaml`) as any).value = '';
                };
                reader.readAsText(files);
              } else {
                message.error('文件大小不能超过1M');
              }
            }}
          />
          <a>加载本地文件</a>
          <span>(不超过1M)</span>
        </label>
      </div>

      {type === 'yaml' ? (
        <YamlCode value={value} autosize mode="yaml" onChange={onChange} />
      ) : (
        <>xxx</>
      )}
    </>
  );
};

export default ContentInput;
