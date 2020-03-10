import { useEffect } from 'react';
import { connect } from 'dva';
import Tags, { TableProps } from '@/components/registry/images/tags/table';
import Actions from './actions';
import { RegistryModelState, ITag } from '@/models/registry/images';
import { ConnectLoading, Dispatch } from '@/models/connect';

export interface TagListProps extends TableProps {
  expanded: boolean;
  tags: { [key: string]: ITag[] };
  image_name: string;
  update?: () => void;
  dispatch: Dispatch<any>;
}

const TagList: React.FC<TagListProps> = ({ image_name, tags, loading, update, dispatch }) => {
  const getTags = (name: string) => dispatch({ type: 'registry/getTags', payload: name })
  useEffect(() => { getTags(image_name) }, [])
  return (
    <Tags
      loading={loading}
      data={tags[image_name] || [] as ITag[]}
      actions={<Actions
        type="tag"
        dispatch={dispatch}
        update={() => {
          update!()
          getTags(image_name)
        }}
      />}
    />
  )
}


export type ConnectState = {
  registry: RegistryModelState
  loading: ConnectLoading
}

export default connect(({ registry, loading }: ConnectState) => ({ tags: registry.tags, loading: loading.effects['registry/getTags'] }))(TagList)