import * as React from 'react';
import {Select, Spin} from 'antd';
import {SelectProps} from 'antd/lib/select';
import InfiniteScroll from 'react-infinite-scroller';
import styles from './style/index.less';

export interface SearchSelectState {
  data?: any[];
  loading?: boolean;
  hasMore?: boolean;
}

export interface SearchSelectProps<VT = any> extends SelectProps<VT> {
  asyncSearch: (page: number) => Promise<VT[]>;
  children: (data: VT[]) => React.ReactNode;
  onChange?: (value: VT, option: any, data?: any[]) => void;
}

function reducer(state: SearchSelectState, newState: SearchSelectState) {
  return {...state, ...newState};
}

const SearchSelect: React.FC<SearchSelectProps> = ({
  onFocus = () => {},
  onBlur = () => {},
  onChange = () => {},
  asyncSearch,
  children,
  ...props
}) => {
  const [key, setKey] = React.useState(new Date().getTime());
  const [{data, loading, hasMore}, setState] = React.useReducer(reducer, {
    data: [],
    loading: false,
    hasMore: true,
  });

  const onLoad = async (page: number = 1) => {
    setState({loading: true});
    try {
      const _data = await asyncSearch(page);
      if (page === 1) {
        setState({loading: false, hasMore: true, data: [].concat(_data)});
      } else {
        setState({loading: false, data: data?.concat(_data)});
      }
    } catch (err) {
      setState({loading: false, hasMore: false});
    }
  };

  return (
    <Select
      {...props}
      loading={loading}
      listHeight={data!.length * 32}
      onFocus={(e) => {
        onLoad();
        onFocus(e);
      }}
      onBlur={(e) => {
        setKey(new Date().getTime());
        onBlur(e);
      }}
      onChange={(value, option) => onChange(value, option, data)}
      notFoundContent={
        loading ? (
          <div className={styles[`infinite-loading`]}>
            <Spin size="small" />
          </div>
        ) : (
          '暂无数据'
        )
      }
      dropdownClassName={`${styles[`search-select`]}`}
      dropdownRender={(menuNode) => {
        return (
          <div
            key={key}
            className={styles[`infinite-container`]}
            style={{maxHeight: 32 * 9}}
          >
            <InfiniteScroll
              pageStart={1}
              initialLoad={false}
              threshold={256}
              loadMore={onLoad}
              hasMore={!loading && hasMore}
              useWindow={false}
            >
              {menuNode}
              {loading && data!.length > 0 && (
                <div
                  key="infinite-loading"
                  className={styles[`infinite-loading`]}
                >
                  <Spin size="small" />
                </div>
              )}
            </InfiniteScroll>
          </div>
        );
      }}
    >
      {children(data!)}
    </Select>
  );
};

export default SearchSelect;

// export type OptionType = {
//   key: string;
//   value?: any;
//   label: any;
//   title?: string;
//   disabled?: boolean;
//   children?: OptionType[];
// };

// export interface SearchSelectProps extends SelectProps<any> {
//   isScroll?: boolean;
//   pageStart?: number;
//   initialLoad?: boolean;
//   threshold?: number;
//   height?: number;
//   asyncSearch: (
//     page: number,
//     callback: (res: {results: OptionType[]; total: number}) => void
//   ) => any;
//   onChangeOptions?: (
//     value: any,
//     option: React.ReactElement<any> | React.ReactElement<any>[],
//     values: any[]
//   ) => any;
// }

// class SearchSelect extends PureComponent<SearchSelectProps, any> {
//   static readonly defaultProps = {
//     isScroll: true,
//     pageStart: 0,
//     initialLoad: false,
//     threshold: 200,
//     height: 250,
//   };

//   state = {
//     total: Infinity,
//     data: [] as OptionType[],
//     loading: false,
//     hasMore: true,
//   };

//   open: boolean = false;

//   getOptions = (options: OptionType[]) => {
//     if (Array.isArray(options)) {
//       return options.map((option) => {
//         if (Array.isArray(option.children)) {
//           return (
//             <OptGroup key={option.key} label={option.label}>
//               {this.getOptions(option.children)}
//             </OptGroup>
//           );
//         } else {
//           return (
//             <Option
//               disabled={option.disabled}
//               key={option.key}
//               value={option.value || option.key}
//               title={option.title}
//             >
//               {option.label}
//             </Option>
//           );
//         }
//       });
//     }
//     return null;
//   };

//   handleInfiniteOnLoad = (page: number) => {
//     let {total, data} = this.state;
//     const {asyncSearch} = this.props;
//     this.setState({
//       loading: true,
//     });
//     if (data.length >= total!) {
//       this.setState({
//         hasMore: false,
//         loading: false,
//       });
//       return;
//     }
//     asyncSearch!(page, (res) => {
//       data = data.concat(res.results);
//       if (this.props.isScroll) {
//         this.setState({
//           data,
//           total: res.total,
//           loading: false,
//         });
//       } else if (!this.props.isScroll && this.open) {
//         this.setState({
//           data,
//           total: res.total,
//           loading: false,
//         });
//       }
//     });
//   };

//   render() {
//     const {
//       height,
//       pageStart,
//       initialLoad,
//       isScroll,
//       threshold,
//       className,
//       onChange = () => null,
//       onChangeOptions = () => null,
//       ...props
//     } = this.props;
//     const {loading, hasMore, data} = this.state;
//     return (
//       <Select
//         {...props}
//         onFocus={(e) => {
//           this.open = true;
//           !isScroll && this.handleInfiniteOnLoad(0);
//           props.onFocus && props.onFocus(e);
//         }}
//         onBlur={(v: any) => {
//           this.open = false;
//           !isScroll && this.setState({data: [], loading: false});
//           props.onBlur && props.onBlur(v);
//         }}
//         onChange={(v: any, o: any) => {
//           onChange!(v, o);
//           onChangeOptions!(v, o, data);
//         }}
//         className={`${styles[`search-select`]} ${className}`}
//         notFoundContent={
//           loading ? (
//             <div className={styles[`infinite-loading`]}>
//               <Spin size="small" />
//             </div>
//           ) : (
//             '暂无数据'
//           )
//         }
//         dropdownRender={(menuNode) => {
//           if (isScroll) {
//             return (
//               <div
//                 className={styles[`infinite-container`]}
//                 style={{maxHeight: height}}
//               >
//                 <InfiniteScroll
//                   initialLoad={initialLoad}
//                   threshold={threshold}
//                   pageStart={pageStart}
//                   loadMore={this.handleInfiniteOnLoad}
//                   hasMore={!loading && hasMore}
//                   useWindow={false}
//                 >
//                   {menuNode}
//                   {loading && data.length > 0 && (
//                     <div
//                       key="infinite-loading"
//                       className={styles[`infinite-loading`]}
//                     >
//                       <Spin size="small" />
//                     </div>
//                   )}
//                 </InfiniteScroll>
//               </div>
//             );
//           } else {
//             return (
//               <div
//                 className={styles[`infinite-container`]}
//                 style={{maxHeight: height}}
//               >
//                 {menuNode}
//                 {loading && data.length > 0 && (
//                   <div
//                     key="infinite-loading"
//                     className={styles[`infinite-loading`]}
//                   >
//                     <Spin size="small" />
//                   </div>
//                 )}
//               </div>
//             );
//           }
//         }}
//       >
//         {this.getOptions(data)}
//       </Select>
//     );
//   }
// }

// export default SearchSelect;
