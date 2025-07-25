import batteryData from '../data/battery.json';
import { parseISO, differenceInHours } from 'date-fns';

export type BatteryRecord = {
  timestamp: string;
  academyId: number;
  serialNumber: string;
  employeeId: string;
  batteryLevel: number;
};

export type DeviceStatus = {
  serialNumber: string;
  averageDrainPerDay: number | null;
  needsReplacement: boolean;
};

export type SchoolBatteryStatus = {
  academyId: number;
  devices: DeviceStatus[];
  unhealthyCount: number;
  unknownCount: number;
};

export function calculateAverageDrain(readings: BatteryRecord[]): number | null {
  if (readings.length < 2) return null;

  readings.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  let totalDrain = 0;
  let totalTime = 0;

  for (let i = 1; i < readings.length; i++) {
    const prev = readings[i - 1];
    const curr = readings[i];

    const prevLevel = prev.batteryLevel * 100;
    const currLevel = curr.batteryLevel * 100;

    const hours = differenceInHours(parseISO(curr.timestamp), parseISO(prev.timestamp));
    if (currLevel < prevLevel && hours > 0) {
      totalDrain += prevLevel - currLevel;
      totalTime += hours;
    }
  }

  if (totalTime === 0) return null;

  const avgPerDay = (totalDrain / totalTime) * 24;
  return +avgPerDay.toFixed(2);
}

export function analyzeBatteryData(threshold: number = 30): SchoolBatteryStatus[] {
  const records = batteryData as BatteryRecord[];
  const academyMap = new Map<number, Map<string, BatteryRecord[]>>();

  for (const record of records) {
    if (!academyMap.has(record.academyId)) {
      academyMap.set(record.academyId, new Map());
    }

    const deviceMap = academyMap.get(record.academyId)!;
    if (!deviceMap.has(record.serialNumber)) {
      deviceMap.set(record.serialNumber, []);
    }

    deviceMap.get(record.serialNumber)!.push(record);
  }

  const results: SchoolBatteryStatus[] = [];

  for (const [academyId, deviceMap] of academyMap.entries()) {
    const devices: DeviceStatus[] = [];

    for (const [serialNumber, logs] of deviceMap.entries()) {
      const avg = calculateAverageDrain(logs);
      const needsReplacement = avg !== null && avg > threshold;

      devices.push({
        serialNumber,
        averageDrainPerDay: avg,
        needsReplacement,
      });
    }

    results.push({
      academyId,
      devices,
      unhealthyCount: devices.filter((d) => d.needsReplacement).length,
      unknownCount: devices.filter((d) => d.averageDrainPerDay === null).length,
    });
  }

  return results.sort((a, b) => b.unhealthyCount - a.unhealthyCount);
}
