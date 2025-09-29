import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useTheme } from '../../contexts/ThemeContext';
import { useData, Room } from '../../contexts/DataContext';
import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui/Button';

export default function RoomsScreen() {
  const { colors } = useTheme();
  const { rooms, tenants } = useData();
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'occupied' | 'vacant' | 'maintenance'>('all');

  const filteredRooms = rooms.filter(room => {
    if (filter === 'all') return true;
    return room.status === filter;
  });

  const stats = {
    totalRooms: rooms.length,
    occupiedRooms: rooms.filter(r => r.status === 'occupied').length,
    vacantRooms: rooms.filter(r => r.status === 'vacant').length,
    maintenanceRooms: rooms.filter(r => r.status === 'maintenance').length,
    totalRevenue: rooms.filter(r => r.status === 'occupied').reduce((sum, r) => sum + r.rent, 0),
  };

  const getRoomTypeIcon = (type: string) => {
    switch (type) {
      case 'single': return 'person';
      case 'double': return 'people';
      case 'triple': return 'people-circle';
      default: return 'bed';
    }
  };

  const getTenantName = (tenantId?: string) => {
    if (!tenantId) return null;
    const tenant = tenants.find(t => t.id === tenantId);
    return tenant?.name || 'Unknown Tenant';
  };

  const renderRoomItem = ({ item }: { item: Room }) => (
    <Card style={styles.roomCard}>
      <TouchableOpacity
        style={styles.roomContent}
        onPress={() => router.push(`/rooms/${item.id}` as any)}
      >
        <View style={styles.roomHeader}>
          <View style={styles.roomInfo}>
            <View style={styles.roomTitleRow}>
              <Ionicons 
                name={getRoomTypeIcon(item.type) as any} 
                size={20} 
                color={colors.primary} 
              />
              <Text style={[styles.roomNumber, { color: colors.text }]}>Room {item.number}</Text>
            </View>
            <Text style={[styles.roomType, { color: colors.textSecondary }]}>
              {item.type.charAt(0).toUpperCase() + item.type.slice(1)} • Floor {item.floor}
            </Text>
          </View>
          <View style={styles.roomStatus}>
            <Text style={[styles.rent, { color: colors.text }]}>₹{item.rent.toLocaleString()}/month</Text>
            <StatusBadge status={item.status} />
          </View>
        </View>
        
        {item.tenantId && (
          <View style={styles.tenantInfo}>
            <Ionicons name="person" size={16} color={colors.textSecondary} />
            <Text style={[styles.tenantName, { color: colors.textSecondary }]}>
              {getTenantName(item.tenantId)}
            </Text>
          </View>
        )}

        <View style={styles.facilitiesContainer}>
          <Text style={[styles.facilitiesLabel, { color: colors.textSecondary }]}>Facilities:</Text>
          <View style={styles.facilitiesList}>
            {item.facilities.map((facility, index) => (
              <View key={index} style={[styles.facilityTag, { backgroundColor: `${colors.primary}15` }]}>
                <Text style={[styles.facilityText, { color: colors.primary }]}>{facility}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.roomActions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: `${colors.primary}15` }]}
            onPress={() => router.push(`/rooms/${item.id}/edit` as any)}
          >
            <Ionicons name="create" size={16} color={colors.primary} />
            <Text style={[styles.actionText, { color: colors.primary }]}>Edit</Text>
          </TouchableOpacity>
          {item.status === 'vacant' && (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: `${colors.success}15` }]}
              onPress={() => router.push(`/tenants/add?roomId=${item.id}` as any)}
            >
              <Ionicons name="person-add" size={16} color={colors.success} />
              <Text style={[styles.actionText, { color: colors.success }]}>Assign</Text>
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
          <Text style={[styles.headerTitle, { color: '#FFFFFF' }]}>Rooms</Text>
          <Text style={[styles.headerSubtitle, { color: '#FFFFFF' }]}>
            {stats.occupiedRooms}/{stats.totalRooms} occupied • ₹{stats.totalRevenue.toLocaleString()}/month
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/rooms/add' as any)}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <Text style={[styles.statNumber, { color: colors.success }]}>
            {stats.occupiedRooms}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Occupied</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={[styles.statNumber, { color: colors.info }]}>
            {stats.vacantRooms}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Vacant</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={[styles.statNumber, { color: colors.warning }]}>
            {stats.maintenanceRooms}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Maintenance</Text>
        </Card>
      </View>

      {/* Filter Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
        <View style={styles.filterContainer}>
          {(['all', 'occupied', 'vacant', 'maintenance'] as const).map((filterOption) => (
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

      {/* Rooms List */}
      {filteredRooms.length > 0 ? (
        <FlatList
          data={filteredRooms}
          renderItem={renderRoomItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="bed-outline" size={64} color={colors.textSecondary} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No Rooms Found</Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            {rooms.length === 0 ? 'Add your first room to get started' : `No ${filter} rooms found`}
          </Text>
          {rooms.length === 0 && (
            <Button
              title="Add First Room"
              onPress={() => router.push('/rooms/add' as any)}
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
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
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
  roomCard: {
    marginBottom: 12,
  },
  roomContent: {
    padding: 16,
  },
  roomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  roomInfo: {
    flex: 1,
  },
  roomTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  roomNumber: {
    fontSize: 18,
    fontWeight: '600',
  },
  roomType: {
    fontSize: 14,
    marginTop: 2,
  },
  roomStatus: {
    alignItems: 'flex-end',
    gap: 8,
  },
  rent: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  tenantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  tenantName: {
    fontSize: 14,
  },
  facilitiesContainer: {
    marginBottom: 16,
  },
  facilitiesLabel: {
    fontSize: 12,
    marginBottom: 8,
  },
  facilitiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  facilityTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  facilityText: {
    fontSize: 10,
    fontWeight: '500',
  },
  roomActions: {
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
