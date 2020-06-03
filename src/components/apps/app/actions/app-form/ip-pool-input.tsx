import {SearchSelect} from 'library';
import {Select} from 'antd';

export interface IIPPoolInput {
  value?: any;
  onChange?: (value: any) => void;
  getIPPools?: () => Promise<any>;
}

const IPPoolInput = <T extends any>({
  value,
  onChange = () => {},
  getIPPools,
}: IIPPoolInput) => {
  return (
    <SearchSelect
      value={value}
      style={{width: '100%'}}
      showSearch
      allowClear
      placeholder="选择虚拟子网"
      onChange={(value) => onChange!(value)}
      asyncSearch={async (page) => {
        return new Promise(async (resolve, reject) => {
          if (page >= 2) reject();
          try {
            const pools: T[] = await getIPPools!();
            resolve(pools);
          } catch (err) {
            reject();
          }
        });
      }}
    >
      {(data) =>
        data.map((pool) => (
          <Select.Option key={pool.name} value={pool.name}>
            {pool.name}
          </Select.Option>
        ))
      }
    </SearchSelect>
  );
};

export default IPPoolInput;
