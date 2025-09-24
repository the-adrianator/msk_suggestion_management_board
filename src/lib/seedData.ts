import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase';
import { sampleEmployees, sampleAdminUsers, sampleSuggestions } from './sampleData';
import type { Employee, AdminUser, Suggestion } from './types';

/**
 * Seed Firestore with sample data
 * This is a one-off script for development
 */
export const seedFirestore = async (): Promise<void> => {
  try {
    console.log('Seeding Firestore with sample data...');

    // Seed employees
    for (const employee of sampleEmployees) {
      await addDoc(collection(db, 'employees'), employee);
      console.log(`Added employee: ${employee.name}`);
    }

    // Seed admin users
    for (const admin of sampleAdminUsers) {
      await addDoc(collection(db, 'adminUsers'), admin);
      console.log(`Added admin user: ${admin.name}`);
    }

    // Seed suggestions
    for (const suggestion of sampleSuggestions) {
      await addDoc(collection(db, 'suggestions'), suggestion);
      console.log(`Added suggestion for employee: ${suggestion.employeeId}`);
    }

    console.log('✅ Sample data seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    throw error;
  }
};

/**
 * Clear all collections (for development reset)
 */
export const clearFirestore = async (): Promise<void> => {
  try {
    console.log('⚠️  Clearing Firestore collections...');
    // Note: In production, you'd want more sophisticated batch operations
    // For now, this is a placeholder - actual implementation would require
    // batch delete operations or admin SDK
    console.log('Collections cleared (placeholder)');
  } catch (error) {
    console.error('❌ Error clearing data:', error);
    throw error;
  }
};
