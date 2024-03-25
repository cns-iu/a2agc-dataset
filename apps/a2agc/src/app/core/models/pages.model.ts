/**
 * Page link info
 */
export interface PageLink {
  /** Path to visualization */
  path: string;
  /** Page title */
  title: string;
  /** Page description */
  description?: string;
  /** Page order */
  order?: number;
}
