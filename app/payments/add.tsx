import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useTheme } from '../../contexts/ThemeContext';
import { useData } from '../../contexts/DataContext';

export default function AddPaymentScreen() {
  const { colors } = useTheme();
  const { addPayment, tenants } = useData();
  const router = useRouter();

  const [formData, setFormData] = useState({
    tenantId: '',
    amount: '',
    type: 'rent' as 'rent' | 'deposit' | 'maintenance' | 'other',
    status: 'pending' as 'paid' | 'pending' | 'overdue',
    dueDate: '',
    paidDate: '',
    description: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tenantSearchQuery, setTenantSearchQuery] = useState('');
  const [showTenantDropdown, setShowTenantDropdown] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<any>(null);

  const paymentTypes = [
    { value: 'rent', label: 'Rent', icon: 'home' },
    { value: 'deposit', label: 'Deposit', icon: 'shield-checkmark' },
    { value: 'maintenance', label: 'Maintenance', icon: 'construct' },
    { value: 'other', label: 'Other', icon: 'card' },
  ];

  const paymentStatuses = [
    { value: 'pending', label: 'Pending', color: '#FF9500' },
    { value: 'paid', label: 'Paid', color: '#34C759' },
    { value: 'overdue', label: 'Overdue', color: '#FF3B30' },
  ];

  // Filter tenants based on search query
  const filteredTenants = tenants.filter(tenant =>
    tenant.name.toLowerCase().includes(tenantSearchQuery.toLowerCase()) ||
    tenant.email.toLowerCase().includes(tenantSearchQuery.toLowerCase()) ||
    tenant.roomNumber.toLowerCase().includes(tenantSearchQuery.toLowerCase())
  );

  const handleTenantSelect = (tenant: any) => {
    setSelectedTenant(tenant);
    setTenantSearchQuery(tenant.name);
    setFormData(prev => ({ ...prev, tenantId: tenant.id }));
    setShowTenantDropdown(false);
    if (errors.tenantId) {
      setErrors(prev => ({ ...prev, tenantId: '' }));
    }
  };

  const handleTenantSearchChange = (query: string) => {
    setTenantSearchQuery(query);
    setShowTenantDropdown(query.length > 0);
    if (query.length === 0) {
      setSelectedTenant(null);
      setFormData(prev => ({ ...prev, tenantId: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.tenantId) newErrors.tenantId = 'Please select a tenant';
    if (!formData.amount.trim()) newErrors.amount = 'Amount is required';
    else if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Invalid amount';
    }
    if (!formData.dueDate) newErrors.dueDate = 'Due date is required';
    if (formData.status === 'paid' && !formData.paidDate) {
      newErrors.paidDate = 'Paid date is required for paid payments';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    try {
      const selectedTenant = tenants.find(t => t.id === formData.tenantId);
      if (!selectedTenant) {
        Alert.alert('Error', 'Selected tenant not found');
        return;
      }

      addPayment({
        tenantId: formData.tenantId,
        tenantName: selectedTenant.name,
        amount: Number(formData.amount),
        type: formData.type,
        status: formData.status,
        dueDate: formData.dueDate,
        paidDate: formData.status === 'paid' ? formData.paidDate : undefined,
        description: formData.description.trim(),
      });

      Alert.alert('Success', 'Payment record added successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to add payment record. Please try again.');
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
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
            <Text style={[styles.headerTitle, { color: colors.text }]}>Add Payment</Text>
            <View style={styles.headerSpacer} />
          </View>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            Record new payment transaction
          </Text>
        </View>
      </View>
        <View style={styles.formSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Payment Details</Text>
          
          {/* Tenant Search */}
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.label, { color: colors.text }]}>
              Select Tenant <Text style={{ color: colors.error }}>*</Text>
            </Text>
            <View style={styles.searchContainer}>
              <TextInput
                style={[styles.searchInput, { color: colors.text, borderColor: colors.border }]}
                value={tenantSearchQuery}
                onChangeText={handleTenantSearchChange}
                placeholder="Search tenant by name, email, or room number..."
                placeholderTextColor={colors.textSecondary}
                onFocus={() => setShowTenantDropdown(tenantSearchQuery.length > 0)}
              />
              <Ionicons name="search-outline" size={16} color={colors.textSecondary} style={styles.searchIcon} />
            </View>
            
            {/* Selected Tenant Display */}
            {selectedTenant && (
              <View style={[styles.selectedTenant, { backgroundColor: `${colors.primary}15`, borderColor: colors.primary }]}>
                <View style={styles.tenantInfo}>
                  <Text style={[styles.tenantName, { color: colors.text }]}>{selectedTenant.name}</Text>
                  <Text style={[styles.tenantDetails, { color: colors.textSecondary }]}>
                    Room {selectedTenant.roomNumber} • {selectedTenant.email}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedTenant(null);
                    setTenantSearchQuery('');
                    setFormData(prev => ({ ...prev, tenantId: '' }));
                  }}
                >
                  <Ionicons name="close-circle-outline" size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>
            )}

            {/* Dropdown Results */}
            {showTenantDropdown && filteredTenants.length > 0 && (
              <View style={[styles.dropdown, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <ScrollView style={styles.dropdownScroll} showsVerticalScrollIndicator={false}>
                  {filteredTenants.slice(0, 5).map((tenant) => (
                    <TouchableOpacity
                      key={tenant.id}
                      style={[styles.dropdownItem, { borderBottomColor: colors.border }]}
                      onPress={() => handleTenantSelect(tenant)}
                    >
                      <View style={styles.tenantInfo}>
                        <Text style={[styles.tenantName, { color: colors.text }]}>{tenant.name}</Text>
                        <Text style={[styles.tenantDetails, { color: colors.textSecondary }]}>
                          Room {tenant.roomNumber} • {tenant.email}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {showTenantDropdown && filteredTenants.length === 0 && tenantSearchQuery.length > 0 && (
              <View style={[styles.noResults, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Text style={[styles.noResultsText, { color: colors.textSecondary }]}>
                  No tenants found matching "{tenantSearchQuery}"
                </Text>
              </View>
            )}

            {errors.tenantId && (
              <Text style={[styles.errorText, { color: colors.error }]}>{errors.tenantId}</Text>
            )}
          </View>

          {/* Payment Type */}
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.label, { color: colors.text }]}>Payment Type</Text>
            <View style={styles.typeContainer}>
              {paymentTypes.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  style={[
                    styles.typeOption,
                    {
                      backgroundColor: formData.type === type.value 
                        ? colors.primary 
                        : 'transparent',
                      borderColor: formData.type === type.value 
                        ? colors.primary 
                        : colors.border,
                    }
                  ]}
                  onPress={() => updateFormData('type', type.value)}
                >
                  <Ionicons 
                    name={type.icon as any} 
                    size={20} 
                    color={formData.type === type.value ? '#FFFFFF' : colors.textSecondary} 
                  />
                  <Text style={[
                    styles.typeLabel,
                    {
                      color: formData.type === type.value ? '#FFFFFF' : colors.text,
                    }
                  ]}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Amount Input */}
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.label, { color: colors.text }]}>
              Amount <Text style={{ color: colors.error }}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.border }]}
              value={formData.amount}
              onChangeText={(value) => updateFormData('amount', value)}
              placeholder="Enter amount"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
            />
            {errors.amount && (
              <Text style={[styles.errorText, { color: colors.error }]}>{errors.amount}</Text>
            )}
          </View>

          {/* Due Date Input */}
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.label, { color: colors.text }]}>
              Due Date <Text style={{ color: colors.error }}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.border }]}
              value={formData.dueDate}
              onChangeText={(value) => updateFormData('dueDate', value)}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.textSecondary}
            />
            {errors.dueDate && (
              <Text style={[styles.errorText, { color: colors.error }]}>{errors.dueDate}</Text>
            )}
          </View>

          {/* Payment Status */}
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.label, { color: colors.text }]}>Status</Text>
            <View style={styles.statusContainer}>
              {paymentStatuses.map((status) => (
                <TouchableOpacity
                  key={status.value}
                  style={[
                    styles.statusOption,
                    {
                      backgroundColor: formData.status === status.value 
                        ? `${status.color}15` 
                        : 'transparent',
                      borderColor: formData.status === status.value 
                        ? status.color 
                        : colors.border,
                    }
                  ]}
                  onPress={() => updateFormData('status', status.value)}
                >
                  <Text style={[
                    styles.statusLabel,
                    {
                      color: formData.status === status.value ? status.color : colors.text,
                    }
                  ]}>
                    {status.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {formData.status === 'paid' && (
            <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.label, { color: colors.text }]}>
                Paid Date <Text style={{ color: colors.error }}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                value={formData.paidDate}
                onChangeText={(value) => updateFormData('paidDate', value)}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.textSecondary}
              />
              {errors.paidDate && (
                <Text style={[styles.errorText, { color: colors.error }]}>{errors.paidDate}</Text>
              )}
            </View>
          )}

          {/* Description Input */}
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.label, { color: colors.text }]}>Description</Text>
            <TextInput
              style={[styles.textArea, { color: colors.text, borderColor: colors.border }]}
              value={formData.description}
              onChangeText={(value) => updateFormData('description', value)}
              placeholder="Enter description (optional)"
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.cancelButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => router.back()}
          >
            <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: colors.primary }]}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>Add Payment</Text>
          </TouchableOpacity>
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
  
  // Form Section
  formSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  
  // Cards
  card: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  
  // Input Fields
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  
  // Tenant Search
  searchContainer: {
    position: 'relative',
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    paddingRight: 40,
    fontSize: 14,
  },
  searchIcon: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  selectedTenant: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 8,
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 200,
    zIndex: 1000,
  },
  dropdownScroll: {
    maxHeight: 200,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
  },
  noResults: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 4,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  tenantInfo: {
    flex: 1,
  },
  tenantName: {
    fontSize: 16,
    fontWeight: '500',
  },
  tenantDetails: {
    fontSize: 12,
    marginTop: 2,
  },
  
  // Payment Type
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
  },
  typeLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  
  // Status Selection
  statusContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  statusOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  
  // Error Text
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
  
  // Buttons
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  submitButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});
