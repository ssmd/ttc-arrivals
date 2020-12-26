import React from 'react'
import PolylineOverlay from './PolyLineOverlay'

function Path({path}) {
    return (
        path?.length > 0 ?
            path.map(({points}, i) => (
                <PolylineOverlay key={i} points={points?.map((p) => ([Number(p.lon), Number(p.lat)]))}/>
            ))
        : null
        
    )
}

export default Path
