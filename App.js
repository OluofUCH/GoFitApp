import { useState } from "react";
import { View, Text, Button } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Dashboard from "./screens/Dashboard";

WebBrowser.maybeCompleteAuthSession();

const Stack = createStackNavigator();

const CLIENT_ID = "147295";
const CLIENT_SECRET = "94886c1fcad9333d1e7383c1d02fcb42d26dfbb0";
const REDIRECT_URI = "exp://localhost:19000";

function HomeScreen({ navigation }) {
  const [token, setToken] = useState(null);

  const discovery = {
    authorizationEndpoint: "https://www.strava.com/oauth/authorize",
    tokenEndpoint: "https://www.strava.com/oauth/token",
  };

  const loginWithStrava = async () => {
    const authUrl = `${discovery.authorizationEndpoint}?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&approval_prompt=auto&scope=activity:read_all`;

    const result = await AuthSession.startAsync({ authUrl });

    if (result.type === "success" && result.params.code) {
      fetchToken(result.params.code);
    }
  };

  const fetchToken = async (code) => {
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
    setToken(data.access_token);
    navigation.navigate("Dashboard", { token: data.access_token });
  };

  return (
    <View className="flex-1 items-center justify-center bg-white p-4">
      {token ? (
        <Text className="text-xl font-bold">Authenticated!</Text>
      ) : (
        <>
          <Text className="text-lg mb-4">Sign in with Strava</Text>
          <Button title="Login" onPress={loginWithStrava} />
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
        <Stack.Screen name="Dashboard" component={Dashboard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
