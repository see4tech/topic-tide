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
  contentSnippet?: string;
}

export const fetchTopics = async (): Promise<Topic[]> => {
  console.log('Fetching topics from Airtable...');
  
  const records = await base('Topicos')
    .select({
      filterByFormula: '{Postear} = 1',
      sort: [{ field: 'Pubdate', direction: 'desc' }],
    })
    .all();
  
  console.log('Received records from Airtable:', records.length);
  
  return records.map((record) => {
    // Add debug logging to check the values
    // console.log('Title fields:', {
    //   traducido: record.get('Titulo Traducido'),
    //   original: record.get('Titulo')
    // });
    
    return {
      // id: record.id,
      // title: record.get('Titulo Traducido')?.toString() || record.get('Titulo')?.toString() || '',
      // content: record.get('Contenido Noticioso')?.toString() || record.get('Contenido Post')?.toString() || '',
      // creator: record.get('Creador') as string,
      // pubDate: record.get('Pubdate') as string,
      // image: record.get('Imagen') as string,
      // link: record.get('Link') as string,
      id: record.id,
      title: record.get('Titulo Traducido')?.toString() || record.get('Titulo')?.toString() || '',
      content: record.get('Contenido Noticioso')?.toString(), 
      creator: record.get('Creador') as string,
      pubDate: record.get('Pubdate') as string,
      image: record.get('Imagen') as string,
      link: record.get('Link') as string,
      contentSnippet: record.get('Contenido Post')?.toString(),
    };
  });
};

export const checkEmailExists = async (email: string): Promise<boolean> => {
  try {
    console.log('Checking if email exists in Airtable...', email);
    
    const records = await base('Subscriptores')
      .select({
        filterByFormula: `{Email} = '${email}'`,
        maxRecords: 1,
      })
      .all();

    console.log('Email check result:', records.length > 0);
    return records.length > 0;
  } catch (error) {
    console.error('Error checking email existence:', error);
    throw error;
  }
};

export const createSubscriber = async (name: string, email: string): Promise<void> => {
  try {
    console.log('Creating new subscriber in Airtable...', { name, email });
    
    const result = await base('Subscriptores').create([
      {
        fields: {
          Nombre: name,
          Email: email,
          'Fecha Subscripcion': new Date().toISOString(),
          Estado: 'Activo',
        },
      },
    ]);

    console.log('Subscriber created successfully:', result);
  } catch (error) {
    console.error('Error creating subscriber:', error);
    throw error;
  }
};