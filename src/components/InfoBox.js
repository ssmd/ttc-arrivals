import React, {useState} from 'react'
import ReactLoading from "react-loading";
import './InfoBox.css'

function InfoBox({routes, handleRouteChange, loading, search, setSearch}) {

	
    return (
        <div className="infoBox">
			<div className="infoBoxHeader">
			<div className="closeBtn" onClick={() => {
                    
                }}>X</div>
				<img className="logo" src="ttc.png" alt="logo"/>
				<div className="infoBoxTitle">Live Transit Map</div>
				<input className="searchBox" placeholder="Search for a Route..." value={search} onChange={(e) => setSearch(e.target.value)}></input>
				<hr className="infoBoxDivider"/>
				
			</div>
			<div className="routes">
			{routes?.length > 0 ? 
				routes.filter(({id, title}) => (id.toLowerCase().includes(search.toLowerCase()) || title.toLowerCase().includes(search.toLowerCase()))).map(({id, title}) => (
					<div tag={id} key={id} className="route" onClick={handleRouteChange}>
						<div tag={id} className="routeNum">{id}</div>
						<h1 tag={id} className="routeTitle">{title?.split("-", 2)[1]?.split("Night")[0]?.split("Express")[0]}</h1>
						<div tag={id} className="tags">
						{title.split("Express").length > 1 && 
							<div tag={id} className="tag">Express</div>
						}
						{title.split("Night").length > 1 && 
							<div tag={id} className="tag">Night</div>
						}
						</div>
					</div>
				))
			: 
			
				<div className="error">
					{loading && ((typeof routes === 'object') && (!Array.isArray(routes))) ? (<ReactLoading type={"spin"} color={"red"} height={50} width={50}/>) :
						<>There was an error fetching transit information. Please try again later.</>
					}
				</div>
			}
			</div>
			<div className="footer">
				<p>
					Made with ❤ by {" "}
					<a href="https://github.com/seyon123" target="_blank" rel="noopener noreferrer">
						Seyon Rajagopal{" "}
					</a>
				</p>
			</div>
			
		</div>
    )
}

export default InfoBox
