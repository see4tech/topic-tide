import mysql from "mysql2/promise";

// Load environment variables for database connection
const dbConfig = {
  host: import.meta.env.VITE_MYSQL_HOST,
  user: import.meta.env.VITE_MYSQL_USER,
  password: import.meta.env.VITE_MYSQL_PASSWORD,
  database: import.meta.env.VITE_MYSQL_DATABASE,
};

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

// Function to fetch topics from MySQL
export const fetchTopics = async (): Promise<Topic[]> => {
  console.log('Attempting to connect to MySQL...', dbConfig.host);
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('Successfully connected to MySQL');
    
    console.log('Executing MySQL query...');
    const [rows] = await connection.execute<mysql.RowDataPacket[]>(
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

    console.log('Received records from MySQL:', rows?.length || 0);
    
    if (!Array.isArray(rows)) {
      console.log('Query result is not an array, returning empty array');
      return [];
    }

    const topics = rows.map(row => ({
      id: row.id,
      title: row.title,
      content: row.content,
      creator: row.creator,
      pubDate: row.pubDate,
      image: row.image,
      link: row.link,
      contentSnippet: row.contentSnippet
    }));

    return topics;
  } catch (error) {
    console.error('Error fetching topics from MySQL:', error);
    throw error;
  } finally {
    if (connection) {
      console.log('Closing MySQL connection');
      await connection.end();
    }
  }
};

// Function to check if an email exists in the Subscribers table
export const checkEmailExists = async (email: string): Promise<boolean> => {
  console.log('Checking if email exists in MySQL...', email);
  let connection;

  try {
    connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute<mysql.RowDataPacket[]>(
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
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

// Function to create a new subscriber in MySQL
export const createSubscriber = async (name: string, email: string): Promise<void> => {
  console.log('Creating new subscriber in MySQL...', { name, email });
  let connection;

  try {
    connection = await mysql.createConnection(dbConfig);
    await connection.execute(
      `INSERT INTO Subscriptores (Nombre, Email, Fecha_Subscripcion, Estado) 
       VALUES (?, ?, ?, ?)`, 
      [name, email, new Date().toISOString(), 'Activo']
    );

    console.log('Subscriber created successfully');
  } catch (error) {
    console.error('Error creating subscriber in MySQL:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};