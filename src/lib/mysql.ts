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

// Function to create a connection pool instead of individual connections
const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Function to fetch topics from MySQL
export const fetchTopics = async (): Promise<Topic[]> => {
  console.log('Fetching topics using connection pool...');
  
  try {
    console.log('Executing MySQL query...');
    const [rows] = await pool.execute(
      `SELECT 
        id, 
        COALESCE(Titulo_Traducido, Titulo) AS title, 
        Contenido_Post AS content, 
        Creador AS creator, 
        Pubdate AS pubDate, 
        Imagen AS image, 
        Link AS link, 
        Contenido_Noticioso AS contentSnippet 
       FROM Topicos 
       WHERE Postear = 1 
       ORDER BY Pubdate DESC`
    );

    console.log('Received records from MySQL:', Array.isArray(rows) ? rows.length : 0);
    
    if (!Array.isArray(rows)) {
      console.log('Query result is not an array, returning empty array');
      return [];
    }

    const topics = rows.map((row: any) => ({
      id: row.id?.toString() || '',
      title: row.title || '',
      content: row.content || '',
      creator: row.creator || '',
      pubDate: row.pubDate?.toISOString() || new Date().toISOString(),
      image: row.image || '',
      link: row.link || '',
      contentSnippet: row.contentSnippet || ''
    }));

    return topics;
  } catch (error) {
    console.error('Error fetching topics from MySQL:', error);
    throw error;
  }
};

// Function to check if an email exists in the Subscribers table
export const checkEmailExists = async (email: string): Promise<boolean> => {
  console.log('Checking if email exists in MySQL...', email);

  try {
    const [rows] = await pool.execute(
      `SELECT 1 
       FROM Subscriptores 
       WHERE Email = ? 
       LIMIT 1`, 
      [email]
    );

    const emailExists = Array.isArray(rows) && rows.length > 0;
    console.log('Email check result:', emailExists);
    return emailExists;
  } catch (error) {
    console.error('Error checking email existence in MySQL:', error);
    throw error;
  }
};

// Function to create a new subscriber in MySQL
export const createSubscriber = async (name: string, email: string): Promise<void> => {
  console.log('Creating new subscriber in MySQL...', { name, email });

  try {
    await pool.execute(
      `INSERT INTO Subscriptores (Nombre, Email, Fecha_Subscripcion, Estado) 
       VALUES (?, ?, ?, ?)`, 
      [name, email, new Date().toISOString(), 'Activo']
    );

    console.log('Subscriber created successfully');
  } catch (error) {
    console.error('Error creating subscriber in MySQL:', error);
    throw error;
  }
};