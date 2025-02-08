import { useState, useEffect } from "react";
import { View, Text, Button, ActivityIndicator, StyleSheet } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createClient } from "@supabase/supabase-js";
import Dashboard from "./screens/dashboard.js";
import Profile from "./screens/profile.js";
// import DeviceActivityScreen from './screens/DeviceActivityScreen';

WebBrowser.maybeCompleteAuthSession();

const Stack = createStackNavigator();

// ✅ Supabase Setup
const SUPABASE_URL = "https://giuzfwdleogsfpsnphgs.supabase.co"; // Replace with your Supabase project URL
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpdXpmd2RsZW9nc2Zwc25waGdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg5Mzc3MzMsImV4cCI6MjA1NDUxMzczM30.EIAv7aIeILgv-9AVGA1jff_aM4stJ8nYCTwOghvfv_M"; // Replace with your Supabase anon key
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const CLIENT_ID = "147295";
const CLIENT_SECRET = "94886c1fcad9333d1e7383c1d02fcb42d26dfbb0";

// 2. Generate the correct redirect URI dynamically using AuthSession.makeRedirectUri()
// If you're testing with Expo Go, useProxy should be set to true.
// For a standalone app, you can define a custom scheme in your app config (e.g., "myapp").
// Example for Expo Go:
const redirectUri = AuthSession.makeRedirectUri({
  useProxy: true,
  // For standalone apps, uncomment the line below and set your custom scheme:
  // scheme: "myapp",
});

function HomeScreen({ navigation }) {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  const discovery = {
    authorizationEndpoint: "https://www.strava.com/oauth/authorize",
    tokenEndpoint: "https://www.strava.com/oauth/token",
  };

  // Use `useAuthRequest` with the dynamically generated redirectUri
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: CLIENT_ID,
      scopes: ["activity:read_all"],
      redirectUri, // now using the dynamically generated URI
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === "success" && response.params.code) {
      fetchToken(response.params.code);
    }
  }, [response]);

  const fetchToken = async (code) => {
    setLoading(true);
    try {
      const response = await fetch(discovery.tokenEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          code,
          grant_type: "authorization_code",
        }),
      });

      const data = await response.json();
      if (data.access_token) {
        setToken(data.access_token);
        await storeUserInSupabase(data);
        navigation.navigate("Dashboard", { token: data.access_token });
console.log(data.access_token);
      }
    } catch (error) {
      console.error("Error fetching token:", error);
    } finally {
      setLoading(false);
    }
  };

  // Store user info in Supabase
  const storeUserInSupabase = async (userData) => {
    const { data, error } = await supabase.from("users").upsert([
      {
        strava_id: userData.athlete.id,
        username: userData.athlete.username,
        first_name: userData.athlete.firstname,
        last_name: userData.athlete.lastname,
        profile: userData.athlete.profile,
        access_token: userData.access_token,
        refresh_token: userData.refresh_token,
      },
    ]);

    if (error) console.error("Error saving user:", error);
    else console.log("User saved:", data);
  };
  return (
    <View className="flex-1 items-center justify-center bg-white p-4">
      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : token ? (
        <View className="mb-4">
        <Text className="text-xl font-bold">Authenticated!</Text>
        
        <Button
          title="Dashboard"
          onPress={() => navigation.navigate("Dashboard", { token })}
          />
      </View>
          
      ) : (
        <>
          <Text className="text-lg mb-4" style={styles.button}>Sign in with Strava</Text>
          <Button title="Login" className="mx-2"  onPress={() => promptAsync()} />
        </>
      )}
    </View>
  );
}




export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Dashboard" component={Dashboard} />
    <Stack.Screen name="Profile" component={Profile} />
    {/* <Stack.Screen name="DeviceActivity" component={DeviceActivityScreen} /> */}
  </Stack.Navigator>
    </NavigationContainer>
  );
}
