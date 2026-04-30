import React, { createContext, useContext, useEffect, useState } from 'react'
import { Ingredient } from './types'
import { loadIngredients, saveIngredients } from './storage'

interface ContextType {
  ingredients: Ingredient[]
  addIngredient: (ingredient: Ingredient) => Promise<void>
  updateIngredient: (ingredient: Ingredient) => Promise<void>
}

const IngredientsContext = createContext<ContextType | null>(null)

export const IngredientsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([])

  useEffect(() => {
    loadIngredients().then(setIngredients)
  }, [])

  const persist = async (updated: Ingredient[]) => {
    setIngredients(updated)
    await saveIngredients(updated)
  }

  const addIngredient = async (ingredient: Ingredient) =>
    persist([ingredient, ...ingredients])

  const updateIngredient = async (ingredient: Ingredient) =>
    persist(ingredients.map(i => (i.id === ingredient.id ? ingredient : i)))

  return (
    <IngredientsContext.Provider value={{ ingredients, addIngredient, updateIngredient }}>
      {children}
    </IngredientsContext.Provider>
  )
}

export const useIngredients = () => {
  const ctx = useContext(IngredientsContext)
  if (!ctx) throw new Error('useIngredients must be used within IngredientsProvider')
  return ctx
}
