import {Skeleton, PageHeader, Typography} from 'antd';
import {connect} from 'dva';
import {IImage, RegistryModelState} from '@/models/registry/images';
import {Dispatch, ConnectLoading} from '@/models/connect';
import {useEffect} from 'react';

export type ImageListProps = {
  loading: boolean;
  data: {
    total: number;
    items: IImage[];
  };
  dispatch: Dispatch<any>;
};

const ImageList = ({loading, data, dispatch}: ImageListProps) => {
  const getImages = () =>
    dispatch({type: 'registry/getImages', payload: {page: 1, size: 10}});
  useEffect(() => {
    getImages();
  }, []);
  return (
    <section className="box" style={{marginBottom: '24px'}}>
      <Skeleton loading={loading}>
        <PageHeader
          title="镜像使用量排名"
          subTitle={`镜像使用前十 (共${data.total})`}
          style={{padding: 0}}
        >
          <Typography>
            {data.items.map((v, i: number) => (
              <Typography.Paragraph
                style={{width: '100%'}}
                key={`${v.name}`}
                ellipsis={{rows: 2, expandable: true}}
              >
                <span
                  style={{
                    float: 'left',
                    display: 'inline-block',
                    margin: '2px 8px 2px 0',
                    width: 16,
                    height: 16,
                    lineHeight: '16px',
                    borderRadius: '50%',
                    textAlign: 'center',
                    background: i < 3 ? '#2D225A' : '#f0f2f5',
                    color: i < 3 ? '#fff' : '#2D225A'
                  }}
                >
                  {i + 1}
                </span>
                <Typography.Text>{v.name}</Typography.Text>
                <Typography.Text style={{float: 'right'}} type="danger">
                  {v.pull_count}
                </Typography.Text>
              </Typography.Paragraph>
            ))}
          </Typography>
        </PageHeader>
      </Skeleton>
    </section>
  );
};

export type ConnectState = {
  registry: RegistryModelState;
  loading: ConnectLoading;
};
export default connect(({registry, loading}: ConnectState) => ({
  data: registry.images,
  loading: loading.effects['registry/getImages']
}))(ImageList);
