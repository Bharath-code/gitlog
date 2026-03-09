import { notFound } from 'next/navigation';
import { kv } from '@vercel/kv';
import { EmbeddableWidget } from '@/shared/components/widgets/embeddable-widget';

interface WidgetPageProps {
  params: Promise<{
    widgetId: string;
  }>;
}

export default async function WidgetPage({ params }: WidgetPageProps) {
  const { widgetId } = await params;

  // Verify widget exists
  const keys = await kv.keys('widget:*');
  let widgetExists = false;

  for (const key of keys) {
    const config = await kv.get<any>(key);
    if (config && config.id === widgetId) {
      widgetExists = true;
      break;
    }
  }

  if (!widgetExists) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <EmbeddableWidget widgetId={widgetId} />
    </div>
  );
}
