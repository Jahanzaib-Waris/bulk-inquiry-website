export type InquiryStatus = "new" | "reviewed";

export interface Inquiry {
  id: string;
  email: string;
  description: string;
  image_urls: string[];
  status: InquiryStatus;
  created_at: string;
}

export interface SiteSettings {
  id: number;
  site_name: string;
  logo_url: string | null;
  updated_at: string;
}
