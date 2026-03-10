type Category = 'New' | 'Fixed' | 'Improved' | 'Other';

export function categorizePR(labels: Array<{ name: string } | string>): Category {
  const labelNames = labels.map((l) =>
    typeof l === 'string' ? l.toLowerCase() : l.name.toLowerCase()
  );

  // Check for feature/new labels
  if (
    labelNames.some(
      (l) =>
        l.includes('feat') ||
        l.includes('feature') ||
        l.includes('new') ||
        l.includes('enhancement')
    )
  ) {
    return 'New';
  }

  // Check for fix/bug labels
  if (
    labelNames.some(
      (l) => l.includes('fix') || l.includes('bug') || l.includes('bugfix') || l.includes('hotfix')
    )
  ) {
    return 'Fixed';
  }

  // Check for chore/improvement labels
  if (
    labelNames.some(
      (l) =>
        l.includes('chore') ||
        l.includes('improvement') ||
        l.includes('refactor') ||
        l.includes('perf') ||
        l.includes('style')
    )
  ) {
    return 'Improved';
  }

  // Default category
  return 'Other';
}

export function getCategoryColor(category: Category): string {
  switch (category) {
    case 'New':
      return 'bg-accent/10 text-accent border-accent/20';
    case 'Fixed':
      return 'bg-success/10 text-success border-success/20';
    case 'Improved':
      return 'bg-blue/10 text-blue border-blue/20';
    default:
      return 'bg-muted/10 text-muted border-muted/20';
  }
}
