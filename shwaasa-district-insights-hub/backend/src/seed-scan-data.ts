
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Scan } from './models/scan.model';
import { District } from './models/district.model';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error('MONGO_URI not defined in .env');
}

// FIXED: Complete historical data generation with proper 5-day increments
const generateRealisticHistory = (baseData: { tb: number; copd: number; fibrosis: number; pneumonia: number }) => {
  // Define complete periods with proper 5-day increments and realistic scaling factors
  const periods = [
    { period: '5d', factor: 0.18 },    // 18% of current data (5 days ago)
    { period: '7d', factor: 0.22 },    // 22% of current data (7 days ago)
    { period: '10d', factor: 0.28 },   // 28% of current data (10 days ago)
    { period: '15d', factor: 0.35 },   // 35% of current data (15 days ago)
    { period: '20d', factor: 0.42 },   // 42% of current data (20 days ago)
    { period: '25d', factor: 0.48 },   // 48% of current data (25 days ago)
    { period: '30d', factor: 0.55 },   // 55% of current data (30 days ago)
    { period: '35d', factor: 0.60 },   // 60% of current data (35 days ago) - ADDED
    { period: '40d', factor: 0.64 },   // 64% of current data (40 days ago) - ADDED
    { period: '45d', factor: 0.68 },   // 68% of current data (45 days ago)
    { period: '50d', factor: 0.72 },   // 72% of current data (50 days ago) - ADDED
    { period: '55d', factor: 0.75 },   // 75% of current data (55 days ago) - ADDED
    { period: '60d', factor: 0.78 },   // 78% of current data (60 days ago) - UPDATED
    { period: '65d', factor: 0.82 },   // 82% of current data (65 days ago) - ADDED
    { period: '70d', factor: 0.85 },   // 85% of current data (70 days ago) - ADDED
    { period: '75d', factor: 0.88 },   // 88% of current data (75 days ago) - UPDATED
    { period: '80d', factor: 0.92 },   // 92% of current data (80 days ago) - ADDED
    { period: '85d', factor: 0.96 },   // 96% of current data (85 days ago) - ADDED
    { period: '90d', factor: 1.00 },   // 100% - current data (90 days = present)
    { period: '95d', factor: 0.98 },   // 98% of current data (95 days ago) - ADDED
    { period: '100d', factor: 0.95 },  // 95% of current data (100 days ago) - ADDED
    { period: '105d', factor: 0.92 },  // 92% of current data (105 days ago) - UPDATED
    { period: '110d', factor: 0.90 },  // 90% of current data (110 days ago) - ADDED
    { period: '115d', factor: 0.88 },  // 88% of current data (115 days ago) - ADDED
    { period: '120d', factor: 0.85 },  // 85% of current data (120 days ago) - UPDATED
    { period: '125d', factor: 0.83 },  // 83% of current data (125 days ago) - ADDED
    { period: '130d', factor: 0.81 },  // 81% of current data (130 days ago) - ADDED
    { period: '135d', factor: 0.79 },  // 79% of current data (135 days ago) - UPDATED
    { period: '140d', factor: 0.77 },  // 77% of current data (140 days ago) - ADDED
    { period: '145d', factor: 0.75 },  // 75% of current data (145 days ago) - ADDED
    { period: '150d', factor: 0.73 },  // 73% of current data (150 days ago) - UPDATED
    { period: '155d', factor: 0.71 },  // 71% of current data (155 days ago) - ADDED
    { period: '160d', factor: 0.69 },  // 69% of current data (160 days ago) - ADDED
    { period: '165d', factor: 0.67 },  // 67% of current data (165 days ago) - UPDATED
    { period: '170d', factor: 0.65 },  // 65% of current data (170 days ago) - ADDED
    { period: '175d', factor: 0.63 },  // 63% of current data (175 days ago) - ADDED
    { period: '180d', factor: 0.61 },  // 61% of current data (180 days ago) - UPDATED
    { period: 'custom', factor: 0.65 } // 65% of current data (custom period)
  ];

  return periods.map(({ period, factor }) => {
    // Add slight variation (±2%) to make data more realistic but consistent
    const addVariation = (value: number) => {
      const variation = 0.02; // Reduced variation for more predictable results
      const randomFactor = 1 + (Math.random() - 0.5) * variation;
      return Math.max(1, Math.round(value * factor * randomFactor));
    };

    return {
      period,
      tb: addVariation(baseData.tb),
      copd: addVariation(baseData.copd),
      fibrosis: addVariation(baseData.fibrosis),
      pneumonia: addVariation(baseData.pneumonia)
    };
  });
};

