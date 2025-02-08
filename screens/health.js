import { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

export default function Health({ route }) {
  const { token } = route.params;
  const [heartRates, setHeartRates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHealthData();
  }, []);

  const fetchHealthData = async () => {
    try {
      const response = await fetch("https://www.strava.com/api/v3/athlete/activities", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      // Extract heart rate data
      const heartRateData = data
        .slice(0, 5) // Get last 5 activities
        .map((activity) => activity.average_heartrate || 0);

      setHeartRates(heartRateData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching health data:", error);
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-100 p-4">
      <Text className="text-xl font-bold text-center mb-4">Health Stats</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <>
          <View className="bg-white p-4 rounded-lg shadow mb-4">
            <Text className="text-lg font-semibold">Recent Heart Rate Data</Text>
            <Text>Avg Heart Rate: {heartRates.length > 0 ? `${heartRates[0]} bpm` : "N/A"}</Text>
          </View>

          <Text className="text-lg font-semibold mb-2">Heart Rate Trends</Text>
          <LineChart
            data={{
              labels: ["1", "2", "3", "4", "5"],
              datasets: [{ data: heartRates }],
            }}
            width={Dimensions.get("window").width - 40}
            height={200}
            yAxisSuffix=" bpm"
            chartConfig={{
              backgroundColor: "#fff",
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(75, 192, 192, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            style={{ borderRadius: 10 }}
          />
        </>
      )}
      </ScrollView>
  )
