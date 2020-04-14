import styles from '../../index.less';
import { connect } from 'dva';
import { createSelector } from 'reselect';
import Basic from '../Basic';

export default connect(createSelector(
    [
        props => props.monitor.host.network || { data: {}, err: null },
    ],
    (network, loading) => ({ network, loading })
))(({ network, ...props }) => {
    const { err, data: { in: _in, out } } = network;
    return (
        <Basic
            borderNone
            type="network"
            {...props}
            ratio={.65}
            chartType="line"
            colors={["#2D225A", "#3e6cdc"]}
            title={(
                <div>
                    <span className={styles[`header-item`]}>网络流入流出</span>
                </div>
            )}
            data={(((_in || [])[0] || {}).values || []).map((v, i) => ({
                name: v[0],
                in: Number(v[1]),
                out: Number(((((out || [])[0] || {}).values || [])[i] || [])[1] || 0),
            }))}
            domain={[0, 'auto']}
            tickFormatter={(v) => `${Number(v).netCeil(2)}`}
            tooltipContent={({ payload }) => {
                if (!payload || payload.length <= 0) return null;
                let time = new Date(payload[0].payload.name * 1000);
                return (
                    <div style={{ backgroundColor: '#fff', padding: '8px', border: '1px solid #ccc' }}>
                        <h3>
                            {`${(Array(2).join(0) + Number(time.getMonth() + 1)).slice(-2)}/${(Array(2).join(0) + Number(time.getDate())).slice(-2)}  ${(Array(2).join(0) + Number(time.getHours())).slice(-2)}:${(Array(2).join(0) + Number(time.getMinutes())).slice(-2)}`}
                        </h3>
                        <p style={{ color: '#2D225A' }}>
                            流入：{Number(payload[0].payload.in).netCeil(2)}
                        </p>
                        <p style={{ color: '#3e6cdc' }}>
                            流出：{Number(payload[0].payload.out).netCeil(2)}
                        </p>
                    </div >
                )
            }}
        />
    )
})