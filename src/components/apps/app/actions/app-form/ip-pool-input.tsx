import {SearchSelect} from 'library';

export interface IIPPoolInput {
  value?: any;
  onChange?: (value: any) => void;
  getIPPools?: () => Promise<any>;
}

const IPPoolInput = <T extends any>({
  value,
  onChange,
  getIPPools,
}: IIPPoolInput) => {
  return (
    <SearchSelect
      value={value}
      style={{width: '100%'}}
      showSearch
      allowClear
      initialLoad={true}
      placeholder="选择虚拟子网"
      onChange={onChange}
      asyncSearch={async (page, callback) => {
        const pools: T[] = await getIPPools!();
        callback({
          total: pools.length,
          results: pools.map((pool) => ({
            key: pool.name,
            label: pool.name,
          })),
        });
      }}
    />
  );
};

export default IPPoolInput;
