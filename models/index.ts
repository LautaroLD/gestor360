export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  businesses: Business[] // un usuario puede tener varios negocios
  password?: string
  phone?: string
  birthDay?: string
  createdAt: Date
  updatedAt: Date
}

export interface Business {
  id: string
  name: string
  owner: User
  ownerId: string
  address?: string
  description?: string
  catalogs: Catalog[]
  products: Product[]
  orders: Order[]
  createdAt: Date
  updatedAt: Date
  categories: Category[]
}

export interface Category {
  id: string
  name: string
  slug: string
  businesses: Business[]
}

export interface Catalog {
  id: string
  title: string
  business: Business
  businessId: string
  products: Product[]
  createdAt: Date
  updatedAt: Date
}

export interface Product {
  id: string
  title: string
  description: string
  image?: string
  price: number
  business: Business
  businessId: string
  catalogs: Catalog[]
  orderProduct: OrderProduct[]
  createdAt: Date
  updatedAt: Date
}

export interface Order {
  id: string
  client: Client
  clientId: string
  business?: Business
  businessId?: string
  status: OrderStatus
  orderProduct: OrderProduct[]
  total: number | string
  deliveryDate: Date
  deliveryTime: string
  createdAt: Date
  updatedAt: Date
}

export interface OrderProduct {
  id: string
  order: Order
  orderId: string
  product: Product
  productId: string
  quantity: number
}

export interface Client {
  id: string
  name: string
  phone: string
  orders: Order[]
  createdAt: Date
  updatedAt: Date
}

export enum OrderStatus {
  pending = 'pending',
  ready = 'ready',
  cancelled = 'cancelled',
  delivered = 'delivered',
}
export interface chartData extends Product {
  color: string
  quantity: number
}
