import './style.css'

function MapContainer(props: { children: React.ReactNode; className?: string; }) {
    return (
        <div className={`map-container`}>
            <div className="mobile">
                {props.children}
            </div>
        </div>
    );
}

export default MapContainer