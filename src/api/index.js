import axios from "axios";

//const api = "http://webservices.nextbus.com/service/publicJSONFeed?";
const api = "http://restbus.info/api/";
const agency = "ttc"


export const fetchBusLocation = async (route) => {
    //let url = `${api}command=vehicleLocations&a=${agency}&r=${route}`;
    let url = `${api}agencies/${agency}/routes/${route}/vehicles`;
    try {
        const{
            data
        } = await axios.get(url);

        return data
        
    } catch (error) {
        return error;
    }
};

export const fetchRouteInfo = async (route) => {
    //let url = `${api}command=routeConfig&a=${agency}&r=${route}`;
    let url = `${api}agencies/${agency}/routes/${route}`;
    try {
        const{
            data
        } = await axios.get(url);
        console.log(url)

        return data
        
    } catch (error) {
        return error;
    }
};

export const fetchStopTimes = async (route, stopId) => {
    //let url = `${api}command=predictions&a=${agency}&routeTag=${route}&stopId=${stopId}`;
    let url = `${api}agencies/${agency}/routes/${route}/stops/${stopId}/predictions`;
    try {
        const{
            data,
        } = await axios.get(url);
        console.log(url)

        return data
        
    } catch (error) {
        return error;
    }
};

export const fetchAllRoutes = async () => {
 
    //let url = `${api}command=routeList&a=${agency}`;
    let url = `${api}agencies/${agency}/routes/`;

    try {
        const{
            data
        } = await axios.get(url);
        console.log(url)

        return data
        
    } catch (error) {
        return error;
    }
};