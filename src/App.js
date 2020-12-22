import React, { useState, useEffect } from "react";
import ReactMapGL, {Marker, NavigationControl,ScaleControl, FullscreenControl, Layer} from "react-map-gl";
import "./App.css";

import {fetchBusLocation} from './api'

function App() {

	const [viewport, setviewport] = useState({
		latitude: 43.6534817,
		longitude: -79.3839347,
		width: "100vw",
		height: "100vh",
		zoom: 10,
		bearing: -17
	});

	const [busLocation, setBusLocation] = useState([]);

	useEffect(() => {
		const fetchBusAPI = async () => {
            setBusLocation(await fetchBusLocation(36));
		};
		fetchBusAPI()
		const interval = setInterval(() => fetchBusAPI(), 10000)
        return () => {
          clearInterval(interval);
        }
	}, [])

	console.log(busLocation);

	return (
		<div className="App">
			<ReactMapGL {...viewport} 
				mapboxApiAccessToken="pk.eyJ1Ijoic2V5b24xMDAiLCJhIjoiY2tpejhqcTh5MWE4djJ5cDNpaHUxMzBvcyJ9.7yaG59iuW_HA0xr4wY6btQ"
				mapStyle="mapbox://styles/seyon100/ckiz9arnc0sxe19o51hatbmuv"
				onViewportChange={ viewport => {
					if(viewport.zoom < 10) {
						viewport.zoom = 10;
					}
					setviewport(viewport);
				}}
			>
				{busLocation?.length > 0 ?
					busLocation.map(({id,lat,lon}) => (
						<Marker key={id} latitude={Number(lat)} longitude={Number(lon)}>
							<img className="busMarker" src="bus.png"/>
						</Marker>
					))
				:""}
				<div style={{position: 'absolute', right: 10, bottom: 70}}>
					<NavigationControl />
				</div>
				<div style={{position: 'absolute', right: 10, bottom: 30}}>
					<FullscreenControl/>
				</div>
				<div style={{position: 'absolute', right: 60, bottom: 30}}>
					<ScaleControl maxWidth={100} unit={"metric"}/>
				</div>
						
				
				<Layer
					id="3d-buildings"
					source="composite"
					source-layer="building"
					filter={['==', 'extrude', 'true']}
					type="fill-extrusion"
					minZoom={6}
					paint={{
						'fill-extrusion-color': '#aaa',
						'fill-extrusion-height': {
						  type: 'identity',
						  property: 'height'
						},
						'fill-extrusion-base': {
						  type: 'identity',
						  property: 'min_height'
						},
						'fill-extrusion-opacity': 0.6
					  }}
				/>

			</ReactMapGL>
		</div>
	);
}

export default App;
