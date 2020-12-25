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
    let url = `${api}command=predictions&a=${agency}&r=${route}&stopId=${stopId}`;
    try {
        const{
            data: {predictions: {direction}},
        } = await axios.get(url);
        // console.log(url)
        // console.log(direction)

        return direction
        
    } catch (error) {
        return error;
    }
};

// // WIP
// export const fetchRoutePath = async (routeNum) => {
 
//     let url = `${api}command=routeConfig&a=${agency}&r=${routeNum}`;
//     try {
//         const{
//             data: {route},
//         } = await axios.get(url);
//         console.log(url)
//         console.log(route);

//         return route
        
//     } catch (error) {
//         return error;
//     }
// };