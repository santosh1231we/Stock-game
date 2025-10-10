import { NextResponse } from "next/server"
import { db } from "@/lib/firebase-admin"

export async function POST() {
  try {
    const usersSnap = await db.collection('users').get()
    const batch = db.batch()
    let count = 0
    usersSnap.docs.forEach(doc => {
      const p = doc.data() as any
      batch.set(db.collection('leaderboards').doc('all').collection('entries').doc(doc.id), {
        userId: doc.id,
        username: p.username,
        netWorth: Number(p.netWorth || 0),
        updatedAt: Date.now(),
      }, { merge: true })
      count++
    })
    await batch.commit()
    return NextResponse.json({ ok: true, count })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'failed' }, { status: 500 })
  }
}


