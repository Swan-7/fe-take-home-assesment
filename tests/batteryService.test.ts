import { describe, it, expect } from 'vitest';
import { calculateAverageDrain } from '../src/services/batteryService';
import type { BatteryRecord } from '../src/services/batteryService';

describe('calculateAverageDrain', () => {
  it('returns null for a single reading', () => {
    const data: BatteryRecord[] = [
      {
        timestamp: '2024-07-25T08:00:00Z',
        batteryLevel: 0.9,
        serialNumber: 'device1',
        employeeId: 'emp1',
        academyId: 123,
      }
    ];
    expect(calculateAverageDrain(data)).toBe(null);
  });

  it('calculates average drain over 24 hours correctly', () => {
    const data: BatteryRecord[] = [
      {
        timestamp: '2024-07-25T08:00:00Z',
        batteryLevel: 1.0,
        serialNumber: 'device1',
        employeeId: 'emp1',
        academyId: 123,
      },
      {
        timestamp: '2024-07-26T08:00:00Z',
        batteryLevel: 0.7,
        serialNumber: 'device1',
        employeeId: 'emp1',
        academyId: 123,
      }
    ];
    expect(calculateAverageDrain(data)).toBeCloseTo(30, 1);
  });

  it('ignores charging (battery level increases)', () => {
    const data: BatteryRecord[] = [
      {
        timestamp: '2024-07-25T08:00:00Z',
        batteryLevel: 0.5,
        serialNumber: 'device1',
        employeeId: 'emp1',
        academyId: 123,
      },
      {
        timestamp: '2024-07-25T10:00:00Z',
        batteryLevel: 0.6, // charging
        serialNumber: 'device1',
        employeeId: 'emp1',
        academyId: 123,
      }
    ];
    expect(calculateAverageDrain(data)).toBe(null);
  });
});
