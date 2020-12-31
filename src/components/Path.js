import React from 'react'
import { Layer, Source } from '@urbica/react-map-gl'

function Path({pathData}) {
    return (pathData && pathData.length > 0) ? (
        <>
            <Source
                id="route"
                type="geojson"
                data={{
                    type: "FeatureCollection",
                    features: pathData,
                }}
            />
            <Layer
                id="route"
                type="line"
                source="route"
                layout={{
                    "line-join": "round",
                    "line-cap": "round",
                }}
                paint={{
                    "line-color": "#ff0000",
                    "line-width": 8,
                }}
            />
        </>
    ): null
}

export default Path
