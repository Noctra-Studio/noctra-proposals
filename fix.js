const fs = require('fs');

const pages = [
  'src/app/(dashboard)/proposals/new/page.tsx',
  'src/app/(dashboard)/proposals/[id]/page.tsx',
  'src/app/(dashboard)/proposals/[id]/contract/page.tsx',
  'src/app/p/[slug]/page.tsx',
  'src/app/c/[slug]/page.tsx'
];
pages.forEach(p => fs.writeFileSync(p, 'export default function Page() { return null; }'));

const routes = [
  'src/app/api/proposals/route.ts',
  'src/app/api/proposals/[id]/route.ts',
  'src/app/api/proposals/[id]/send/route.ts',
  'src/app/api/proposals/[id]/respond/route.ts',
  'src/app/api/contracts/route.ts',
  'src/app/api/contracts/[id]/route.ts',
  'src/app/api/contracts/[id]/send/route.ts'
];
routes.forEach(p => fs.writeFileSync(p, 'export function GET() { return new Response("OK"); }'));

fs.writeFileSync('src/lib/resend.ts', 'export {};');
fs.writeFileSync('src/lib/utils.ts', 'export {};');
fs.writeFileSync('src/lib/pdf-generator.tsx', 'export default function PdfGen() { return null; }');
