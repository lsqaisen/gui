import { Terminal } from 'library';

const ishttps = 'https:' == document.location.protocol ? true : false;

export interface CntrTermProps {
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

const CntrTerm = ({ match, location }: CntrTermProps) => {
  const { params: { name } } = match;
  const { query: { ns, cntr } } = location;
  return (
    <Terminal
      successMessages={"\x1b[32mTerminal connected successfully!\n\r\x1b[0m"}
      url={`${ishttps ? 'wss' : 'ws'}://${window.location.host.includes("localhost") ? `localhost:${ishttps ? '6600' : '6601'}` : window.location.host}/api/apps/pods/${name}/terminals?container_name=${cntr}&namespace=${ns}`}
    />
  )
}

export default CntrTerm;