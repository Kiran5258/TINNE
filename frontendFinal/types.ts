export interface IUser {
  id: string;
  fullName: string;
  email: string;
  address1: string,
  state: string,

  role: 'user' | 'admin';
}
export interface Product {
  stocks: any;
  _id: string;
  productName: string;
  description: string;
  price: number;
  offerPrice?: number;   // percentage discount
  sizes: {
    label: string;       // e.g. "500g", "1kg"
    stock: number;       // stock for this size
    price: number;       // price for this size
  }[];
  images: string[] | null;
  category: string;
  createdAt?: string;
  updatedAt?: string;
}


export interface CartItem {
  id: string; // product._id from backend
  productName: string;
  price: number;
  images: string[] | null;
  category: string;
  quantity: number;
  selectedSize: string; // "500g", "1kg", etc.
  originalPrice: number;
  offerPrice: number;
}


export interface OrderItem {
  productName: string;
  sizeLabel: string;
  quantity: number;
  price: number;
  subtotal: number;
}


export interface Sale {
  id: string;
  date: string;
  productTitle: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Shipped';
  customer: string;
}

export interface AuthState {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: IUser, token: string) => void;
  logout: () => void;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  author: {
    name: string;
    avatar: string;
  };
  publishedAt: string;
  readingTime: string;
  tags: string[];
  content: Array<{
    type: string;
    text?: string;
    level?: number;
    src?: string;
    caption?: string;
    items?: string[];
  }>;
}