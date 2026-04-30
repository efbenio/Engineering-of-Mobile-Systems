import React, { useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { IngredientList } from '../components/IngredientList'
import { useIngredients } from '../context'
import {
  Category,
  ConfectionType,
  Ingredient,
  RootStackParamList,
  StorageLocation,
} from '../types'

type Nav = NativeStackNavigationProp<RootStackParamList>
type QueryType = 'missing' | 'recent' | 'location' | 'category' | 'confection'

const QUERY_TABS: { key: QueryType; label: string }[] = [
  { key: 'missing', label: 'Missing data' },
  { key: 'recent', label: 'Recent' },
  { key: 'location', label: 'Location' },
  { key: 'category', label: 'Category' },
  { key: 'confection', label: 'Confection' },
]

const LOCATIONS: StorageLocation[] = ['fridge', 'freezer', 'pantry']
const CATEGORIES: Category[] = ['fruit', 'vegetable', 'dairy', 'fish', 'meat', 'liquid', 'other']
const CONFECTION_TYPES: ConfectionType[] = ['fresh', 'canned', 'frozen', 'cured']

export const BrowseScreen: React.FC = () => {
  const { ingredients } = useIngredients()
  const navigation = useNavigation<Nav>()
  const [query, setQuery] = useState<QueryType>('missing')
  const [filterLocation, setFilterLocation] = useState<StorageLocation>('fridge')
  const [filterCategory, setFilterCategory] = useState<Category>('fruit')
  const [filterConfection, setFilterConfection] = useState<ConfectionType>('fresh')

  const getResults = (): Ingredient[] => {
    switch (query) {
      case 'missing':
        return ingredients.filter(
          i => !i.category || !i.location || !i.confectionType || !i.expirationDate
        )
      case 'recent':
        return [...ingredients]
          .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
          .slice(0, 20)
      case 'location':
        return ingredients.filter(i => i.location === filterLocation)
      case 'category':
        return ingredients.filter(i => i.category === filterCategory)
      case 'confection':
        return ingredients.filter(i => i.confectionType === filterConfection)
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsScroll}
        contentContainerStyle={styles.tabsContent}
      >
        {QUERY_TABS.map(({ key, label }) => (
          <TouchableOpacity
            key={key}
            style={[styles.tab, query === key && styles.tabActive]}
            onPress={() => setQuery(key)}
          >
            <Text style={[styles.tabText, query === key && styles.tabTextActive]}>{label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {query === 'location' && (
        <SubFilter options={LOCATIONS} value={filterLocation} onChange={setFilterLocation} />
      )}
      {query === 'category' && (
        <SubFilter options={CATEGORIES} value={filterCategory} onChange={setFilterCategory} />
      )}
      {query === 'confection' && (
        <SubFilter
          options={CONFECTION_TYPES}
          value={filterConfection}
          onChange={setFilterConfection}
        />
      )}

      <IngredientList
        ingredients={getResults()}
        onSelect={item => navigation.navigate('Edit', { id: item.id })}
        emptyMessage="No ingredients match this query."
      />
    </View>
  )
}

interface SubFilterProps<T extends string> {
  options: T[]
  value: T
  onChange: (v: T) => void
}

function SubFilter<T extends string>({ options, value, onChange }: SubFilterProps<T>) {
  return (
    <View style={styles.subFilter}>
      {options.map(opt => (
        <TouchableOpacity
          key={opt}
          style={[styles.chip, value === opt && styles.chipActive]}
          onPress={() => onChange(opt)}
        >
          <Text style={[styles.chipText, value === opt && styles.chipTextActive]}>{opt}</Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f7' },
  tabsScroll: {
    flexGrow: 0,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tabsContent: { paddingHorizontal: 8, paddingVertical: 10, gap: 6 },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f5f5f5',
  },
  tabActive: { backgroundColor: '#2196F3', borderColor: '#2196F3' },
  tabText: { fontSize: 13, color: '#555' },
  tabTextActive: { color: '#fff', fontWeight: '600' },
  subFilter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f5f5f5',
  },
  chipActive: { backgroundColor: '#1976D2', borderColor: '#1976D2' },
  chipText: { fontSize: 12, color: '#555' },
  chipTextActive: { color: '#fff' },
})
