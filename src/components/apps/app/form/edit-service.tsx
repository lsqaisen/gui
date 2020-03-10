import * as React from 'react';
import { Form, Input, Typography, Radio, Checkbox } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { ColProps } from 'antd/lib/grid/col';
import { App } from 'api/type/app';
import Containers from './app-form/containers';
import Service from './app-form/service';

const FormItem = Form.Item;

export interface EditFormProps extends FormComponentProps {
  data?: App
  labelCol?: ColProps
  wrapperCol?: ColProps
}

@(Form.create() as any)
class EditForm extends React.PureComponent<EditFormProps, any> {
  static readonly defaultProps = {
    form: {},
    labelCol: { xs: 24, md: 4 },
    wrapperCol: { xs: 24, md: 20 },
  };

  constructor(props: EditFormProps) {
    super(props);
    this.state = {
      open: props.data && !!props.data.service ? true : false
    }
  }

  render() {
    const { data, labelCol, wrapperCol, form } = this.props;
    const { getFieldDecorator, setFieldsValue } = form;
    const { type = "Deployment", service } = (data || {} as App);
    const { open } = this.state;
    return (
      <Form>
        <FormItem
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          validateStatus=""
          help="">
          <FormItem
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            label="Service"
          >
            <label htmlFor="">
              <Checkbox
                checked={open}
                onChange={(e) => {
                  this.setState({ open: e.target.checked })
                  if (e.target.checked) {
                    setFieldsValue({
                      service: {
                        type: "LoadBalancer",
                        external_traffic_policy: "Cluster",
                        session_affinity: "None",
                        load_balance: { auto_create: true },
                        ports: []
                      }
                    })
                  } else {
                    setFieldsValue({ service: undefined })
                  }
                }}
              ><a>启用</a></Checkbox>
            </label>
          </FormItem>
          {getFieldDecorator('service', {
            initialValue: service,
            rules: [],
          })(
            <Service portsRequired={type === "DaemonSet"} />
          )}
        </FormItem>
      </Form>
    )
  }
}

export default EditForm;