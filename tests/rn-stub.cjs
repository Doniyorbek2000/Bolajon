// Testlar uchun: React Native va Expo modullarining bo'sh o'rnini bosuvchi
module.exports = new Proxy(
  { useWindowDimensions: () => ({ width: 400, height: 800 }), Platform: { OS: 'web' }, StyleSheet: { create: (x) => x, flatten: (x) => x } },
  { get: (t, k) => (k in t ? t[k] : () => null) },
);
