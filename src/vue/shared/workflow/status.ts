export const CANONICAL_WORKFLOW_STATUSES = [
  'new',
  'queued',
  'preparing',
  'ready',
  'delivered',
  'awaiting_payment',
  'paid',
  'cancelled',
] as const;

export type CanonicalWorkflowStatus =
  (typeof CANONICAL_WORKFLOW_STATUSES)[number];

const CANONICAL_SET = new Set<string>(CANONICAL_WORKFLOW_STATUSES);

export function isCanonicalWorkflowStatus(
  value: unknown
): value is CanonicalWorkflowStatus {
  return typeof value === 'string' && CANONICAL_SET.has(value);
}

export function toCanonical(input: unknown): CanonicalWorkflowStatus | null {
  if (!isCanonicalWorkflowStatus(input)) {
    if (typeof input === 'string' && input && process.env.NODE_ENV !== 'production') {
      console.warn(`[workflow/status] Unknown status: "${input}"`);
    }
    return null;
  }
  return input;
}
