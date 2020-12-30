import React, { useState, useEffect } from "react";
import ReactLoading from "react-loading";
import ReactMapGL, {FlyToInterpolator, WebMercatorViewport, NavigationControl, ScaleControl, FullscreenControl } from "react-map-gl";
import "./App.css";

import { fetchBusLocation, fetchStopTimes, fetchRouteInfo, fetchAllRoutes } from "./api";
import Stops from "./components/Stops";
import Path from "./components/Path";
import BusLocation from "./components/BusLocation";
import InfoBox from "./components/InfoBox";
import StopBox from "./components/StopBox";

function App() {

	const [loadingStopTimes, setLoadingStopTimes] = useState(true);
	const [loadingRoutes, setLoadingRoutes] = useState(true);
	const [viewport, setviewport] = useState({
		latitude: 43.6534817,
		longitude: -79.3839347,

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
			setLoadingRoutes(false);
		};
		setAllRoutes([]);
		setLoadingRoutes(true);
		fetchAPI();
		const timeout = setTimeout(() => fetchAPI(), 500);
		return () => {
			clearTimeout(timeout);
		};
	}, []);

	useEffect(() => {

		const fetchAPI = async () => {
			setRouteInfo(await fetchRouteInfo(busRoute));
			setLoadingRoutes(false);
		};
		setLoadingRoutes(true);
		fetchAPI();
		const timeout = setTimeout(() => fetchAPI(), 500);
		return () => {
			clearTimeout(timeout);
		};
			
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
			setLoadingStopTimes(false);
		};
		setStopTimes({});
		setLoadingStopTimes(true);
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
			changeViewPort();
		}
				
	}, [bounds])


	const changeViewPort = () => {

		if(window.innerWidth <= 640){
			var {longitude, latitude, zoom} = new WebMercatorViewport(viewport)
            .fitBounds([[bounds[2], bounds[3]], [bounds[0], bounds[1]]], {
              padding: 50,

			});
			var newviewport = {
				viewport,
				longitude,
				latitude,
				zoom,
				transitionDuration: 1500,
				transitionInterpolator: new FlyToInterpolator(),
				
			}
			setviewport(newviewport);
		}else {
			var {longitude, latitude, zoom} = new WebMercatorViewport(viewport)
            .fitBounds([[bounds[2], bounds[3]], [bounds[0], bounds[1]]], {
              padding: 50,
              offset: [400,0]
			});
			var newviewport = {
				viewport,
				longitude,
				latitude,
				zoom,
				transitionDuration: 1500,
				transitionInterpolator: new FlyToInterpolator(),
				
			}
			setviewport(newviewport);
		}
		
	}

	const handleRouteChange = (event) => {
		setBusRoute(event.target.getAttribute("tag"));		
	};

	return (
		<div className="App">
			{selectedStop ? (
				<StopBox selectedStop={selectedStop} stopTimes={stopTimes} setSelectedStop={setSelectedStop} setStopTimes={setStopTimes} route={busRoute} loading={setLoadingStopTimes}/>
			) : (
				<InfoBox routes={allRoutes} handleRouteChange={handleRouteChange} loading={loadingRoutes}/>
			)}

			<div className="mapContainer">
				<ReactMapGL
					className="map"
					{...viewport}
					width="100%"
      				height="100%"
					mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
					mapStyle="mapbox://styles/seyon100/ckiz9arnc0sxe19o51hatbmuv?optimize=true"
					style={{ width: '100%' }}
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

					<Stops stops={routeInfo.stops} setSelectedStop={setSelectedStop}></Stops>

					<BusLocation busLocation={busLocation}></BusLocation>

					{/* Map Navigation Buttons */}
					<div style={{ position: "absolute", right: 10, bottom: 80 }}>
						<NavigationControl />
					</div>
					<div style={{ position: "absolute", right: 10, bottom: 40 }}>
						<FullscreenControl />
					</div>
					<div style={{ position: "absolute", right: 60, bottom: 40 }}>
						<ScaleControl maxWidth={100} unit={"metric"} />
					</div>
				</ReactMapGL>
			</div>

			<div className="footer">
				<p>
					Made with ❤ by
					<a href="https://github.com/seyon123" target="_blank" rel="noopener noreferrer">
						{" "}
						Seyon Rajagopal{" "}
					</a>
				</p>
			</div>
		</div>
	);
}

export default App;
