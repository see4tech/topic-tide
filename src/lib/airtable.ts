import Airtable from 'airtable';

const apiKey = import.meta.env.VITE_AIRTABLE_API_KEY;
const baseId = import.meta.env.VITE_AIRTABLE_BASE_ID;

const base = new Airtable({ apiKey }).base(baseId);

export interface Topic {
  id: string;
  title: string;
  content: string;
  creator?: string;
  pubDate: string;
  image?: string;
  link?: string;
}

export const fetchTopics = async (): Promise<Topic[]> => {
  // Calculate dates for filtering
  const today = new Date();
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  // Format dates for Airtable formula
  const todayStr = today.toISOString().split('T')[0];
  const weekAgoStr = weekAgo.toISOString().split('T')[0];

  const records = await base('Topicos')
    .select({
      filterByFormula: `AND(
        IS_AFTER({Pubdate}, '${weekAgoStr}'),
        IS_BEFORE({Pubdate}, '${todayStr}')
      )`,
      sort: [{ field: 'Pubdate', direction: 'desc' }],
    })
    .all();
  
  return records.map((record) => ({
    id: record.id,
    title: record.get('Titulo') as string,
    content: record.get('Contenido Post') as string,
    creator: record.get('Creador') as string,
    pubDate: record.get('Pubdate') as string,
    image: record.get('Imagen') as string,
    link: record.get('Link') as string,
  }));
};