// babel.config.js
module.exports = {
  presets: [
    ["babel-preset-expo", { jsxImportSource: "nativewind" }]
  ],
  plugins: [
    "nativewind/babel",
    "react-native-reanimated/plugin"
  ]
};
