// import { useParams, Link } from "react-router-dom";
// import { useQuery } from "@tanstack/react-query";
// import { fetchTopics } from "@/lib/airtable";
// import { ArrowLeft } from "lucide-react";
// import { formatDate } from "@/utils/dateFormatter";

// const Story = () => {
//   const { id } = useParams();
  
//   const { data: topics } = useQuery({
//     queryKey: ["topics"],
//     queryFn: fetchTopics,
//   });

//   const story = topics?.find((t) => t.id === id);

//   // Add debug logging
//   console.log('Story image URL:', story?.image);
//   console.log('Default image URL:', import.meta.env.VITE_DEFAULT_NEWS_IMAGE);

//   if (!story) {
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <h1>Historia no encontrada</h1>
//         <Link to="/" className="text-blue-500 hover:underline">
//           Volver a la página principal
//         </Link>
//       </div>
//     );
//   }

//   const formattedDate = formatDate(story.pubDate);

//   return (
//     <div className="min-h-screen" style={{ backgroundColor: import.meta.env.VITE_BODY_BG_COLOR }}>
//       <div className="container mx-auto px-4 py-8">
//         <div className="max-w-4xl mx-auto">
//           <Link 
//             to="/" 
//             className="inline-flex items-center gap-2 mb-6 hover:underline"
//             style={{ color: import.meta.env.VITE_TITLE_FONT_COLOR }}
//           >
//             <ArrowLeft className="w-4 h-4" />
//             Volver a Noticias
//           </Link>

//           <h1 
//             className="text-4xl font-bold mb-4"
//             style={{ color: import.meta.env.VITE_TITLE_FONT_COLOR }}
//           >
//             {story.title}
//           </h1>

//           <div className="flex flex-wrap items-center gap-4 text-sm mb-8">
//             {story.creator && (
//               <span 
//                 className="font-medium"
//                 style={{ color: import.meta.env.VITE_AUTHOR_FONT_COLOR }}
//               >
//                 Por {story.creator}
//               </span>
//             )}
//             <time 
//               dateTime={story.pubDate}
//               className="text-sm"
//               style={{ color: import.meta.env.VITE_PUBDATE_FONT_COLOR }}
//             >
//               {formattedDate}
//             </time>
//           </div>

//           <div className="mb-8">
//             <img
//               src={story.image || import.meta.env.VITE_DEFAULT_NEWS_IMAGE}
//               alt={story.title}
//               className="w-full h-[400px] object-cover rounded-lg shadow-lg"
//               onError={(e) => {
//                 console.log('Image failed to load, using default image');
//                 e.currentTarget.src = import.meta.env.VITE_DEFAULT_NEWS_IMAGE;
//               }}
//             />
//           </div>

//           <div 
//             className="prose prose-lg max-w-none mb-8"
//             style={{ color: import.meta.env.VITE_TEXT_FONT_COLOR }}
//           >
//             <p>{story.contentSnippet}</p>
//           </div>

//           {story.link && (
//             <a
//               href={story.link}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="inline-block text-sm hover:underline"
//               style={{ color: import.meta.env.VITE_READ_MORE_FONT_COLOR }}
//             >
//               Leer la noticia completa en el sitio original →
//             </a>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };
// import { useParams, Link } from "react-router-dom";
// import { useQuery } from "@tanstack/react-query";
// import { fetchTopics } from "@/lib/airtable";
// import { ArrowLeft } from "lucide-react";
// import { formatDate } from "@/utils/dateFormatter";

// const Story = () => {
//   const { id } = useParams();
  
//   const { data: topics } = useQuery({
//     queryKey: ["topics"],
//     queryFn: fetchTopics,
//   });

//   const story = topics?.find((t) => t.id === id);

//   // Add debug logging
//   console.log('Story image URL:', story?.image);
//   console.log('Default image URL:', import.meta.env.VITE_DEFAULT_NEWS_IMAGE);

//   if (!story) {
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <h1>Historia no encontrada</h1>
//         <Link to="/" className="text-blue-500 hover:underline">
//           Volver a la página principal
//         </Link>
//       </div>
//     );
//   }

//   const formattedDate = formatDate(story.pubDate);

//   return (
//     <div className="min-h-screen" style={{ backgroundColor: import.meta.env.VITE_BODY_BG_COLOR }}>
//       <div className="container mx-auto px-4 py-8">
//         <div className="max-w-4xl mx-auto">
//           <Link 
//             to="/" 
//             className="inline-flex items-center gap-2 mb-6 hover:underline"
//             style={{ color: import.meta.env.VITE_TITLE_FONT_COLOR }}
//           >
//             <ArrowLeft className="w-4 h-4" />
//             Volver a Noticias
//           </Link>

