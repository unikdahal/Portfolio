import { readFile, access } from 'node:fs/promises'

const requiredFiles = [
  'dist/index.html',
  'dist/404.html',
  'dist/favicon.svg',
]

for (const file of requiredFiles) {
  await access(file)
}

const app = await readFile('src/App.jsx', 'utf8')
const home = await readFile('src/v2/PortfolioV2.jsx', 'utf8')
const cases = await readFile('src/v2/CaseStudy.jsx', 'utf8')
const writing = await readFile('src/v2/V2Writing.jsx', 'utf8')
const fallback = await readFile('public/404.html', 'utf8')
const index = await readFile('index.html', 'utf8')

const checks = [
  [app.includes('path="/" element={<PortfolioV2 />}'), 'V2 must own the root route'],
  [app.includes('path="/work/:slug" element={<CaseStudy />}'), 'case studies must be canonical at /work/:slug'],
  [app.includes('path="/writing/:slug" element={<V2Writing />}'), 'articles must be canonical at /writing/:slug'],
  [app.includes('path="/writing" element={<V2Writing />}'), 'writing index must be canonical at /writing'],
  [app.includes('path="/v1" element={<LegacyPortfolio />}'), 'temporary V1 fallback must remain available'],
  [app.includes('path="/v2/*"'), 'old V2 URLs must retain a compatibility redirect'],
  [app.includes('path="/blog/*"'), 'old blog URLs must retain a compatibility redirect'],
  [!home.includes('href="/v2'), 'homepage must not emit stale /v2 links'],
  [!cases.includes('href="/v2'), 'case studies must not emit stale /v2 links'],
  [!writing.includes('href="/v2'), 'writing must not emit stale /v2 links'],
  [!home.includes('Previous version'), 'canonical V2 must not advertise the legacy portfolio'],
  [home.includes('https://www.unikdahal.com.np/'), 'homepage canonical URL must be root'],
  [cases.includes('https://www.unikdahal.com.np/work/'), 'case-study canonical URLs must use /work'],
  [writing.includes('https://www.unikdahal.com.np/writing'), 'writing canonical URLs must use /writing'],
  [fallback.includes("'/?/'"), 'GitHub Pages 404 fallback must preserve SPA deep links'],
  [index.includes('Restore path encoded by 404.html SPA redirect'), 'index must restore deep-link paths'],
]

const failed = checks.filter(([ok]) => !ok).map(([, message]) => message)

if (failed.length) {
  console.error('V2 smoke check failed:')
  for (const message of failed) console.error('- ' + message)
  process.exit(1)
}

console.log('V2 smoke check passed (' + checks.length + ' assertions).')