// Enhanced debug function to verify the complete logic
const debugHistoryGeneration = (baseData: { tb: number; copd: number; fibrosis: number; pneumonia: number }) => {
  console.log('=== DEBUGGING COMPLETE HISTORICAL DATA GENERATION ===');
  console.log('Base data (Current - 90d):', baseData);
  const currentTotal = baseData.tb + baseData.copd + baseData.fibrosis + baseData.pneumonia;
  console.log('Total current cases:', currentTotal);
  
  const history = generateRealisticHistory(baseData);
  
  // Show all periods for debugging in groups
  console.log('\n📊 Complete Period Coverage:');
  
  // Early periods (5-30 days)
  console.log('\n🔵 Early Periods (5-30 days):');
  ['5d', '7d', '10d', '15d', '20d', '25d', '30d'].forEach(periodName => {
    const periodData = history.find(h => h.period === periodName);
    if (periodData) {
      const total = periodData.tb + periodData.copd + periodData.fibrosis + periodData.pneumonia;
      const percentage = ((total / currentTotal) * 100).toFixed(1);
      console.log(`${periodName}: Total ${total} (${percentage}% of current)`);
    }
  });
  
  // Mid periods (35-90 days) - This was the missing range
  console.log('\n🟢 Mid Periods (35-90 days):');
  ['35d', '40d', '45d', '50d', '55d', '60d', '65d', '70d', '75d', '80d', '85d', '90d'].forEach(periodName => {
    const periodData = history.find(h => h.period === periodName);
    if (periodData) {
      const total = periodData.tb + periodData.copd + periodData.fibrosis + periodData.pneumonia;
      const percentage = ((total / currentTotal) * 100).toFixed(1);
      console.log(`${periodName}: Total ${total} (${percentage}% of current)`);
    }
  });
  
  // Extended periods (95-180 days)
  console.log('\n🟡 Extended Periods (95-180 days):');
  ['95d', '100d', '105d', '120d', '135d', '150d', '165d', '180d'].forEach(periodName => {
    const periodData = history.find(h => h.period === periodName);
    if (periodData) {
      const total = periodData.tb + periodData.copd + periodData.fibrosis + periodData.pneumonia;
      const percentage = ((total / currentTotal) * 100).toFixed(1);
      console.log(`${periodName}: Total ${total} (${percentage}% of current)`);
    }
  });
  
  console.log(`\n📈 Total periods generated: ${history.length}`);
  return history;
};

// Test with sample data before using in districts
console.log('Testing with Hyderabad data:');
debugHistoryGeneration({ tb: 450, copd: 320, fibrosis: 180, pneumonia: 250 });

// Sample scan data with updated dates for May 21–27, 2025
const sampleScanData = {
  totalScans: 89500,
  normalScans: 71600,
  abnormalScans: 17900,
  pendingValidation: 4750,
  dailyTarget: 15000,
  achieved: 12400,
  history: [
    { day: 'Wed', target: 5000, achieved: 4500, date: new Date('2025-05-21') },
    { day: 'Thu', target: 5000, achieved: 4200, date: new Date('2025-05-22') },
    { day: 'Fri', target: 5000, achieved: 3500, date: new Date('2025-05-23') },
    { day: 'Sat', target: 5000, achieved: 4800, date: new Date('2025-05-24') },
    { day: 'Sun', target: 5000, achieved: 5800, date: new Date('2025-05-25') },
    { day: 'Mon', target: 5000, achieved: 3800, date: new Date('2025-05-26') },
    { day: 'Tue', target: 5000, achieved: 4500, date: new Date('2025-05-27') }
  ],
  timestamp: new Date('2025-05-27T16:58:00+05:30')
};

