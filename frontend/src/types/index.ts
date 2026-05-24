export interface User {
  id: number;
  nim: string;
  name: string;
}

export interface CategoryEvent {
  id: number;
  name: string;
  description?: string;
  color: string;
  createdAt: string;
  updatedAt: string;
  _count?: { events: number };
}

export interface Pembicara {
  id: number;
  name: string;
  title: string;
  expertise: string;
  email?: string;
  phone?: string;
  bio?: string;
  photoUrl?: string;
  createdAt: string;
  updatedAt: string;
  _count?: { events: number };
}

export interface Event {
  id: number;
  title: string;
  description?: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  imageUrl?: string;
  categoryId: number;
  pembicaraId: number;
  category: CategoryEvent;
  pembicara: Pembicara;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (nim: string, password: string) => Promise<void>;
  logout: () => void;
}
