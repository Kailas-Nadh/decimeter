import { useTheme } from "@/shared/hooks/useTheme";
import { useEffect, useRef, useState } from "react";
import {
    Alert,
    PermissionsAndroid,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import RNSoundLevel from "react-native-sound-level";

export const DecibelMonitor = () => {
  const theme = useTheme();
  const [isRecording, setIsRecording] = useState(false);
  const [decibels, setDecibels] = useState(-160);
  const startedRef = useRef(false);

  useEffect(() => {
    RNSoundLevel.onNewFrame = (data) => {
      setDecibels(data.value);
    };

    return () => {
      if (!startedRef.current) return;
      try {
        RNSoundLevel.stop();
      } catch {
        // no-op: stop() can throw if the native recorder was never started
      } finally {
        startedRef.current = false;
      }
    };
  }, []);

  const requestMicrophonePermission = async () => {
    if (Platform.OS === "android") {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      );
      return result === PermissionsAndroid.RESULTS.GRANTED;
    }
    // iOS permission is requested when the sound-level monitor starts.
    return true;
  };
  const startMeter = async () => {
    if (startedRef.current) return;

    const permission = await requestMicrophonePermission();
    if (!permission) {
      Alert.alert(
        "Microphone Permission",
        "Please allow microphone access to use the decibel meter.",
      );
      return;
    }

    try {
      // Check every 100ms for a more responsive meter.
      RNSoundLevel.start({ monitorInterval: 100, samplingRate: 16000 });
      startedRef.current = true;
      setIsRecording(true);
    } catch (error) {
      console.error("Could not start sound level:", error);
      Alert.alert("Microphone Error", "Could not start the microphone.");
    }
  };

  const stopMeter = () => {
    if (!startedRef.current) {
      setIsRecording(false);
      return;
    }

    try {
      RNSoundLevel.stop();
    } catch (error) {
      console.warn("Sound level stop ignored:", error);
    } finally {
      startedRef.current = false;
      setIsRecording(false);
      setDecibels(-160);
    }
  };

  const toggleMeter = () => {
    if (isRecording) {
      stopMeter();
    } else {
      startMeter();
    }
  };
  // Convert -160...0 dBFS to a convenient 0...120 display.
  const displayDb = Math.max(0, Math.min(120, Math.round(decibels + 120)));
  const meterWidth = `${Math.min((displayDb / 120) * 100, 100)}%`;
  return (
    <View style={[styles.container, { backgroundColor: theme["background"] }]}>
      <Text style={[styles.title, { color: theme["text"] }]}>
        Decibel Meter
      </Text>

      <Text style={[styles.decibel, { color: theme["text"] }]}>
        {displayDb}
      </Text>

      <Text style={[styles.unit, { color: theme["text"] }]}>dB</Text>

      <View style={styles.meterBackground}>
        <View style={[styles.meterFill, { width: meterWidth }]} />
      </View>

      <Text style={[styles.status, { color: theme["text"] }]}>
        {isRecording ? "Listening..." : "Stopped"}
      </Text>

      <Pressable
        onPress={toggleMeter}
        style={[
          styles.button,
          { backgroundColor: isRecording ? "#E53935" : "#2196F3" },
        ]}
      >
        <Text style={styles.buttonText}>{isRecording ? "Stop" : "Start"}</Text>
      </Pressable>
    </View>
  );
};

export default DecibelMonitor;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: { fontSize: 24, fontWeight: "600", marginBottom: 25 },
  decibel: { fontSize: 90, fontWeight: "bold" },
  unit: { fontSize: 24, marginBottom: 35 },
  meterBackground: {
    width: "90%",
    height: 14,
    borderRadius: 7,
    backgroundColor: "#444",
    overflow: "hidden",
    marginBottom: 20,
  },
  meterFill: { height: "100%", borderRadius: 7, backgroundColor: "#4CAF50" },
  status: { fontSize: 16, marginBottom: 30 },
  button: {
    width: 160,
    height: 55,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
});
