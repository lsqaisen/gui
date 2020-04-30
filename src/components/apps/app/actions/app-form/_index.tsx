import * as React from 'react';
import {
  Row,
  Col,
  Form,
  Button,
  Input,
  Radio,
  InputNumber,
  Typography,
  Checkbox,
} from 'antd';
import Context from '../../context';
import NameInput from './name-input';
import {SearchSelect} from 'library';
import LabelsInput from './labels-input';
import VolumesInput from './volumes-input/';
// import {ColProps} from 'antd/lib/grid/col';
// import Labels from './labels';
// import Volumes from './volumes';
// import Containers from './containers';
// import Service from './service';
import {INetworkPool} from '@/models/network/pool';
// import {InputProps} from 'antd/lib/input';

export interface AppFormProps {
  initialValues?: any;
  onSubmit: (values: any) => void;
}

const AppForm: React.FC<AppFormProps> = ({
  initialValues,
  onSubmit,
  children,
}) => {
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      name="app-form"
      scrollToFirstError
      initialValues={initialValues}
      onFinish={onSubmit}
      labelCol={{xs: 24, md: 4}}
      wrapperCol={{xs: 24, md: 20}}
    >
      <Form.Item required name="namespace" label="命名空间">
        <Input disabled />
      </Form.Item>
      {/* <Form.Item
        required
        validateFirst
        name="name"
        label="服务名称"
        extra="最长63个字符，只能包含小写字母、数字和字符‘-’，小写字母开头，小写字母或数字结尾."
        rules={[
          {required: true, message: '服务名称必须填写！'},
          {
            validator: (rule, value, callback) => {
              if (value === 'app-') callback('服务名称必须填写！');
              callback();
            },
          },
          {max: 64, message: '最长63个字符'},
          {
            pattern: /^[a-z0-9-]+$/,
            message: '只能包含小写字母、数字和字符‘-’',
          },
          {pattern: /[a-z0-9]$/, message: '小写字母或数字结尾'},
        ]}
      >
        <NameInput placeholder="服务名称" />
      </Form.Item>
      <Context.Consumer>
        {({getIPPools}) => (
          <Form.Item name="ip_pool" label="虚拟子网">
            <SearchSelect
              style={{width: '100%'}}
              showSearch
              allowClear
              initialLoad={true}
              placeholder="选择虚拟子网"
              onChange={() => {
                form.setFieldsValue({image_tag: undefined});
              }}
              asyncSearch={async (page, callback) => {
                const pools: INetworkPool[] = await getIPPools!();
                callback({
                  total: pools.length,
                  results: pools.map((pool) => ({
                    key: pool.name,
                    label: pool.name,
                  })),
                });
              }}
            />
          </Form.Item>
        )}
      </Context.Consumer>
      <Form.Item name="type" label="类型" required>
        <Radio.Group style={{maxWidth: 320}}>
          <Radio value="Deployment">Deployment（可扩展的部署Pod）</Radio>
          <Radio value="DaemonSet">DaemonSet（在每个主机上运行Pod）</Radio>
          <Radio value="StatefulSet">StatefulSet（有状态集的运行Pod）</Radio>
        </Radio.Group>
      </Form.Item> */}
      {/* <Form.Item
        name="labels"
        style={{marginBottom: 0}}
        label="标签"
        extra={`只能包含字母、数字及分隔符("-"、"_"、"."、"/")， 且必须以字母、数字开头和结尾`}
        validateStatus="success"
        help={undefined}
      >
        <LabelsInput form={form} />
      </Form.Item> */}
      <Form.Item
        name="volumes"
        style={{marginBottom: 0}}
        label="数据卷"
        validateStatus="success"
        help={undefined}
      >
        <VolumesInput form={form} />
      </Form.Item>
      {children || (
        <Form.Item
          wrapperCol={{
            xs: {
              span: 24,
              offset: 0,
            },
            sm: {
              span: 16,
              offset: 8,
            },
          }}
        >
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Form.Item>
      )}
    </Form>
  );
};

// @(Form.create() as any)
// class AppForm extends React.PureComponent<AppFormProps, any> {
//   static readonly defaultProps = {
//     form: {},
//     labelCol: {xs: 24, md: 4},
//     wrapperCol: {xs: 24, md: 20}
//   };

//   constructor(props: AppFormProps) {
//     super(props);
//     this.state = {
//       open: props.data && !!props.data.service ? true : false
//     };
//   }

