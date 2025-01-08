import './style.css'

function MapContainer(props: { children: React.ReactNode | React.ReactNode[]; className?: string; }) {
    const [children1, children2] = Array.isArray(props.children) ? props.children : [props.children]

    return (
        <div className={`hz-map-container`}>
            <div className="mobile">
                {children1}
            </div>
            <div className='hz-map-control'>
                <div className='hz-title'>
                    <span>动画控制面板</span>
                </div>
                {children2}
            </div>
        </div>
    );
}

export default MapContainer