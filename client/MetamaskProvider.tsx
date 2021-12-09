import React, { useEffect, useState } from "react";
import { useWallet, UseWalletProvider } from "use-wallet";

function MetamaskProvider({
  children,
}: {
  children: JSX.Element;
}): JSX.Element {
  const wallet = useWallet();
  const activate = async (connector: any) => await wallet.connect(connector);

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!wallet.isConnected()) {
      activate("injected");
      setLoaded(true);
    }
  }, []);

  if (loaded) {
    return children;
  }
  return <>Loading</>;
}

export default MetamaskProvider;
