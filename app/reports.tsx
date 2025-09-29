import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useTheme } from '../contexts/ThemeContext';
import { useData } from '../contexts/DataContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const { width } = Dimensions.get('window');

export default function ReportsScreen() {
  const { colors } = useTheme();
  const { tenants, payments, rooms, complaints } = useData();
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  // Calculate statistics
  const stats = {
    totalRevenue: payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0),
    pendingRevenue: payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0),
    overdueRevenue: payments.filter(p => p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0),
    occupancyRate: rooms.length > 0 ? (rooms.filter(r => r.status === 'occupied').length / rooms.length) * 100 : 0,
    avgRent: rooms.length > 0 ? rooms.reduce((sum, r) => sum + r.rent, 0) / rooms.length : 0,
    totalDeposits: tenants.reduce((sum, t) => sum + t.deposit, 0),
    activeComplaints: complaints.filter(c => c.status === 'open').length,
    resolvedComplaints: complaints.filter(c => c.status === 'resolved').length,
  };

  const revenueData = [
    { label: 'Collected', value: stats.totalRevenue, color: colors.success, icon: 'checkmark-circle' },
    { label: 'Pending', value: stats.pendingRevenue, color: colors.warning, icon: 'time' },
    { label: 'Overdue', value: stats.overdueRevenue, color: colors.error, icon: 'alert-circle' },
  ];

  const occupancyData = [
    { label: 'Occupied', value: rooms.filter(r => r.status === 'occupied').length, color: colors.success },
    { label: 'Vacant', value: rooms.filter(r => r.status === 'vacant').length, color: colors.info },
    { label: 'Maintenance', value: rooms.filter(r => r.status === 'maintenance').length, color: colors.warning },
  ];

  const paymentTypeBreakdown = [
    { type: 'Rent', amount: payments.filter(p => p.type === 'rent' && p.status === 'paid').reduce((sum, p) => sum + p.amount, 0) },
    { type: 'Deposit', amount: payments.filter(p => p.type === 'deposit' && p.status === 'paid').reduce((sum, p) => sum + p.amount, 0) },
    { type: 'Maintenance', amount: payments.filter(p => p.type === 'maintenance' && p.status === 'paid').reduce((sum, p) => sum + p.amount, 0) },
    { type: 'Other', amount: payments.filter(p => p.type === 'other' && p.status === 'paid').reduce((sum, p) => sum + p.amount, 0) },
  ];

  const periods = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: '#FFFFFF' }]}>Reports & Analytics</Text>
          <Text style={[styles.headerSubtitle, { color: '#FFFFFF' }]}>
            Business insights and statistics
          </Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Period Selection */}
        <Card style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Time Period</Text>
          <View style={styles.periodContainer}>
            {periods.map((period) => (
              <TouchableOpacity
                key={period.value}
                style={[
                  styles.periodButton,
                  {
                    backgroundColor: selectedPeriod === period.value ? colors.primary : colors.surface,
                    borderColor: colors.border,
                  }
                ]}
                onPress={() => setSelectedPeriod(period.value as any)}
              >
                <Text style={[
                  styles.periodText,
                  {
                    color: selectedPeriod === period.value ? '#FFFFFF' : colors.text,
                  }
                ]}>
                  {period.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Revenue Overview */}
        <Card style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Revenue Overview</Text>
          <View style={styles.revenueGrid}>
            {revenueData.map((item, index) => (
              <View key={index} style={styles.revenueItem}>
                <View style={[styles.revenueIcon, { backgroundColor: `${item.color}15` }]}>
                  <Ionicons name={item.icon as any} size={24} color={item.color} />
                </View>
                <Text style={[styles.revenueAmount, { color: colors.text }]}>
                  ₹{item.value.toLocaleString()}
                </Text>
                <Text style={[styles.revenueLabel, { color: colors.textSecondary }]}>
                  {item.label}
                </Text>
              </View>
            ))}
          </View>
          
          <View style={styles.totalRevenue}>
            <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>Total Revenue</Text>
            <Text style={[styles.totalAmount, { color: colors.primary }]}>
              ₹{(stats.totalRevenue + stats.pendingRevenue + stats.overdueRevenue).toLocaleString()}
            </Text>
          </View>
        </Card>

        {/* Occupancy Statistics */}
        <Card style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Occupancy Statistics</Text>
          
          <View style={styles.occupancyHeader}>
            <Text style={[styles.occupancyRate, { color: colors.primary }]}>
              {stats.occupancyRate.toFixed(1)}%
            </Text>
            <Text style={[styles.occupancyLabel, { color: colors.textSecondary }]}>
              Occupancy Rate
            </Text>
          </View>

          <View style={styles.occupancyBreakdown}>
            {occupancyData.map((item, index) => (
              <View key={index} style={styles.occupancyItem}>
                <View style={styles.occupancyInfo}>
                  <View style={[styles.occupancyDot, { backgroundColor: item.color }]} />
                  <Text style={[styles.occupancyItemLabel, { color: colors.text }]}>
                    {item.label}
                  </Text>
                </View>
                <Text style={[styles.occupancyValue, { color: colors.text }]}>
                  {item.value} rooms
                </Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Payment Type Breakdown */}
        <Card style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Payment Breakdown</Text>
          <View style={styles.paymentBreakdown}>
            {paymentTypeBreakdown.map((item, index) => (
              <View key={index} style={styles.paymentItem}>
                <Text style={[styles.paymentType, { color: colors.text }]}>{item.type}</Text>
                <Text style={[styles.paymentAmount, { color: colors.textSecondary }]}>
                  ₹{item.amount.toLocaleString()}
                </Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Key Metrics */}
        <Card style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Key Metrics</Text>
          <View style={styles.metricsGrid}>
            <View style={styles.metricItem}>
              <Text style={[styles.metricValue, { color: colors.primary }]}>
                ₹{stats.avgRent.toLocaleString()}
              </Text>
              <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
                Average Rent
              </Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={[styles.metricValue, { color: colors.success }]}>
                ₹{stats.totalDeposits.toLocaleString()}
              </Text>
              <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
                Total Deposits
              </Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={[styles.metricValue, { color: colors.warning }]}>
                {stats.activeComplaints}
              </Text>
              <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
                Open Complaints
              </Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={[styles.metricValue, { color: colors.info }]}>
                {((stats.resolvedComplaints / (stats.activeComplaints + stats.resolvedComplaints)) * 100 || 0).toFixed(1)}%
              </Text>
              <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
                Resolution Rate
              </Text>
            </View>
          </View>
        </Card>

        {/* Export Options */}
        <Card style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Export Reports</Text>
          <View style={styles.exportButtons}>
            <Button
              title="Export PDF"
              onPress={() => console.log('Export PDF')}
              variant="outline"
              style={styles.exportButton}
            />
            <Button
              title="Export Excel"
              onPress={() => console.log('Export Excel')}
              variant="outline"
              style={styles.exportButton}
            />
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
  },
  backButton: {
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 14,
    opacity: 0.8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  periodContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  periodText: {
    fontSize: 14,
    fontWeight: '500',
  },
  revenueGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  revenueItem: {
    alignItems: 'center',
    flex: 1,
  },
  revenueIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  revenueAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  revenueLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  totalRevenue: {
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  totalLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  occupancyHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  occupancyRate: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  occupancyLabel: {
    fontSize: 14,
    marginTop: 4,
  },
  occupancyBreakdown: {
    gap: 12,
  },
  occupancyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  occupancyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  occupancyDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  occupancyItemLabel: {
    fontSize: 14,
  },
  occupancyValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  paymentBreakdown: {
    gap: 12,
  },
  paymentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentType: {
    fontSize: 14,
    fontWeight: '500',
  },
  paymentAmount: {
    fontSize: 14,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  metricItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 8,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  exportButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  exportButton: {
    flex: 1,
  },
});
