/**
 * Alvin Button Effect Application — root component.
 *
 * @format
 */

import { useState } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AnimatedSplash } from '@/components';
import { HomeScreen } from '@/screens';

function App() {
  const [ready, setReady] = useState(false);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      {ready ? <HomeScreen /> : <AnimatedSplash onFinish={() => setReady(true)} />}
    </SafeAreaProvider>
  );
}

export default App;
