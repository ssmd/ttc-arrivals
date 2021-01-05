import React from "react";
import { Marker } from "@urbica/react-map-gl";

function BusLocation({ busLocation }) {
	return busLocation?.length > 0
		? busLocation.map(({ id, lat, lon, heading, directionId }) => (
			directionId !== null && <Marker key={id} latitude={Number(lat)} longitude={Number(lon) } rotation={heading} rotationAlignment="map" >
				<div className="markerContainer">
					<div className="arrow">
						<div className="arrowInner"></div>
					</div>
					{/* <div className="routename" >{directionId.split("Con")[0].split("con")[0].split("_", 3)[2]}</div> */}
					<img className="busMarker" src="bus.png"  alt="Bus_Logo"/>
				</div>
			</Marker>
		  ))
		: null;
}

export default BusLocation;
