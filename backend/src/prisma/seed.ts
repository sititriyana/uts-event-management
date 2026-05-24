import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';


const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const hashedPassword = await bcrypt.hash('24090098', 10);

  await prisma.user.upsert({
    where: { nim: '24090098' },
    update: {
      name: 'Siti Triyana',
      password: hashedPassword,
    },
    create: {
      nim: '24090098',
      name: 'Siti Triyana',
      password: hashedPassword,
    },
  });

  console.log('✅ User: NIM 24090098 / Password 24090098');

  // Categories
  await prisma.categoryEvent.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Seminar',
      description: 'Event seminar akademik dan profesional',
      color: '#6366f1',
    },
  });

  await prisma.categoryEvent.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Workshop',
      description: 'Pelatihan dan workshop praktis',
      color: '#0ea5e9',
    },
  });

  await prisma.categoryEvent.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: 'Webinar',
      description: 'Seminar online via internet',
      color: '#10b981',
    },
  });

  console.log('✅ Categories: 3 data');

  // Pembicara
  await prisma.pembicara.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Budi Santoso, S.Tr.Kom.',
      title: 'Dosen',
      expertise: 'Artificial Intelligence & Machine Learning',
      email: 'budi.santoso@example.com',
      phone: '0811-2345-6789',
      bio: 'Pakar AI dengan pengalaman lebih dari 10 tahun.',
    },
  });

  await prisma.pembicara.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Siti Rahma, S.T., M.T.',
      title: 'Software Engineer',
      expertise: 'Full-Stack Web Development',
      email: 'siti.rahma@example.com',
      phone: '0812-3456-7890',
      bio: 'Software engineer berpengalaman di bidang web development modern.',
    },
  });

  console.log('✅ Pembicara: 2 data');

  // Events
  await prisma.event.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: 'Seminar Nasional Kecerdasan Buatan 2025',
      description: 'Membahas perkembangan terkini AI.',
      date: new Date('2025-08-15'),
      time: '09:00',
      location: 'Auditorium Utama',
      capacity: 200,
      status: 'upcoming',
      categoryId: 1,
      pembicaraId: 1,
    },
  });

  await prisma.event.upsert({
    where: { id: 2 },
    update: {},
    create: {
      title: 'Workshop React TypeScript',
      description: 'Belajar React + TypeScript dari dasar.',
      date: new Date('2025-07-20'),
      time: '08:00',
      location: 'Lab Komputer D2.15',
      capacity: 30,
      status: 'upcoming',
      categoryId: 2,
      pembicaraId: 2,
    },
  });

  console.log('✅ Events: 2 data');

  console.log('✅ Seeding selesai!');
  console.log('👤 Login: NIM 24090098 / Password: 24090098');
}

main()
  .catch((error) => {
    console.error('❌ Seeding gagal:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });