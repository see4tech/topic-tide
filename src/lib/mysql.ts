import mysql from 'mysql2/promise';

export interface Topic {
  id: string;
  title: string;
  content: string;
  creator?: string;
  pubDate: string;
  image?: string;
  link?: string;
  contentSnippet: string;
}

const dbConfig = {
  host: import.meta.env.VITE_MYSQL_HOST,
  user: import.meta.env.VITE_MYSQL_USER,
  password: import.meta.env.VITE_MYSQL_PASSWORD,
  database: import.meta.env.VITE_MYSQL_DATABASE,
};

console.log('Creating MySQL connection pool with config:', {
  host: dbConfig.host,
  user: dbConfig.user,
  database: dbConfig.database
});

const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export const fetchTopics = async (): Promise<Topic[]> => {
  console.log('Fetching topics from MySQL...');
  
  try {
    const [rows] = await pool.execute(
      'SELECT id, COALESCE(Titulo_Traducido, Titulo) AS title, Contenido_Post AS content, Creador AS creator, Pubdate AS pubDate, Imagen AS image, Link AS link, Contenido_Noticioso AS contentSnippet FROM Topicos WHERE Postear = 1 ORDER BY Pubdate DESC'
    );

    console.log('Raw MySQL response:', rows);

    if (!Array.isArray(rows)) {
      console.log('Query result is not an array');
      return [];
    }

    const topics = rows.map((row: any) => ({
      id: row.id?.toString() || '',
      title: row.title || '',
      content: row.content || '',
      creator: row.creator || '',
      pubDate: row.pubDate instanceof Date ? row.pubDate.toISOString() : new Date().toISOString(),
      image: row.image || '',
      link: row.link || '',
      contentSnippet: row.contentSnippet || ''
    }));

    console.log('Processed topics:', topics);
    return topics;
  } catch (error) {
    console.error('Error in fetchTopics:', error);
    throw error;
  }
};

export const checkEmailExists = async (email: string): Promise<boolean> => {
  console.log('Checking email existence:', email);
  
  try {
    const [rows] = await pool.execute(
      'SELECT 1 FROM Subscriptores WHERE Email = ? LIMIT 1',
      [email]
    );
    
    const exists = Array.isArray(rows) && rows.length > 0;
    console.log('Email exists:', exists);
    return exists;
  } catch (error) {
    console.error('Error checking email:', error);
    throw error;
  }
};

export const createSubscriber = async (name: string, email: string): Promise<void> => {
  console.log('Creating new subscriber:', { name, email });
  
  try {
    await pool.execute(
      'INSERT INTO Subscriptores (Nombre, Email, Fecha_Subscripcion, Estado) VALUES (?, ?, NOW(), ?)',
      [name, email, 'Activo']
    );
    console.log('Subscriber created successfully');
  } catch (error) {
    console.error('Error creating subscriber:', error);
    throw error;
  }
};