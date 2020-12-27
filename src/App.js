import React, { useState, useEffect } from "react";
import ReactMapGL, {FlyToInterpolator, WebMercatorViewport, NavigationControl, ScaleControl, FullscreenControl } from "react-map-gl";
import "./App.css";

import { fetchBusLocation, fetchStopTimes, fetchRouteInfo, fetchAllRoutes } from "./api";
import Stops from "./components/Stops";
import Path from "./components/Path";
import BusLocation from "./components/BusLocation";
import InfoBox from "./components/InfoBox";
import StopBox from "./components/StopBox";

function App() {

	const [viewport, setviewport] = useState({
		latitude: 43.6534817,
		longitude: -79.3839347,
		width: "100vw",
		height: "100vh",
		bearing: -16,
		zoom: 10,
	});
	const [busLocation, setBusLocation] = useState([]);
	const [routeInfo, setRouteInfo] = useState({});
	const [allRoutes, setAllRoutes] = useState([]);
	const [busRoute, setBusRoute] = useState();
	const [selectedStop, setSelectedStop] = useState(null);
	const [stopTimes, setStopTimes] = useState({});
	const [bounds, setBounds] = useState();
	


	useEffect(() => {
		const fetchAPI = async () => {
			setAllRoutes(await fetchAllRoutes());
		};
		fetchAPI();
	}, []);

	useEffect(() => {
		const fetchAPI = async () => {
			setRouteInfo(await fetchRouteInfo(busRoute));
		};
		fetchAPI();
			
	}, [busRoute]);

	useEffect(() => {
		const fetchAPI = async () => {
			setBusLocation(await fetchBusLocation(busRoute));
		};
		fetchAPI();
		const interval = setInterval(() => fetchAPI(), 20000);
		return () => {
			clearInterval(interval);
		};
	}, [busRoute]);

	useEffect(() => {
		const fetchAPI = async () => {
			selectedStop && setStopTimes(await fetchStopTimes(busRoute, selectedStop?.id));
		};
		fetchAPI();
		const interval = setInterval(() => fetchAPI(), 20000);
		return () => {
			clearInterval(interval);
		};
	}, [selectedStop, busRoute]);

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

	useEffect(() => {
		if (Object.entries(routeInfo).length !== 0){
			setBounds([routeInfo.bounds?.sw.lon, routeInfo.bounds?.sw.lat, routeInfo.bounds?.ne.lon, routeInfo.bounds?.ne.lat]);
		}
	
	}, [routeInfo]);

	useEffect(() => {
		if (bounds?.length > 0 && bounds[0] !== undefined && Object.entries(routeInfo).length !== 0){
			console.log("This 2 Ran", bounds);
			changeViewPort();
		}
				
	}, [bounds])


	const changeViewPort = () => {
		
		const {longitude, latitude, zoom} = new WebMercatorViewport(viewport)
            .fitBounds([[bounds[2], bounds[3]], [bounds[0], bounds[1]]], {
              padding: 150,
              offset: [400,0]
			});
		
        const newviewport = {
            viewport,
            longitude,
            latitude,
            zoom,
            transitionDuration: 1000,
            transitionInterpolator: new FlyToInterpolator(),
            
		}
		console.log("changeViewPort Called", bounds, busRoute,routeInfo);
		setviewport(newviewport);

		console.log("changeViewPort Called After", bounds, busRoute,routeInfo);
	}

	const stopClicked = (stop) => {
		setSelectedStop(stop);
	};

	const handleRouteChange = (event) => {
		setBusRoute(event.target.getAttribute("tag"));
		console.log("Route Change");		
	};

	return (
		<div className="App">
			{selectedStop ? (
				<StopBox selectedStop={selectedStop} stopTimes={stopTimes} setSelectedStop={setSelectedStop} setStopTimes={setStopTimes} route={busRoute}/>
			) : (
				<InfoBox routes={allRoutes} handleRouteChange={handleRouteChange} />
			)}

			<ReactMapGL
				className="map"
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
				
				<Path path={routeInfo.paths}></Path>

				<Stops stops={routeInfo.stops} stopClicked={stopClicked}></Stops>

				<BusLocation busLocation={busLocation}></BusLocation>

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
