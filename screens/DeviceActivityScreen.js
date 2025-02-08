// // DeviceActivityScreen.js
// import React, { useEffect, useState } from 'react';
// import { View, Text, ActivityIndicator, Platform, StyleSheet, ScrollView } from 'react-native';
// import DeviceActivity from 'react-native-device-activity';

// export default function DeviceActivityScreen() {
//   const [report, setReport] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     // This functionality is iOS 15+ only
//     if (Platform.OS !== 'ios') {
//       setError('Device activity is only available on iOS 15 and later.');
//       setLoading(false);
//       return;
//     }

//     // Example method call; actual API may differ—check the repository’s README
//     DeviceActivity.getReport()
//       .then((data) => {
//         console.log('Device Activity Report:', data);
//         setReport(data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error('Error fetching device activity:', err);
//         setError(err.message || 'An error occurred.');
//         setLoading(false);
//       });
//   }, []);

//   if (loading) {
//     return (
//       <View style={styles.centered}>
//         <ActivityIndicator size="large" color="#000" />
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.centered}>
//         <Text>Error: {error}</Text>
//       </View>
//     );
//   }

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.title}>Device Activity Report</Text>
//       <Text>{JSON.stringify(report, null, 2)}</Text>
//       {/* You can format and display the report as needed */}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   centered: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   container: {
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
// });
