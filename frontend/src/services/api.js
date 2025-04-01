/**
 * Servicio para manejar las solicitudes a la API
 */

// Función para realizar una petición GET a la API
export const fetchApi = async (endpoint) => {
  try {
    const response = await fetch(`/api/${endpoint}`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

// Función para realizar una petición POST a la API
export const postApi = async (endpoint, data) => {
  try {
    const response = await fetch(`/api/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};

export default { fetchApi, postApi };
