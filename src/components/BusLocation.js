import React from "react";
import { Marker } from "@urbica/react-map-gl";

function BusLocation({ busLocation, selectedBranch }) {
	return busLocation?.length > 0
		? busLocation.filter(({directionId}) => {
			if (selectedBranch) {
				return directionId === selectedBranch
			}
			else return true;
			
		})
		.map(({ id, lat, lon, heading, directionId }) => (
			directionId !== null && <Marker key={id} latitude={Number(lat)} longitude={Number(lon) } rotation={heading} rotationAlignment="map" >
				<div className="markerContainer">
					<div className="arrow">
						<div className="arrowInner"></div>
					</div>
					<img className="busMarker" src="bus.png"  alt="Bus_Logo"/>
				</div>
			</Marker>
		  ))
		: null;
}

export default BusLocation;
