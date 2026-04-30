import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  StyleSheet,
  Alert,
} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { Category, ConfectionType, Ingredient, IngredientFormData, StorageLocation } from '../types'

const CATEGORIES: Category[] = ['fruit', 'vegetable', 'dairy', 'fish', 'meat', 'liquid', 'other']
const LOCATIONS: StorageLocation[] = ['fridge', 'freezer', 'pantry']
const CONFECTION_TYPES: ConfectionType[] = ['fresh', 'canned', 'frozen', 'cured']
const ESTIMATES = [
  { label: '1 week', days: 7 },
  { label: '10 days', days: 10 },
  { label: '1 month', days: 30 },
]

const addDays = (days: number): Date => {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d
}

interface Props {
  initial?: Ingredient
  onSubmit: (data: IngredientFormData) => void
  submitLabel: string
}

export const IngredientForm: React.FC<Props> = ({ initial, onSubmit, submitLabel }) => {
  const [name, setName] = useState(initial?.name ?? '')
  const [category, setCategory] = useState<Category | undefined>(initial?.category)
  const [location, setLocation] = useState<StorageLocation | undefined>(initial?.location)
  const [confectionType, setConfectionType] = useState<ConfectionType | undefined>(
    initial?.confectionType
  )
  const [expirationDate, setExpirationDate] = useState<Date | undefined>(
    initial?.expirationDate ? new Date(initial.expirationDate) : undefined
  )
  const [showPicker, setShowPicker] = useState(false)

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert('Name required', 'Please enter the ingredient name.')
      return
    }
    onSubmit({
      name: name.trim(),
      category,
      location,
      confectionType,
      expirationDate: expirationDate?.toISOString(),
    })
  }

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.label}>Name *</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="e.g. Milk"
        placeholderTextColor="#aaa"
      />

      <ChipPicker label="Category" options={CATEGORIES} value={category} onChange={setCategory} />
      <ChipPicker label="Location" options={LOCATIONS} value={location} onChange={setLocation} />
      <ChipPicker
        label="Confection type"
        options={CONFECTION_TYPES}
        value={confectionType}
        onChange={setConfectionType}
      />

      <Text style={styles.label}>Expiration date</Text>
      <View style={styles.row}>
        {ESTIMATES.map(({ label, days }) => (
          <TouchableOpacity key={label} style={styles.chip} onPress={() => setExpirationDate(addDays(days))}>
            <Text style={styles.chipText}>{label}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.chip} onPress={() => setShowPicker(true)}>
          <Text style={styles.chipText}>Pick date</Text>
        </TouchableOpacity>
      </View>

      {expirationDate && (
        <View style={styles.row}>
          <Text style={styles.dateText}>{expirationDate.toLocaleDateString()}</Text>
          <TouchableOpacity onPress={() => setExpirationDate(undefined)}>
            <Text style={styles.clearText}>  Remove</Text>
          </TouchableOpacity>
        </View>
      )}

      {showPicker && (
        <DateTimePicker
          value={expirationDate ?? new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={(_, date) => {
            if (Platform.OS !== 'ios') setShowPicker(false)
            if (date) setExpirationDate(date)
          }}
        />
      )}
      {showPicker && Platform.OS === 'ios' && (
        <TouchableOpacity style={styles.doneButton} onPress={() => setShowPicker(false)}>
          <Text style={styles.doneText}>Done</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>{submitLabel}</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

interface ChipPickerProps<T extends string> {
  label: string
  options: T[]
  value: T | undefined
  onChange: (v: T | undefined) => void
}

function ChipPicker<T extends string>({ label, options, value, onChange }: ChipPickerProps<T>) {
  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        {options.map(opt => (
          <TouchableOpacity
            key={opt}
            style={[styles.chip, value === opt && styles.chipSelected]}
            onPress={() => onChange(value === opt ? undefined : opt)}
          >
            <Text style={[styles.chipText, value === opt && styles.chipTextSelected]}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 6 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fafafa',
  },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f5f5f5',
  },
  chipSelected: { backgroundColor: '#2196F3', borderColor: '#2196F3' },
  chipText: { fontSize: 13, color: '#555' },
  chipTextSelected: { color: '#fff' },
  dateText: { fontSize: 14, color: '#333', paddingVertical: 4 },
  clearText: { fontSize: 14, color: '#e53935', paddingVertical: 4 },
  doneButton: { alignSelf: 'flex-end', padding: 8 },
  doneText: { color: '#2196F3', fontWeight: '600', fontSize: 15 },
  submitButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  submitText: { color: '#fff', fontSize: 16, fontWeight: '600' },
})
