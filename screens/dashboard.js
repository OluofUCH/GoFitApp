import { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

export default function Dashboard({ route }) {
  const { token } = route.params;
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await fetch("https://www.strava.com/api/v3/athlete/activities", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setActivities(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching activities:", error);
      setLoading(false);
    }
  };

  // Prepare data for charts
  const distanceData = activities.slice(0, 5).map((activity) => (activity.distance / 1000).toFixed(2));
  const heartRateData = activities
    .slice(0, 5)
    .map((activity) => activity.average_heartrate || 0);

  return (
    <ScrollView className="flex-1 bg-gray-100 p-4">
      <Text className="text-xl font-bold text-center mb-4">Your Activities</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <>
          {/* Distance Chart */}
          <Text className="text-lg font-semibold mb-2">Distance Over Time (km)</Text>
          <LineChart
            data={{
              labels: ["1", "2", "3", "4", "5"],
              datasets: [{ data: distanceData.map(Number) }],
            }}
            width={Dimensions.get("window").width - 40}
            height={200}
            yAxisSuffix=" km"
            chartConfig={{
              backgroundColor: "#fff",
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            style={{ marginBottom: 20, borderRadius: 10 }}
          />

          {/* Heart Rate Chart */}
          <Text className="text-lg font-semibold mb-2">Heart Rate Trends</Text>
          <LineChart
            data={{
              labels: ["1", "2", "3", "4", "5"],
              datasets: [{ data: heartRateData.map(Number) }],
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
  );
}
