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
  console.log('Fetching topics from MySQL...');
  const connection = await mysql.createConnection(dbConfig);

  try {
    const [rows] = await connection.execute(
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

    console.log('Received records from MySQL:', rows.length);
    return rows as Topic[];
  } catch (error) {
    console.error('Error fetching topics from MySQL:', error);
    throw error;
  } finally {
    await connection.end();
  }
};

// Function to check if an email exists in the Subscribers table
export const checkEmailExists = async (email: string): Promise<boolean> => {
  console.log('Checking if email exists in MySQL...', email);
  const connection = await mysql.createConnection(dbConfig);

  try {
    const [rows] = await connection.execute(
      `SELECT 1 
       FROM Subscriptores 
       WHERE Email = ? 
       LIMIT 1`, 
      [email]
    );

    const emailExists = rows.length > 0;
    console.log('Email check result:', emailExists);
    return emailExists;
  } catch (error) {
    console.error('Error checking email existence in MySQL:', error);
    throw error;
  } finally {
    await connection.end();
  }
};

// Function to create a new subscriber in MySQL
export const createSubscriber = async (name: string, email: string): Promise<void> => {
  console.log('Creating new subscriber in MySQL...', { name, email });
  const connection = await mysql.createConnection(dbConfig);

  try {
    const result = await connection.execute(
      `INSERT INTO Subscriptores (Nombre, Email, Fecha_Subscripcion, Estado) 
       VALUES (?, ?, ?, ?)`, 
      [name, email, new Date().toISOString(), 'Activo']
    );

    console.log('Subscriber created successfully:', result);
  } catch (error) {
    console.error('Error creating subscriber in MySQL:', error);
    throw error;
  } finally {
    await connection.end();
  }
};