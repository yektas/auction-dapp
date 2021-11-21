import React from 'react'
import Navbar from './Navbar';

interface Props { }

const Layout = (props: React.PropsWithChildren<Props>) => {
    return (
        <div className="relative h-screen overflow-hidden bg-gradient-to-tl from-emerald-500 via-emerald-300 to-cyan-400">
            <Navbar />
            {props.children}
        </div>
    )
}

export default Layout;
