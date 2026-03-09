import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getEntry, updateEntry } from '@/shared/lib/db/entry';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const entry = await getEntry(params.id);
    
    if (!entry) {
      return NextResponse.json({ error: 'Draft not found' }, { status: 404 });
    }

    // Verify ownership
    if (entry.userId !== user.id) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    return NextResponse.json(entry);
  } catch (error) {
    console.error('Fetch draft error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch draft' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, category, aiRewrite } = await req.json();
    
    const entry = await getEntry(params.id);
    
    if (!entry) {
      return NextResponse.json({ error: 'Draft not found' }, { status: 404 });
    }

    // Verify ownership
    if (entry.userId !== user.id) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    // Update entry
    await updateEntry(params.id, {
      title: title || entry.title,
      category: category || entry.category,
      aiRewrite: aiRewrite !== undefined ? aiRewrite : entry.aiRewrite,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update draft error:', error);
    return NextResponse.json(
      { error: 'Failed to update draft' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const entry = await getEntry(params.id);
    
    if (!entry) {
      return NextResponse.json({ error: 'Draft not found' }, { status: 404 });
    }

    // Verify ownership
    if (entry.userId !== user.id) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    // Delete from KV
    const { kv } = await import('@vercel/kv');
    await kv.del(params.id);

    // Remove from draft index
    const draftIndexKey = `user:${user.id}:drafts`;
    await kv.lrem(draftIndexKey, 1, params.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete draft error:', error);
    return NextResponse.json(
      { error: 'Failed to delete draft' },
      { status: 500 }
    );
  }
}
