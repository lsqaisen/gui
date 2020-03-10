import { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import { Page } from 'library';
import { getImagesRequest } from 'api/type/registry';
import { ConnectLoading, Dispatch } from '@/models/connect';
import { RegistryModelState } from '@/models/registry/images';
import Table from '@/components/registry/images/table';
import Tags from './basic/tags';
import UploadImage from './basic/actions/upload-image';
import Actions from './basic/actions';

export type RegistryListProps = {
  data: any;
  loading: boolean;
  dispatch: Dispatch<any>;
}

const RegistryList: React.FC<RegistryListProps> = ({ loading, data, dispatch }) => {
  const [{ page, size, query }, setState] = useState({ page: 1, size: 10, query: "" } as any)
  const getImages = () => dispatch({ type: 'registry/getImages', payload: { page, size, query } });
  const getTags = (name: string) => dispatch({ type: 'registry/getTags', payload: name })
  useEffect(() => {
    getImages();
  }, [page, size, query])
  return (
    <Page
      className="node-body"
      style={{ minHeight: '100%' }}
      title=""
      routes={[{
        path: '/dashboard',
        breadcrumbName: '总览',
      }, {
        path: `/registry/images`,
        breadcrumbName: '镜像列表',
      }]}
    >
      <section className="box">
        <header style={{ overflow: 'hidden', marginBottom: 16 }}>
          <div className="fr">
            <Button style={{ marginLeft: 16 }} type="ghost" loading={loading} onClick={getImages} >刷新</Button>
          </div>
          <div className="fr">
            <UploadImage update={getImages} />
          </div>
        </header>
        <Table
          loading={loading}
          data={data}
          tagsRender={(record, index, indent, expanded) => <Tags {...{ image_name: record.name, expanded }} update={getImages} />}
          pagination={{
            current: page,
            pageSize: size,
            showSizeChanger: true,
            showQuickJumper: true,
            onChange: (page, size) => setState({ page, size, query }),
            onShowSizeChange: (page, size) => setState({ page, size, query }),
            showTotal: total => `共 ${total} 条`,
          }}
          actions={<Actions
            dispatch={dispatch}
            update={(name) => {
              getImages();
              getTags(name!);
            }}
          />}
        />
      </section>
    </Page>
  )
}

export type ConnectState = {
  registry: RegistryModelState
  loading: ConnectLoading
}
export default connect(({ registry, loading }: ConnectState) => ({ data: registry.images, loading: loading.effects['registry/getImages'] }))(RegistryList)