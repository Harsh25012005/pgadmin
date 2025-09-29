import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useTheme } from '../../contexts/ThemeContext';
import { useData, Payment } from '../../contexts/DataContext';
import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui/Button';

export default function PaymentsScreen() {
  const { colors } = useTheme();
  const { payments, tenants } = useData();
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');

  const filteredPayments = payments.filter(payment => {
    if (filter === 'all') return true;
    return payment.status === filter;
  });

  const stats = {
    totalAmount: payments.reduce((sum, p) => sum + p.amount, 0),
    paidAmount: payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0),
    pendingAmount: payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0),
    overdueAmount: payments.filter(p => p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0),
  };

  const getPaymentTypeIcon = (type: string) => {
    switch (type) {
      case 'rent': return 'home';
      case 'deposit': return 'shield-checkmark';
      case 'maintenance': return 'construct';
      default: return 'card';
    }
  };

  const renderPaymentItem = ({ item }: { item: Payment }) => (
    <Card style={styles.paymentCard}>
      <TouchableOpacity
        style={styles.paymentContent}
        onPress={() => router.push(`/payments/${item.id}` as any)}
      >
        <View style={styles.paymentHeader}>
          <View style={styles.paymentInfo}>
            <View style={styles.paymentTitleRow}>
              <Ionicons 
                name={getPaymentTypeIcon(item.type) as any} 
                size={20} 
                color={colors.primary} 
              />
              <Text style={[styles.paymentTitle, { color: colors.text }]}>
                {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
              </Text>
            </View>
            <Text style={[styles.tenantName, { color: colors.textSecondary }]}>{item.tenantName}</Text>
          </View>
          <View style={styles.paymentAmount}>
            <Text style={[styles.amount, { color: colors.text }]}>₹{item.amount.toLocaleString()}</Text>
            <StatusBadge status={item.status} />
          </View>
        </View>
        
        <View style={styles.paymentDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="calendar" size={16} color={colors.textSecondary} />
            <Text style={[styles.detailText, { color: colors.textSecondary }]}>
              Due: {new Date(item.dueDate).toLocaleDateString()}
            </Text>
          </View>
          {item.paidDate && (
            <View style={styles.detailItem}>
              <Ionicons name="checkmark-circle" size={16} color={colors.success} />
              <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                Paid: {new Date(item.paidDate).toLocaleDateString()}
              </Text>
            </View>
          )}
          {item.description && (
            <View style={styles.detailItem}>
              <Ionicons name="document-text" size={16} color={colors.textSecondary} />
              <Text style={[styles.detailText, { color: colors.textSecondary }]}>{item.description}</Text>
            </View>
          )}
        </View>

        <View style={styles.paymentActions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: `${colors.primary}15` }]}
            onPress={() => router.push(`/payments/${item.id}/edit` as any)}
          >
            <Ionicons name="create" size={16} color={colors.primary} />
            <Text style={[styles.actionText, { color: colors.primary }]}>Edit</Text>
          </TouchableOpacity>
          {item.status !== 'paid' && (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: `${colors.success}15` }]}
              onPress={() => {
                // Mark as paid logic would go here
                console.log('Mark as paid:', item.id);
              }}
            >
              <Ionicons name="checkmark" size={16} color={colors.success} />
              <Text style={[styles.actionText, { color: colors.success }]}>Mark Paid</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    </Card>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <View>
          <Text style={[styles.headerTitle, { color: '#FFFFFF' }]}>Payments</Text>
          <Text style={[styles.headerSubtitle, { color: '#FFFFFF' }]}>
            ₹{stats.paidAmount.toLocaleString()} collected this month
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/payments/add' as any)}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsScroll}>
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Text style={[styles.statNumber, { color: colors.success }]}>
              ₹{stats.paidAmount.toLocaleString()}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Paid</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={[styles.statNumber, { color: colors.warning }]}>
              ₹{stats.pendingAmount.toLocaleString()}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Pending</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={[styles.statNumber, { color: colors.error }]}>
              ₹{stats.overdueAmount.toLocaleString()}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Overdue</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>
              ₹{stats.totalAmount.toLocaleString()}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total</Text>
          </Card>
        </View>
      </ScrollView>

      {/* Filter Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
        <View style={styles.filterContainer}>
          {(['all', 'paid', 'pending', 'overdue'] as const).map((filterOption) => (
            <TouchableOpacity
              key={filterOption}
              style={[
                styles.filterTab,
                {
                  backgroundColor: filter === filterOption ? colors.primary : 'transparent',
                  borderColor: colors.border,
                }
              ]}
              onPress={() => setFilter(filterOption)}
            >
              <Text style={[
                styles.filterText,
                {
                  color: filter === filterOption ? '#FFFFFF' : colors.text,
                }
              ]}>
                {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Payments List */}
      {filteredPayments.length > 0 ? (
        <FlatList
          data={filteredPayments}
          renderItem={renderPaymentItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="card-outline" size={64} color={colors.textSecondary} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No Payments Found</Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            {payments.length === 0 ? 'Record your first payment to get started' : `No ${filter} payments found`}
          </Text>
          {payments.length === 0 && (
            <Button
              title="Record First Payment"
              onPress={() => router.push('/payments/add' as any)}
              style={styles.emptyButton}
            />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 14,
    opacity: 0.8,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsScroll: {
    maxHeight: 100,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  statCard: {
    padding: 12,
    alignItems: 'center',
    minWidth: 100,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  filterScroll: {
    maxHeight: 60,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  paymentCard: {
    marginBottom: 12,
  },
  paymentContent: {
    padding: 16,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  paymentTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  tenantName: {
    fontSize: 14,
    marginTop: 2,
  },
  paymentAmount: {
    alignItems: 'flex-end',
    gap: 8,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  paymentDetails: {
    gap: 8,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    flex: 1,
  },
  paymentActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  emptyButton: {
    marginTop: 20,
  },
});
