export interface ToolItem {
  id: string; name?: string; category?: string; description?: string; icon?: string;
  link?: string; url?: string; downloadUrl?: string; featured?: boolean; isNew?: boolean;
  badge?: string; createdAt?: string | number; downloads?: number; stars?: number;
}
export interface NotificationItem { id?: string; title?: string; text?: string; message?: string; createdAt?: number | string; }
export interface ReviewMap { [toolId: string]: { avg: number; count: number }; }
