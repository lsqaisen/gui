import { PureComponent } from 'react';
import { Alert, Cascader, Icon, Typography } from 'antd';
import styles from '../style/index.less';


export interface ExternalInputProps {
  username: string;
}

export default class extends PureComponent<ExternalInputProps, any> {
  state = {
    system: 'centos_7_or_later',
  }

  systemCmd(system: string) {
    switch (system) {
      case 'macos':
        return `curl http://${window.location.host}/service/ci/ca -o ekos-registry-ca.crt
sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain ./ekos-registry-ca.crt`;
      case 'ubuntu_debian':
        return `sudo curl http://${window.location.host}/service/ci/ca -o /usr/local/share/ca-certificates/ekos-registry-ca.crt
sudo update-ca-certificates`;
      case 'centos_7_or_later':
        return `yum install ca-certificates 
update-ca-trust force-enable
curl http://${window.location.host}/service/ci/ca -o /etc/pki/ca-trust/source/anchors/ekos-registry-ca.crt
update-ca-trust extract`;
      case 'windows_10':
        return `powershell -command "& { iwr http://${window.location.host}/service/ci/ca -OutFile ekos-registry-ca.crt }"
certutil -addstore -f "ROOT" ekos-registry-ca.crt`;
      default: return '';
    }
  }

  render() {
    const { username } = this.props;
    const { system } = this.state;
    return (
      <div>
        <div className={styles.item_step}>
          <h3 className={styles.h3}> {'第一步：配置CA证书，'}
            <Cascader
              value={[system]}
              options={[{
                value: 'macos',
                label: 'MacOS',
              }, {
                value: 'ubuntu_debian',
                label: 'Ubuntu/Debian',
              }, {
                value: 'centos_7_or_later',
                label: 'CentOS 7 or later',
              }, {
                value: 'windows_10',
                label: 'Windows 10',
              }]}
              onChange={(v) => this.setState({ system: v[0] })}
            >
              <a>{(system => {
                switch (system) {
                  case 'macos':
                    return "MacOS";
                  case 'ubuntu_debian':
                    return "Ubuntu/Debian";
                  case 'centos_7_or_later':
                    return "CentOS 7 or later";
                  case 'windows_10':
                    return "Windows 10";
                  default: break;
                }
              })(system)}<Icon type='down' style={{ fontSize: '14px', marginLeft: '6px' }} /></a>
            </Cascader>
          </h3>
          <div className={styles.ekos_code}>
            <pre>
              <Typography.Paragraph style={{ margin: 0 }} copyable>{this.systemCmd(system)}</Typography.Paragraph>
            </pre>
          </div>
        </div>
        <div className={styles.item_step}>
          <Alert style={{ fontSize: '14px', marginTop: 16 }} message="证书配置完成后，部分系统需要重启Docker！" type="info" showIcon />
        </div>
        <div className={styles.item_step}>
          <h3 className={styles.h3}>第二步：设置镜像tag</h3>
          <div className={styles.ekos_code}>
            <pre>
              <Typography.Paragraph style={{ margin: 0 }} copyable>{`docker tag <镜像名> ${window.location.hostname}/${username}/<镜像名>`}</Typography.Paragraph>
            </pre>
          </div>
        </div>
        <div className={styles.item_step}>
          <h3 className={styles.h3}>第三步：登录镜像仓库</h3>
          <div className={styles.ekos_code}>
            <pre>
              <Typography.Paragraph style={{ margin: 0 }} copyable>{`docker login ${window.location.hostname}`}</Typography.Paragraph>
            </pre>
          </div>
        </div>
        <div className={styles.item_step}>
          <h3 className={styles.h3}>第四步：提交镜像到仓库</h3>
          <div className={styles.ekos_code}>
            <pre>
              <Typography.Paragraph style={{ margin: 0 }} copyable>{`docker push ${window.location.hostname}/${username}/<镜像名>`}</Typography.Paragraph>
            </pre>
          </div>
        </div>
      </div>
    )
  }
}