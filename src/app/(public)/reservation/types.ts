import { ReservationFormData } from "@/lib/validation/reservation";

export type { ReservationFormData };

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
