import { Terminal } from 'library';

const ishttps = 'https:' == document.location.protocol ? true : false;

const InstallLog = () => {
  return (
    <Terminal
      splitWrite={true}
      bidirectional={false}
      buffered={true}
      beforeSendData={["hello word"]}
      url={`${ishttps ? 'wss' : 'ws'}://${window.location.host.includes("localhost") ? "localhost:6600" : window.location.host}/api/cluster/logs/install`}
    />
  )
}

export default InstallLog;