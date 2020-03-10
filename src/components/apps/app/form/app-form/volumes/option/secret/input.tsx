import { Form } from 'antd';
import { SearchSelect } from 'library';
import Context from '@/components/apps/app/context';
import { ISecret } from '@/models/apps/secret';
import option, { SearchSelectProps } from '../basic';

const FormItem = Form.Item;

const SecretSearchSelect = ({ initialValue = {}, labelCol, wrapperCol, form: { getFieldDecorator, setFieldsValue }, setVolumeItemsData }: SearchSelectProps) => (
  <Context.Consumer>
    {({ getSecrets, CreateSecretComp }) => (
      <FormItem
        labelCol={labelCol}
        wrapperCol={wrapperCol}
        label="Secret"
        required>
        {getFieldDecorator('secretName', {
          initialValue: initialValue.secretName,
          rules: [
            { required: true, message: '必须选择Secret' },
          ],
        })(
          <SearchSelect
            style={{ width: 'calc(100% - 68px)' }}
            initialLoad
            placeholder="选择Secret"
            asyncSearch={async (page, callback) => {
              let secrets: ISecret[] = await getSecrets!();
              callback({
                total: secrets.length,
                results: secrets.map((v) => ({
                  key: v.metadata.name,
                  label: v.metadata.name,
                  ...v,
                })) as any,
              })
            }}
            onChangeOptions={(name, _, configmaps: ISecret[]) => {
              setVolumeItemsData(Object.entries(configmaps.find(v => v.metadata.name === name)!.data || {}).map(([key]) => key))
            }}
          />
        )}
        <span style={{ float: 'right' }}>
          {CreateSecretComp && <CreateSecretComp onCreate={(data: any) => {
            setFieldsValue({ name: data.name })
          }} />}
        </span>
      </FormItem>
    )}
  </Context.Consumer>
)

export default option(SecretSearchSelect);