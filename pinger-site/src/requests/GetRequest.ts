export async function GetRequest() {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/pings`);
  
      if (!res.ok) throw new Error(`Ошибка: ${res.statusText}`);
  
      const data = await res.json();
      return data;
    } catch (error) {
      throw new Error(`Ошибка запроса: ${(error as Error).message}`);
    }
  }
  