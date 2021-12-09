import React from "react";
import { Footer } from "./Footer";
import Navbar from "./Navbar";

interface Props {}

const Layout = (props: React.PropsWithChildren<Props>) => {
  return (
    <div>
      <Navbar />
      <div className="h-full mb-10">{props.children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
