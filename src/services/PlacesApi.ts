import API from "./API";

const placesServicePath = process.env.REACT_APP_PLACES_SERVICE_PATH

const near = async (data: { lat: number, lon: number, distance: number }) => {
    return API.post(`${placesServicePath}/places`, data)
};


export const PlacesApi =
    {
        near
    };
