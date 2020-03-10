import DeletePool from '@/components/network/pool/delete';

export default ({ data, dispatch }: any) => {
  return (
    <DeletePool
      btn={<a style={{ color: '#ff5242' }} />}
      label={data.name}
      onDelete={(name) => {
        return dispatch({
          type: `nwpool/delete`,
          payload: data
        })
      }}
    >删除</DeletePool>
  )
}
