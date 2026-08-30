import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';

// Logo bundled with the JS. Alias `@/` resolves to `src/`.
const logo = require('@/assets/alvin.png');

type Props = {
  /** Called once the splash animation finishes. */
  onFinish: () => void;
};

/**
 * Animated splash screen:
 *  1. Logo pops in (fade + scale with a slight overshoot).
 *  2. A soft glow pulses behind it.
 *  3. The whole screen fades out, then `onFinish` reveals the app.
 *
 * Runs entirely on the native driver (opacity/transform only) → smooth, no lag.
 */
export function AnimatedSplash({ onFinish }: Props) {
  const enter = useRef(new Animated.Value(0)).current; // 0 → 1 logo entrance
  const glow = useRef(new Animated.Value(0)).current; // glow pulse
  const screen = useRef(new Animated.Value(1)).current; // whole-screen opacity

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(glow, { toValue: 1, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(glow, { toValue: 0, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    );
    pulse.start();

    Animated.sequence([
      Animated.timing(enter, {
        toValue: 1,
        duration: 900,
        easing: Easing.out(Easing.back(1.6)),
        useNativeDriver: true,
      }),
      Animated.delay(700),
      Animated.timing(screen, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start(() => {
      pulse.stop();
      onFinish();
    });
  }, [enter, glow, screen, onFinish]);

  const scale = enter.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] });
  const glowScale = glow.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1.25] });
  const glowOpacity = glow.interpolate({ inputRange: [0, 1], outputRange: [0.15, 0.45] });

  return (
    <Animated.View style={[styles.container, { opacity: screen }]}>
      <Animated.View
        style={[styles.glow, { opacity: glowOpacity, transform: [{ scale: glowScale }] }]}
      />
      <Animated.Image
        source={logo}
        style={[styles.logo, { opacity: enter, transform: [{ scale }] }]}
        resizeMode="contain"
      />
    </Animated.View>
  );
}

const LOGO = 170;
const GLOW = 260;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0b0b0f',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: GLOW,
    height: GLOW,
    borderRadius: GLOW / 2,
    backgroundColor: '#6366f1',
  },
  logo: {
    width: LOGO,
    height: LOGO,
  },
});
