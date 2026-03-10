import { kv } from '@vercel/kv';

export interface FilterRule {
  id: string;
  userId: string;
  repoId?: string;
  name: string;
  conditions: FilterCondition[];
  action: 'include' | 'exclude';
  priority: number;
  isActive: boolean;
  createdAt: string;
}

export interface FilterCondition {
  field: 'label' | 'author' | 'title' | 'files' | 'size';
  operator:
    | 'contains'
    | 'equals'
    | 'startsWith'
    | 'endsWith'
    | 'regex'
    | 'greaterThan'
    | 'lessThan';
  value: string | number;
}

/**
 * Create a new filter rule
 */
export async function createFilterRule(
  rule: Omit<FilterRule, 'id' | 'createdAt'>
): Promise<FilterRule> {
  const filterRule: FilterRule = {
    ...rule,
    id: `filter:${rule.userId}:${rule.repoId || 'global'}:${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  await kv.set(filterRule.id, filterRule);
  return filterRule;
}

/**
 * Get all filter rules for a user
 */
export async function getFilterRules(userId: string, repoId?: string): Promise<FilterRule[]> {
  const pattern = repoId ? `filter:${userId}:${repoId}:*` : `filter:${userId}:*`;

  const keys = await kv.keys(pattern);
  const rules = await Promise.all(keys.map((key) => kv.get<FilterRule>(key)));
  return rules.filter((r): r is FilterRule => r !== null && r.isActive);
}

/**
 * Check if a PR should be included/excluded based on filter rules
 */
export async function shouldIncludePR(
  userId: string,
  repoId: string,
  prData: {
    title: string;
    labels: string[];
    author: string;
    files: string[];
    additions: number;
    deletions: number;
  }
): Promise<{ include: boolean; matchedRule?: FilterRule }> {
  const rules = await getFilterRules(userId, repoId);

  // Sort by priority (higher priority first)
  rules.sort((a, b) => b.priority - a.priority);

  // Check each rule
  for (const rule of rules) {
    if (matchesRule(prData, rule.conditions)) {
      return {
        include: rule.action === 'include',
        matchedRule: rule,
      };
    }
  }

  // Default: include if no rules match
  return { include: true };
}

/**
 * Check if PR data matches filter conditions
 */
function matchesRule(prData: any, conditions: FilterCondition[]): boolean {
  // All conditions must match (AND logic)
  return conditions.every((condition) => matchCondition(prData, condition));
}

/**
 * Check if a single condition matches
 */
function matchCondition(prData: any, condition: FilterCondition): boolean {
  const { field, operator, value } = condition;

  let fieldValue: any;
  switch (field) {
    case 'label':
      fieldValue = prData.labels;
      break;
    case 'author':
      fieldValue = prData.author;
      break;
    case 'title':
      fieldValue = prData.title;
      break;
    case 'files':
      fieldValue = prData.files;
      break;
    case 'size':
      fieldValue = prData.additions + prData.deletions;
      break;
    default:
      return false;
  }

  // Handle array fields (labels, files)
  if (Array.isArray(fieldValue)) {
    if (operator === 'contains') {
      return fieldValue.some((item: string) =>
        item.toLowerCase().includes(String(value).toLowerCase())
      );
    }
    if (operator === 'equals') {
      return fieldValue.some((item: string) => item.toLowerCase() === String(value).toLowerCase());
    }
    return false;
  }

  // Handle string/number fields
  const strValue = String(fieldValue).toLowerCase();
  const strMatch = String(value).toLowerCase();

  switch (operator) {
    case 'contains':
      return strValue.includes(strMatch);
    case 'equals':
      return strValue === strMatch;
    case 'startsWith':
      return strValue.startsWith(strMatch);
    case 'endsWith':
      return strValue.endsWith(strMatch);
    case 'regex':
      try {
        const regex = new RegExp(String(value));
        return regex.test(strValue);
      } catch {
        return false;
      }
    case 'greaterThan':
      return Number(fieldValue) > Number(value);
    case 'lessThan':
      return Number(fieldValue) < Number(value);
    default:
      return false;
  }
}

/**
 * Common preset filters
 */
export const PRESET_FILTERS = {
  excludeChores: {
    name: 'Exclude Chores',
    conditions: [{ field: 'label' as const, operator: 'contains' as const, value: 'chore' }],
    action: 'exclude' as const,
    priority: 10,
  },
  excludeTests: {
    name: 'Exclude Tests',
    conditions: [{ field: 'label' as const, operator: 'contains' as const, value: 'test' }],
    action: 'exclude' as const,
    priority: 10,
  },
  excludeRefactors: {
    name: 'Exclude Refactors',
    conditions: [{ field: 'label' as const, operator: 'contains' as const, value: 'refactor' }],
    action: 'exclude' as const,
    priority: 10,
  },
  includeFeatures: {
    name: 'Include Features Only',
    conditions: [
      { field: 'label' as const, operator: 'contains' as const, value: 'feat' },
      { field: 'label' as const, operator: 'contains' as const, value: 'feature' },
    ],
    action: 'include' as const,
    priority: 20,
  },
  largeChanges: {
    name: 'Large Changes (>100 lines)',
    conditions: [{ field: 'size' as const, operator: 'greaterThan' as const, value: 100 }],
    action: 'include' as const,
    priority: 30,
  },
};

/**
 * Apply preset filter
 */
export async function applyPresetFilter(
  userId: string,
  repoId: string,
  presetName: keyof typeof PRESET_FILTERS
): Promise<FilterRule> {
  const preset = PRESET_FILTERS[presetName];

  return createFilterRule({
    userId,
    repoId,
    ...preset,
    isActive: true,
  });
}
