import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useTheme } from '../../contexts/ThemeContext';
import { useData } from '../../contexts/DataContext';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

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
          <Text style={[styles.headerTitle, { color: '#FFFFFF' }]}>Add Payment</Text>
          <Text style={[styles.headerSubtitle, { color: '#FFFFFF' }]}>
            Record new payment
          </Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.formCard}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Payment Details</Text>
          
          {/* Tenant Selection */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>
              Select Tenant <Text style={{ color: colors.error }}>*</Text>
            </Text>
            <ScrollView style={styles.tenantScroll} showsVerticalScrollIndicator={false}>
              {tenants.map((tenant) => (
                <TouchableOpacity
                  key={tenant.id}
                  style={[
                    styles.tenantOption,
                    {
                      backgroundColor: formData.tenantId === tenant.id 
                        ? `${colors.primary}15` 
                        : colors.surface,
                      borderColor: formData.tenantId === tenant.id 
                        ? colors.primary 
                        : colors.border,
                    }
                  ]}
                  onPress={() => updateFormData('tenantId', tenant.id)}
                >
                  <View style={styles.tenantInfo}>
                    <Text style={[styles.tenantName, { color: colors.text }]}>{tenant.name}</Text>
                    <Text style={[styles.tenantDetails, { color: colors.textSecondary }]}>
                      Room {tenant.roomNumber} • {tenant.email}
                    </Text>
                  </View>
                  {formData.tenantId === tenant.id && (
                    <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
            {errors.tenantId && (
              <Text style={[styles.errorText, { color: colors.error }]}>{errors.tenantId}</Text>
            )}
          </View>

          {/* Payment Type */}
          <View style={styles.inputContainer}>
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
                        : colors.surface,
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

          <Input
            label="Amount"
            value={formData.amount}
            onChangeText={(value) => updateFormData('amount', value)}
            placeholder="Enter amount"
            keyboardType="numeric"
            error={errors.amount}
            required
          />

          <Input
            label="Due Date"
            value={formData.dueDate}
            onChangeText={(value) => updateFormData('dueDate', value)}
            placeholder="YYYY-MM-DD"
            error={errors.dueDate}
            required
          />

          {/* Payment Status */}
          <View style={styles.inputContainer}>
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
                        : colors.surface,
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
            <Input
              label="Paid Date"
              value={formData.paidDate}
              onChangeText={(value) => updateFormData('paidDate', value)}
              placeholder="YYYY-MM-DD"
              error={errors.paidDate}
              required
            />
          )}

          <Input
            label="Description"
            value={formData.description}
            onChangeText={(value) => updateFormData('description', value)}
            placeholder="Enter description (optional)"
            multiline
            numberOfLines={3}
          />
        </Card>

        <View style={styles.buttonContainer}>
          <Button
            title="Cancel"
            onPress={() => router.back()}
            variant="outline"
            style={styles.cancelButton}
          />
          <Button
            title="Add Payment"
            onPress={handleSubmit}
            style={styles.submitButton}
          />
        </View>
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
  formCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  tenantScroll: {
    maxHeight: 200,
  },
  tenantOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
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
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    marginBottom: 40,
  },
  cancelButton: {
    flex: 1,
  },
  submitButton: {
    flex: 1,
  },
});
