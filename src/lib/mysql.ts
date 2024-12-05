export interface Topic {
  id: string;
  titulo: string;
  tituloTraducido: string;
  postear: number;
  posteadoInstagram: number;
  posteadoLinkedin: number;
  posteadoX: number;
  link: string;
  posteadoNewsletter: number;
  contenidoNoticioso: string;
  contenidoPost: string;
  contenidoResumido: string;
  contenidoCompleto: string;
  pubDate: string;
  creador: string;
  imagen: string;
  rss: string;
  hashtags: string;
  HTML: string;
  promptImagen: string;
  categoria: string;
}

const API_URL = "https://api.see4.tech/v1/news";

export const fetchTopics = async (): Promise<Topic[]> => {
  console.log('Fetching topics from API...');
  try {
    const response = await fetch(API_URL, {
      headers: {
        'x-api-key': import.meta.env.VITE_API_KEY || '',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Fetched topics:', data);
    return data;
  } catch (error) {
    console.error('Error fetching topics:', error);
    throw error;
  }
};

export const checkEmailExists = async (email: string): Promise<boolean> => {
  console.log('Checking email existence:', email);
  return false;
};

export const createSubscriber = async (name: string, email: string): Promise<void> => {
  console.log('Creating new subscriber:', { name, email });
  return;
};