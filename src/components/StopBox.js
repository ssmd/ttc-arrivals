import React from "react";

function StopBox({selectedStop, stopTimes, setSelectedStop, setStopTimes}) {
	return (
		<div className="stopBox">
            <div className="stopBoxHeader">
                <div className="closeBtn" onClick={() => {
                    setSelectedStop(null);
                    setStopTimes({});
                }}>X</div>
                <img className="logo" src="ttc.png"  alt="logo"/>
				<div className="stopBoxTitle">{selectedStop.title}</div>
				<hr className="stopBoxDivider"/>
            </div>
			{stopTimes?.length > 0
				? stopTimes.map((route, i) => (
						<div className="busTimes" key={i}>
							{route.values?.length > 0
								? route.values.map((bus, j) => (
										<div key={j} className="busTime">
											
												<div className="busBranch">{bus.branch} </div>
												<div className="busDirection">{bus.direction?.title}</div>
                                                <div className="busMinutes">{`${bus.minutes} min`}</div>
											
										</div>
								  ))
								: ""}
						</div>
				  ))
				: <div className="error">There are no buses running to this stop at this time.</div>}
		</div>
	);
}

export default StopBox;
