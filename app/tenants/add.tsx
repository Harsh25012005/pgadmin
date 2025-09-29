import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useTheme } from '../../contexts/ThemeContext';
import { useData } from '../../contexts/DataContext';

export default function AddTenantScreen() {
  const { colors } = useTheme();
  const { addTenant, rooms } = useData();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    roomNumber: '',
    address: '',
    emergencyContact: '',
    deposit: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const availableRooms = rooms.filter(room => room.status === 'vacant');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.roomNumber.trim()) newErrors.roomNumber = 'Room number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.emergencyContact.trim()) newErrors.emergencyContact = 'Emergency contact is required';
    if (!formData.deposit.trim()) newErrors.deposit = 'Deposit amount is required';
    else if (isNaN(Number(formData.deposit)) || Number(formData.deposit) <= 0) {
      newErrors.deposit = 'Invalid deposit amount';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    try {
      addTenant({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        roomNumber: formData.roomNumber.trim(),
        address: formData.address.trim(),
        emergencyContact: formData.emergencyContact.trim(),
        deposit: Number(formData.deposit),
        joinDate: new Date().toISOString().split('T')[0],
        status: 'active',
      });

      Alert.alert('Success', 'Tenant added successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to add tenant. Please try again.');
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Clean Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <TouchableOpacity
              style={[styles.backButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back-outline" size={20} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Add Tenant</Text>
          </View>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            Create new tenant record
          </Text>
        </View>
      </View>

      {/* Personal Information */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Personal Information</Text>
        
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Full Name *</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
            value={formData.name}
            onChangeText={(value: string) => updateFormData('name', value)}
            placeholder="Enter full name"
            placeholderTextColor={colors.textSecondary}
          />
          {errors.name && <Text style={[styles.errorText, { color: colors.error }]}>{errors.name}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Email Address *</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
            value={formData.email}
            onChangeText={(value: string) => updateFormData('email', value)}
            placeholder="Enter email address"
            placeholderTextColor={colors.textSecondary}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email && <Text style={[styles.errorText, { color: colors.error }]}>{errors.email}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Phone Number *</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
            value={formData.phone}
            onChangeText={(value: string) => updateFormData('phone', value)}
            placeholder="Enter phone number"
            placeholderTextColor={colors.textSecondary}
            keyboardType="phone-pad"
          />
          {errors.phone && <Text style={[styles.errorText, { color: colors.error }]}>{errors.phone}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Address *</Text>
          <TextInput
            style={[styles.textArea, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
            value={formData.address}
            onChangeText={(value: string) => updateFormData('address', value)}
            placeholder="Enter complete address"
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={3}
          />
          {errors.address && <Text style={[styles.errorText, { color: colors.error }]}>{errors.address}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Emergency Contact *</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
            value={formData.emergencyContact}
            onChangeText={(value: string) => updateFormData('emergencyContact', value)}
            placeholder="Enter emergency contact number"
            placeholderTextColor={colors.textSecondary}
            keyboardType="phone-pad"
          />
          {errors.emergencyContact && <Text style={[styles.errorText, { color: colors.error }]}>{errors.emergencyContact}</Text>}
        </View>
      </View>

      {/* Room & Payment */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Room & Payment</Text>
        
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Room Number *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.roomScroll}>
            <View style={styles.roomContainer}>
              {availableRooms.map((room) => (
                <TouchableOpacity
                  key={room.id}
                  style={[
                    styles.roomOption,
                    {
                      backgroundColor: formData.roomNumber === room.number 
                        ? colors.primary 
                        : colors.surface,
                      borderColor: colors.border,
                    }
                  ]}
                  onPress={() => updateFormData('roomNumber', room.number)}
                >
                  <Text style={[
                    styles.roomNumber,
                    {
                      color: formData.roomNumber === room.number 
                        ? '#FFFFFF' 
                        : colors.text,
                    }
                  ]}>
                    {room.number}
                  </Text>
                  <Text style={[
                    styles.roomType,
                    {
                      color: formData.roomNumber === room.number 
                        ? '#FFFFFF' 
                        : colors.textSecondary,
                    }
                  ]}>
                    {room.type} • ₹{room.rent}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
          {errors.roomNumber && (
            <Text style={[styles.errorText, { color: colors.error }]}>{errors.roomNumber}</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Security Deposit *</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
            value={formData.deposit}
            onChangeText={(value: string) => updateFormData('deposit', value)}
            placeholder="Enter deposit amount"
            placeholderTextColor={colors.textSecondary}
            keyboardType="numeric"
          />
          {errors.deposit && <Text style={[styles.errorText, { color: colors.error }]}>{errors.deposit}</Text>}
        </View>
      </View>

      {/* Buttons */}
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
          <Text style={styles.submitButtonText}>Add Tenant</Text>
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
    gap: 12,
    marginBottom: 4,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '600',
  },
  headerSubtitle: {
    fontSize: 14,
  },
  
  // Sections
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  
  // Form Inputs
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    height: 44,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 14,
  },
  textArea: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
  
  // Room Selection
  roomScroll: {
    marginTop: 8,
  },
  roomContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 8,
  },
  roomOption: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 100,
    alignItems: 'center',
  },
  roomNumber: {
    fontSize: 16,
    fontWeight: '600',
  },
  roomType: {
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
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  submitButton: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});
