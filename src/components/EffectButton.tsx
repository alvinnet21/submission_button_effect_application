import React, { useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export type EffectType = 'pop' | 'spin' | 'shake' | 'pulse' | 'bounce' | 'flip';

type Props = {
  effect: EffectType;
  label: string;
  /** Two (or more) colors for the button's gradient fill. */
  gradient: string[];
  /** Color of the outer glow. */
  glow: string;
  /** Square side length in px (computed by the screen for responsiveness). */
  size: number;
};

const DURATION: Record<EffectType, number> = {
  pop: 350,
  spin: 600,
  shake: 400,
  pulse: 500,
  bounce: 550,
  flip: 650,
};

const EASING: Record<EffectType, (value: number) => number> = {
  pop: Easing.out(Easing.quad),
  spin: Easing.inOut(Easing.ease),
  shake: Easing.linear,
  pulse: Easing.inOut(Easing.ease),
  bounce: Easing.out(Easing.quad),
  flip: Easing.inOut(Easing.ease),
};

/**
 * Maps an effect to an animated transform/opacity style.
 * Every effect only touches `transform` / `opacity`, so it can run on the
 * native (UI) thread via `useNativeDriver: true` — no JS-thread work per frame,
 * hence no lag even if several buttons animate at once.
 */
function getAnimatedStyle(effect: EffectType, anim: Animated.Value) {
  switch (effect) {
    case 'pop':
      return {
        transform: [
          { scale: anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 1.3, 1] }) },
        ],
      };
    case 'spin':
      return {
        transform: [
          { rotate: anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) },
        ],
      };
    case 'shake':
      return {
        transform: [
          {
            translateX: anim.interpolate({
              inputRange: [0, 0.25, 0.5, 0.75, 1],
              outputRange: [0, -12, 12, -12, 0],
            }),
          },
        ],
      };
    case 'pulse':
      return {
        opacity: anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 0.25, 1] }),
        transform: [
          { scale: anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 0.9, 1] }) },
        ],
      };
    case 'bounce':
      return {
        transform: [
          {
            translateY: anim.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0, -30, 0],
            }),
          },
        ],
      };
    case 'flip':
      return {
        transform: [
          { perspective: 800 },
          { rotateY: anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) },
        ],
      };
  }
}

/**
 * A single tappable button with a gradient fill and a colored glow that plays
 * its own distinct visual effect on press. Memoized + self-contained animated
 * value → pressing one button never re-renders or animates the others.
 */
export const EffectButton = React.memo(function EffectButton({
  effect,
  label,
  gradient,
  glow,
  size,
}: Props) {
  const anim = useRef(new Animated.Value(0)).current;

  const play = () => {
    anim.setValue(0);
    Animated.timing(anim, {
      toValue: 1,
      duration: DURATION[effect],
      easing: EASING[effect],
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={[
        styles.wrapper,
        { width: size, height: size, shadowColor: glow },
        getAnimatedStyle(effect, anim),
      ]}
    >
      <Pressable
        onPress={play}
        style={styles.pressable}
        accessibilityRole="button"
        accessibilityLabel={`${label} effect`}
      >
        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.button}
        >
          <Text style={styles.label}>{label}</Text>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 20,
    // Colored glow (shadowColor is set per-button above).
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 16,
    elevation: 16, // Android 9+ tints the elevation shadow with shadowColor.
  },
  pressable: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  button: {
    flex: 1,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
