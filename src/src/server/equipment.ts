import { createServerFn } from '@tanstack/react-start'

export type EquipmentStatus = 'operational' | 'maintenance' | 'repair' | 'idle'
export type EquipmentType =
  | 'tractor'
  | 'harvester'
  | 'planter'
  | 'sprayer'
  | 'irrigation'
  | 'cultivator'

interface Equipment {
  id: number
  name: string
  type: EquipmentType
  model: string
  status: EquipmentStatus
  hoursUsed: number
  efficiency: number
  lastMaintenance: string
  nextMaintenance: string
  location: string
  fuelLevel: number
  icon: string
}

interface EquipmentStats {
  totalEquipment: number
  operational: number
  needsMaintenance: number
  avgEfficiency: number
  totalHours: number
}

interface MaintenanceSchedule {
  equipmentId: number
  equipmentName: string
  type: string
  dueDate: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  description: string
}

interface EquipmentData {
  stats: EquipmentStats
  equipment: Equipment[]
  maintenanceSchedule: MaintenanceSchedule[]
  recommendations: string[]
  utilizationByType: Array<{ type: string; hours: number; percentage: number }>
}

// Mock data generator
function generateEquipmentData(): EquipmentData {
  const equipment: Equipment[] = [
    {
      id: 1,
      name: 'Трактор John Deere 8R',
      type: 'tractor',
      model: '8R 410',
      status: 'operational',
      hoursUsed: 1247,
      efficiency: 92,
      lastMaintenance: '2025-11-15',
      nextMaintenance: '2026-01-15',
      location: 'Поле №1',
      fuelLevel: 78,
      icon: '🚜',
    },
    {
      id: 2,
      name: 'Комбайн Case IH',
      type: 'harvester',
      model: 'Axial-Flow 9250',
      status: 'operational',
      hoursUsed: 856,
      efficiency: 88,
      lastMaintenance: '2025-10-20',
      nextMaintenance: '2025-12-20',
      location: 'Гараж',
      fuelLevel: 45,
      icon: '🌾',
    },
    {
      id: 3,
      name: 'Сеялка Kinze',
      type: 'planter',
      model: '4900',
      status: 'maintenance',
      hoursUsed: 523,
      efficiency: 75,
      lastMaintenance: '2025-09-10',
      nextMaintenance: '2025-12-25',
      location: 'Сервис',
      fuelLevel: 0,
      icon: '🌱',
    },
    {
      id: 4,
      name: 'Опрыскиватель Hardi',
      type: 'sprayer',
      model: 'Navigator 6000',
      status: 'operational',
      hoursUsed: 342,
      efficiency: 95,
      lastMaintenance: '2025-11-01',
      nextMaintenance: '2026-02-01',
      location: 'Поле №3',
      fuelLevel: 82,
      icon: '💧',
    },
    {
      id: 5,
      name: 'Система полива Valley',
      type: 'irrigation',
      model: '8000 Series',
      status: 'operational',
      hoursUsed: 2104,
      efficiency: 90,
      lastMaintenance: '2025-10-05',
      nextMaintenance: '2026-01-05',
      location: 'Поле №2',
      fuelLevel: 100,
      icon: '🌊',
    },
    {
      id: 6,
      name: 'Культиватор Lemken',
      type: 'cultivator',
      model: 'Smaragd 9/600',
      status: 'idle',
      hoursUsed: 678,
      efficiency: 85,
      lastMaintenance: '2025-08-15',
      nextMaintenance: '2025-12-22',
      location: 'Гараж',
      fuelLevel: 60,
      icon: '⚙️',
    },
    {
      id: 7,
      name: 'Трактор Massey Ferguson',
      type: 'tractor',
      model: '8S.265',
      status: 'repair',
      hoursUsed: 1892,
      efficiency: 65,
      lastMaintenance: '2025-07-20',
      nextMaintenance: 'В ремонте',
      location: 'Сервис',
      fuelLevel: 15,
      icon: '🚜',
    },
    {
      id: 8,
      name: 'Опрыскиватель Amazone',
      type: 'sprayer',
      model: 'UX 6200',
      status: 'operational',
      hoursUsed: 289,
      efficiency: 93,
      lastMaintenance: '2025-11-10',
      nextMaintenance: '2026-02-10',
      location: 'Поле №4',
      fuelLevel: 71,
      icon: '💧',
    },
  ]

  const stats: EquipmentStats = {
    totalEquipment: equipment.length,
    operational: equipment.filter((e) => e.status === 'operational').length,
    needsMaintenance:
      equipment.filter(
        (e) => e.status === 'maintenance' || e.status === 'repair',
      ).length,
    avgEfficiency: Math.round(
      equipment.reduce((sum, e) => sum + e.efficiency, 0) / equipment.length,
    ),
    totalHours: equipment.reduce((sum, e) => sum + e.hoursUsed, 0),
  }

  const maintenanceSchedule: MaintenanceSchedule[] = [
    {
      equipmentId: 2,
      equipmentName: 'Комбайн Case IH',
      type: 'Плановое ТО',
      dueDate: '2025-12-20',
      priority: 'high',
      description: 'Замена масла и фильтров, проверка жатки',
    },
    {
      equipmentId: 6,
      equipmentName: 'Культиватор Lemken',
      type: 'Плановое ТО',
      dueDate: '2025-12-22',
      priority: 'medium',
      description: 'Проверка лемехов, регулировка глубины',
    },
    {
      equipmentId: 3,
      equipmentName: 'Сеялка Kinze',
      type: 'Ремонт',
      dueDate: '2025-12-25',
      priority: 'urgent',
      description: 'Замена высевающих дисков, калибровка',
    },
    {
      equipmentId: 1,
      equipmentName: 'Трактор John Deere 8R',
      type: 'Плановое ТО',
      dueDate: '2026-01-15',
      priority: 'low',
      description: 'Проверка трансмиссии, замена жидкостей',
    },
  ]

  const recommendations = [
    'Запланировать ремонт сеялки Kinze до начала сезона посева',
    'Трактор Massey Ferguson требует срочного ремонта двигателя',
    'Проверить уровень топлива в Комбайне Case IH перед следующим использованием',
    'Рекомендуется провести диагностику системы полива Valley',
  ]

  const utilizationByType = [
    { type: 'Тракторы', hours: 3139, percentage: 42 },
    { type: 'Полив', hours: 2104, percentage: 28 },
    { type: 'Комбайны', hours: 856, percentage: 11 },
    { type: 'Культиваторы', hours: 678, percentage: 9 },
    { type: 'Опрыскиватели', hours: 631, percentage: 8 },
    { type: 'Сеялки', hours: 523, percentage: 7 },
  ]

  return {
    stats,
    equipment,
    maintenanceSchedule,
    recommendations,
    utilizationByType,
  }
}

export const getEquipmentData = createServerFn({ method: 'GET' }).handler(
  async () => {
    // In a real app, this would fetch from database
    return generateEquipmentData()
  },
)
