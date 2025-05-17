const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Package = require('./models/Package');
const Constants = require('./models/Constants');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Package.deleteMany();
    await Constants.deleteMany();

    const packages = [
      {
        name: 'Male Wellness Package',
        description: 'Preventive tests tailored for men.',
        tier: 'Standard',
        tests: [
          { name: 'Prostate Screening', cost: 70 },
          { name: 'Cholesterol Test', cost: 50 },
          { name: 'Blood Pressure', cost: 30 },
          { name: 'Weight Check', cost: 20 }
        ]
      },
      {
        name: 'Female Wellness Package',
        description: 'Preventive tests tailored for women.',
        tier: 'Comprehensive',
        tests: [
          { name: 'Pregnancy Test', cost: 30 },
          { name: 'Pap Smear', cost: 60 },
          { name: 'Breast Exam', cost: 50 },
          { name: 'Blood Sugar', cost: 40 },
          { name: 'Blood Pressure', cost: 30 }
        ]
      },
      {
        name: 'Child Wellness Package',
        description: 'Preventive screenings for children under 18.',
        tier: 'Basic',
        tests: [
          { name: 'Malaria Test', cost: 35 },
          { name: 'Deworming Review', cost: 25 },
          { name: 'Urine Test', cost: 20 },
          { name: 'Weight Check', cost: 20 },
          { name: 'Eye Check', cost: 30 }
        ]
      },
      {
        name: 'General Wellness Package',
        description: 'Core check-up for all ages and genders.',
        tier: 'Standard',
        tests: [
          { name: 'Blood Pressure', cost: 30 },
          { name: 'Blood Sugar', cost: 40 },
          { name: 'Malaria Test', cost: 35 },
          { name: 'Urine Test', cost: 25 },
          { name: 'Eye Check', cost: 30 },
          { name: 'Weight Check', cost: 20 }
        ]
      },
      {
        name: 'Executive Wellness Package',
        description: 'High-level diagnostics for executives.',
        tier: 'Premier',
        tests: [
          { name: 'ECG', cost: 100 },
          { name: 'Liver Function Test', cost: 80 },
          { name: 'Kidney Function Test', cost: 80 },
          { name: 'Cholesterol Test', cost: 50 },
          { name: 'Blood Sugar', cost: 40 }
        ]
      },
      {
        name: 'Family Wellness Package',
        description: 'A mix of general tests suitable for family use.',
        tier: 'Premium',
        tests: [
          { name: 'Blood Pressure', cost: 30 },
          { name: 'Blood Sugar', cost: 40 },
          { name: 'Malaria Test', cost: 35 },
          { name: 'Urine Test', cost: 25 },
          { name: 'Eye Check', cost: 30 },
          { name: 'Weight Check', cost: 20 }
        ]
      }
    ];

    await Package.insertMany(packages);

    await Constants.create({
      amount: 60,
      note: 'Default operational constant set by Financial Admin'
    });

    console.log('Packages with tiers and constant seeded successfully');
    process.exit();
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
