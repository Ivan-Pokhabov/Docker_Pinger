export async function PostRequest(ip: string) {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/pings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ip: ip }),
      });
  
      if (!res.ok) throw new Error(`Ошибка: ${res.statusText}`);
  
      const text = await res.text();
        if (!text) return { message: ip };

        const data = JSON.parse(text);
        return data;
    } catch (error) {
      throw new Error(`Ошибка запроса: ${(error as Error).message}`);
    }
  }
  