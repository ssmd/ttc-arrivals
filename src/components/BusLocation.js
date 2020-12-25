import React from "react";
import { Marker } from "react-map-gl";

function BusLocation({ busLocation }) {
	return busLocation?.length > 0
		? busLocation.map(({ id, lat, lon }) => (
				<Marker key={id} latitude={Number(lat)} longitude={Number(lon)} offsetLeft={-20} offsetTop={-20}>
					<img className="busMarker" src="bus.png" />
				</Marker>
		  ))
		: null;
}

export default BusLocation;
