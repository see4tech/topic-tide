import Airtable from 'airtable';

const apiKey = import.meta.env.VITE_AIRTABLE_API_KEY;
const baseId = import.meta.env.VITE_AIRTABLE_BASE_ID;

if (!apiKey) throw new Error('Missing Airtable API key');
if (!baseId) throw new Error('Missing Airtable base ID');

const base = new Airtable({ apiKey }).base(baseId);

export interface Topic {
  id: string;
  title: string;
  content: string;
  image: string;
  link: string;
  pubDate: string;
  creator: string;
}

export const fetchTopics = async (): Promise<Topic[]> => {
  try {
    // Calculate dates for filtering
    const today = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(today.getDate() - 7);

    // Format dates for Airtable formula
    const todayStr = today.toISOString().split('T')[0];
    const weekAgoStr = weekAgo.toISOString().split('T')[0];

    const records = await base('Topicos')
      .select({
        filterByFormula: `AND(
          {Postear} = TRUE(),
          IS_AFTER({Pubdate}, '${weekAgoStr}'),
          IS_BEFORE({Pubdate}, '${todayStr}T23:59:59')
        )`,
        sort: [{ field: 'Pubdate', direction: 'desc' }],
      })
      .all();
    
    return records.map((record) => ({
      id: record.id,
      title: record.get('Titulo') as string,
      content: record.get('Contenido Post') as string,
      image: record.get('Imagen') as string,
      link: record.get('Link') as string,
      pubDate: record.get('Pubdate') as string,
      creator: record.get('Creador') as string,
    }));
  } catch (error) {
    console.error('Error fetching topics:', error);
    throw error;
  }
}