//   render() {
//     const {data, labelCol, wrapperCol, form} = this.props;
//     const {getFieldDecorator, getFieldValue, setFieldsValue} = form;
//     const {
//       name,
//       namespace,
//       type = 'Deployment',
//       replicas,
//       labels,
//       volumes,
//       containers = [{}],
//       service,
//       ip_pool
//     } = data || ({} as App);
//     const {open} = this.state;
//     return (
//       <Form>
//         <Form.Item
//           labelCol={labelCol}
//           wrapperCol={wrapperCol}
//           label="命名空间"
//           required
//         >
//           {getFieldDecorator('namespace', {
//             initialValue: namespace
//           })(<Input disabled />)}
//         </Form.Item>
//         <Form.Item
//           labelCol={labelCol}
//           wrapperCol={wrapperCol}
//           label="服务名称"
//           extra="最长63个字符，只能包含小写字母、数字和字符‘-’，小写字母开头，小写字母或数字结尾."
//           required
//         >
//           {getFieldDecorator('name', {
//             initialValue: name,
//             validateFirst: true,
//             rules: [
//               {required: true, message: '服务名称必须填写！'},
//               {
//                 validator: (rule, value, callback) => {
//                   if (value === 'app-') callback('服务名称必须填写！');
//                   callback();
//                 }
//               },
//               {max: 64, message: '最长63个字符'},
//               {
//                 pattern: /^[a-z0-9-]+$/,
//                 message: '只能包含小写字母、数字和字符‘-’'
//               },
//               {pattern: /[a-z0-9]$/, message: '小写字母或数字结尾'}
//             ]
//           })(<NameInput placeholder="服务名称" />)}
//         </Form.Item>
//         <Context.Consumer>
//           {({getIPPools}) => (
//             <Form.Item
//               labelCol={labelCol}
//               wrapperCol={wrapperCol}
//               label="虚拟子网"
//             >
//               {getFieldDecorator('ip_pool', {
//                 initialValue: ip_pool
//               })(
//                 <SearchSelect
//                   style={{width: '100%'}}
//                   showSearch
//                   allowClear
//                   initialLoad={true}
//                   placeholder="选择虚拟子网"
//                   onChange={() => {
//                     form.setFieldsValue({image_tag: undefined});
//                   }}
//                   asyncSearch={async (page, callback) => {
//                     const pools: INetworkPool[] = await getIPPools!();
//                     callback({
//                       total: pools.length,
//                       results: pools.map(pool => ({
//                         key: pool.name,
//                         label: pool.name
//                       }))
//                     });
//                   }}
//                 />
//               )}
//             </Form.Item>
//           )}
//         </Context.Consumer>
//         <Form.Item
//           labelCol={labelCol}
//           wrapperCol={wrapperCol}
//           label="类型"
//           required
//         >
//           {getFieldDecorator('type', {
//             initialValue: type
//           })(
//             <Radio.Group style={{maxWidth: 320}}>
//               <Radio value="Deployment">Deployment（可扩展的部署Pod）</Radio>
//               <Radio value="DaemonSet">DaemonSet（在每个主机上运行Pod）</Radio>
//               <Radio value="StatefulSet">
//                 StatefulSet（有状态集的运行Pod）
//               </Radio>
//             </Radio.Group>
//           )}
//         </Form.Item>
//         <Form.Item
//           labelCol={labelCol}
//           wrapperCol={wrapperCol}
//           label="标签"
//           extra={`只能包含字母、数字及分隔符("-"、"_"、"."、"/")， 且必须以字母、数字开头和结尾`}
//           validateStatus=""
//           help=""
//         >
//           {getFieldDecorator('labels', {
//             initialValue: Object.entries(labels || {}).map(([name, value]) => ({
//               name,
//               value
//             })),
//             rules: []
//           })(<Labels />)}
//         </Form.Item>
//         <Form.Item
//           labelCol={labelCol}
//           wrapperCol={wrapperCol}
//           label="数据卷"
//           validateStatus=""
//           help=""
//         >
//           {getFieldDecorator('volumes', {
//             initialValue: volumes,
//             rules: []
//           })(<Volumes />)}
//         </Form.Item>
//         <Form.Item
//           labelCol={labelCol}
//           wrapperCol={wrapperCol}
//           label="实例数量"
//           required
//         >
//           {getFieldDecorator('replicas', {
//             initialValue: replicas || 1,
//             rules: [{required: true, message: '必须指定实例数量！'}]
//           })(
//             <InputNumber
//               style={{width: 180}}
//               min={1}
//               max={10000}
//               placeholder="实例数量"
//             />
//           )}
//         </Form.Item>
//         <Form.Item
//           labelCol={{span: 24}}
//           wrapperCol={{span: 24}}
//           label={
//             <Typography.Text strong style={{fontSize: '16px'}}>
//               实例内容器
//             </Typography.Text>
//           }
//           validateStatus=""
//           help=""
//         >
//           {getFieldDecorator('containers', {
//             initialValue: containers,
//             rules: []
//           })(
//             <Containers
//               volumes={(getFieldValue('volumes') || []).filter(
//                 (v: any) => !v.host_path
//               )}
//             />
//           )}
//         </Form.Item>
//         <Form.Item
//           labelCol={{span: 24}}
//           wrapperCol={{span: 24}}
//           label={
//             <Typography.Text strong style={{fontSize: '16px'}}>
//               访问设置（Service）
//             </Typography.Text>
//           }
//           validateStatus=""
//           help=""
//         >
//           <Form.Item labelCol={labelCol} wrapperCol={wrapperCol} label="Service">
//             <label htmlFor="">
//               <Checkbox
//                 checked={open}
//                 onChange={e => {
//                   this.setState({open: e.target.checked});
//                   if (e.target.checked) {
//                     setFieldsValue({
//                       service: {
//                         type: 'LoadBalancer',
//                         external_traffic_policy: 'Cluster',
//                         session_affinity: 'None',
//                         load_balance: {auto_create: true},
//                         ports: []
//                       }
//                     });
//                   } else {
//                     setFieldsValue({service: undefined});
//                   }
//                 }}
//               >
//                 <a>启用</a>
//               </Checkbox>
//             </label>
//           </Form.Item>
//           {getFieldDecorator('service', {
//             initialValue: service,
//             rules: []
//           })(<Service portsRequired={getFieldValue('type') === 'DaemonSet'} />)}
//         </Form.Item>
//       </Form>
//     );
//   }
// }

export default AppForm;
