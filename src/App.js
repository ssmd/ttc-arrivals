import React, { useState, useEffect } from "react";
import ReactMapGL, { Marker, Popup, NavigationControl, ScaleControl, FullscreenControl, Source, Layer } from "react-map-gl";
import "./App.css";
import PolylineOverlay from './PolyLineOverlay'

import { fetchBusLocation, fetchRouteStops, fetchStopTimes, fetchRoutePath } from "./api";

function App() {
	const busRoute = 35;

	const [viewport, setviewport] = useState({
		latitude: 43.6534817,
		longitude: -79.3839347,
		width: "100vw",
		height: "100vh",
		zoom: 10,
		bearing: -17,
	});

	const [busLocation, setBusLocation] = useState([]);
	const [routePath, setRoutePath] = useState([]);
	const [routeStops, setRouteStops] = useState([]);
	const [selectedStop, setSelectedStop] = useState(null);
	const [stopTimes, setStopTimes] = useState({});

	useEffect(() => {
		const fetchBusAPI = async () => {
			setBusLocation(await fetchBusLocation(busRoute));
			setRoutePath(await fetchRoutePath(busRoute))
			setRouteStops(await fetchRouteStops(busRoute));	
		};

		fetchBusAPI();
		const interval = setInterval(() => fetchBusAPI(), 5000);
		return () => {
			clearInterval(interval);
		};
	}, []);

	useEffect(() => {
		console.log("RoutePath", routePath);
	}, [busLocation])

	useEffect(() => {
		const fetchAPI = async () => {
			setStopTimes(await fetchStopTimes(busRoute, selectedStop?.stopId));
		};
		fetchAPI();
		const interval = setInterval(() => fetchAPI(), 5000);
		return () => {
			clearInterval(interval);
		};
		
	}, [selectedStop]);

	useEffect(() => {
		const listener = (e) => {
			if (e.key === "Escape") {
				setSelectedStop(null);
			}
		};
		window.addEventListener("keydown", listener);

		return () => {
			window.removeEventListener("keydown", listener);
		};
	}, []);

	return (
		<div className="App">

			<ReactMapGL
				{...viewport}
				mapboxApiAccessToken="pk.eyJ1Ijoic2V5b24xMDAiLCJhIjoiY2tpejhqcTh5MWE4djJ5cDNpaHUxMzBvcyJ9.7yaG59iuW_HA0xr4wY6btQ"
				mapStyle="mapbox://styles/seyon100/ckiz9arnc0sxe19o51hatbmuv"
				containerStyle={{ flex: 1 }}
				onViewportChange={(viewport) => {
					if (viewport.zoom < 10) {
						viewport.zoom = 10;
					} else if (viewport.zoom > 18) {
						viewport.zoom = 18;
					}

					setviewport(viewport);
				}}
			>
				{/* Showpath og route */}
				{routePath.length > 0 ?
					routePath.map(({point}) => (
						<PolylineOverlay points={point.map((p) => ([Number(p.lon), Number(p.lat)]))}/>
					))
				: null
				}

				{/* Show Stops */}
				{routeStops?.length > 0
					? routeStops.map(({ stopId, lat, lon, title }) => (
							<Marker key={stopId} latitude={Number(lat)} longitude={Number(lon)} offsetLeft={-10} offsetTop={-10}>
								<button
									className="busStopBtn"
									onClick={(e) => {
										e.preventDefault();
										setSelectedStop({ stopId, title, lat, lon });
									}}
								>
									<div className="busStopIcon" />
								</button>
							</Marker>
					  ))
					: ""}

				{/* Show Bus Location */}
				{busLocation?.length > 0
					? busLocation.map(({ id, lat, lon }) => (
							<Marker key={id} latitude={Number(lat)} longitude={Number(lon)} offsetLeft={-20} offsetTop={-20}>
								<img className="busMarker" src="bus.png" />
							</Marker>
					  ))
					: ""}

				{/* Show Bus Time info when bus stop is clicked */}
				{selectedStop ? (
					<Popup
						latitude={Number(selectedStop.lat)}
						longitude={Number(selectedStop.lon)}
						onClose={() => {
							setSelectedStop(null);
							setStopTimes({});
						}}
					>
						<div>
							<h2>{selectedStop.title}</h2>
							{stopTimes?.length > 0 ? (
								stopTimes.map((route) => (
									<>
										<p>
											<strong>{route?.title}</strong>
										</p>
										{route.prediction?.length > 0
											? route.prediction.map((bus) => (
													<>
														<p>{`in ${bus.minutes} minutes`}</p>
													</>
											  ))
											: ""}
									</>
								))
							) : (
								<>
									<p>
										<strong>{stopTimes?.title}</strong>
									</p>
									{stopTimes?.prediction?.length > 0
										? stopTimes.prediction.map((bus) => (
												<>
													{console.log(bus)}
													<p>{`in ${bus.minutes} minutes`}</p>
												</>
										  ))
										: ""}
								</>
							)}
						</div>
					</Popup>
				) : (
					""
				)}

				{/* Map Navigation Buttons */}
				<div style={{ position: "absolute", right: 10, bottom: 70 }}>
					<NavigationControl />
				</div>
				<div style={{ position: "absolute", right: 10, bottom: 30 }}>
					<FullscreenControl />
				</div>
				<div style={{ position: "absolute", right: 60, bottom: 30 }}>
					<ScaleControl maxWidth={100} unit={"metric"} />
				</div>
				
{/* 
				<Layer
					id="3d-buildings"
					source="composite"
					source-layer="building"
					filter={["==", "extrude", "true"]}
					type="fill-extrusion"
					minZoom={6}
					paint={{
						"fill-extrusion-color": "#aaa",
						"fill-extrusion-height": {
							type: "identity",
							property: "height",
						},
						"fill-extrusion-base": {
							type: "identity",
							property: "min_height",
						},
						"fill-extrusion-opacity": 0.6,
					}}
				/> */}
			</ReactMapGL>
		</div>
	);
}

export default App;