//           <h1 
//             className="text-4xl font-bold mb-4"
//             style={{ color: import.meta.env.VITE_TITLE_FONT_COLOR }}
//           >
//             {story.title}
//           </h1>

//           <div className="flex flex-wrap items-center gap-4 text-sm mb-8">
//             {story.creator && (
//               <span 
//                 className="font-medium"
//                 style={{ color: import.meta.env.VITE_AUTHOR_FONT_COLOR }}
//               >
//                 Por {story.creator}
//               </span>
//             )}
//             <time 
//               dateTime={story.pubDate}
//               className="text-sm"
//               style={{ color: import.meta.env.VITE_PUBDATE_FONT_COLOR }}
//             >
//               {formattedDate}
//             </time>
//           </div>

//           <div className="mb-8">
//             <img
//               src={story.image || import.meta.env.VITE_DEFAULT_NEWS_IMAGE}
//               alt={story.title}
//               className="w-full h-[400px] object-cover rounded-lg shadow-lg"
//               onError={(e) => {
//                 console.log('Image failed to load, using default image');
//                 e.currentTarget.src = import.meta.env.VITE_DEFAULT_NEWS_IMAGE;
//               }}
//             />
//           </div>

//           <div 
//             className="prose prose-lg max-w-none mb-8"
//             style={{ color: import.meta.env.VITE_TEXT_FONT_COLOR }}
//           >
//             {/* Display content from 'Contenido Noticioso' */}
//             <p>{story.contentSnippet}</p>
//           </div>

//           {story.link && (
//             <a
//               href={story.link}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="inline-block text-sm hover:underline"
//               style={{ color: import.meta.env.VITE_READ_MORE_FONT_COLOR }}
//             >
//               Leer la noticia completa en el sitio original →
//             </a>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Story;
// import React from "react";
import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchTopics } from "@/lib/airtable";
import { ArrowLeft } from "lucide-react";
import { formatDate } from "@/utils/dateFormatter";

const Story = () => {
  const { id } = useParams();
  
  const { data: topics } = useQuery({
    queryKey: ["topics"],
    queryFn: fetchTopics,
  });

  const story = topics?.find((t) => t.id === id);

  if (!story) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1>Historia no encontrada</h1>
        <Link to="/" className="text-blue-500 hover:underline">
          Volver a la página principal
        </Link>
      </div>
    );
  }

  const formattedDate = formatDate(story.pubDate);

  return (
    <div className="min-h-screen" style={{ backgroundColor: import.meta.env.VITE_BODY_BG_COLOR }}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 mb-6 hover:underline"
            style={{ color: import.meta.env.VITE_TITLE_FONT_COLOR }}
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a Noticias
          </Link>

          <h1
            className="text-4xl font-bold mb-4"
            style={{ color: import.meta.env.VITE_TITLE_FONT_COLOR }}
          >
            {story.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm mb-8">
            {story.creator && (
              <span
                className="font-medium"
                style={{ color: import.meta.env.VITE_AUTHOR_FONT_COLOR }}
              >
                Por {story.creator}
              </span>
            )}
            <time
              dateTime={story.pubDate}
              className="text-sm"
              style={{ color: import.meta.env.VITE_PUBDATE_FONT_COLOR }}
            >
              {formattedDate}
            </time>
          </div>

          <div className="mb-8">
            <img
              src={story.image || import.meta.env.VITE_DEFAULT_NEWS_IMAGE}
              alt={story.title}
              className="w-full h-[400px] object-cover rounded-lg shadow-lg"
              onError={(e) => {
                console.log('Image failed to load, using default image');
                e.currentTarget.src = import.meta.env.VITE_DEFAULT_NEWS_IMAGE;
              }}
            />
          </div>

          {/* Display contentSnippet exactly as it comes */}
          <div
            className="prose prose-lg max-w-none mb-8"
            style={{ color: import.meta.env.VITE_TEXT_FONT_COLOR }}
            dangerouslySetInnerHTML={{ __html: story.contentSnippet }} // Display raw HTML from contentSnippet
          />

          {story.link && (
            <a
              href={story.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-sm hover:underline"
              style={{ color: import.meta.env.VITE_READ_MORE_FONT_COLOR }}
            >
              Leer la noticia completa en el sitio original →
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default Story;