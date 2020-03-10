import { PureComponent } from 'react';
import { Form, Alert, Col, Input, Button, Typography } from 'antd';
import { FormProps, WrappedFormUtils } from 'antd/lib/form/Form';
import { SearchSelect } from 'library';
import styles from '../style/index.less';

const FormItem = Form.Item;

export interface FileInputProps extends FormProps {
  admin: boolean;
  namespace: string;
  value?: any;
  formItemLayout?: any;
  searchProjects: (params: any) => any;
}

export default class extends PureComponent<FileInputProps, any> {
  static readonly defaultProps = {
    form: {} as WrappedFormUtils,
    formItemLayout: {
      labelCol: { xs: 24, md: 5 },
      wrapperCol: { xs: 24, md: 19 },
    },
    searchProjects: () => null,
  }

  state = {
    target: '',
    image: undefined,
  }

  render() {
    const { admin, namespace, form, formItemLayout, searchProjects } = this.props;
    const { getFieldDecorator } = form || {} as WrappedFormUtils;
    const { target, image } = this.state;
    return (
      <div>
        <FormItem style={{ marginBottom: 0 }}>
          <Alert style={{ fontSize: '14px' }} message="已打包好镜像文件可忽略以下打包压缩镜像步骤" type="info" showIcon />
        </FormItem>
        <FormItem style={{ marginBottom: 0 }}>
          <div className={styles.item_step}>
            <h3 className={styles.h3}>通过下面命令可以将镜像打包成tar格式的文件</h3>
            <div className={styles.ekos_code}>
              <pre>
                <Typography.Paragraph style={{ margin: 0 }} copyable>{`docker save <镜像名:tag> -o <镜像名>.tar`}</Typography.Paragraph>
              </pre>
            </div>
          </div>
        </FormItem>
        <div className={styles.item_step}>
          <Col>
            <h3 className={styles.h3}>填写镜像名称，选择镜像文件，点击提交按钮上传镜像文件</h3>
          </Col>
          <FormItem
            key="namespace"
            style={{ display: 'none' }}
            {...formItemLayout}
            label="镜像名称">
            {getFieldDecorator(`namespace`, {
              initialValue: admin ? target : namespace,
            })(
              <Input name="namespace" type="text" />
            )}
          </FormItem>
          {admin &&
            <FormItem  {...formItemLayout} label="仓库名称">
              {getFieldDecorator(`project`, {
                rules: [{
                  required: true, message: '请选择仓库'
                }]
              })(
                <SearchSelect
                  placeholder="请选择仓库"
                  asyncSearch={async (page, callback) => {
                    let { list, total }: any = await searchProjects!({ page: page + 1 });
                    callback({
                      total,
                      results: list.map((v: any) => ({
                        key: v.name,
                        label: (
                          <Typography>
                            <Typography.Text>{`${v.name}${v.description ? `(${v.description})` : ''}`}</Typography.Text>
                          </Typography>
                        )
                      })),
                    });
                  }}
                  onChange={(v) => {
                    this.setState({
                      target: v,
                    });
                  }}
                />
              )}
            </FormItem>}
          <FormItem  {...formItemLayout} label="镜像名称">
            {getFieldDecorator(`target`, {
              validateFirst: true,
              rules: [{
                required: true, message: '必须指定镜像名称'
              }, {
                max: 20, message: '不能超过20个字符'
              }, {
                pattern: /^[0-9a-zA-Z]+[0-9a-zA-Z_]*(:.*){0,1}$/, message: '名称由字母、数字和字符"-"组成'
              }, {
                pattern: /^.*(:([0-9a-zA-Z_]\.{0,1})*[0-9a-zA-Z]+){0,1}$/, message: 'target由字母、数字和字符".-:"组成'
              }, {
                pattern: /^[0-9a-zA-Z]+[0-9a-zA-Z_]*(:([0-9a-zA-Z_]\.{0,1})*[0-9a-zA-Z]+){0,1}$/, message: '由字母、数字和字符".:-"组成，以字母或数字开头和结尾,不能出现多个":"'
              }]
            })(
              <Input
                name="target"
                placeholder="镜像名称，tag不填默认为latest"
                {...(admin ? target ? { addonBefore: `${target}/` } : { addonBefore: `选择仓库/` } : { addonBefore: `${namespace}/` })}
              />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="镜像文件">
            {getFieldDecorator(`image`, {
              rules: [{
                required: true, message: 'image文件不能为空！'
              }, {
                validator: (r, v, callback) => {
                  let par = /(tar|tgz|tar\.gz)$/;
                  if (!!v) {
                    if (!par.test(v)) {
                      callback('文件格式需要为tar或tgz');
                    }
                  }
                  callback();
                }
              }]
            })(
              <Input type='file' style={{ display: 'none' }} id='image' name='image'
                placeholder="名称"
                onChange={(v) => {
                  this.setState({
                    image: ((document.getElementById('image') as any).value).split('\\').slice(-1)[0]
                  });
                }} />
            )}
            <Col span='17'>
              <Input placeholder="选择所要上传的tar或tgz文件" type='text' value={`${image || ''}`} />
            </Col>
            <Col span='6' offset='1'>
              <Button style={{ width: '100%' }} type="ghost" icon="upload" onClick={() => {
                (document.getElementById('image') as any).click();
              }}>选择</Button>
            </Col>
          </FormItem>
        </div>
      </div>
    )
  }
}