import "../styles/sidebar.css"

function SidebarItem({ children, className = "", onClick = () => { } }) {
    return <>
        <div onClick={onClick} className={`sidebar-item ${className}`}>
            {children}
        </div>
    </>
}

function SidebarGroup({ children, className = "", style}) {
    return <>
        <div className={`sidebar-group ${className}`} style={style}>
            {children}
        </div>
    </>
}

function Sidebar({ children, hide = true }) {
    return <>
        <div className={`sidebar ${hide? "hidden": "flex"} lg:flex`}>
            {children}
        </div>
    </>
}

function Spacer() {
    return <>
        <div className="sidebar-spacer"></div>
    </>
}

export { Sidebar, SidebarGroup, SidebarItem, Spacer }