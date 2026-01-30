export interface Location {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  description: string | null;
  phone: string | null;
  hours: string | null;
  image_url: string | null;
  category: string | null;
  created_at: string;
  updated_at: string;
}

export interface LocationFormData {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  description?: string;
  phone?: string;
  hours?: string;
  image_url?: string;
  category?: string;
}
