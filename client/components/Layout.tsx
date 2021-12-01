import React from "react";
import Navbar from "./Navbar";

interface Props {}

const Layout = (props: React.PropsWithChildren<Props>) => {
  return (
    <div>
      <Navbar />
      {props.children}
    </div>
  );
};

export default Layout;
