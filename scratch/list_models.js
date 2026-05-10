async function listModels() {
  const key = 'AIzaSyDVco0VIIwsk5bdNeBHcswL7js4tJeVrKo';
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
  
  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log('Available Models:', JSON.stringify(data.models.map(m => m.name), null, 2));
  } catch (err) {
    console.error('Error:', err);
  }
}

listModels();
