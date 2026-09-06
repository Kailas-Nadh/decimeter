import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const AppLayout = () => {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      safeAreaInsets={{ bottom: insets.bottom + 16 }}
      screenOptions={{
        headerShown: false,
        freezeOnBlur: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Decibel Meter",
          tabBarLabel: "Decibel Meter",
        }}
      />
      <Tabs.Screen
        name="iss-tracker"
        options={{
          title: "ISS Tracker",
          tabBarLabel: "ISS Tracker",
        }}
      />
    </Tabs>
  );
};

export default AppLayout;
