export async function getAIFix(html, issue) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/fix`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ html, issue }),
  });
  if (!res.ok) throw new Error('AI fix failed');
  return res.json();
}
