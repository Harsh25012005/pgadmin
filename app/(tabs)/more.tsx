import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useTheme } from '../../contexts/ThemeContext';
import { useData } from '../../contexts/DataContext';
import { Card } from '../../components/ui/Card';

export default function MoreScreen() {
  const { colors, theme, setTheme, isDark } = useTheme();
  const { complaints, announcements } = useData();
  const router = useRouter();

  const menuSections = [
    {
      title: 'Management',
      items: [
        {
          title: 'Complaints',
          subtitle: `${complaints.filter(c => c.status === 'open').length} open issues`,
          icon: 'warning',
          route: '/complaints',
          color: colors.warning,
        },
        {
          title: 'Announcements',
          subtitle: `${announcements.filter(a => a.isActive).length} active`,
          icon: 'megaphone',
          route: '/announcements',
          color: colors.info,
        },
        {
          title: 'Reports',
          subtitle: 'Analytics and insights',
          icon: 'bar-chart',
          route: '/reports',
          color: colors.secondary,
        },
      ],
    },
    {
      title: 'Tools',
      items: [
        {
          title: 'Backup Data',
          subtitle: 'Export your data',
          icon: 'cloud-download',
          route: '/backup',
          color: colors.primary,
        },
        {
          title: 'Import Data',
          subtitle: 'Import from file',
          icon: 'cloud-upload',
          route: '/import',
          color: colors.success,
        },
        {
          title: 'Settings',
          subtitle: 'App preferences',
          icon: 'settings',
          route: '/settings',
          color: colors.textSecondary,
        },
      ],
    },
  ];

  const quickStats = [
    {
      title: 'Open Complaints',
      value: complaints.filter(c => c.status === 'open').length,
      icon: 'warning',
      color: colors.warning,
    },
    {
      title: 'Active Announcements',
      value: announcements.filter(a => a.isActive).length,
      icon: 'megaphone',
      color: colors.info,
    },
    {
      title: 'High Priority Issues',
      value: complaints.filter(c => c.priority === 'high' && c.status === 'open').length,
      icon: 'alert-circle',
      color: colors.error,
    },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <View>
          <Text style={[styles.headerTitle, { color: '#FFFFFF' }]}>More</Text>
          <Text style={[styles.headerSubtitle, { color: '#FFFFFF' }]}>
            Additional features and settings
          </Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <Ionicons name="person-circle" size={32} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        {quickStats.map((stat, index) => (
          <Card key={index} style={styles.statCard}>
            <View style={styles.statContent}>
              <Ionicons name={stat.icon as any} size={24} color={stat.color} />
              <Text style={[styles.statNumber, { color: colors.text }]}>{stat.value}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{stat.title}</Text>
            </View>
          </Card>
        ))}
      </View>

      {/* Theme Toggle */}
      <Card style={styles.section}>
        <View style={styles.themeContainer}>
          <View style={styles.themeInfo}>
            <Ionicons 
              name={isDark ? 'moon' : 'sunny'} 
              size={24} 
              color={colors.primary} 
            />
            <View style={styles.themeText}>
              <Text style={[styles.themeTitle, { color: colors.text }]}>Dark Mode</Text>
              <Text style={[styles.themeSubtitle, { color: colors.textSecondary }]}>
                {isDark ? 'Dark theme enabled' : 'Light theme enabled'}
              </Text>
            </View>
          </View>
          <Switch
            value={isDark}
            onValueChange={(value) => setTheme(value ? 'dark' : 'light')}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={isDark ? '#FFFFFF' : colors.textSecondary}
          />
        </View>
      </Card>

      {/* Menu Sections */}
      {menuSections.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{section.title}</Text>
          <Card style={styles.menuCard}>
            {section.items.map((item, itemIndex) => (
              <TouchableOpacity
                key={itemIndex}
                style={[
                  styles.menuItem,
                  itemIndex < section.items.length - 1 && {
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                  }
                ]}
                onPress={() => console.log(`Navigate to ${item.route}`)}
              >
                <View style={styles.menuItemContent}>
                  <View style={[styles.menuIcon, { backgroundColor: `${item.color}15` }]}>
                    <Ionicons name={item.icon as any} size={20} color={item.color} />
                  </View>
                  <View style={styles.menuText}>
                    <Text style={[styles.menuTitle, { color: colors.text }]}>{item.title}</Text>
                    <Text style={[styles.menuSubtitle, { color: colors.textSecondary }]}>
                      {item.subtitle}
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </Card>
        </View>
      ))}

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Activity</Text>
        <Card style={styles.activityCard}>
          {complaints.slice(-3).map((complaint, index) => (
            <View key={complaint.id} style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: `${colors.warning}15` }]}>
                <Ionicons name="warning" size={16} color={colors.warning} />
              </View>
              <View style={styles.activityContent}>
                <Text style={[styles.activityTitle, { color: colors.text }]}>
                  New complaint: {complaint.title}
                </Text>
                <Text style={[styles.activitySubtitle, { color: colors.textSecondary }]}>
                  From {complaint.tenantName} • {new Date(complaint.createdDate).toLocaleDateString()}
                </Text>
              </View>
            </View>
          ))}
          {complaints.length === 0 && (
            <Text style={[styles.emptyActivity, { color: colors.textSecondary }]}>
              No recent activity
            </Text>
          )}
        </Card>
      </View>

      {/* App Info */}
      <Card style={[styles.section, { marginBottom: 32 }]}>
        <View style={styles.appInfoContent}>
          <Text style={[styles.appName, { color: colors.text }]}>PG Admin</Text>
          <Text style={[styles.appVersion, { color: colors.textSecondary }]}>Version 1.0.0</Text>
          <Text style={[styles.appDescription, { color: colors.textSecondary }]}>
            Complete PG management solution
          </Text>
        </View>
      </Card>
    </ScrollView>
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
  profileButton: {
    padding: 4,
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
  },
  statContent: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 4,
  },
  section: {
    margin: 16,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  themeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  themeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  themeText: {
    flex: 1,
  },
  themeTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  themeSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  menuCard: {
    padding: 0,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  menuSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  activityCard: {
    padding: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  activitySubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  emptyActivity: {
    textAlign: 'center',
    fontStyle: 'italic',
    padding: 20,
  },
  appInfoContent: {
    alignItems: 'center',
    padding: 20,
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  appVersion: {
    fontSize: 14,
    marginTop: 4,
  },
  appDescription: {
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
});
