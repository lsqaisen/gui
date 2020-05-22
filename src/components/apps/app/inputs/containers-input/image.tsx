import * as React from 'react';
import {Form, Row, Col, Input, Button, Tooltip} from 'antd';
import {EditOutlined} from '@ant-design/icons';
import {SearchSelect} from 'library';
import {getImagesRequest} from 'api/type/registry';

const FormItem = Form.Item;

export interface ImageInputProps {
  value?: string;
  onChange?: (value: string) => void;
  getImages: (value: getImagesRequest) => Promise<any>;
  getTags: (image_name: string) => Promise<any>;
}

const ImageInput = ({
  value,
  onChange = () => {},
  getImages,
  getTags,
}: ImageInputProps) => {
  const [type, setType] = React.useState('select');
  const [image, tag] = (value || ':').split(':');
  return (
    <Row gutter={8}>
      <Col style={{width: 'calc(100% - 42px)', float: 'left'}}>
        {type === 'select' ? (
          <Row gutter={8}>
            <Col span={16}>
              <FormItem
                style={{marginBottom: 0}}
                extra={`搜索针对于当前下拉显示的数据，默认显示10条数据，下拉滚动可加载更多数据`}
              >
                <SearchSelect
                  value={image}
                  showSearch
                  initialLoad
                  placeholder="选择镜像名称"
                  onChange={(value) => {
                    onChange([value].filter((v) => !!v).join(':'));
                  }}
                  asyncSearch={async (page, callback) => {
                    const {items, total}: any = await getImages!({
                      domain: 'on',
                      page,
                      size: 10,
                    });
                    callback({
                      total,
                      results: items.map((image: any) => ({
                        key: image.name,
                        label: (
                          <Tooltip title={image.name}>
                            {image.name.split('/').pop()}
                          </Tooltip>
                        ),
                      })),
                    });
                  }}
                />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem>
                <SearchSelect
                  value={tag}
                  isScroll={false}
                  placeholder="请选择tag"
                  asyncSearch={async (_, callback) => {
                    const response: any[] = await getTags!(
                      (value || '')
                        .split('/')
                        .slice(1)
                        .join('/')
                    );
                    callback({
                      total: response.length,
                      results: response.map((v: any) => ({
                        key: `${v.tag}`,
                        label: `${v.tag}`,
                      })),
                    });
                  }}
                  onChange={(value) => {
                    onChange([image, value].filter((v) => !!v).join(':'));
                  }}
                />
              </FormItem>
            </Col>
          </Row>
        ) : (
          <Row>
            <FormItem extra="请输入完整镜像地址，支持输入外部仓库中的镜像，例如：example.com/dev/app1:v2">
              <Input
                placeholder="请输入镜像"
                value={value}
                onChange={(v) => onChange(v.target.value)}
              />
            </FormItem>
          </Row>
        )}
      </Col>
      <Col style={{width: 34, float: 'left'}}>
        <Tooltip title="手动输入">
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setType(type === 'select' ? 'edit' : 'select');
            }}
          />
        </Tooltip>
      </Col>
    </Row>
  );
};

export default ImageInput;
