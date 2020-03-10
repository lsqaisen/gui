import DeletePool from '@/components/network/vip/delete';

export default ({ data, dispatch }: any) => {
  return (
    <DeletePool
      btn={<a style={{ color: '#ff5242' }} />}
      label={data.name}
      onDelete={(name) => {
        return dispatch({
          type: `nwvip/delete`,
          payload: data
        })
      }}
    >删除</DeletePool>
  )
}