// FIXED: Sample district data with complete history generation
const sampleDistrictData = [
  {
    id: 'adilabad',
    name: 'Adilabad',
    tb: 280,
    copd: 210,
    fibrosis: 120,
    pneumonia: 180,
    riskLevel: 'medium',
    coordinates: { x: 78.5311, y: 19.6728 },
    history: generateRealisticHistory({ tb: 280, copd: 210, fibrosis: 120, pneumonia: 180 })
  },
  {
    id: 'bhadradri-kothagudem',
    name: 'Bhadradri Kothagudem',
    tb: 320,
    copd: 240,
    fibrosis: 140,
    pneumonia: 200,
    riskLevel: 'high',
    coordinates: { x: 80.6158, y: 17.5556 },
    history: generateRealisticHistory({ tb: 320, copd: 240, fibrosis: 140, pneumonia: 200 })
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    tb: 450,
    copd: 320,
    fibrosis: 180,
    pneumonia: 250,
    riskLevel: 'high',
    coordinates: { x: 78.4867, y: 17.3850 },
    history: generateRealisticHistory({ tb: 450, copd: 320, fibrosis: 180, pneumonia: 250 })
  },
  {
    id: 'jagtial',
    name: 'Jagtial',
    tb: 200,
    copd: 150,
    fibrosis: 80,
    pneumonia: 120,
    riskLevel: 'low',
    coordinates: { x: 78.9131, y: 18.7909 },
    history: generateRealisticHistory({ tb: 200, copd: 150, fibrosis: 80, pneumonia: 120 })
  },
  {
    id: 'jangaon',
    name: 'Jangaon',
    tb: 180,
    copd: 130,
    fibrosis: 70,
    pneumonia: 100,
    riskLevel: 'low',
    coordinates: { x: 79.1553, y: 17.7244 },
    history: generateRealisticHistory({ tb: 180, copd: 130, fibrosis: 70, pneumonia: 100 })
  },
  {
    id: 'jayashankar-bhupalpally',
    name: 'Jayashankar Bhupalpally',
    tb: 160,
    copd: 120,
    fibrosis: 60,
    pneumonia: 90,
    riskLevel: 'low',
    coordinates: { x: 79.9953, y: 18.4386 },
    history: generateRealisticHistory({ tb: 160, copd: 120, fibrosis: 60, pneumonia: 90 })
  },
  {
    id: 'jogulamba-gadwal',
    name: 'Jogulamba Gadwal',
    tb: 140,
    copd: 100,
    fibrosis: 50,
    pneumonia: 80,
    riskLevel: 'low',
    coordinates: { x: 77.7964, y: 16.2231 },
    history: generateRealisticHistory({ tb: 140, copd: 100, fibrosis: 50, pneumonia: 80 })
  },
  {
    id: 'kamareddy',
    name: 'Kamareddy',
    tb: 220,
    copd: 160,
    fibrosis: 90,
    pneumonia: 130,
    riskLevel: 'medium',
    coordinates: { x: 78.3428, y: 18.3219 },
    history: generateRealisticHistory({ tb: 220, copd: 160, fibrosis: 90, pneumonia: 130 })
  },
  {
    id: 'karimnagar',
    name: 'Karimnagar',
    tb: 340,
    copd: 250,
    fibrosis: 140,
    pneumonia: 200,
    riskLevel: 'high',
    coordinates: { x: 79.1288, y: 18.4386 },
    history: generateRealisticHistory({ tb: 340, copd: 250, fibrosis: 140, pneumonia: 200 })
  },
  {
    id: 'khammam',
    name: 'Khammam',
    tb: 300,
    copd: 220,
    fibrosis: 130,
    pneumonia: 170,
    riskLevel: 'medium',
    coordinates: { x: 80.1514, y: 17.2473 },
    history: generateRealisticHistory({ tb: 300, copd: 220, fibrosis: 130, pneumonia: 170 })
  },
  {
    id: 'komaram-bheem',
    name: 'Komaram Bheem',
    tb: 190,
    copd: 140,
    fibrosis: 75,
    pneumonia: 110,
    riskLevel: 'low',
    coordinates: { x: 79.4533, y: 19.1078 },
    history: generateRealisticHistory({ tb: 190, copd: 140, fibrosis: 75, pneumonia: 110 })
  },
  {
    id: 'mahabubabad',
    name: 'Mahabubabad',
    tb: 170,
    copd: 125,
    fibrosis: 65,
    pneumonia: 95,
    riskLevel: 'low',
    coordinates: { x: 79.9953, y: 17.5986 },
    history: generateRealisticHistory({ tb: 170, copd: 125, fibrosis: 65, pneumonia: 95 })
  },
  {
    id: 'mahabubnagar',
    name: 'Mahabubnagar',
    tb: 260,
    copd: 190,
    fibrosis: 110,
    pneumonia: 150,
    riskLevel: 'medium',
    coordinates: { x: 77.9956, y: 16.7425 },
    history: generateRealisticHistory({ tb: 260, copd: 190, fibrosis: 110, pneumonia: 150 })
  },
  {
    id: 'mancherial',
    name: 'Mancherial',
    tb: 200,
    copd: 145,
    fibrosis: 80,
    pneumonia: 115,
    riskLevel: 'low',
    coordinates: { x: 79.4600, y: 18.8697 },
    history: generateRealisticHistory({ tb: 200, copd: 145, fibrosis: 80, pneumonia: 115 })
  },
  {
    id: 'medak',
    name: 'Medak',
    tb: 180,
    copd: 135,
    fibrosis: 70,
    pneumonia: 105,
    riskLevel: 'low',
    coordinates: { x: 78.2747, y: 18.0553 },
    history: generateRealisticHistory({ tb: 180, copd: 135, fibrosis: 70, pneumonia: 105 })
  },
  {
    id: 'medchal-malkajgiri',
    name: 'Medchal Malkajgiri',
    tb: 380,
    copd: 280,
    fibrosis: 160,
    pneumonia: 220,
    riskLevel: 'high',
    coordinates: { x: 78.4817, y: 17.6236 },
    history: generateRealisticHistory({ tb: 380, copd: 280, fibrosis: 160, pneumonia: 220 })
  },
  {
    id: 'mulugu',
    name: 'Mulugu',
    tb: 120,
    copd: 90,
    fibrosis: 45,
    pneumonia: 70,
    riskLevel: 'low',
    coordinates: { x: 79.9322, y: 18.1944 },
    history: generateRealisticHistory({ tb: 120, copd: 90, fibrosis: 45, pneumonia: 70 })
  },
  {
    id: 'nagarkurnool',
    name: 'Nagarkurnool',
    tb: 150,
    copd: 110,
    fibrosis: 55,
    pneumonia: 85,
    riskLevel: 'low',
    coordinates: { x: 78.3175, y: 16.4892 },
    history: generateRealisticHistory({ tb: 150, copd: 110, fibrosis: 55, pneumonia: 85 })
  },
  {
    id: 'nalgonda',
    name: 'Nalgonda',
    tb: 290,
    copd: 215,
    fibrosis: 125,
    pneumonia: 165,
    riskLevel: 'medium',
    coordinates: { x: 79.2674, y: 17.0542 },
    history: generateRealisticHistory({ tb: 290, copd: 215, fibrosis: 125, pneumonia: 165 })
  },
  {
    id: 'narayanpet',
    name: 'Narayanpet',
    tb: 130,
    copd: 95,
    fibrosis: 50,
    pneumonia: 75,
    riskLevel: 'low',
    coordinates: { x: 77.4925, y: 16.7425 },
    history: generateRealisticHistory({ tb: 130, copd: 95, fibrosis: 50, pneumonia: 75 })
  },
  {
    id: 'nirmal',
    name: 'Nirmal',
    tb: 210,
    copd: 155,
    fibrosis: 85,
    pneumonia: 125,
    riskLevel: 'medium',
    coordinates: { x: 78.3428, y: 19.0947 },
    history: generateRealisticHistory({ tb: 210, copd: 155, fibrosis: 85, pneumonia: 125 })
  },
  {
    id: 'nizamabad',
    name: 'Nizamabad',
    tb: 240,
    copd: 175,
    fibrosis: 100,
    pneumonia: 140,
    riskLevel: 'medium',
    coordinates: { x: 78.0969, y: 18.6719 },
    history: generateRealisticHistory({ tb: 240, copd: 175, fibrosis: 100, pneumonia: 140 })
  },
  {
    id: 'peddapalli',
    name: 'Peddapalli',
    tb: 190,
    copd: 140,
    fibrosis: 75,
    pneumonia: 110,
    riskLevel: 'low',
    coordinates: { x: 79.3747, y: 18.6122 },
    history: generateRealisticHistory({ tb: 190, copd: 140, fibrosis: 75, pneumonia: 110 })
  },
  {
    id: 'rajanna-sircilla',
    name: 'Rajanna Sircilla',
    tb: 160,
    copd: 115,
    fibrosis: 60,
    pneumonia: 90,
    riskLevel: 'low',
    coordinates: { x: 78.8139, y: 18.3928 },
    history: generateRealisticHistory({ tb: 160, copd: 115, fibrosis: 60, pneumonia: 90 })
  },
  {
    id: 'rangareddy',
    name: 'Rangareddy',
    tb: 350,
    copd: 260,
    fibrosis: 150,
    pneumonia: 210,
    riskLevel: 'high',
    coordinates: { x: 78.2464, y: 17.4065 },
    history: generateRealisticHistory({ tb: 350, copd: 260, fibrosis: 150, pneumonia: 210 })
  },
  {
    id: 'sangareddy',
    name: 'Sangareddy',
    tb: 220,
    copd: 165,
    fibrosis: 90,
    pneumonia: 135,
    riskLevel: 'medium',
    coordinates: { x: 78.0969, y: 17.6236 },
    history: generateRealisticHistory({ tb: 220, copd: 165, fibrosis: 90, pneumonia: 135 })
  },
  {
    id: 'siddipet',
    name: 'Siddipet',
    tb: 200,
    copd: 150,
    fibrosis: 80,
    pneumonia: 120,
    riskLevel: 'low',
    coordinates: { x: 78.8553, y: 18.1025 },
    history: generateRealisticHistory({ tb: 200, copd: 150, fibrosis: 80, pneumonia: 120 })
  },
  {
    id: 'suryapet',
    name: 'Suryapet',
    tb: 250,
    copd: 185,
    fibrosis: 105,
    pneumonia: 145,
    riskLevel: 'medium',
    coordinates: { x: 79.6186, y: 17.1297 },
    history: generateRealisticHistory({ tb: 250, copd: 185, fibrosis: 105, pneumonia: 145 })
  },
  {
    id: 'vikarabad',
    name: 'Vikarabad',
    tb: 170,
    copd: 125,
    fibrosis: 65,
    pneumonia: 95,
    riskLevel: 'low',
    coordinates: { x: 77.9011, y: 17.3386 },
    history: generateRealisticHistory({ tb: 170, copd: 125, fibrosis: 65, pneumonia: 95 })
  },
  {
    id: 'wanaparthy',
    name: 'Wanaparthy',
    tb: 140,
    copd: 105,
    fibrosis: 55,
    pneumonia: 80,
    riskLevel: 'low',
    coordinates: { x: 78.0608, y: 16.3669 },
    history: generateRealisticHistory({ tb: 140, copd: 105, fibrosis: 55, pneumonia: 80 })
  },
  {
    id: 'warangal-rural',
    name: 'Warangal Rural',
    tb: 210,
    copd: 155,
    fibrosis: 85,
    pneumonia: 125,
    riskLevel: 'medium',
    coordinates: { x: 79.5881, y: 17.9689 },
    history: generateRealisticHistory({ tb: 210, copd: 155, fibrosis: 85, pneumonia: 125 })
  },
  {
    id: 'warangal-urban',
    name: 'Warangal Urban',
    tb: 280,
    copd: 205,
    fibrosis: 115,
    pneumonia: 160,
    riskLevel: 'medium',
    coordinates: { x: 79.5881, y: 18.0086 },
    history: generateRealisticHistory({ tb: 280, copd: 205, fibrosis: 115, pneumonia: 160 })
  },
  {
    id: 'yadadri-bhuvanagiri',
    name: 'Yadadri Bhuvanagiri',
    tb: 190,
    copd: 140,
    fibrosis: 75,
    pneumonia: 110,
    riskLevel: 'low',
    coordinates: { x: 78.8553, y: 17.5556 },
    history: generateRealisticHistory({ tb: 190, copd: 140, fibrosis: 75, pneumonia: 110 })
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI!);
    console.log('✅ Connected to MongoDB Atlas');

    // Clear existing data
    await Scan.deleteMany({});
    await District.deleteMany({});
    console.log('🗑️ Cleared existing data');

    // Insert scan data
    const newScanData = new Scan(sampleScanData);
    await newScanData.save();
    console.log('✅ Sample scan data inserted successfully');

    // Insert district data
    const districts = await District.insertMany(sampleDistrictData);
    console.log(`✅ ${districts.length} Telangana districts inserted successfully`);

    // Display summary with verification
    console.log('\n📊 Telangana Districts Data Summary:');
    console.log(`- Total Districts: ${districts.length}`);
    console.log(`- High Risk Districts: ${districts.filter(d => d.riskLevel === 'high').length}`);
    console.log(`- Medium Risk Districts: ${districts.filter(d => d.riskLevel === 'medium').length}`);
    console.log(`- Low Risk Districts: ${districts.filter(d => d.riskLevel === 'low').length}`);
    
    const totalCases = districts.reduce((sum, d) => sum + (d.tb + d.copd + d.fibrosis + d.pneumonia), 0);
    console.log(`- Total Cases Across All Districts: ${totalCases}`);

    // COMPREHENSIVE VERIFICATION: Check all key period totals
    console.log('\n🔍 COMPREHENSIVE VERIFICATION - Historical Data Totals:');
    const keyPeriods = ['7d', '30d', '35d', '40d', '45d', '50d', '55d', '60d', '65d', '70d', '75d', '80d', '85d', '90d'];
    
    keyPeriods.forEach(period => {
      const totalForPeriod = districts.reduce((sum, d) => {
        const periodData = d.history.find(h => h.period === period);
        return sum + (periodData ? periodData.tb + periodData.copd + periodData.fibrosis + periodData.pneumonia : 0);
      }, 0);
      
      const percentage = ((totalForPeriod / totalCases) * 100).toFixed(1);
      console.log(`✅ Total cases for ${period}: ${totalForPeriod} (${percentage}% of 90d baseline)`);
    });

    console.log('\n🎯 Now your dashboard should show smooth transitions from 30d to 90d!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the seed function
seedDatabase();

export { sampleScanData, sampleDistrictData, seedDatabase };