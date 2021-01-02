import React, { useState, useEffect } from "react";
import ReactMapGL, { NavigationControl, ScaleControl, FullscreenControl, AttributionControl, Source, Layer } from "@urbica/react-map-gl";
import "./App.css";
import "mapbox-gl/dist/mapbox-gl.css";

import { fetchBusLocation, fetchStopTimes, fetchRouteInfo, fetchAllRoutes } from "./api";
import Stops from "./components/Stops";
import Path from "./components/Path";
import BusLocation from "./components/BusLocation";
import InfoBox from "./components/InfoBox";
import StopBox from "./components/StopBox";

function App() {
	const [loadingStopTimes, setLoadingStopTimes] = useState(true);
	const [loadingRoutes, setLoadingRoutes] = useState(true);
	const [theme, setTheme] = useState("light");
	const [menu, setMenu] = useState(false);
	const [viewport, setviewport] = useState({
		latitude: 43.6534817,
		longitude: -79.3839347,
		bearing: -16,
		zoom: 10,
	});
	const [busLocation, setBusLocation] = useState([]);
	const [busPath, setBusPath] = useState([]);
	const [pathData, setPathData] = useState([]);
	const [routeInfo, setRouteInfo] = useState({});
	const [allRoutes, setAllRoutes] = useState({});
	const [search, setSearch] = useState("");
	const [busRoute, setBusRoute] = useState();
	const [selectedStop, setSelectedStop] = useState(null);
	const [stopTimes, setStopTimes] = useState({});
	const [bounds, setBounds] = useState();

	const mapstyles = {
		light: "mapbox://styles/seyon100/ckiz9arnc0sxe19o51hatbmuv?optimize=true",
		dark: "mapbox://styles/mapbox/dark-v9?optimize=true",
	};

	useEffect(() => {
		const fetchAPI = async () => {
			setAllRoutes(await fetchAllRoutes());
			setLoadingRoutes(false);
		};
		setAllRoutes({});
		setLoadingRoutes(true);
		fetchAPI();
	}, []);

	useEffect(() => {
		const fetchAPI = async () => {
			busRoute && setRouteInfo(await fetchRouteInfo(busRoute));
		};
		setLoadingRoutes(true);
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

	useEffect(()=>{
		const storetheme = localStorage.getItem("theme");
		const body = document.querySelector("body");

		if (storetheme === "dark") {
			body.classList.add("dark");
			setTheme("dark")
		}else{
			setTheme("light")
		}
	},[]);

	useEffect(() => {
		const body = document.querySelector("body");

		if (theme === "dark"){
			localStorage.setItem("theme", "dark");
			body.classList.add("dark");
		}else if (body.classList.contains("dark")) {
			localStorage.clear();
			body.classList.remove("dark");
		}

	}, [theme]);

	useEffect(() => {
		if (Object.entries(routeInfo).length !== 0) {
			setBounds([routeInfo.bounds?.sw.lon, routeInfo.bounds?.sw.lat, routeInfo.bounds?.ne.lon, routeInfo.bounds?.ne.lat]);
		}
	}, [routeInfo]);

	useEffect(() => {
		if (bounds?.length > 0 && bounds[0] !== undefined && Object.entries(routeInfo).length !== 0) {
			changeViewPort();
		}
	}, [bounds]);

	// help convert path to GEOJSON format
	useEffect(() => {
		setBusPath(routeInfo?.paths?.map(({ points }) => points?.map((p) => [Number(p.lon), Number(p.lat)])));
	}, [routeInfo]);

	useEffect(() => {
		setPathData(
			busPath?.map((path) => ({
				type: "Feature",
				geometry: {
					type: "LineString",
					coordinates: path,
				},
			}))
		);
	}, [busPath]);

	const changeViewPort = () => {
		const newviewport = {
			...viewport,
			latitude: Math.min(bounds[1], bounds[3]) + (Math.max(bounds[1], bounds[3]) - Math.min(bounds[1], bounds[3])) / 2,
			longitude: Math.min(bounds[0], bounds[2]) + (Math.max(bounds[0], bounds[2]) - Math.min(bounds[0], bounds[2])) / 2,
			zoom: 12,
		};
		setviewport(newviewport);
	};

	const handleRouteChange = (event) => {
		setBusRoute(event.target.getAttribute("tag"));
		setSearch("");
	};

	return (
		<div className="App">
			<div className="themeToggle">
				<button id="lightBtn" className="themeBtn" onClick={() => setTheme("light")}>
					🌞
				</button>
				<button id="darkBtn" className="themeBtn" onClick={() => setTheme("dark")}>
					🌙
				</button>
			</div>

			{selectedStop ? (
					<StopBox selectedStop={selectedStop} stopTimes={stopTimes} setSelectedStop={setSelectedStop} setStopTimes={setStopTimes} route={busRoute} loading={loadingStopTimes} setMenu={setMenu}/>
				) : !menu ? (
					<InfoBox routes={allRoutes} handleRouteChange={handleRouteChange} loading={loadingRoutes} search={search} setSearch={setSearch} setMenu={setMenu}/>
				): (<div className="menuBtn" onClick={() => setMenu(false)}><i className="fas fa-bars"></i></div>)
			}

				
			{busRoute && (
				<div className="routeDisplayContainer">
					<div className="routeDisplay">
						<div className="routeDisplayNum">{busRoute}</div> <div className="routeDisplayTitle"> {routeInfo?.title}</div>
					</div>
				</div>
			)}


			<div className="mapContainer">
				<ReactMapGL
					className="map"
					{...viewport}
					style={{ width: "100%", height: "100%" }}
					accessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
					mapStyle={mapstyles[theme]}
					viewportChangeMethod="flyTo"
					viewportChangeOptions={{ duration: 1000 }}
					attributionControl={false}
					pitch={5}
					onViewportChange={setviewport}
				>
					<Path pathData={pathData}></Path>
					<Stops stops={routeInfo.stops} setSelectedStop={setSelectedStop}></Stops>
					<BusLocation busLocation={busLocation}></BusLocation>

					<AttributionControl compact={true} position="bottom-right" customAttribution='<a href="https://github.com/seyon123" target="_blank" rel="noopener noreferrer">© Seyon Rajagopal</a>' />
					<ScaleControl position="bottom-right" />
					<NavigationControl showCompass showZoom position="bottom-right" />
					<FullscreenControl position="bottom-right" />
				</ReactMapGL>
			</div>
		</div>
	);
}

export default App;
