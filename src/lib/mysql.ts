// Mock data interface
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

// Mock data
const mockTopics: Topic[] = [
  {
    id: "1",
    title: "La Inteligencia Artificial revoluciona la industria tecnológica",
    content: "Los últimos avances en IA están transformando la manera en que interactuamos con la tecnología. Desde asistentes virtuales más inteligentes hasta sistemas de automatización más sofisticados, la IA está presente en cada vez más aspectos de nuestra vida digital.",
    creator: "María González",
    pubDate: new Date().toISOString(),
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995",
    contentSnippet: "Los últimos avances en IA están transformando la industria tecnológica"
  },
  {
    id: "2",
    title: "El futuro de la computación cuántica",
    content: "Los investigadores han logrado nuevos avances significativos en el campo de la computación cuántica. Estos desarrollos prometen revolucionar áreas como la criptografía y el procesamiento de datos masivos.",
    creator: "Carlos Rodríguez",
    pubDate: new Date().toISOString(),
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb",
    contentSnippet: "Nuevos avances en computación cuántica"
  },
  {
    id: "3",
    title: "Ciberseguridad en la era digital",
    content: "Con el aumento de las amenazas cibernéticas, las empresas están invirtiendo más que nunca en seguridad digital. Expertos recomiendan nuevas estrategias para proteger datos sensibles.",
    creator: "Ana Martínez",
    pubDate: new Date().toISOString(),
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3",
    contentSnippet: "Aumentan las inversiones en ciberseguridad"
  }
];

console.log('Mock data initialized:', mockTopics);

export const fetchTopics = async (): Promise<Topic[]> => {
  console.log('Fetching mock topics...');
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockTopics;
};

export const checkEmailExists = async (email: string): Promise<boolean> => {
  console.log('Checking email existence (mock):', email);
  return false;
};

export const createSubscriber = async (name: string, email: string): Promise<void> => {
  console.log('Creating new subscriber (mock):', { name, email });
  return;
};