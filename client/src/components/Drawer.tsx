type DrawerProps = {
    children?: React.ReactNode
    style?: React.CSSProperties
    className?: string | undefined
    type?: "mobile" | "desktop"
}

const Drawer: React.FC<DrawerProps> = ({ children, className, type }) => {

    return (
        <div
        style={{ minHeight: 'calc(100vh + 5rem)' }}
        className={`fixed drawer ${type === "mobile" ? "drawer-mobile" : ""}`}>
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            <div className="flex flex-col items-center p-5 drawer-content bg-base-100">
                {/* <!-- Page content here --> */}
                {children}
            </div> 
            <div className="drawer-side bg-base-100">
                <label htmlFor="my-drawer-2" className="bg-base-200 drawer-overlay"></label> 
                <ul className="p-4 overflow-y-auto menu w-80 bg-base-200 text-base-content">
                {/* <!-- Sidebar content here --> */}
                <li><a>Sidebar Item 1</a></li>
                <li><a>Sidebar Item 2</a></li>
                </ul>
            
            </div>
        </div>
    )
}

export default Drawer