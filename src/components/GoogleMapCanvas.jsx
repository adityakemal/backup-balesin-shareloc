import React, { useEffect } from "react";
import { GoogleMap, useJsApiLoader, MarkerF } from "@react-google-maps/api";
import { Crosshair } from "react-feather";

const containerStyle = {
  width: "100%",
  height: "100vh",
};

function GoogleMapCanvas() {
  // useEffect(() => {
  //   console.log(import.meta.env.VITE_GMAP_KEY);
  // }, []);
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GMAP_KEY,
  });

  const [map, setMap] = React.useState(null);
  const [center, setCenter] = React.useState({
    lat: -6.2,
    lng: 106.816666,
  });

  const onLoad = React.useCallback(function callback(map) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    // const bounds = new window.google.maps.LatLngBounds(center);
    // map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  const onLoadMarker = (marker) => {
    // console.log("marker: ", marker.map.center, "onload marker");
    // setMapRef();
    handleGetLocation();
  };

  const [mapref, setMapRef] = React.useState([
    {
      lat: -6.2,
      lng: 106.816666,
    },
  ]);

  const handleCenterChanged = () => {
    if (map) {
      console.log(map.center.lat(), "center lat");
      console.log(map.center.lng(), "center lng");
      const marker = {
        lat: map?.center?.lat(),
        lng: map?.center?.lng(),
      };
      setMapRef((prev) => [...prev, marker]);
    }
    // handleGetLocation();
  };
  const handleDragEnd = () => {
    console.log(map.center.lat(), "center lat");
    console.log(map.center.lng(), "center lng");
    setMapRef(() => [
      {
        lat: map.center.lat(),
        lng: map.center.lng(),
      },
    ]);
    handleGetLocation();
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.permissions.query({ name: "geolocation" }).then((r) => {
        console.log(r.state, "status location");
        if (r.state !== "granted") {
          alert("Please allow location access.");
          window.location.href = "app-settings:location";
          setMap(null);
        } else {
          navigator.geolocation.getCurrentPosition((position) => {
            const userLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            console.log(userLocation); // ADDED
            setMapRef(() => [userLocation]);
            setCenter(() => userLocation);
          });
        }
      });
    } else {
      alert("Geolocation is not supported in your browser.");
    }
  };

  return isLoaded ? (
    <>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={18}
        options={{
          scrollwheel: false,
          zoomControl: false,
          draggableCursor: false,
          streetViewControl: false,
        }}
        draggable={false}
        onLoad={onLoad}
        onDragEnd={handleDragEnd}
        onCenterChanged={handleCenterChanged}
        onUnmount={onUnmount}>
        <MarkerF
          //   icon={{
          //     fillColor: `#4285F4`,
          //     fillOpacity: 1,
          //     path: google.maps.SymbolPath.CIRCLE,
          //     scale: 8,
          //     strokeColor: `rgb(255,255,255)`,
          //     strokeWeight: 2,
          //   }}
          draggable={false}
          onLoad={onLoadMarker}
          position={mapref[mapref.length - 1]}
        />
        <button className="mylocation" onClick={handleGetLocation}>
          <Crosshair color={"gray"} />
        </button>
      </GoogleMap>

      {/* <code>{JSON.stringify(mapref, 0, 2)}</code> */}
      <div className="wrapbutton">
        <button className="sharebut" onClick={handleGetLocation}>
          Share my Location
        </button>
      </div>
    </>
  ) : (
    <>loading...</>
  );
}

export default React.memo(GoogleMapCanvas);
