import {Place} from "../../model/Place";
import SearchNearPlaces from './SearchNearPlaces';
import {useEffect, useRef, useState} from "react";
import {Loader} from "@googlemaps/js-api-loader";

const ProxiExploreMap = () => {
    const ref = useRef<HTMLDivElement>();
    const [places, setPlaces] = useState<Place[]>([]);
    const [mapInitialized, setMapInitialized] = useState(false);
    const [location, setLocation] = useState({lat: -34.397, lng: 150.644});
    const [distance, setDistance] = useState(100);
    const [zoom, setZoom] = useState(15);
    const [mapInstance, setMapInstance] = useState<any>();
    const [markerInstance, setMarkerInstance] = useState<any>();
    let loader: Loader;
    let map: google.maps.Map;
    let marker: google.maps.Marker;

    useEffect(() => {
        const initializeMap = async () => {
            await initMap();
            setMapInitialized(true);
        };

        initializeMap().then();
    }, []);

    useEffect(() => {
        if (mapInitialized) {
            preparePlaces();
        }
    }, [places, mapInitialized]);

    useEffect(() => setMapLocation(), [location]);

    const initMap = async () => {
        createLoader();
        await createMap();
        await createCurrenLocationMarker();
        addEventListener()
    }

    const getLocationInfoCurrentUser = (map: google.maps.Map) => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function (position) {
                const location = {lat: position.coords?.latitude, lng: position.coords?.longitude} as any;
                setLocation(location);
                map.setCenter(location)
                marker.setPosition(location)
                map.panTo(location);
            });
        }
    }

    const setMapLocation = () => {
        if (!location) {
            return;
        }

        placeMarkerAndPanTo()
    }

    const createLoader = () => {
        loader = new Loader({
            apiKey: "YOUR_API_KEY" as string,
            version: "weekly",
            libraries: ["places"]
        });
    }

    const createMap = async () => {
        const {Map} = await loader.importLibrary('maps');

        const mapOptions: google.maps.MapOptions = {
            center: location,
            zoom,
            mapId: "601c46c2e1c6edff"
        }

        map = new Map(ref.current as HTMLDivElement, mapOptions);
        setMapInstance(map)
    }

    const addEventListener = () => {
        onClickMapAddMarker();
        onChangeMapZoom();
    }

    const createCurrenLocationMarker = async () => {
        const {Marker} = await loader.importLibrary('marker');

        debugger
        if (!marker) {
            marker = new Marker({
                map,
                position: location
            });
            setMarkerInstance(marker);
        }

        getLocationInfoCurrentUser(map);
    }

    const placeMarkerAndPanTo = () => {
        if (!mapInstance || !markerInstance) {
            return;
        }

        markerInstance.setPosition(location)
        mapInstance.panTo(location);
    }

    const onClickMapAddMarker = () => {
        map.addListener("click", (e: any) => {
            const location = {lat: e.latLng.lat(), lng: e.latLng.lng()}
            setLocation(location);
            marker.setPosition(location)
            map.panTo(location);
        });
    }

    const onChangeMapZoom = () => {
        map.addListener("zoom_changed", () => {
            const zoom = map.getZoom() as number;
            setZoom(zoom);
        });
    }

    const preparePlaces = () => {
        if (!places.length) {
            return;
        }
        for (let i = 0; i < places.length; i++) {
            createMarker(places[i]);
        }
    }

    const createMarker = (place: Place) => {
        if (!place || !place.geo) return;

        const infoWindow = new google.maps.InfoWindow();

        const marker = new google.maps.Marker({
            map: mapInstance,
            position: {lat: place.geo?.lat, lng: place.geo?.lon},
            title: place.displayName.text,
            clickable:true,
            icon: svgMarker,

        });

        google.maps.event.addListener(marker, "click", () => {
            infoWindow.setContent();
            infoWindow.open(mapInstance);
        });

        marker.addListener("click", () => {
            infoWindow.close();
            infoWindow.setContent(place.displayName?.text || marker.getTitle());
            infoWindow.getContent()
            infoWindow.open(marker.getMap(), marker);
        });
    }


    const svgMarker = {
        path: "M-1.547 12l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM0 0q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
        fillColor: "blue",
        fillOpacity: 0.6,
        strokeWeight: 0,
        rotation: 0,
        scale: 2,
    };

    return (
        <div>
            {/*@ts-ignore*/}
            <div style={{padding: '10px', height: '600px'}} ref={ref}/>
            <SearchNearPlaces setPlaces={setPlaces}
                              setDistance={setDistance}
                              setLocation={setLocation}
                              initialValues={{lat: location.lat, lon: location.lng, distance: distance}}/>
        </div>
    );
};

export default ProxiExploreMap;
