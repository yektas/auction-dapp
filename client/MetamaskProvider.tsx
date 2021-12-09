import React, { useEffect, useState } from "react";
import { useWallet, UseWalletProvider } from "use-wallet";
import { ConnectionInfo } from "./pages";

function MetamaskProvider({
  children,
}: {
  children: JSX.Element;
}): JSX.Element {
  const wallet = useWallet();
  const activate = async (connector: any) => await wallet.connect(connector);

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const connectionInfo = JSON.parse(
      localStorage.getItem("ConnectionInfo") || "{}"
    ) as ConnectionInfo;

    const isConnected = connectionInfo && connectionInfo.connected;
    if (isConnected && !wallet.isConnected()) {
      activate(connectionInfo.connector).then((res: any) => {
        if (res) {
          localStorage.setItem(
            "ConnectionInfo",
            JSON.stringify(connectionInfo)
          );
        }
      });
    }
    setLoaded(true);
  }, []);

  if (loaded) {
    return children;
  }
  return <>Loading</>;
}

export default MetamaskProvider;
