import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Card } from '../../components/ui/Card';
import { useData } from '../../contexts/DataContext';
import { useTheme } from '../../contexts/ThemeContext';

export default function HomeScreen() {
  const { colors } = useTheme();
  const { tenants, payments, rooms, complaints } = useData();
  const router = useRouter();

  // Statistics
  const stats = {
    totalRooms: rooms.length,
    occupiedRooms: rooms.filter(r => r.status === 'occupied').length,
    totalTenants: tenants.length,
    activeTenants: tenants.filter(t => t.status === 'active').length,
    totalRevenue: payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0),
    pendingPayments: payments.filter(p => p.status === 'pending').length,
    overduePayments: payments.filter(p => p.status === 'overdue').length,
    openComplaints: complaints.filter(c => c.status === 'open').length,
    occupancyRate: rooms.length > 0 ? (rooms.filter(r => r.status === 'occupied').length / rooms.length) * 100 : 0,
  };

  const mainCards = [
    {
      title: 'Rooms',
      value: `${stats.occupiedRooms}/${stats.totalRooms}`,
      subtitle: 'Occupied',
      icon: 'bed-outline',
    },
    {
      title: 'Revenue',
      value: `₹${(stats.totalRevenue / 1000).toFixed(0)}K`,
      subtitle: 'This month',
      icon: 'cash-outline',
    },
    {
      title: 'Tenants',
      value: stats.activeTenants,
      subtitle: 'Active',
      icon: 'people-outline',
    },
    {
      title: 'Issues',
      value: stats.openComplaints,
      subtitle: 'Open',
      icon: 'alert-circle-outline',
    },
  ];

  const quickActions = [
    { title: 'Add Tenant', icon: 'person-add-outline', route: '/tenants/add' },
    { title: 'Collect Rent', icon: 'card-outline', route: '/payments/add' },
    { title: 'Add Room', icon: 'home-outline', route: '/rooms/add' },
    { title: 'Reports', icon: 'analytics-outline', route: '/reports' },
  ];

  const recentActivities = [
    ...tenants.slice(-3).map(t => ({
      id: t.id,
      title: `${t.name} joined`,
      subtitle: `Room ${t.roomNumber}`,
      time: new Date(t.joinDate).toLocaleDateString(),
      icon: 'person-add',
      color: colors.success,
    })),
    ...payments.filter(p => p.status === 'paid').slice(-2).map(p => ({
      id: p.id,
      title: `Payment received`,
      subtitle: `${p.tenantName} - ₹${p.amount}`,
      time: new Date(p.paidDate || p.dueDate).toLocaleDateString(),
      icon: 'checkmark-circle',
      color: colors.primary,
    })),
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5);

  const alerts = [
    ...payments.filter(p => p.status === 'overdue').map(p => ({
      id: p.id,
      title: 'Payment Overdue',
      message: `${p.tenantName} - ₹${p.amount}`,
      type: 'error',
      priority: 'high',
    })),
    ...complaints.filter(c => c.status === 'open' && c.priority === 'high').map(c => ({
      id: c.id,
      title: 'Urgent Complaint',
      message: `${c.title} - ${c.tenantName}`,
      type: 'warning',
      priority: 'high',
    })),
  ].slice(0, 3);

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Clean Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Dashboard</Text>
          <Text style={[styles.dateText, { color: colors.textSecondary }]}>
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Text>
        </View>
      </View>

      {/* Stats Cards - 2x2 Grid */}
      <View style={styles.statsSection}>
        <View style={styles.statsRow}>
          {mainCards.slice(0, 2).map((card, index) => (
            <View key={index} style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Ionicons name={card.icon as any} size={24} color={colors.textSecondary} />
              <Text style={[styles.statValue, { color: colors.text }]}>{card.value}</Text>
              <Text style={[styles.statTitle, { color: colors.textSecondary }]}>{card.title}</Text>
              <Text style={[styles.statSubtitle, { color: colors.textSecondary }]}>{card.subtitle}</Text>
            </View>
          ))}
        </View>
        <View style={styles.statsRow}>
          {mainCards.slice(2, 4).map((card, index) => (
            <View key={index + 2} style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Ionicons name={card.icon as any} size={24} color={colors.textSecondary} />
              <Text style={[styles.statValue, { color: colors.text }]}>{card.value}</Text>
              <Text style={[styles.statTitle, { color: colors.textSecondary }]}>{card.title}</Text>
              <Text style={[styles.statSubtitle, { color: colors.textSecondary }]}>{card.subtitle}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.actionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={() => router.push(action.route as any)}
            >
              <Ionicons name={action.icon as any} size={20} color={colors.textSecondary} />
              <Text style={[styles.actionText, { color: colors.text }]}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recent Activity */}
      {recentActivities.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Activity</Text>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {recentActivities.slice(0, 3).map((activity, index) => (
              <View key={activity.id} style={[styles.activityItem, index < 2 && { borderBottomColor: colors.border, borderBottomWidth: 1 }]}>
                <View style={styles.activityContent}>
                  <Text style={[styles.activityTitle, { color: colors.text }]}>{activity.title}</Text>
                  <Text style={[styles.activitySubtitle, { color: colors.textSecondary }]}>{activity.subtitle}</Text>
                </View>
                <Text style={[styles.activityTime, { color: colors.textSecondary }]}>{activity.time}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Alerts */}
      {alerts.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Alerts</Text>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {alerts.map((alert, index) => (
              <View key={alert.id} style={[styles.alertItem, index < alerts.length - 1 && { borderBottomColor: colors.border, borderBottomWidth: 1 }]}>
                <View style={styles.alertContent}>
                  <Text style={[styles.alertTitle, { color: colors.text }]}>{alert.title}</Text>
                  <Text style={[styles.alertMessage, { color: colors.textSecondary }]}>{alert.message}</Text>
                </View>
                <Ionicons 
                  name={alert.type === 'error' ? 'alert-circle-outline' : 'warning-outline'} 
                  size={20} 
                  color={alert.type === 'error' ? colors.error : colors.warning} 
                />
              </View>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  // Clean Header
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    gap: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '600',
  },
  dateText: {
    fontSize: 14,
  },
  
  // Stats Section
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    gap: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '600',
  },
  statTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  statSubtitle: {
    fontSize: 12,
  },
  
  // Sections
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  actionsSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  
  // Actions Grid
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  
  // Cards
  card: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
  },
  
  // Activity Items
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  activitySubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  activityTime: {
    fontSize: 11,
  },
  
  // Alert Items
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  alertMessage: {
    fontSize: 12,
    marginTop: 2,
  },
});
