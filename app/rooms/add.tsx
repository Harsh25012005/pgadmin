import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useTheme } from '../../contexts/ThemeContext';
import { useData } from '../../contexts/DataContext';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export default function AddRoomScreen() {
  const { colors } = useTheme();
  const { addRoom } = useData();
  const router = useRouter();

  const [formData, setFormData] = useState({
    number: '',
    type: 'single' as 'single' | 'double' | 'triple',
    rent: '',
    floor: '',
    facilities: [] as string[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const roomTypes = [
    { value: 'single', label: 'Single', icon: 'person', description: 'One person' },
    { value: 'double', label: 'Double', icon: 'people', description: 'Two persons' },
    { value: 'triple', label: 'Triple', icon: 'people-circle', description: 'Three persons' },
  ];

  const availableFacilities = [
    { id: 'ac', label: 'AC', icon: 'snow' },
    { id: 'fan', label: 'Fan', icon: 'refresh' },
    { id: 'wifi', label: 'WiFi', icon: 'wifi' },
    { id: 'attached_bathroom', label: 'Attached Bathroom', icon: 'water' },
    { id: 'shared_bathroom', label: 'Shared Bathroom', icon: 'people' },
    { id: 'balcony', label: 'Balcony', icon: 'home' },
    { id: 'wardrobe', label: 'Wardrobe', icon: 'shirt' },
    { id: 'study_table', label: 'Study Table', icon: 'desktop' },
    { id: 'fridge', label: 'Fridge', icon: 'cube' },
    { id: 'tv', label: 'TV', icon: 'tv' },
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.number.trim()) newErrors.number = 'Room number is required';
    if (!formData.rent.trim()) newErrors.rent = 'Rent amount is required';
    else if (isNaN(Number(formData.rent)) || Number(formData.rent) <= 0) {
      newErrors.rent = 'Invalid rent amount';
    }
    if (!formData.floor.trim()) newErrors.floor = 'Floor number is required';
    else if (isNaN(Number(formData.floor)) || Number(formData.floor) < 0) {
      newErrors.floor = 'Invalid floor number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    try {
      addRoom({
        number: formData.number.trim(),
        type: formData.type,
        rent: Number(formData.rent),
        floor: Number(formData.floor),
        facilities: formData.facilities,
        status: 'vacant',
      });

      Alert.alert('Success', 'Room added successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to add room. Please try again.');
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const toggleFacility = (facilityId: string) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.includes(facilityId)
        ? prev.facilities.filter(f => f !== facilityId)
        : [...prev.facilities, facilityId]
    }));
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
          <Text style={[styles.headerTitle, { color: '#FFFFFF' }]}>Add Room</Text>
          <Text style={[styles.headerSubtitle, { color: '#FFFFFF' }]}>
            Create new room
          </Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.formCard}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Room Details</Text>
          
          <Input
            label="Room Number"
            value={formData.number}
            onChangeText={(value) => updateFormData('number', value)}
            placeholder="Enter room number (e.g., 101, A-1)"
            error={errors.number}
            required
          />

          {/* Room Type */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Room Type</Text>
            <View style={styles.typeContainer}>
              {roomTypes.map((type) => (
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
                    size={24} 
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
                  <Text style={[
                    styles.typeDescription,
                    {
                      color: formData.type === type.value ? '#FFFFFF' : colors.textSecondary,
                    }
                  ]}>
                    {type.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Input
            label="Monthly Rent"
            value={formData.rent}
            onChangeText={(value) => updateFormData('rent', value)}
            placeholder="Enter monthly rent amount"
            keyboardType="numeric"
            error={errors.rent}
            required
          />

          <Input
            label="Floor Number"
            value={formData.floor}
            onChangeText={(value) => updateFormData('floor', value)}
            placeholder="Enter floor number (0 for ground floor)"
            keyboardType="numeric"
            error={errors.floor}
            required
          />
        </Card>

        <Card style={styles.formCard}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Facilities</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
            Select all facilities available in this room
          </Text>
          
          <View style={styles.facilitiesContainer}>
            {availableFacilities.map((facility) => (
              <TouchableOpacity
                key={facility.id}
                style={[
                  styles.facilityOption,
                  {
                    backgroundColor: formData.facilities.includes(facility.id) 
                      ? `${colors.primary}15` 
                      : colors.surface,
                    borderColor: formData.facilities.includes(facility.id) 
                      ? colors.primary 
                      : colors.border,
                  }
                ]}
                onPress={() => toggleFacility(facility.id)}
              >
                <Ionicons 
                  name={facility.icon as any} 
                  size={20} 
                  color={formData.facilities.includes(facility.id) ? colors.primary : colors.textSecondary} 
                />
                <Text style={[
                  styles.facilityLabel,
                  {
                    color: formData.facilities.includes(facility.id) ? colors.primary : colors.text,
                  }
                ]}>
                  {facility.label}
                </Text>
                {formData.facilities.includes(facility.id) && (
                  <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Preview Card */}
        <Card style={styles.previewCard}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Preview</Text>
          <View style={styles.previewContent}>
            <View style={styles.previewHeader}>
              <Text style={[styles.previewRoomNumber, { color: colors.text }]}>
                Room {formData.number || '---'}
              </Text>
              <Text style={[styles.previewRent, { color: colors.primary }]}>
                ₹{formData.rent || '0'}/month
              </Text>
            </View>
            <Text style={[styles.previewType, { color: colors.textSecondary }]}>
              {formData.type.charAt(0).toUpperCase() + formData.type.slice(1)} • Floor {formData.floor || '0'}
            </Text>
            {formData.facilities.length > 0 && (
              <View style={styles.previewFacilities}>
                <Text style={[styles.previewFacilitiesLabel, { color: colors.textSecondary }]}>
                  Facilities:
                </Text>
                <View style={styles.previewFacilitiesList}>
                  {formData.facilities.map((facilityId) => {
                    const facility = availableFacilities.find(f => f.id === facilityId);
                    return facility ? (
                      <View key={facilityId} style={[styles.previewFacilityTag, { backgroundColor: `${colors.primary}15` }]}>
                        <Text style={[styles.previewFacilityText, { color: colors.primary }]}>
                          {facility.label}
                        </Text>
                      </View>
                    ) : null;
                  })}
                </View>
              </View>
            )}
          </View>
        </Card>

        <View style={styles.buttonContainer}>
          <Button
            title="Cancel"
            onPress={() => router.back()}
            variant="outline"
            style={styles.cancelButton}
          />
          <Button
            title="Add Room"
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
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  typeContainer: {
    gap: 12,
  },
  typeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
  },
  typeLabel: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  typeDescription: {
    fontSize: 12,
  },
  facilitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  facilityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
    minWidth: '45%',
  },
  facilityLabel: {
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
  },
  previewCard: {
    marginBottom: 16,
  },
  previewContent: {
    gap: 8,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  previewRoomNumber: {
    fontSize: 18,
    fontWeight: '600',
  },
  previewRent: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  previewType: {
    fontSize: 14,
  },
  previewFacilities: {
    marginTop: 8,
  },
  previewFacilitiesLabel: {
    fontSize: 12,
    marginBottom: 6,
  },
  previewFacilitiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  previewFacilityTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  previewFacilityText: {
    fontSize: 10,
    fontWeight: '500',
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
