import { useEffect, useRef, useState } from 'react';
import {
  Alert, ScrollView, StyleSheet, Text, View,
} from 'react-native';
import * as Location from 'expo-location';
import api from '../utils/api';
import { Button, Card, colors, Muted } from '../components/UI';

// How often (ms) we ping the server with the worker's location while clocked in.
const PING_INTERVAL_MS = 30_000; // 30 seconds

export default function ClockInScreen({ route, navigation }) {
  const { site, resuming = false } = route.params;

  const [status, setStatus] = useState(resuming ? 'active' : 'idle');
  // idle → getting_location → checking → active → clocking_out
  const [currentLocation, setCurrentLocation] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [clockInTime, setClockInTime] = useState(null);
  const [elapsed, setElapsed] = useState('00:00:00');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const pingIntervalRef = useRef(null);
  const elapsedIntervalRef = useRef(null);

  // ── On mount: restore active session if we came from the banner ──
  useEffect(() => {
    if (resuming) {
      // Fetch the active session to get the real clock-in time
      api.get('/sessions/active').then(({ data }) => {
        if (data.session) {
          setSessionId(data.session._id);
          setClockInTime(new Date(data.session.clockIn));
        }
      });
    }
    return () => {
      clearInterval(pingIntervalRef.current);
      clearInterval(elapsedIntervalRef.current);
    };
  }, []);

  // ── Elapsed timer while active ────────────────────────────────────
  useEffect(() => {
    if (status === 'active' && clockInTime) {
      elapsedIntervalRef.current = setInterval(() => {
        const diff = Math.floor((Date.now() - clockInTime.getTime()) / 1000);
        const h = String(Math.floor(diff / 3600)).padStart(2, '0');
        const m = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
        const s = String(diff % 60).padStart(2, '0');
        setElapsed(`${h}:${m}:${s}`);
      }, 1000);
    } else {
      clearInterval(elapsedIntervalRef.current);
      setElapsed('00:00:00');
    }
    return () => clearInterval(elapsedIntervalRef.current);
  }, [status, clockInTime]);

  // ── Location pinger while active ──────────────────────────────────
  useEffect(() => {
    if (status === 'active') {
      pingIntervalRef.current = setInterval(async () => {
        try {
          const pos = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          await api.post('/sessions/location', {
            longitude: pos.coords.longitude,
            latitude: pos.coords.latitude,
            accuracy: pos.coords.accuracy,
          });
        } catch (_) {
          // Silent fail — a missed ping is not worth alarming the worker.
          // The next ping in 30s will try again.
        }
      }, PING_INTERVAL_MS);
    } else {
      clearInterval(pingIntervalRef.current);
    }
    return () => clearInterval(pingIntervalRef.current);
  }, [status]);

  // ── Clock In flow ─────────────────────────────────────────────────
  const handleClockIn = async () => {
    setLoading(true);
    setMessage('');

    try {
      // 1. Ask for location permission
      setStatus('getting_location');
      const { status: permStatus } = await Location.requestForegroundPermissionsAsync();
      if (permStatus !== 'granted') {
        Alert.alert(
          'Location permission denied',
          'FieldTrack needs your location to verify you are on-site. Please enable it in Settings.'
        );
        setStatus('idle');
        setLoading(false);
        return;
      }

      // 2. Get current GPS position
      setMessage('Getting your location…');
      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setCurrentLocation(pos.coords);

      // 3. Send clock-in request — server does the geofence check
      setStatus('checking');
      setMessage('Verifying you are within the geofence…');

      const { data } = await api.post('/sessions/clock-in', {
        siteId: site._id,
        longitude: pos.coords.longitude,
        latitude: pos.coords.latitude,
        accuracy: pos.coords.accuracy,
      });

      // 4. Clocked in successfully
      setSessionId(data.session._id);
      setClockInTime(new Date(data.session.clockIn));
      setStatus('active');
      setMessage('');
    } catch (err) {
      const serverMsg = err.response?.data?.message;
      const isOutside = err.response?.data?.outsideFence;

      if (isOutside) {
        Alert.alert(
          '📍 Outside geofence',
          'You are not within the job site boundary. Please move to the site and try again.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Clock-in failed', serverMsg || 'Please try again.');
      }
      setStatus('idle');
      setMessage('');
    } finally {
      setLoading(false);
    }
  };

  // ── Clock Out flow ────────────────────────────────────────────────
  const handleClockOut = async () => {
    Alert.alert('Clock out', 'Are you sure you want to clock out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clock out',
        style: 'destructive',
        onPress: async () => {
          setLoading(true);
          setStatus('clocking_out');
          try {
            const { data } = await api.post('/sessions/clock-out');
            const mins = data.session.durationMinutes || 0;
            Alert.alert(
              '✅ Clocked out',
              `Session recorded: ${Math.floor(mins / 60)}h ${mins % 60}m`,
              [{ text: 'OK', onPress: () => navigation.goBack() }]
            );
          } catch (err) {
            Alert.alert('Error', err.response?.data?.message || 'Failed to clock out.');
            setStatus('active');
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Site info */}
      <Card style={styles.siteCard}>
        <Text style={styles.siteLabel}>Job Site</Text>
        <Text style={styles.siteName}>{site.name}</Text>
        {site.address ? <Muted style={{ marginTop: 4 }}>{site.address}</Muted> : null}
      </Card>

      {/* Status card */}
      <Card style={[styles.statusCard, status === 'active' && styles.statusCardActive]}>
        {status === 'idle' && (
          <>
            <Text style={styles.statusIcon}>⏱</Text>
            <Text style={styles.statusTitle}>Ready to clock in</Text>
            <Muted style={{ textAlign: 'center', marginTop: 8 }}>
              Make sure you are physically on-site. Your GPS location will be verified against the geofence.
            </Muted>
          </>
        )}

        {(status === 'getting_location' || status === 'checking') && (
          <>
            <Text style={styles.statusIcon}>📡</Text>
            <Text style={styles.statusTitle}>{message || 'Please wait…'}</Text>
          </>
        )}

        {status === 'active' && (
          <>
            <Text style={styles.statusIcon}>🟢</Text>
            <Text style={styles.statusTitle}>Clocked In</Text>
            <Text style={styles.elapsed}>{elapsed}</Text>
            <Muted style={{ textAlign: 'center', marginTop: 8 }}>
              Location is being tracked. Pinging server every 30 seconds.
            </Muted>
          </>
        )}

        {status === 'clocking_out' && (
          <>
            <Text style={styles.statusIcon}>⏳</Text>
            <Text style={styles.statusTitle}>Clocking out…</Text>
          </>
        )}
      </Card>

      {/* GPS accuracy indicator (shown while idle/active) */}
      {currentLocation && (
        <Muted style={{ textAlign: 'center' }}>
          GPS accuracy: ±{Math.round(currentLocation.accuracy || 0)}m
        </Muted>
      )}

      {/* Actions */}
      <View style={styles.actions}>
        {(status === 'idle' || status === 'getting_location' || status === 'checking') && (
          <Button
            title="Clock In"
            onPress={handleClockIn}
            loading={loading}
            disabled={status !== 'idle'}
          />
        )}
        {status === 'active' && (
          <Button
            title="Clock Out"
            onPress={handleClockOut}
            variant="danger"
            loading={loading}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, gap: 16 },
  siteCard: {},
  siteLabel: { color: colors.textMuted, fontSize: 12, fontWeight: '600', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.8 },
  siteName: { color: colors.text, fontSize: 20, fontWeight: '800' },
  statusCard: {
    alignItems: 'center',
    padding: 28,
    gap: 8,
  },
  statusCardActive: {
    borderColor: colors.success,
    borderWidth: 1,
  },
  statusIcon: { fontSize: 40, marginBottom: 8 },
  statusTitle: { color: colors.text, fontSize: 18, fontWeight: '700', textAlign: 'center' },
  elapsed: {
    color: colors.success,
    fontSize: 36,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
    marginTop: 8,
  },
  actions: { marginTop: 8 },
});