import { PrismaClient, Gender, MaritalStatus, MemberCategory, MemberSituation, MembershipStatus } from '../src/generated/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // 1. Create Admin User
  console.log('Creating admin user...');
  const hashedPassword = await bcrypt.hash('Admin@123', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@adnaepc.local' },
    update: {},
    create: {
      email: 'admin@adnaepc.local',
      name: 'Administrateur',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });
  console.log(`✓ Admin user created: ${adminUser.email}`);

  // 2. Create Associations
  console.log('Creating associations...');
  const dorcas = await prisma.association.upsert({
    where: { name: 'Dorcas' },
    update: {},
    create: {
      name: 'Dorcas',
      description: 'Association des femmes',
    },
  });

  const hommes = await prisma.association.upsert({
    where: { name: 'Association des Hommes' },
    update: {},
    create: {
      name: 'Association des Hommes',
      description: 'Association des hommes engagés',
    },
  });

  const jeunes = await prisma.association.upsert({
    where: { name: 'Union Cadette des Jeunes Gens' },
    update: {},
    create: {
      name: 'Union Cadette des Jeunes Gens',
      description: 'Association des jeunes',
    },
  });
  console.log(`✓ Created 3 associations`);

  // 3. Create Members
  console.log('Creating members...');
  const member1 = await prisma.member.upsert({
    where: { matricule: '001-aa' },
    update: {},
    create: {
      matricule: '001-aa',
      firstName: 'Jean',
      lastName: 'NGONO',
      gender: Gender.MALE,
      dateOfBirth: new Date('1985-03-15'),
      maritalStatus: MaritalStatus.MARRIED,
      category: MemberCategory.ADULT,
      situation: MemberSituation.ACTIVE,
      membershipStatus: MembershipStatus.MEMBER,
      phone: '612345678',
      email: 'jean.ngono@example.cm',
      address: 'Yaoundé, Cameroun',
      profession: 'Ingénieur',
    },
  });

  const member2 = await prisma.member.upsert({
    where: { matricule: '002-aa' },
    update: {},
    create: {
      matricule: '002-aa',
      firstName: 'Marie',
      lastName: 'KAMGA',
      gender: Gender.FEMALE,
      dateOfBirth: new Date('1990-07-22'),
      maritalStatus: MaritalStatus.MARRIED,
      category: MemberCategory.ADULT,
      situation: MemberSituation.ACTIVE,
      membershipStatus: MembershipStatus.MEMBER,
      phone: '698765432',
      email: 'marie.kamga@example.cm',
      address: 'Douala, Cameroun',
      profession: 'Enseignante',
    },
  });

  const member3 = await prisma.member.upsert({
    where: { matricule: '003-aa' },
    update: {},
    create: {
      matricule: '003-aa',
      firstName: 'Paul',
      lastName: 'FOTSO',
      gender: Gender.MALE,
      dateOfBirth: new Date('2000-12-05'),
      maritalStatus: MaritalStatus.SINGLE,
      category: MemberCategory.YOUTH,
      situation: MemberSituation.ACTIVE,
      membershipStatus: MembershipStatus.MEMBER,
      phone: '677123456',
      email: 'paul.fotso@example.cm',
      address: 'Bafoussam, Cameroun',
      profession: 'Étudiant',
    },
  });

  const member4 = await prisma.member.upsert({
    where: { matricule: '004-aa' },
    update: {},
    create: {
      matricule: '004-aa',
      firstName: 'Élisabeth',
      lastName: 'MBALLA',
      gender: Gender.FEMALE,
      dateOfBirth: new Date('1975-05-18'),
      maritalStatus: MaritalStatus.WIDOWED,
      category: MemberCategory.ADULT,
      situation: MemberSituation.ACTIVE,
      membershipStatus: MembershipStatus.MEMBER,
      phone: '655234567',
      email: 'elisabeth.mballa@example.cm',
      address: 'Yaoundé, Cameroun',
      profession: 'Commerçante',
    },
  });

  const member5 = await prisma.member.upsert({
    where: { matricule: '005-aa' },
    update: {},
    create: {
      matricule: '005-aa',
      firstName: 'André',
      lastName: 'TCHUENTE',
      gender: Gender.MALE,
      dateOfBirth: new Date('1988-09-30'),
      maritalStatus: MaritalStatus.SINGLE,
      category: MemberCategory.ADULT,
      situation: MemberSituation.ACTIVE,
      membershipStatus: MembershipStatus.VISITOR,
      phone: '670987654',
      address: 'Yaoundé, Cameroun',
      profession: 'Informaticien',
    },
  });
  console.log(`✓ Created 5 members`);

  // 4. Link members to associations
  console.log('Linking members to associations...');
  await prisma.memberAssociation.upsert({
    where: {
      memberId_associationId: {
        memberId: member1.id,
        associationId: hommes.id,
      },
    },
    update: {},
    create: {
      memberId: member1.id,
      associationId: hommes.id,
      joinDate: new Date('2020-01-15'),
    },
  });

  await prisma.memberAssociation.upsert({
    where: {
      memberId_associationId: {
        memberId: member2.id,
        associationId: dorcas.id,
      },
    },
    update: {},
    create: {
      memberId: member2.id,
      associationId: dorcas.id,
      joinDate: new Date('2019-06-10'),
    },
  });

  await prisma.memberAssociation.upsert({
    where: {
      memberId_associationId: {
        memberId: member3.id,
        associationId: jeunes.id,
      },
    },
    update: {},
    create: {
      memberId: member3.id,
      associationId: jeunes.id,
      joinDate: new Date('2021-03-20'),
    },
  });

  await prisma.memberAssociation.upsert({
    where: {
      memberId_associationId: {
        memberId: member4.id,
        associationId: dorcas.id,
      },
    },
    update: {},
    create: {
      memberId: member4.id,
      associationId: dorcas.id,
      joinDate: new Date('2018-01-05'),
    },
  });

  await prisma.memberAssociation.upsert({
    where: {
      memberId_associationId: {
        memberId: member5.id,
        associationId: hommes.id,
      },
    },
    update: {},
    create: {
      memberId: member5.id,
      associationId: hommes.id,
      joinDate: new Date('2023-08-12'),
    },
  });
  console.log(`✓ Linked members to associations`);

  // 5. Create Commitments for current year
  const currentYear = new Date().getFullYear();
  console.log(`Creating commitments for year ${currentYear}...`);

  await prisma.commitment.upsert({
    where: {
      memberId_year: {
        memberId: member1.id,
        year: currentYear,
      },
    },
    update: {},
    create: {
      memberId: member1.id,
      year: currentYear,
      titheAmount: 500000,
      constructionAmount: 200000,
      debtAmount: 0,
      totalCommitment: 700000,
    },
  });

  await prisma.commitment.upsert({
    where: {
      memberId_year: {
        memberId: member2.id,
        year: currentYear,
      },
    },
    update: {},
    create: {
      memberId: member2.id,
      year: currentYear,
      titheAmount: 300000,
      constructionAmount: 150000,
      debtAmount: 50000,
      totalCommitment: 500000,
    },
  });

  await prisma.commitment.upsert({
    where: {
      memberId_year: {
        memberId: member3.id,
        year: currentYear,
      },
    },
    update: {},
    create: {
      memberId: member3.id,
      year: currentYear,
      titheAmount: 100000,
      constructionAmount: 50000,
      debtAmount: 0,
      totalCommitment: 150000,
    },
  });
  console.log(`✓ Created 3 commitments`);

  console.log('\n✅ Seed completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`   - 1 Admin user (admin@adnaepc.local / Admin@123)`);
  console.log(`   - 3 Associations (Dorcas, Hommes, Jeunes)`);
  console.log(`   - 5 Members`);
  console.log(`   - 5 Member-Association links`);
  console.log(`   - 3 Commitments for ${currentYear}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
