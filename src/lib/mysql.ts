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
    title: "Sample Technology News",
    content: "This is a sample technology news article content. It contains interesting information about recent developments in tech.",
    creator: "John Doe",
    pubDate: new Date().toISOString(),
    image: import.meta.env.VITE_DEFAULT_NEWS_IMAGE,
    contentSnippet: "Sample technology news snippet"
  },
  {
    id: "2",
    title: "Another Tech Update",
    content: "Another interesting technology update with detailed information about innovations.",
    creator: "Jane Smith",
    pubDate: new Date().toISOString(),
    image: import.meta.env.VITE_DEFAULT_NEWS_IMAGE,
    contentSnippet: "Another tech update snippet"
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