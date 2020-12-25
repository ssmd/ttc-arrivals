import React, { useState, useEffect } from "react";
import ReactMapGL, { Marker, Popup, NavigationControl, ScaleControl, FullscreenControl, Source, Layer } from "react-map-gl";
import "./App.css";

import { fetchBusLocation, fetchStopTimes, fetchRouteInfo } from "./api";
import Stops from "./components/Stops";
import Path from "./components/Path";
import BusLocation from "./components/BusLocation";

function App() {
	const busRoute = '60';

	const [viewport, setviewport] = useState({
		latitude: 43.6534817,
		longitude: -79.3839347,
		width: "100%",
		height: "100vh",
		bearing: -16,
		zoom: 10,
	});

	const [busLocation, setBusLocation] = useState([]);
	const [routeInfo, setRouteInfo] = useState([]);
	const [selectedStop, setSelectedStop] = useState(null);
	const [stopTimes, setStopTimes] = useState({});

	useEffect(() => {
		const fetchAPI = async () => {
			setBusLocation(await fetchBusLocation(busRoute));
			setRouteInfo(await fetchRouteInfo(busRoute));	
		};

		fetchAPI();
		const interval = setInterval(() => fetchAPI(), 5000);
		return () => {
			clearInterval(interval);
		};
	}, []);

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

	const stopClicked = (stop) => {
		setSelectedStop(stop);
	}



	return (
		<div className="App">

			<ReactMapGL
				{...viewport}
				
				mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
				mapStyle="mapbox://styles/seyon100/ckiz9arnc0sxe19o51hatbmuv"
				containerStyle={{ flex: 1 }}
				onViewportChange={(viewport) => {
					if (viewport.pitch < 0) {
						viewport.pitch = 0;
					} else if (viewport.pitch > 25) {
						viewport.pitch = 25;
					}

					setviewport(viewport);
				}}
			>
				<Path path={routeInfo.path}></Path>				
				
				<Stops stops={routeInfo.stop} stopClicked={stopClicked}></Stops>

				<BusLocation busLocation={busLocation}></BusLocation>

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
								stopTimes.map((route,i) => (
									<div key={i}>
										<p>
											<strong>{route?.title}</strong>
										</p>
										{route.prediction?.length > 0
											? route.prediction.map((bus,j) => (
													<div key={j}>
														<p>{`in ${bus.minutes} minutes`}</p>
													</div>
											  ))
											: ""}
									</div>
								))
							) : (
								<div>
									<p>
										<strong>{stopTimes?.title}</strong>
									</p>
									{stopTimes?.prediction?.length > 0
										? stopTimes.prediction.map((bus,j) => (
												<div key={j}>
													{console.log(bus)}
													<p>{`in ${bus.minutes} minutes`}</p>
												</div>
										  ))
										: ""}
								</div>
							)}
						</div>
					</Popup>
				) : (
					null
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
				
			</ReactMapGL>
		</div>
	);
}

export default App;
