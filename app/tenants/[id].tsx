import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { useTheme } from '../../contexts/ThemeContext';
import { useData } from '../../contexts/DataContext';

export default function TenantDetailScreen() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { getTenant, payments, complaints, rooms, deleteTenant } = useData();
  
  const tenant = getTenant(id as string);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!tenant) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.errorContainer}>
          <Ionicons name="person-outline" size={48} color={colors.textSecondary} />
          <Text style={[styles.errorTitle, { color: colors.text }]}>Tenant Not Found</Text>
          <Text style={[styles.errorSubtitle, { color: colors.textSecondary }]}>
            The tenant you're looking for doesn't exist.
          </Text>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: colors.primary }]}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Get tenant-related data
  const tenantPayments = payments.filter(p => p.tenantId === tenant.id);
  const tenantComplaints = complaints.filter(c => c.tenantId === tenant.id);
  const tenantRoom = rooms.find(r => r.number === tenant.roomNumber);
  
  // Calculate statistics
  const stats = {
    totalPayments: tenantPayments.length,
    paidPayments: tenantPayments.filter(p => p.status === 'paid').length,
    pendingPayments: tenantPayments.filter(p => p.status === 'pending').length,
    overduePayments: tenantPayments.filter(p => p.status === 'overdue').length,
    totalAmount: tenantPayments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0),
    openComplaints: tenantComplaints.filter(c => c.status === 'open').length,
  };

  const quickActions = [
    { title: 'Edit Details', icon: 'create-outline', action: () => router.push(`/tenants/edit/${tenant.id}` as any) },
    { title: 'Add Payment', icon: 'card-outline', action: () => router.push(`/payments/add?tenantId=${tenant.id}` as any) },
    { title: 'View Room', icon: 'home-outline', action: () => router.push(`/rooms/${tenantRoom?.id}` as any) },
    { title: 'Delete Tenant', icon: 'trash-outline', action: () => handleDeleteTenant(), color: colors.error },
  ];

  const handleDeleteTenant = () => {
    Alert.alert(
      'Delete Tenant',
      `Are you sure you want to delete ${tenant.name}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteTenant(tenant.id);
            router.back();
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Clean Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <TouchableOpacity
              style={styles.backIcon}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back-outline" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.text }]}>{tenant.name}</Text>
            <View style={styles.headerSpacer} />
          </View>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            Room {tenant.roomNumber} • {tenant.status}
          </Text>
        </View>
      </View>

      {/* Stats Cards - 2x2 Grid */}
      <View style={styles.statsSection}>
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name="card-outline" size={24} color={colors.textSecondary} />
            <Text style={[styles.statValue, { color: colors.text }]}>{stats.paidPayments}</Text>
            <Text style={[styles.statTitle, { color: colors.textSecondary }]}>Payments</Text>
            <Text style={[styles.statSubtitle, { color: colors.textSecondary }]}>Completed</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name="cash-outline" size={24} color={colors.textSecondary} />
            <Text style={[styles.statValue, { color: colors.text }]}>₹{(stats.totalAmount / 1000).toFixed(0)}K</Text>
            <Text style={[styles.statTitle, { color: colors.textSecondary }]}>Total Paid</Text>
            <Text style={[styles.statSubtitle, { color: colors.textSecondary }]}>Amount</Text>
          </View>
        </View>
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name="time-outline" size={24} color={colors.textSecondary} />
            <Text style={[styles.statValue, { color: colors.text }]}>{stats.pendingPayments}</Text>
            <Text style={[styles.statTitle, { color: colors.textSecondary }]}>Pending</Text>
            <Text style={[styles.statSubtitle, { color: colors.textSecondary }]}>Payments</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name="alert-circle-outline" size={24} color={colors.textSecondary} />
            <Text style={[styles.statValue, { color: colors.text }]}>{stats.openComplaints}</Text>
            <Text style={[styles.statTitle, { color: colors.textSecondary }]}>Open</Text>
            <Text style={[styles.statSubtitle, { color: colors.textSecondary }]}>Complaints</Text>
          </View>
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
              onPress={action.action}
            >
              <Ionicons 
                name={action.icon as any} 
                size={20} 
                color={action.color || colors.textSecondary} 
              />
              <Text style={[
                styles.actionText, 
                { color: action.color || colors.text }
              ]}>
                {action.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Tenant Information */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Tenant Information</Text>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Email</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>{tenant.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Phone</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>{tenant.phone}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Address</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>{tenant.address}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Emergency Contact</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>{tenant.emergencyContact}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Join Date</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              {new Date(tenant.joinDate).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Deposit</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>₹{tenant.deposit.toLocaleString()}</Text>
          </View>
        </View>
      </View>

      {/* Recent Payments */}
      {tenantPayments.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Payments</Text>
            <TouchableOpacity onPress={() => router.push(`/payments?tenantId=${tenant.id}` as any)}>
              <Text style={[styles.viewAllText, { color: colors.primary }]}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {tenantPayments.slice(-3).reverse().map((payment, index) => (
              <View 
                key={payment.id} 
                style={[
                  styles.paymentItem, 
                  index < 2 && { borderBottomColor: colors.border, borderBottomWidth: 1 }
                ]}
              >
                <View style={styles.paymentContent}>
                  <Text style={[styles.paymentTitle, { color: colors.text }]}>
                    {payment.type.charAt(0).toUpperCase() + payment.type.slice(1)}
                  </Text>
                  <Text style={[styles.paymentDate, { color: colors.textSecondary }]}>
                    {new Date(payment.dueDate).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.paymentRight}>
                  <Text style={[styles.paymentAmount, { color: colors.text }]}>
                    ₹{payment.amount.toLocaleString()}
                  </Text>
                  <View style={[
                    styles.statusBadge, 
                    { 
                      backgroundColor: payment.status === 'paid' 
                        ? `${colors.success}15` 
                        : payment.status === 'pending'
                        ? `${colors.warning}15`
                        : `${colors.error}15`
                    }
                  ]}>
                    <Text style={[
                      styles.statusText, 
                      { 
                        color: payment.status === 'paid' 
                          ? colors.success 
                          : payment.status === 'pending'
                          ? colors.warning
                          : colors.error
                      }
                    ]}>
                      {payment.status}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Recent Complaints */}
      {tenantComplaints.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Complaints</Text>
            <TouchableOpacity onPress={() => router.push(`/complaints?tenantId=${tenant.id}` as any)}>
              <Text style={[styles.viewAllText, { color: colors.primary }]}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {tenantComplaints.slice(-3).reverse().map((complaint, index) => (
              <View 
                key={complaint.id} 
                style={[
                  styles.complaintItem, 
                  index < 2 && { borderBottomColor: colors.border, borderBottomWidth: 1 }
                ]}
              >
                <View style={styles.complaintContent}>
                  <Text style={[styles.complaintTitle, { color: colors.text }]}>{complaint.title}</Text>
                  <Text style={[styles.complaintCategory, { color: colors.textSecondary }]}>
                    {complaint.category} • {new Date(complaint.createdDate).toLocaleDateString()}
                  </Text>
                </View>
                <View style={[
                  styles.priorityBadge, 
                  { 
                    backgroundColor: complaint.priority === 'high' 
                      ? `${colors.error}15` 
                      : complaint.priority === 'medium'
                      ? `${colors.warning}15`
                      : `${colors.success}15`
                  }
                ]}>
                  <Text style={[
                    styles.priorityText, 
                    { 
                      color: complaint.priority === 'high' 
                        ? colors.error 
                        : complaint.priority === 'medium'
                        ? colors.warning
                        : colors.success
                    }
                  ]}>
                    {complaint.priority}
                  </Text>
                </View>
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
  
  // Error State
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    gap: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  errorSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
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
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  backIcon: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '600',
    flex: 1,
  },
  headerSpacer: {
    width: 36,
  },
  headerSubtitle: {
    fontSize: 14,
    marginLeft: 36,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
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
  
  // Info Rows
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    flex: 2,
    textAlign: 'right',
  },
  
  // Payment Items
  paymentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  paymentContent: {
    flex: 1,
  },
  paymentTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  paymentDate: {
    fontSize: 12,
    marginTop: 2,
  },
  paymentRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  paymentAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  
  // Complaint Items
  complaintItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  complaintContent: {
    flex: 1,
  },
  complaintTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  complaintCategory: {
    fontSize: 12,
    marginTop: 2,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
});
