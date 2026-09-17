import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const colors = {
  bg: '#0f1117',
  surface: '#1a1d27',
  surface2: '#22263a',
  border: '#2e3248',
  primary: '#6366f1',
  primaryDark: '#4f52cc',
  success: '#22c55e',
  danger: '#ef4444',
  warning: '#f59e0b',
  text: '#f0f2ff',
  textMuted: '#8b90b0',
};

export function Button({ title, onPress, variant = 'primary', loading = false, disabled = false, style }) {
  const bg =
    variant === 'primary' ? colors.primary :
    variant === 'success' ? colors.success :
    variant === 'danger'  ? colors.danger  :
    colors.surface2;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[styles.btn, { backgroundColor: bg, opacity: disabled || loading ? 0.6 : 1 }, style]}
      activeOpacity={0.8}
    >
      {loading
        ? <ActivityIndicator color="#fff" />
        : <Text style={styles.btnText}>{title}</Text>}
    </TouchableOpacity>
  );
}

export function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Label({ children, style }) {
  return <Text style={[styles.label, style]}>{children}</Text>;
}

export function Muted({ children, style }) {
  return <Text style={[styles.muted, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  btn: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  muted: {
    color: colors.textMuted,
    fontSize: 13,
  },
});