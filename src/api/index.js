import axios from "axios";

const api = "http://webservices.nextbus.com/service/publicJSONFeed?";
const agency = "ttc"


export const fetchBusLocation = async (route) => {
    let url = `${api}command=vehicleLocations&a=${agency}&r=${route}`;
    try {
        const{
            data: {vehicle},
        } = await axios.get(url);
        // console.log(vehicle)
        return vehicle
        
    } catch (error) {
        return error;
    }
};

export const fetchRouteInfo = async (route) => {
    let url = `${api}command=routeConfig&a=${agency}&r=${route}`;
    try {
        const{
            data: {route},
        } = await axios.get(url);
        // console.log(stop)

        return route
        
    } catch (error) {
        return error;
    }
};

export const fetchStopTimes = async (route, stopId) => {
    let url = `${api}command=predictions&a=${agency}&routeTag=${route}&stopId=${stopId}`;
    try {
        const{
            data: {predictions},
        } = await axios.get(url);
        console.log(url)
        console.log(predictions)

        return predictions
        
    } catch (error) {
        return error;
    }
};

export const fetchAllRoutes = async () => {
 
    let url = `${api}command=routeList&a=${agency}`;
    try {
        const{
            data: {route},
        } = await axios.get(url);
        console.log(url)
        console.log(route);

        return route
        
    } catch (error) {
        return error;
    }
};