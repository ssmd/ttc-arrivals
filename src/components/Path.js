import React from 'react'
import PolylineOverlay from './PolyLineOverlay'

function Path({path}) {
    return (
        path?.length > 0 ?
            path.map(({point}, i) => (
                <PolylineOverlay key={i} points={point.map((p) => ([Number(p.lon), Number(p.lat)]))}/>
            ))
        : null
        
    )
}

export default Path
