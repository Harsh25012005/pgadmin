import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { useTheme } from '../../contexts/ThemeContext';
import { useData } from '../../contexts/DataContext';

export default function PaymentDetailScreen() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { getPayment, getTenant, deletePayment, updatePayment } = useData();
  
  const payment = getPayment(id as string);
  const tenant = payment ? getTenant(payment.tenantId) : null;

  if (!payment) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.errorContainer}>
          <Ionicons name="card-outline" size={48} color={colors.textSecondary} />
          <Text style={[styles.errorTitle, { color: colors.text }]}>Payment Not Found</Text>
          <Text style={[styles.errorSubtitle, { color: colors.textSecondary }]}>
            The payment you're looking for doesn't exist.
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

  const getPaymentTypeIcon = (type: string) => {
    switch (type) {
      case 'rent': return 'home-outline';
      case 'deposit': return 'shield-checkmark-outline';
      case 'maintenance': return 'construct-outline';
      default: return 'card-outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return colors.success;
      case 'pending': return colors.warning;
      case 'overdue': return colors.error;
      default: return colors.textSecondary;
    }
  };

  const quickActions = [
    { 
      title: 'Edit Payment', 
      icon: 'create-outline', 
      action: () => router.push(`/payments/edit/${payment.id}` as any) 
    },
    { 
      title: 'Mark as Paid', 
      icon: 'checkmark-circle-outline', 
      action: () => handleMarkAsPaid(),
      show: payment.status !== 'paid'
    },
    { 
      title: 'View Tenant', 
      icon: 'person-outline', 
      action: () => router.push(`/tenants/${payment.tenantId}` as any) 
    },
    { 
      title: 'Delete Payment', 
      icon: 'trash-outline', 
      action: () => handleDeletePayment(), 
      color: colors.error 
    },
  ].filter(action => action.show !== false);

  const handleMarkAsPaid = () => {
    Alert.alert(
      'Mark as Paid',
      `Mark this ${payment.type} payment as paid?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Mark Paid',
          onPress: () => {
            updatePayment(payment.id, {
              status: 'paid',
              paidDate: new Date().toISOString().split('T')[0]
            });
            Alert.alert('Success', 'Payment marked as paid successfully!');
          },
        },
      ]
    );
  };

  const handleDeletePayment = () => {
    Alert.alert(
      'Delete Payment',
      `Are you sure you want to delete this payment record? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deletePayment(payment.id);
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
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              {payment.type.charAt(0).toUpperCase() + payment.type.slice(1)} Payment
            </Text>
            <View style={styles.headerSpacer} />
          </View>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            {payment.tenantName} • ₹{payment.amount.toLocaleString()}
          </Text>
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

      {/* Payment Information */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Payment Information</Text>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Type</Text>
            <View style={styles.infoValueRow}>
              <Ionicons 
                name={getPaymentTypeIcon(payment.type) as any} 
                size={16} 
                color={colors.textSecondary} 
              />
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {payment.type.charAt(0).toUpperCase() + payment.type.slice(1)}
              </Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Amount</Text>
            <Text style={[styles.infoValue, { color: colors.text, fontWeight: '600' }]}>
              ₹{payment.amount.toLocaleString()}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Status</Text>
            <View style={[
              styles.statusBadge, 
              { backgroundColor: `${getStatusColor(payment.status)}15` }
            ]}>
              <Text style={[
                styles.statusText, 
                { color: getStatusColor(payment.status) }
              ]}>
                {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
              </Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Due Date</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              {new Date(payment.dueDate).toLocaleDateString()}
            </Text>
          </View>
          {payment.paidDate && (
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Paid Date</Text>
              <Text style={[styles.infoValue, { color: colors.success }]}>
                {new Date(payment.paidDate).toLocaleDateString()}
              </Text>
            </View>
          )}
          {payment.description && (
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Description</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {payment.description}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Tenant Information */}
      {tenant && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Tenant Information</Text>
            <TouchableOpacity onPress={() => router.push(`/tenants/${tenant.id}` as any)}>
              <Text style={[styles.viewAllText, { color: colors.primary }]}>View Details</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <TouchableOpacity
              style={styles.tenantCard}
              onPress={() => router.push(`/tenants/${tenant.id}` as any)}
            >
              <View style={styles.tenantInfo}>
                <Text style={[styles.tenantName, { color: colors.text }]}>{tenant.name}</Text>
                <Text style={[styles.tenantDetails, { color: colors.textSecondary }]}>
                  Room {tenant.roomNumber} • {tenant.email}
                </Text>
                <Text style={[styles.tenantDetails, { color: colors.textSecondary }]}>
                  {tenant.phone}
                </Text>
              </View>
              <View style={[
                styles.tenantStatusBadge, 
                { backgroundColor: tenant.status === 'active' ? `${colors.success}15` : `${colors.warning}15` }
              ]}>
                <Text style={[
                  styles.tenantStatusText, 
                  { color: tenant.status === 'active' ? colors.success : colors.warning }
                ]}>
                  {tenant.status}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Payment Timeline */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Payment Timeline</Text>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.timelineItem}>
            <View style={[styles.timelineDot, { backgroundColor: colors.primary }]} />
            <View style={styles.timelineContent}>
              <Text style={[styles.timelineTitle, { color: colors.text }]}>Payment Created</Text>
              <Text style={[styles.timelineDate, { color: colors.textSecondary }]}>
                Due: {new Date(payment.dueDate).toLocaleDateString()}
              </Text>
            </View>
          </View>
          
          {payment.status === 'paid' && payment.paidDate && (
            <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, { backgroundColor: colors.success }]} />
              <View style={styles.timelineContent}>
                <Text style={[styles.timelineTitle, { color: colors.text }]}>Payment Completed</Text>
                <Text style={[styles.timelineDate, { color: colors.textSecondary }]}>
                  Paid: {new Date(payment.paidDate).toLocaleDateString()}
                </Text>
              </View>
            </View>
          )}
          
          {payment.status === 'overdue' && (
            <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, { backgroundColor: colors.error }]} />
              <View style={styles.timelineContent}>
                <Text style={[styles.timelineTitle, { color: colors.text }]}>Payment Overdue</Text>
                <Text style={[styles.timelineDate, { color: colors.textSecondary }]}>
                  Since: {new Date(payment.dueDate).toLocaleDateString()}
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>
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
    alignItems: 'center',
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
    textAlign: 'right',
  },
  infoValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '500',
  },
  
  // Tenant Card
  tenantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tenantInfo: {
    flex: 1,
  },
  tenantName: {
    fontSize: 16,
    fontWeight: '600',
  },
  tenantDetails: {
    fontSize: 12,
    marginTop: 2,
  },
  tenantStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tenantStatusText: {
    fontSize: 10,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  
  // Timeline
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
    marginRight: 12,
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  timelineDate: {
    fontSize: 12,
    marginTop: 2,
  },
});
