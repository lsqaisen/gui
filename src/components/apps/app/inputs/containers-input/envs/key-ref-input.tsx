import * as React from 'react';
import {Form, Row, Col, Select} from 'antd';
import {EnvKeyRef} from 'api/type/app/';
import {IConfigMap} from '@/models/apps/configmap';
import {ISecret} from '@/models/apps/secret';
import {SearchSelect} from 'library';
import {FormInstance} from 'antd/lib/form';

interface FieldData {
  name: number;
  key: number;
  fieldKey: number;
}

export interface KeyRefProps {
  value?: {
    configMapKeyRef?: EnvKeyRef;
    secretKeyRef?: EnvKeyRef;
  };
  field?: FieldData;
  form: FormInstance;
  getConfigMaps?: () => Promise<any>;
  getSecrets?: () => Promise<any>;
  onChange?: (value: any) => void;
}

const KeyRef = ({
  value,
  field,
  form,
  getConfigMaps,
  getSecrets,
  onChange = () => {},
}: KeyRefProps) => {
  const [type, setType] = React.useState(
    value && value.configMapKeyRef ? 'configMapKeyRef' : 'secretKeyRef'
  );
  const [keys, setKeys] = React.useState([] as string[]);
  React.useEffect(() => {
    console.log(type, value, form.getFieldsValue());
    onChange({
      [type]: (value || {})[
        type === 'secretKeyRef' ? 'configMapKeyRef' : 'secretKeyRef'
      ],
    });
  }, [type]);
  const keyref = React.useMemo(
    () => (
      // <Form.Item
      //   name={[field?.name as any, 'valueFrom', type]}
      //   fieldKey={[field?.fieldKey, 'valueFrom', type] as any}
      // >
      <Row gutter={4}>
        <Col span={12}>
          {/* <Form.Item
            name={[field?.name as any, 'valueFrom', type, 'name']}
            fieldKey={[field?.fieldKey, 'valueFrom', type, 'name'] as any}
            rules={[{required: true, message: '标签值必须填写'}]}
          > */}
          <SearchSelect
            showSearch
            style={{width: '100%'}}
            initialLoad={true}
            placeholder="选择ConfigMap"
            asyncSearch={async (page, callback) => {
              let [configmaps, secrets] = await Promise.all([
                getConfigMaps!(),
                getSecrets!(),
              ]);
              const results = [
                ...(configmaps.map((v: IConfigMap) => ({
                  key: v.name,
                  label: v.name,
                  ...v,
                })) as any),
                ...(secrets.map((v: ISecret) => ({
                  key: v.metadata.name,
                  label: v.metadata.name,
                  ...v,
                })) as any),
              ];
              if (value?.configMapKeyRef?.name || value?.secretKeyRef?.name) {
                const selectValue = results.find(
                  (v: any) =>
                    v.key ===
                    (value?.configMapKeyRef?.name || value?.secretKeyRef?.name)
                );
                setKeys(Object.keys(selectValue.data || {}));
              }
              console.log(results);
              callback({
                total: configmaps.length,
                results,
              });
            }}
            onChangeOptions={(name, _, data) => {
              const selectValue = data.find((v: any) => v.key === name);
              if (!!selectValue.metadata && type !== 'secretKeyRef') {
                setType('secretKeyRef');
              } else if (type !== 'configMapKeyRef') {
                setType('configMapKeyRef');
              }
              console.log(selectValue);
              setKeys(Object.keys(selectValue.data || {}));
            }}
          />
          {/* </Form.Item> */}
        </Col>
        <Col span={12}>
          {/* <Form.Item
            name={[field?.name as any, 'valueFrom', type, 'key']}
            fieldKey={[field?.fieldKey, 'valueFrom', type, 'key'] as any}
            rules={[{required: true, message: '标签值必须填写'}]}
          > */}
          <Select>
            {keys.map((v) => (
              <Select.Option key={v} value={v}>
                {v}
              </Select.Option>
            ))}
          </Select>
          {/* </Form.Item> */}
        </Col>
      </Row>
      // </Form.Item>
    ),
    [field?.name, type]
  );
  return keyref;
};

export default KeyRef;
