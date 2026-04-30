import React, { useState } from 'react'
import { View, Text, TextInput, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { IngredientList } from '../components/IngredientList'
import { useIngredients } from '../context'
import { RootStackParamList } from '../types'

type Nav = NativeStackNavigationProp<RootStackParamList>

export const ExpiringScreen: React.FC = () => {
  const { ingredients } = useIngredients()
  const navigation = useNavigation<Nav>()
  const [days, setDays] = useState('7')

  const daysNum = Math.max(1, parseInt(days, 10) || 7)
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() + daysNum)

  const expiring = ingredients
    .filter(i => i.expirationDate && new Date(i.expirationDate) <= cutoff)
    .sort(
      (a, b) =>
        new Date(a.expirationDate!).getTime() - new Date(b.expirationDate!).getTime()
    )

  return (
    <View style={styles.container}>
      <View style={styles.control}>
        <Text style={styles.controlLabel}>Expiring within</Text>
        <TextInput
          style={styles.daysInput}
          value={days}
          onChangeText={setDays}
          keyboardType="number-pad"
          selectTextOnFocus
        />
        <Text style={styles.controlLabel}>days</Text>
      </View>
      <IngredientList
        ingredients={expiring}
        onSelect={item => navigation.navigate('Edit', { id: item.id })}
        emptyMessage="No ingredients expiring within this period."
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f7' },
  control: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  controlLabel: { fontSize: 15, color: '#333' },
  daysInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    width: 52,
    textAlign: 'center',
    fontSize: 15,
    color: '#333',
  },
})
