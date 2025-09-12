type UpstashCmd = [string, ...string[]]

const url = process.env.UPSTASH_REDIS_REST_URL
const token = process.env.UPSTASH_REDIS_REST_TOKEN

async function callRedis<T = any>(cmd: UpstashCmd): Promise<T> {
  if (!url || !token) throw new Error("Redis not configured")
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      commands: [cmd],
    }),
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`Redis error ${res.status}`)
  const json = await res.json()
  const first = json?.result?.[0]
  return first?.result as T
}

export async function redisSet(key: string, value: any) {
  const str = typeof value === 'string' ? value : JSON.stringify(value)
  return callRedis(["SET", key, str])
}

export async function redisGet<T = any>(key: string): Promise<T | null> {
  const res = await callRedis<string>(["GET", key])
  if (!res) return null
  try { return JSON.parse(res) as T } catch { return res as any }
}

export async function redisZAdd(key: string, score: number, member: string) {
  return callRedis(["ZADD", key, String(score), member])
}

export async function redisZRevRangeWithScores(key: string, start: number, stop: number): Promise<Array<{ member: string; score: number }>> {
  const res = await callRedis<string[]>(["ZREVRANGE", key, String(start), String(stop), "WITHSCORES"])
  const out: Array<{ member: string; score: number }> = []
  for (let i = 0; i < (res?.length || 0); i += 2) {
    out.push({ member: res[i] as string, score: Number(res[i + 1]) })
  }
  return out
}

export async function redisSAdd(key: string, member: string) {
  return callRedis(["SADD", key, member])
}

export async function redisSMembers(key: string): Promise<string[]> {
  return callRedis(["SMEMBERS", key])
}


