export type DemoCategory = {
  id: number;
  name: string;
  description?: string | null;
  color: string;
  createdAt: string;
  updatedAt: string;
};

export type DemoPembicara = {
  id: number;
  name: string;
  title: string;
  expertise: string;
  email?: string | null;
  phone?: string | null;
  bio?: string | null;
  photoUrl?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type DemoEvent = {
  id: number;
  title: string;
  description?: string | null;
  date: string;
  time: string;
  location: string;
  capacity: number;
  status: string;
  imageUrl?: string | null;
  categoryId: number;
  pembicaraId: number;
  createdAt: string;
  updatedAt: string;
};

const now = () => new Date().toISOString();

export let demoCategories: DemoCategory[] = [
  {
    id: 1,
    name: 'Seminar',
    description: 'Event seminar akademik dan profesional',
    color: '#7c3aed',
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 2,
    name: 'Workshop',
    description: 'Pelatihan dan praktik langsung',
    color: '#2563eb',
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 3,
    name: 'Webinar',
    description: 'Event online berbasis internet',
    color: '#10b981',
    createdAt: now(),
    updatedAt: now(),
  },
];

export let demoPembicara: DemoPembicara[] = [
  {
    id: 1,
    name: 'Dr. Ahmad Fauzi, M.Kom.',
    title: 'Dosen Senior',
    expertise: 'Artificial Intelligence',
    email: 'ahmad.fauzi@example.com',
    phone: '0811-2345-6789',
    bio: 'Pakar AI dengan pengalaman lebih dari 15 tahun.',
    photoUrl: '',
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 2,
    name: 'Siti Rahma, S.T., M.T.',
    title: 'Software Engineer',
    expertise: 'Full-Stack Web Development',
    email: 'siti.rahma@example.com',
    phone: '0812-3456-7890',
    bio: 'Software engineer berpengalaman di bidang web modern.',
    photoUrl: '',
    createdAt: now(),
    updatedAt: now(),
  },
];

export let demoEvents: DemoEvent[] = [
  {
    id: 1,
    title: 'Seminar Nasional Kecerdasan Buatan 2025',
    description: 'Membahas perkembangan terkini AI.',
    date: '2025-08-15T00:00:00.000Z',
    time: '09:00',
    location: 'Auditorium Utama',
    capacity: 200,
    status: 'upcoming',
    imageUrl: '',
    categoryId: 1,
    pembicaraId: 1,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 2,
    title: 'Workshop React TypeScript',
    description: 'Belajar React dan TypeScript dari dasar.',
    date: '2025-07-20T00:00:00.000Z',
    time: '08:00',
    location: 'Lab Komputer D2.15',
    capacity: 30,
    status: 'upcoming',
    imageUrl: '',
    categoryId: 2,
    pembicaraId: 2,
    createdAt: now(),
    updatedAt: now(),
  },
];

export const nextCategoryId = () =>
  demoCategories.length ? Math.max(...demoCategories.map((item) => item.id)) + 1 : 1;

export const nextPembicaraId = () =>
  demoPembicara.length ? Math.max(...demoPembicara.map((item) => item.id)) + 1 : 1;

export const nextEventId = () =>
  demoEvents.length ? Math.max(...demoEvents.map((item) => item.id)) + 1 : 1;

export const getCategoryWithCount = (category: DemoCategory) => ({
  ...category,
  _count: {
    events: demoEvents.filter((event) => event.categoryId === category.id).length,
  },
});

export const getPembicaraWithCount = (pembicara: DemoPembicara) => ({
  ...pembicara,
  _count: {
    events: demoEvents.filter((event) => event.pembicaraId === pembicara.id).length,
  },
});

export const getEventWithRelations = (event: DemoEvent) => ({
  ...event,
  category: demoCategories.find((category) => category.id === event.categoryId) || null,
  pembicara: demoPembicara.find((pembicara) => pembicara.id === event.pembicaraId) || null,
});
