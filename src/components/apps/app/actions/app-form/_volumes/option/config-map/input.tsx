import { Form } from 'antd';
import { SearchSelect } from 'library';
import Context from '@/components/apps/app/context';
import { IConfigMap } from '@/models/apps/configmap';
import option, { SearchSelectProps } from '../basic';

const FormItem = Form.Item;

const ConfigMapSearchSelect = ({ initialValue, labelCol, wrapperCol, form: { getFieldDecorator, setFieldsValue }, setVolumeItemsData }: SearchSelectProps) => (
  <Context.Consumer>
    {({ getConfigMaps, CreateConfigMapComp }) => (
      <FormItem
        labelCol={labelCol}
        wrapperCol={wrapperCol}
        label="ConfigMap"
        required>
        {getFieldDecorator('name', {
          initialValue: initialValue.name,
          rules: [
            { required: true, message: '必须选择ConfigMap' },
          ],
        })(
          <SearchSelect
            style={{ width: 'calc(100% - 68px)' }}
            initialLoad
            placeholder="选择ConfigMap"
            asyncSearch={async (page, callback) => {
              let configmaps: IConfigMap[] = await getConfigMaps!();
              callback({
                total: configmaps.length,
                results: configmaps.map((v) => ({
                  key: v.name,
                  label: v.name,
                  ...v,
                })) as any,
              })
            }}
            onChangeOptions={(name, _, configmaps: IConfigMap[]) => {
              setVolumeItemsData(Object.entries(configmaps.find(v => v.name === name)!.data || {}).map(([key]) => key))
            }}
          />
        )}
        <span style={{ float: 'right' }}>
          {CreateConfigMapComp && <CreateConfigMapComp onCreate={(data: IConfigMap) => {
            setFieldsValue({ name: data.name })
          }} />}
        </span>
      </FormItem>
    )}
  </Context.Consumer>
)

export default option(ConfigMapSearchSelect);