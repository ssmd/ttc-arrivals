import React from 'react'

function InfoBox({allRoutes, setBusRoute}) {
    return (
        <div className="infoBox">
				{allRoutes?.length > 0 ?
					allRoutes.map(({tag, title}) => (
						<div key={tag} className="routeNum" title={title} onClick={setBusRoute}>{tag}</div>
					))
				: null
				}
			</div>
    )
}

export default InfoBox
