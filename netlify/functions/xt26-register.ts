// Netlify function: forwards XT26 "express interest" form submissions into
// Orbit (the prospect pipeline at orbit.juxt.pro) as a Prospect row with
// source="xt26_website_form".
//
// Runs alongside the existing web3forms submission path. The form primary-
// submits to web3forms (email notification + audit trail to demo@juxt.pro);
// this function is fire-and-forget from the browser, so if it fails the user
// still sees a successful submission based on the web3forms response.
//
// Env:
//   ORBIT_API_TOKEN  Bearer token in Orbit's api_tokens list. Recommended to
//                    attribute this to xt26@juxt.pro (dedicated) rather than a
//                    personal token, so rotation is independent of humans.

type NetlifyEvent = {
  httpMethod: string
  body: string | null
}

type NetlifyResponse = {
  statusCode: number
  headers?: Record<string, string>
  body: string
}

const ORBIT_URL = 'https://orbit.juxt.pro'

export const handler = async (event: NetlifyEvent): Promise<NetlifyResponse> => {
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'method not allowed' })
  }

  const token = process.env.ORBIT_API_TOKEN
  if (!token) {
    console.error('xt26-register: ORBIT_API_TOKEN not configured')
    return json(500, { error: 'token not configured' })
  }

  let body: Record<string, string>
  try {
    body = JSON.parse(event.body ?? '{}')
  } catch {
    return json(400, { error: 'invalid json' })
  }

  const firstName = (body.firstName ?? '').trim()
  const lastName = (body.lastName ?? '').trim()
  const email = (body.email ?? '').trim().toLowerCase()
  if (!firstName || !lastName || !email) {
    return json(400, { error: 'firstName, lastName, email required' })
  }

  // Orbit's POST /api/people hard-cut the legacy `name` field on
  // 2026-04-29; firstName + lastName are first-class slots now.
  // Pass them through directly rather than joining and re-splitting
  // at the orbit boundary. The form already collects them split.
  // Source attribution. The form may pass orbitSource to distinguish
  // variants (e.g. the on-demand recordings form, which Orbit tags
  // `video-signup` + drops in the follow-up queue). Whitelisted so the
  // public endpoint can't inject an arbitrary source; anything else
  // (incl. omitted) falls back to the generic website form.
  const ALLOWED_SOURCES = ['xt26_website_form', 'xt26_recording_request']
  const source = ALLOWED_SOURCES.includes(body.orbitSource)
    ? body.orbitSource
    : 'xt26_website_form'

  const payload = {
    firstName,
    lastName,
    email,
    company: (body.company ?? '').trim(),
    role: (body.jobTitle ?? '').trim(),
    location: (body.country ?? '').trim(),
    source,
  }

  const r = await fetch(`${ORBIT_URL}/api/people?upsert=true`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!r.ok) {
    const detail = await r.text().catch(() => '<no body>')
    console.error('xt26-register: orbit post failed', r.status, detail)
    return json(502, { error: 'upstream failed' })
  }

  return json(200, { ok: true })
}

function json(statusCode: number, body: Record<string, unknown>): NetlifyResponse {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }
}
