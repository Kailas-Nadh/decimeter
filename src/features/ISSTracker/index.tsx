import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import * as Location from "expo-location";
import {
  Map,
  Camera,
  UserLocation,
} from "@maplibre/maplibre-react-native";

export default function MapScreen() {
  useEffect(() => {
    (async () => {
      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        console.log("Location permission denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      console.log("Latitude:", location.coords.latitude);
      console.log("Longitude:", location.coords.longitude);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Map
        style={styles.map}
        mapStyle="https://tiles.openfreemap.org/styles/liberty"
      >
        <Camera
          initialViewState={{
            center: [0, 0],
            zoom: 15,
          }}
          trackUserLocation="default"
          zoom={15}
        />

        <UserLocation visible={true} />
      </Map>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});