import { useEffect, useState } from "react";
import { View, Text, Image, ActivityIndicator, ScrollView } from "react-native";

export default function Profile({ route }) {
  const { token } = route.params;
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch("https://www.strava.com/api/v3/athlete", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setProfile(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-100 p-4">
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <View className="items-center">
          <Image source={{ uri: profile.profile }} className="w-24 h-24 rounded-full mb-4" />
          <Text className="text-xl font-bold">{profile.firstname} {profile.lastname}</Text>
          <Text className="text-lg text-gray-600">{profile.email}</Text>

          <View className="mt-4 bg-white p-4 rounded-lg shadow">
            <Text className="text-lg font-semibold">Details</Text>
            <Text>Age: {profile.age}</Text>
            <Text>Height: {profile.height ? `${profile.height} cm` : "N/A"}</Text>
            <Text>Weight: {profile.weight ? `${profile.weight} kg` : "N/A"}</Text>
            <Text>Country: {profile.country || "Unknown"}</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}
