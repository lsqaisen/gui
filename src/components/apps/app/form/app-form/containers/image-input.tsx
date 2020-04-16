import * as React from 'react';
import {Form, Row, Col, Input, Button, Tooltip} from 'antd';
import {FormInput, SearchSelect} from 'library';
import {FormInputProps} from 'library/type/forminput/';
import Context, {ContextProps} from '../../../context';

const FormItem = Form.Item;

export interface ImageInputProps extends FormInputProps<string> {}

@(FormInput.create({
  name: 'image',
  onValuesChange: ({onChange}, _, allValues) => {
    if (!!allValues.image) {
      onChange(allValues.image);
    } else {
      if (!allValues.image_name && !allValues.image_tag) return onChange();
      else
        onChange(`${allValues.image_name || ''}:${allValues.image_tag || ''}`);
    }
  }
}) as any)
export default class extends React.PureComponent<ImageInputProps, any> {
  static readonly defaultProps = {
    form: {} as any,
    onChange: () => null
  };

  constructor(props: ImageInputProps) {
    super(props);
    const [image, tag] = (props.value || ':').split(':');
    this.state = {
      type: !props.value || tag ? 'select' : 'edit'
    };
  }

  render() {
    const {value, form} = this.props;
    const [image, tag] = (value || ':').split(':');
    const {getFieldDecorator} = form;
    const {type} = this.state;
    return (
      <Context.Consumer>
        {({getImages, getTags}: ContextProps) => (
          <Row gutter={8}>
            <Col style={{width: 'calc(100% - 42px)', float: 'left'}}>
              {type === 'select' ? (
                <Row gutter={8}>
                  <Col span={16}>
                    <FormItem
                      extra={`搜索针对于当前下拉显示的数据，默认显示10条数据，下拉滚动可加载更多数据`}
                    >
                      {getFieldDecorator('image_name', {
                        initialValue: image || undefined,
                        rules: [{required: true, message: '镜像名称必须选择'}]
                      })(
                        <SearchSelect
                          showSearch
                          initialLoad={true}
                          placeholder="选择镜像名称"
                          onChange={() => {
                            form.setFieldsValue({image_tag: undefined});
                          }}
                          asyncSearch={async (page, callback) => {
                            const {items, total}: any = await getImages!({
                              domain: 'on',
                              page,
                              size: 10
                            });
                            callback({
                              total,
                              results: items.map((image: any) => ({
                                key: image.name,
                                label: (
                                  <Tooltip title={image.name}>
                                    {image.name.split('/').pop()}
                                  </Tooltip>
                                )
                              }))
                            });
                          }}
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem>
                      {getFieldDecorator('image_tag', {
                        initialValue: tag || undefined,
                        rules: [{required: true, message: '镜像tag必须选择'}]
                      })(
                        <SearchSelect
                          isScroll={false}
                          placeholder="请选择tag"
                          asyncSearch={async (_, callback) => {
                            const response: any[] = await getTags!(
                              (image || '')
                                .split('/')
                                .slice(1)
                                .join('/')
                            );
                            callback({
                              total: response.length,
                              results: response.map((v: any) => ({
                                key: `${v.tag}`,
                                label: `${v.tag}`
                              }))
                            });
                          }}
                        />
                      )}
                    </FormItem>
                  </Col>
                </Row>
              ) : (
                <Row>
                  <FormItem extra="请输入完整镜像地址，支持输入外部仓库中的镜像，例如：example.com/dev/app1:v2">
                    {getFieldDecorator('image', {
                      initialValue: value || undefined,
                      rules: [{required: true, message: '镜像不能为空！'}]
                    })(<Input placeholder="请输入镜像" />)}
                  </FormItem>
                </Row>
              )}
            </Col>
            <Col style={{width: 34, float: 'left'}}>
              <Tooltip title="手动输入">
                <Button
                  icon="edit"
                  onClick={() => {
                    form.setFieldsValue({
                      image: undefined,
                      image_name: undefined,
                      image_tag: undefined
                    });
                    this.setState({
                      type: type === 'select' ? 'edit' : 'select'
                    });
                  }}
                />
              </Tooltip>
            </Col>
          </Row>
        )}
      </Context.Consumer>
    );
  }
}
