// profile.js
import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, Image, StyleSheet, ScrollView } from "react-native";
import { createClient } from "@supabase/supabase-js";

// ✅ Supabase Setup
const SUPABASE_URL = "https://giuzfwdleogsfpsnphgs.supabase.co"; // Replace with your Supabase project URL
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpdXpmd2RsZW9nc2Zwc25waGdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg5Mzc3MzMsImV4cCI6MjA1NDUxMzczM30.EIAv7aIeILgv-9AVGA1jff_aM4stJ8nYCTwOghvfv_M";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function Profile({ route }) {
  const { token } = route.params; // Expecting the access token to be passed via navigation params
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase
  .from("users")
  .select("strava_id, last_name, profile, access_token, refresh_token")
  .eq("access_token", token)
  .maybeSingle()
  .limit(1);


      if (error) {
        console.error("Error fetching profile:", error);
      } else {
        setProfileData(data);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [token]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (!profileData) {
    return (
      <View style={styles.centered}>
        <Text>Error loading profile data.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {profileData.profile ? (
        <Image source={{ uri: profileData.profile }} style={styles.avatar} />
      ) : null}
      <Text style={styles.name}>
        {profileData.first_name} {profileData.last_name}
      </Text>
      <Text style={styles.username}>@{profileData.username}</Text>
      <Text style={styles.info}>Strava ID: {profileData.strava_id}</Text>
      {/* Add any additional user details you would like to display */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  username: {
    fontSize: 18,
    color: "#888",
    marginBottom: 10,
  },
  info: {
    fontSize: 16,
  },
});
