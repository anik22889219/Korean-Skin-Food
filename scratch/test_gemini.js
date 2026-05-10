async function testGemini() {
  const key = 'AIzaSyDVco0VIIwsk5bdNeBHcswL7js4tJeVrKo';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`;
  
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: "Hello" }] }] }),
    });
    const data = await res.json();
    console.log('Response Status:', res.status);
    console.log('Response Data:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error:', err);
  }
}

testGemini();
