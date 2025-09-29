import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface StatusBadgeProps {
  status: string;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'default';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, variant = 'default' }) => {
  const { colors } = useTheme();

  const getStatusColor = () => {
    switch (variant) {
      case 'success':
        return colors.success;
      case 'warning':
        return colors.warning;
      case 'error':
        return colors.error;
      case 'info':
        return colors.info;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusVariant = (status: string) => {
    const lowerStatus = status.toLowerCase();
    if (['active', 'paid', 'resolved', 'occupied'].includes(lowerStatus)) {
      return 'success';
    }
    if (['pending', 'in-progress', 'maintenance'].includes(lowerStatus)) {
      return 'warning';
    }
    if (['inactive', 'overdue', 'open', 'vacant'].includes(lowerStatus)) {
      return 'error';
    }
    return 'default';
  };

  const finalVariant = variant === 'default' ? getStatusVariant(status) : variant;
  const statusColor = getStatusColor();

  return (
    <View style={[
      styles.badge,
      { 
        backgroundColor: `${statusColor}20`,
        borderColor: statusColor,
      }
    ]}>
      <Text style={[styles.text, { color: statusColor }]}>
        {status.toUpperCase()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 10,
    fontWeight: '600',
  },
});
