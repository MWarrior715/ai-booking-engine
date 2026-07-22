export interface Venue {
  id: string;
  name: string;
  slug: string;
  industry: string;
  description: string | null;
}

export interface Service {
  id: string;
  name: string;
  durationMin: number;
  capacity: number;
}

export interface Slot {
  startAt: string;
  endAt: string;
  available: boolean;
}

export interface Booking {
  id: string;
  serviceId: string;
  startAt: string;
  customerName: string;
  status: string;
}
