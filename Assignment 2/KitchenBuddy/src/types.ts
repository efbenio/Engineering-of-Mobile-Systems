export type Category = 'fruit' | 'vegetable' | 'dairy' | 'fish' | 'meat' | 'liquid' | 'other'
export type StorageLocation = 'fridge' | 'freezer' | 'pantry'
export type ConfectionType = 'fresh' | 'canned' | 'frozen' | 'cured'

export interface Ingredient {
  id: string
  name: string
  category?: Category
  location?: StorageLocation
  confectionType?: ConfectionType
  expirationDate?: string
  addedAt: string
}

export interface IngredientFormData {
  name: string
  category?: Category
  location?: StorageLocation
  confectionType?: ConfectionType
  expirationDate?: string
}

export type RootStackParamList = {
  Tabs: undefined
  Edit: { id: string }
}

export type TabParamList = {
  Add: undefined
  Expiring: undefined
  Browse: undefined
}
