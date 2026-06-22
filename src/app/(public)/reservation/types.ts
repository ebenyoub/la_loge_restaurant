export interface ReservationFormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  requestedDate: string;
  requestedTime: string;
  guestCount: number;
  occasion: string;
  message: string;
  consent: boolean;
}

export interface FormErrors {
  global?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  requestedDate?: string;
  requestedTime?: string;
  guestCount?: string;
  occasion?: string;
  message?: string;
  consent?: string;
}
