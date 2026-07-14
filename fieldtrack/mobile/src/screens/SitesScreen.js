import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator, Alert, FlatList,
  RefreshControl, StyleSheet, Text,
  TouchableOpacity, View,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Button, Card, colors, Muted } from '../components/UI';
import api from '../utils/api';

export default function SitesScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeSession, setActiveSession] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const [sitesRes, sessionRes] = await Promise.all([
        api.get('/sites'),
        api.get('/sessions/active'),
      ]);
      setSites(sitesRes.data.sites || []);
      setActiveSession(sessionRes.data.session || null);
    } catch (err) {
      Alert.alert('Error', 'Could not load your sites. Check your connection.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    // Refresh when returning to this screen from ClockInScreen
    const unsubscribe = navigation.addListener('focus', fetchData);
    return unsubscribe;
  }, [fetchData, navigation]);

  const handleLogout = () => {
    Alert.alert('Log out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log out', style: 'destructive', onPress: logout },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.name?.split(' ')[0]} 👋</Text>
          <Muted>Your assigned job sites</Muted>
        </View>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logout}>Log out</Text>
        </TouchableOpacity>
      </View>

      {/* Active session banner */}
      {activeSession && (
        <TouchableOpacity
          style={styles.activeBanner}
          onPress={() => navigation.navigate('ClockIn', { site: activeSession.site, resuming: true })}
        >
          <Text style={styles.activeBannerText}>
            🟢 Currently clocked in at {activeSession.site?.name}
          </Text>
          <Text style={styles.activeBannerSub}>Tap to open clock-out screen →</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={sites}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); fetchData(); }}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <Card style={styles.empty}>
            <Text style={{ color: colors.textMuted, textAlign: 'center' }}>
              No sites assigned yet. Ask your manager to assign you to a site.
            </Text>
          </Card>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('ClockIn', { site: item })}
            activeOpacity={0.75}
          >
            <Card style={styles.siteCard}>
              <View style={styles.siteRow}>
                <View style={styles.siteIcon}>
                  <Text style={{ fontSize: 20 }}>🏗</Text>
                </View>
                <View style={styles.siteInfo}>
                  <Text style={styles.siteName}>{item.name}</Text>
                  <Muted>{item.address || 'No address'}</Muted>
                  {item.areaSqMeters ? (
                    <Muted style={{ marginTop: 2 }}>
                      {(item.areaSqMeters / 10000).toFixed(2)} ha geofenced area
                    </Muted>
                  ) : null}
                </View>
                <Text style={{ color: colors.textMuted, fontSize: 20 }}>›</Text>
              </View>
            </Card>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  greeting: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 2 },
  logout: { color: colors.primary, fontWeight: '600' },
  activeBanner: {
    backgroundColor: '#14532d',
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
    margin: 16,
    marginBottom: 0,
    padding: 14,
    borderRadius: 10,
  },
  activeBannerText: { color: colors.success, fontWeight: '700', fontSize: 14 },
  activeBannerSub: { color: '#86efac', fontSize: 12, marginTop: 4 },
  list: { padding: 16, gap: 12 },
  siteCard: { marginBottom: 0 },
  siteRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  siteIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: colors.surface2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  siteInfo: { flex: 1 },
  siteName: { color: colors.text, fontWeight: '700', fontSize: 15, marginBottom: 3 },
  empty: { alignItems: 'center', padding: 32 },
});