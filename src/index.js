import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import 'mapbox-gl/dist/mapbox-gl.css';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register({
	onUpdate: registration => {
	  const waitingServiceWorker = registration.waiting;
	  if (waitingServiceWorker) {
		waitingServiceWorker.addEventListener("statechange", event => {
		  if (event.target.state === "activated") {
        alert("New Verison Found. Click OK to Refresh Page");
        window.location.reload()
		  }
		})
		waitingServiceWorker.postMessage({ type: "SKIP_WAITING" })
	  }
	}
})

