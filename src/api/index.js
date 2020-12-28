import axios from "axios";

const api = process.env.REACT_APP_API;
const agency = "ttc"


export const fetchBusLocation = async (route) => {
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
    let url = `${api}agencies/${agency}/routes/${route}`;
    try {
        const{
            data
        } = await axios.get(url);

        return data
        
    } catch (error) {
        return error;
    }
};

export const fetchStopTimes = async (route, stopId) => {
    let url = `${api}agencies/${agency}/routes/${route}/stops/${stopId}/predictions`;
    try {
        const{
            data,
        } = await axios.get(url);

        return data
        
    } catch (error) {
        return error;
    }
};

export const fetchAllRoutes = async () => {
     let url = `${api}agencies/${agency}/routes/`;

    try {
        const{
            data
        } = await axios.get(url);

        return data
        
    } catch (error) {
        return error;
    }
};