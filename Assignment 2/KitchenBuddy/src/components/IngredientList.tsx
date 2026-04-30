import React, { useState } from 'react'
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { Ingredient } from '../types'

interface Props {
  ingredients: Ingredient[]
  onSelect: (ingredient: Ingredient) => void
  emptyMessage?: string
  header?: React.ReactElement
}

const hasMissingData = (i: Ingredient) =>
  !i.category || !i.location || !i.confectionType || !i.expirationDate

const formatDate = (iso: string) => new Date(iso).toLocaleDateString()

export const IngredientList: React.FC<Props> = ({
  ingredients,
  onSelect,
  emptyMessage,
  header,
}) => {
  const [search, setSearch] = useState('')

  const filtered = search
    ? ingredients.filter(i => i.name.toLowerCase().includes(search.toLowerCase()))
    : ingredients

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.search}
        placeholder="Search..."
        placeholderTextColor="#aaa"
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        data={filtered}
        keyExtractor={i => i.id}
        ListHeaderComponent={header ?? null}
        ListEmptyComponent={
          <Text style={styles.empty}>{emptyMessage ?? 'No ingredients found.'}</Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => onSelect(item)}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemName}>{item.name}</Text>
              {hasMissingData(item) && <Text style={styles.missingBadge}>missing data</Text>}
            </View>
            <View style={styles.tags}>
              {item.category && <Text style={styles.tag}>{item.category}</Text>}
              {item.location && <Text style={styles.tag}>{item.location}</Text>}
              {item.confectionType && <Text style={styles.tag}>{item.confectionType}</Text>}
              {item.expirationDate && (
                <Text style={styles.tag}>exp {formatDate(item.expirationDate)}</Text>
              )}
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  search: {
    margin: 12,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fafafa',
    fontSize: 15,
    color: '#333',
  },
  item: {
    marginHorizontal: 12,
    marginBottom: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemName: { fontSize: 16, fontWeight: '600', color: '#222' },
  missingBadge: {
    fontSize: 11,
    color: '#e65100',
    backgroundColor: '#fff3e0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 6 },
  tag: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  empty: { textAlign: 'center', color: '#999', marginTop: 48, fontSize: 15 },
})
