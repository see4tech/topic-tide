import Airtable from 'airtable';

// Initialize Airtable
const apiKey = import.meta.env.VITE_AIRTABLE_API_KEY;
const baseId = import.meta.env.VITE_AIRTABLE_BASE_ID;

if (!apiKey) {
  console.error('Missing VITE_AIRTABLE_API_KEY environment variable');
  throw new Error('Missing VITE_AIRTABLE_API_KEY environment variable');
}

if (!baseId) {
  console.error('Missing VITE_AIRTABLE_BASE_ID environment variable');
  throw new Error('Missing VITE_AIRTABLE_BASE_ID environment variable');
}

const base = new Airtable({ apiKey }).base(baseId);

export interface Topic {
  id: string;
  title: string;
  image: string;
  content: string;
  link: string;
}

export const fetchTopics = async (): Promise<Topic[]> => {
  console.log('Fetching topics from Airtable...');
  try {
    const records = await base('Topicos')
      .select({
        filterByFormula: '{Postear} = TRUE()',
        sort: [{ field: 'Titulo', direction: 'desc' }],
      })
      .all();

    console.log(`Found ${records.length} topics`);
    
    return records.map((record) => ({
      id: record.id,
      title: record.get('Titulo') as string,
      image: record.get('imagen') as string,
      content: record.get('Contenido Post') as string,
      link: record.get('link') as string,
    }));
  } catch (error) {
    console.error('Error fetching topics:', error);
    throw error;
  }
};