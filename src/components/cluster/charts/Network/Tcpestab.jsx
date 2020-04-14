import styles from '../../index.less';
import { connect } from 'dva';
import { createSelector } from 'reselect';
import Basic from '../Basic';

export default connect(createSelector(
    [
        props => props.monitor.host.tcpestab || { data: {}, err: null },
    ],
    (tcpestab, loading) => ({ tcpestab, loading })
))(({ tcpestab, ...props }) => {
    const { err, data: { data } } = tcpestab;
    return (
        <Basic
            borderNone
            type="tcpestab"
            {...props}
            ratio={.65}
            colors={["#2D225A"]}
            title={(
                <div>
                    <span className={styles[`header-item`]}>TCP连接数（个）</span>
                </div>
            )}
            data={(((data || [])[0] || {}).values || []).map((v, i) => ({
                name: v[0],
                tcpestab: Number(v[1]),
            }))}
            domain={[0, 'auto']}
            tickFormatter={(v) => `${Number(v)}`}
            tooltipContent={({ payload }) => {
                if (!payload || payload.length <= 0) return null;
                let time = new Date(payload[0].payload.name * 1000);
                return (
                    <div style={{ backgroundColor: '#fff', padding: '8px', border: '1px solid #ccc' }}>
                        <h3>
                            {`${(Array(2).join(0) + Number(time.getMonth() + 1)).slice(-2)}/${(Array(2).join(0) + Number(time.getDate())).slice(-2)}  ${(Array(2).join(0) + Number(time.getHours())).slice(-2)}:${(Array(2).join(0) + Number(time.getMinutes())).slice(-2)}`}
                        </h3>
                        <p style={{ color: '#2D225A' }}>
                            TCP连接数：{Number(payload[0].payload.tcpestab).toFixed(2)}（个）
                        </p>
                    </div >
                )
            }}
        />
    )
})