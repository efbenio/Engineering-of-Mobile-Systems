import React from 'react'
import { View, StyleSheet } from 'react-native'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { IngredientForm } from '../components/IngredientForm'
import { useIngredients } from '../context'
import { IngredientFormData, RootStackParamList } from '../types'

type Route = RouteProp<RootStackParamList, 'Edit'>
type Nav = NativeStackNavigationProp<RootStackParamList>

export const EditScreen: React.FC = () => {
  const { params } = useRoute<Route>()
  const navigation = useNavigation<Nav>()
  const { ingredients, updateIngredient } = useIngredients()

  const ingredient = ingredients.find(i => i.id === params.id)
  if (!ingredient) return null

  const handleSubmit = async (data: IngredientFormData) => {
    await updateIngredient({ ...ingredient, ...data })
    navigation.goBack()
  }

  return (
    <View style={styles.container}>
      <IngredientForm initial={ingredient} onSubmit={handleSubmit} submitLabel="Save changes" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f7' },
})
