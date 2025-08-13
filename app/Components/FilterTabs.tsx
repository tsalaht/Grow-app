import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Clock, Star, Tag, Grid3x3 as Grid3X3 } from 'lucide-react-native';
import { FilterType } from '@/types/Note';

interface FilterTabsProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export function FilterTabs({ activeFilter, onFilterChange }: FilterTabsProps) {
  const filters = [
    { key: 'all', label: 'الكل', icon: Grid3X3 },
    { key: 'reminders', label: 'تذكيرات', icon: Clock },
    { key: 'pinned', label: 'مثبتة', icon: Star },
    { key: 'tags', label: 'وسوم', icon: Tag },
  ] as const;

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {filters.map((filter) => {
        const IconComponent = filter.icon;
        const isActive = activeFilter === filter.key;
        
        return (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterTab,
              isActive && styles.filterTabActive
            ]}
            onPress={() => onFilterChange(filter.key)}
            activeOpacity={0.7}
          >
            <IconComponent 
              size={18} 
              color={isActive ? '#ffffff' : '#6B7280'} 
            />
            <Text style={[
              styles.filterTabText,
              isActive && styles.filterTabTextActive
            ]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  contentContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    gap: 6,
  },
  filterTabActive: {
    backgroundColor: '#22C55E',
  },
  filterTabText: {
    fontSize: 14,
    fontFamily: 'Cairo-Bold',
    color: '#6B7280',
  },
  filterTabTextActive: {
    color: '#ffffff',
  },
});