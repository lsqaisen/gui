import * as React from 'react';
import {Form, Input} from 'antd';
import HostIPInput from './input/hostip-input';

const FormItem = Form.Item;

// class AddNodeForm extends PureComponent<FormComponentProps & any, any> {
//   static readonly defaultProps = {
//     formItemLayout: {
//       labelCol: {xs: 24, md: 5},
//       wrapperCol: {xs: 24, md: 19}
//     }
//   };

//   render() {
//     const {formItemLayout, form} = this.props;
//     const {getFieldDecorator} = form;
//     return (
//       <Form>
//         <FormItem
//           {...formItemLayout}
//           style={{marginBottom: 0}}
//           label="IP地址范围"
//           validateStatus=""
//           help=""
//           required
//         >
//           {getFieldDecorator('addresses', {rules: []})(<HostIPInput />)}
//         </FormItem>
//         <FormItem {...formItemLayout} label="用户名" key="1">
//           {getFieldDecorator('account', {
//             initialValue: 'root',
//             rules: [
//               {required: true, message: '用户名不能为空!'},
//               {
//                 validator: (rule: any, value: any, callback: any) => {
//                   if (!!value) {
//                     let pattern = /[\u4e00-\u9fa5]/;
//                     let n = 0;
//                     for (let i = 0; i < value.length; i++) {
//                       if (pattern.test(value[i])) {
//                         n = n + 3;
//                       } else {
//                         n = n + 1;
//                       }
//                     }
//                     if (n > 50) {
//                       callback('用户名长度超出限制');
//                     }
//                   }
//                   callback();
//                 }
//               }
//             ]
//           })(<Input placeholder="请输入用户名" />)}
//         </FormItem>
//         <FormItem {...formItemLayout} label="密码" key="2">
//           {getFieldDecorator('password', {
//             rules: [{required: true, message: '密码不能为空!'}]
//           })(
//             <Input
//               type="password"
//               autoComplete="new-password"
//               placeholder="请输入密码"
//             />
//           )}
//         </FormItem>
//       </Form>
//     );
//   }
// }

const AddNodeForm = () => {
  const formItemLayout = {
    labelCol: {xs: 24, md: 5},
    wrapperCol: {xs: 24, md: 19}
  };
  return (
    <>
      <Form.Item {...formItemLayout} label="IP地址范围" name={'addresses'}>
        <HostIPInput />
      </Form.Item>
      <Form.Item
        {...formItemLayout}
        label="用户名"
        name="account"
        rules={[
          {required: true, message: '用户名不能为空!'},
          {
            validator: (_: any, value: any, callback: any) => {
              if (!!value) {
                let pattern = /[\u4e00-\u9fa5]/;
                let n = 0;
                for (let i = 0; i < value.length; i++) {
                  if (pattern.test(value[i])) {
                    n = n + 3;
                  } else {
                    n = n + 1;
                  }
                }
                if (n > 50) {
                  callback('用户名长度超出限制');
                }
              }
              callback();
            }
          }
        ]}
      >
        <Input placeholder="请输入用户名" />
      </Form.Item>
      <Form.Item
        {...formItemLayout}
        label="密码"
        name="password"
        rules={[{required: true, message: '密码不能为空!'}]}
      >
        <Input.Password autoComplete="new-password" placeholder="请输入密码" />
      </Form.Item>
    </>
  );
};

export default AddNodeForm;
