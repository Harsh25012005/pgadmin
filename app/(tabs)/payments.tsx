import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useTheme } from '../../contexts/ThemeContext';
import { useData, Payment } from '../../contexts/DataContext';

export default function PaymentsScreen() {
  const { colors } = useTheme();
  const { payments, tenants } = useData();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.tenantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Statistics for the stats cards
  const stats = {
    totalPayments: payments.length,
    paidPayments: payments.filter(p => p.status === 'paid').length,
    pendingPayments: payments.filter(p => p.status === 'pending').length,
    overduePayments: payments.filter(p => p.status === 'overdue').length,
    totalAmount: payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0),
    pendingAmount: payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0),
  };

  const mainCards = [
    {
      title: 'Paid',
      value: stats.paidPayments,
      subtitle: 'Payments',
      icon: 'checkmark-circle-outline',
    },
    {
      title: 'Revenue',
      value: `₹${(stats.totalAmount / 1000).toFixed(0)}K`,
      subtitle: 'Collected',
      icon: 'cash-outline',
    },
    {
      title: 'Pending',
      value: stats.pendingPayments,
      subtitle: 'Payments',
      icon: 'time-outline',
    },
    {
      title: 'Overdue',
      value: stats.overduePayments,
      subtitle: 'Payments',
      icon: 'alert-circle-outline',
    },
  ];

  const getPaymentTypeIcon = (type: string) => {
    switch (type) {
      case 'rent': return 'home-outline';
      case 'deposit': return 'shield-checkmark-outline';
      case 'maintenance': return 'construct-outline';
      default: return 'card-outline';
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Clean Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Payments</Text>
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={() => router.push('/payments/add' as any)}
            >
              <Ionicons name="add-outline" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            {payments.length} total • {stats.paidPayments} paid • ₹{(stats.totalAmount / 1000).toFixed(0)}K collected
          </Text>
        </View>
      </View>


      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Ionicons name="search-outline" size={16} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search payments..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        {/* Filter Options - Always Visible */}
        <View style={styles.filtersContainer}>
          <Text style={[styles.filterLabel, { color: colors.text }]}>Status:</Text>
          <View style={styles.filterOptions}>
            {(['all', 'paid', 'pending', 'overdue'] as const).map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.filterOption,
                  {
                    backgroundColor: statusFilter === status ? colors.primary : colors.surface,
                    borderColor: colors.border,
                  }
                ]}
                onPress={() => setStatusFilter(status)}
              >
                <Text style={[
                  styles.filterOptionText,
                  {
                    color: statusFilter === status ? '#FFFFFF' : colors.text,
                  }
                ]}>
                  {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Payments List */}
      <View style={styles.paymentsSection}>
        {filteredPayments.length > 0 ? (
          <View style={styles.paymentsList}>
            {filteredPayments.map((payment) => (
              <TouchableOpacity
                key={payment.id}
                style={[styles.paymentItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={() => router.push(`/payments/${payment.id}` as any)}
              >
                <View style={styles.paymentHeader}>
                  <View style={styles.paymentInfo}>
                    <View style={styles.paymentTitleRow}>
                      <Ionicons 
                        name={getPaymentTypeIcon(payment.type) as any} 
                        size={16} 
                        color={colors.textSecondary} 
                      />
                      <Text style={[styles.paymentTitle, { color: colors.text }]}>
                        {payment.type.charAt(0).toUpperCase() + payment.type.slice(1)}
                      </Text>
                    </View>
                    <Text style={[styles.tenantName, { color: colors.textSecondary }]}>{payment.tenantName}</Text>
                  </View>
                  <View style={styles.paymentRight}>
                    <Text style={[styles.paymentAmount, { color: colors.text }]}>₹{payment.amount.toLocaleString()}</Text>
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
                <View style={styles.paymentDetails}>
                  <Text style={[styles.paymentDate, { color: colors.textSecondary }]}>
                    Due: {new Date(payment.dueDate).toLocaleDateString()}
                  </Text>
                  {payment.paidDate && (
                    <Text style={[styles.paymentDate, { color: colors.textSecondary }]}>
                      Paid: {new Date(payment.paidDate).toLocaleDateString()}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="card-outline" size={48} color={colors.textSecondary} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No Payments Found</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              {payments.length === 0 ? 'Add your first payment to get started' : 'Try adjusting your search'}
            </Text>
          </View>
        )}
      </View>
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '600',
  },
  headerSubtitle: {
    fontSize: 14,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  
  // Search Section
  searchSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    height: '100%',
  },
  
  // Filter Section
  filtersContainer: {
    gap: 8,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  filterOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  filterOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  filterOptionText: {
    fontSize: 12,
    fontWeight: '500',
  },
  
  // Payments Section
  paymentsSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  paymentsList: {
    gap: 12,
  },
  paymentItem: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
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
    fontSize: 16,
    fontWeight: '600',
  },
  tenantName: {
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
  paymentDetails: {
    gap: 2,
  },
  paymentDate: {
    fontSize: 12,
  },
  
  // Empty State
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
