import axios from "axios";

const api = "http://webservices.nextbus.com/service/publicJSONFeed?";
const agency = "ttc"


export const fetchBusLocation = async (route) => {
    
    let url = `${api}command=vehicleLocations&a=${agency}&r=${route}`;
    
    try {
        const{
            data: {vehicle},
        } = await axios.get(url);
        console.log(vehicle)
        return vehicle
        
    } catch (error) {
        return error;
    }
};