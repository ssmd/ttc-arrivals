import React from 'react'
import { Marker } from '@urbica/react-map-gl';

function Stops({stops, setSelectedStop}) {
    return (
        stops?.length > 0
            ? stops.map(({ id, lat, lon, title }, i) => (
                    <Marker key={i} latitude={Number(lat)} longitude={Number(lon)}>
                        <button
                            className="busStopBtn"
                            onClick={(e) => {
                                e.preventDefault();
                                setSelectedStop({ id, title, lat, lon });
                            }}
                        >
                            <div className="busStopIcon" />
                        </button>
                    </Marker>
              ))
            : null
        
    )
}

export default Stops
