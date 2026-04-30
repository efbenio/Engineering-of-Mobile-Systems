import AsyncStorage from '@react-native-async-storage/async-storage'
import { Ingredient } from './types'

const KEY = '@kitchen_buddy/ingredients'

export const loadIngredients = async (): Promise<Ingredient[]> => {
  const json = await AsyncStorage.getItem(KEY)
  return json ? JSON.parse(json) : []
}

export const saveIngredients = async (ingredients: Ingredient[]): Promise<void> => {
  await AsyncStorage.setItem(KEY, JSON.stringify(ingredients))
}
