import React from 'react'
import { Marker } from 'react-map-gl';

function Stops({stops, stopClicked}) {
    return (
        stops?.length > 0
            ? stops.map(({ id, lat, lon, title }, i) => (
                    <Marker key={i} latitude={Number(lat)} longitude={Number(lon)} offsetLeft={-10} offsetTop={-10}>
                        <button
                            className="busStopBtn"
                            onClick={(e) => {
                                e.preventDefault();
                                stopClicked({ id, title, lat, lon });
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
