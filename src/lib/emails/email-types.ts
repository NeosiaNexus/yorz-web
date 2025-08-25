export interface Templates {
  'magic-link': { url: string };
  'reset-password': { url: string };
  'order-item-step': { orderName: string; content: string; url: string };
}

export type TemplateName = keyof Templates;
