import { NextResponse } from "next/server"
import { db } from "@/lib/firebase-admin"

export async function POST(req: Request) {
  try {
    const { period = 'daily', limit = 100 } = await req.json().catch(() => ({}))
    const srcRef = db.collection('leaderboards').doc('all').collection('entries')
    const dstRef = db.collection('leaderboards').doc(String(period).toLowerCase()).collection('entries')

    const snap = await srcRef.orderBy('netWorth', 'desc').limit(Math.min(1000, Number(limit || 100))).get()
    const batch = db.batch()
    snap.docs.forEach(doc => {
      const data = doc.data()
      batch.set(dstRef.doc(doc.id), {
        userId: data.userId,
        username: data.username,
        netWorth: data.netWorth || 0,
        updatedAt: Date.now(),
      }, { merge: true })
    })
    await batch.commit()
    return NextResponse.json({ ok: true, period: String(period).toLowerCase(), count: snap.size })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'failed' }, { status: 500 })
  }
}


