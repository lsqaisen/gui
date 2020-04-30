import {connect} from 'dva';
import {ContainersInput} from '@/components/apps/app/inputs/';
import {getImagesRequest} from 'api/type/registry';

const IPPool = ({dispatch, ...props}: any) => {
  return (
    <ContainersInput.Image
      {...props}
      getImages={(payload: getImagesRequest) =>
        dispatch({type: 'registry/getImages', payload})
      }
      getTags={(name: string) =>
        dispatch({type: 'registry/getTags', payload: name})
      }
    />
  );
};

export default connect(() => ({}))(IPPool);
