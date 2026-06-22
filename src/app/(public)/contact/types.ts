import { ContactFormData } from "@/lib/validation/contact";

export type { ContactFormData };

export interface FormErrors {
  global?: string;
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  consent?: string;
}
