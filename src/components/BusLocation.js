import React from "react";
import { Marker } from "@urbica/react-map-gl";

function BusLocation({ busLocation }) {
	return busLocation?.length > 0
		? busLocation.map(({ id, lat, lon, heading }) => (
				<Marker key={id} latitude={Number(lat)} longitude={Number(lon)} rotation={heading} rotationAlignment="map" >
					<img className="busMarker" src="bus.png"  alt="Bus_Marker"/>
				</Marker>
		  ))
		: null;
}

export default BusLocation;
