import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EffectButton, EffectType } from '@/components';

type ButtonSpec = {
  effect: EffectType;
  label: string;
  gradient: string[];
  glow: string;
};

// 6 buttons, each with its own gradient + glow.
const BUTTONS: ButtonSpec[] = [
  { effect: 'pop', label: 'Pop', gradient: ['#f43f5e', '#ff8a5b'], glow: '#f43f5e' },
  { effect: 'spin', label: 'Spin', gradient: ['#f59e0b', '#fbbf24'], glow: '#f59e0b' },
  { effect: 'shake', label: 'Shake', gradient: ['#10b981', '#34d399'], glow: '#10b981' },
  { effect: 'pulse', label: 'Pulse', gradient: ['#3b82f6', '#06b6d4'], glow: '#3b82f6' },
  { effect: 'bounce', label: 'Bounce', gradient: ['#8b5cf6', '#d946ef'], glow: '#8b5cf6' },
  { effect: 'flip', label: 'Flip', gradient: ['#ec4899', '#f472b6'], glow: '#ec4899' },
];

const H_PADDING = 20;
const GAP = 16;
const MAX_BUTTON = 200;

export function HomeScreen() {
  // Recomputes on rotation → layout adapts to portrait/landscape.
  const { width, height } = useWindowDimensions();
  const landscape = width > height;
  const columns = landscape ? 3 : 2;

  const available = width - H_PADDING * 2;
  const size = Math.min((available - GAP * (columns - 1)) / columns, MAX_BUTTON);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Alvin Task Application</Text>
        <Text style={styles.subtitle}>Tap a button to play its effect</Text>

        <View style={styles.grid}>
          {BUTTONS.map(b => (
            <EffectButton
              key={b.effect}
              effect={b.effect}
              label={b.label}
              gradient={b.gradient}
              glow={b.glow}
              size={size}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0b0f',
  },
  content: {
    paddingHorizontal: H_PADDING,
    paddingTop: 8,
    paddingBottom: 32,
  },
  title: {
    color: '#f5f5f7',
    fontSize: 30,
    fontWeight: '800',
  },
  subtitle: {
    color: '#9a9aa5',
    fontSize: 14,
    marginBottom: 28,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: GAP,
  },
});
