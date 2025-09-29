import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useTheme } from '../../contexts/ThemeContext';
import { useData } from '../../contexts/DataContext';

export default function TenantsScreen() {
  const { colors } = useTheme();
  const { tenants } = useData();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'active', 'inactive'
  const [showFilters, setShowFilters] = useState(false);

  const filteredTenants = tenants.filter(tenant => {
    const matchesSearch = tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.roomNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || tenant.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Clean Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Tenants</Text>
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={() => router.push('/tenants/add' as any)}
            >
              <Ionicons name="add-outline" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            {tenants.length} total • {tenants.filter(t => t.status === 'active').length} active
          </Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchRow}>
          <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name="search-outline" size={16} color={colors.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search tenants..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity
            style={[styles.filterButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Ionicons name="filter-outline" size={16} color={colors.text} />
          </TouchableOpacity>
        </View>
        
        {/* Filter Options */}
        {showFilters && (
          <View style={styles.filtersContainer}>
            <Text style={[styles.filterLabel, { color: colors.text }]}>Status:</Text>
            <View style={styles.filterOptions}>
              {['all', 'active', 'inactive'].map((status) => (
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
        )}
      </View>

      {/* Tenants List */}
      <View style={styles.tenantsSection}>
        {filteredTenants.length > 0 ? (
          <View style={styles.tenantsList}>
            {filteredTenants.map((tenant) => (
              <TouchableOpacity
                key={tenant.id}
                style={[styles.tenantItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={() => router.push(`/tenants/${tenant.id}` as any)}
              >
                <View style={styles.tenantHeader}>
                  <View style={styles.tenantInfo}>
                    <Text style={[styles.tenantName, { color: colors.text }]}>{tenant.name}</Text>
                    <Text style={[styles.tenantRoom, { color: colors.textSecondary }]}>Room {tenant.roomNumber}</Text>
                  </View>
                  <View style={[styles.statusBadge, { 
                    backgroundColor: tenant.status === 'active' ? `${colors.success}15` : `${colors.warning}15` 
                  }]}>
                    <Text style={[styles.statusText, { 
                      color: tenant.status === 'active' ? colors.success : colors.warning 
                    }]}>{tenant.status}</Text>
                  </View>
                </View>
                <View style={styles.tenantDetails}>
                  <Text style={[styles.tenantEmail, { color: colors.textSecondary }]}>{tenant.email}</Text>
                  <Text style={[styles.tenantPhone, { color: colors.textSecondary }]}>{tenant.phone}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={48} color={colors.textSecondary} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No Tenants Found</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              {tenants.length === 0 ? 'Add your first tenant to get started' : 'Try adjusting your search'}
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
  
  // Search Section
  searchSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    height: '100%',
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  
  // Tenants Section
  tenantsSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  tenantsList: {
    gap: 12,
  },
  tenantItem: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  tenantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  tenantInfo: {
    flex: 1,
  },
  tenantName: {
    fontSize: 16,
    fontWeight: '600',
  },
  tenantRoom: {
    fontSize: 12,
    marginTop: 2,
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
  tenantDetails: {
    gap: 2,
  },
  tenantEmail: {
    fontSize: 12,
  },
  tenantPhone: {
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
