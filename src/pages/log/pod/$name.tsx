import { Terminal } from 'library';

const ishttps = 'https:' == document.location.protocol ? true : false;
export interface PodLogProps {
  location: {
    query: {
      ns: string;
      cntr: string;
    }
  }
  match: {
    params: {
      name: string;
    }
  }
}

const PodLog = ({ match, location, ...props }: PodLogProps) => {
  const { params: { name } } = match;
  const { query: { ns, cntr } } = location;
  return (
    <Terminal
      splitWrite={true}
      bidirectional={false}
      buffered={true}
      url={`${ishttps ? 'wss' : 'ws'}://${window.location.host.includes("localhost") ? `localhost:${ishttps ? '6600' : '6601'}` : window.location.host}/api/apps/pods/${name}/logs?container_name=${cntr}&namespace=${ns}`}
    />
  )
}

export default PodLog;