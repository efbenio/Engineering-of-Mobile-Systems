import React, { useState } from 'react'
import { View, StyleSheet, Alert } from 'react-native'
import { IngredientForm } from '../components/IngredientForm'
import { useIngredients } from '../context'
import { Ingredient, IngredientFormData } from '../types'

const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`

export const AddScreen: React.FC = () => {
  const { addIngredient } = useIngredients()
  const [formKey, setFormKey] = useState(0)

  const handleSubmit = async (data: IngredientFormData) => {
    const ingredient: Ingredient = {
      ...data,
      id: generateId(),
      addedAt: new Date().toISOString(),
    }
    await addIngredient(ingredient)
    setFormKey(k => k + 1)
    Alert.alert('Added', `${data.name} has been added.`)
  }

  return (
    <View style={styles.container}>
      <IngredientForm key={formKey} onSubmit={handleSubmit} submitLabel="Add ingredient" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f7' },
})
