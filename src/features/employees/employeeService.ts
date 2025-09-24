import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import type { Employee } from '../../lib/types';

/**
 * Employee service for Firestore operations
 */
export class EmployeeService {
  private readonly collectionName = 'employees';

  /**
   * Fetch all employees
   */
  async getAll(): Promise<Employee[]> {
    try {
      const employeesRef = collection(db, this.collectionName);
      const snapshot = await getDocs(employeesRef);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Employee[];
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw new Error('Failed to fetch employees');
    }
  }

  /**
   * Fetch single employee by ID
   */
  async getById(id: string): Promise<Employee | null> {
    try {
      const employeeRef = doc(db, this.collectionName, id);
      const snapshot = await getDoc(employeeRef);
      
      if (!snapshot.exists()) {
        return null;
      }
      
      return {
        id: snapshot.id,
        ...snapshot.data(),
      } as Employee;
    } catch (error) {
      console.error('Error fetching employee:', error);
      throw new Error('Failed to fetch employee');
    }
  }
}

export const employeeService = new EmployeeService();
