export type InquiryStatus = "new" | "reviewed";

export interface Inquiry {
  id: string;
  email: string;
  description: string;
  image_urls: string[];
  status: InquiryStatus;
  created_at: string;
}
