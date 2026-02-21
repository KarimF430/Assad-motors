export interface CarColor {
  id: string
  name: string
  hexCode: string
  popular: boolean
}

export interface CarSpecifications {
  engine: string
  power: string
  torque: string
  transmission: string
  fuelType: string
  mileage: string
  seatingCapacity: number
  groundClearance: string
  bootSpace: string
  safetyRating: string
  airbags: number
  abs: boolean
}

export interface ProsCons {
  title: string
  description: string
  category: string
}

export interface CarData {
  brand: string
  model: string
  fullName: string
  startingPrice: number
  endingPrice: number
  rating: number
  reviewCount: number
  launchYear: number
  description: string
  images: string[]
  specifications: CarSpecifications
  colors: CarColor[]
  pros: string[]
  cons: string[]
  mileage: {
    city: string
    highway: string
    combined: string
  }
}
