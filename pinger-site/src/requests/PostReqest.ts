export async function PostRequest(ip: string) {
    try {
      const res = await fetch('http://localhost:4040/ping', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ip }),
      });
  
      if (!res.ok) throw new Error(`Ошибка: ${res.statusText}`);
  
      const data = await res.json();
      return data;
    } catch (error) {
      throw new Error(`Ошибка запроса: ${(error as Error).message}`);
    }
  }
  