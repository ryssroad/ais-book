import fs from 'fs';
import path from 'path';

// Мапинг файлов к источникам и хештегам
const FILE_SOURCE_MAP = {
  'gpt-book.md': { source: 'ChatGPT', hashtag: '#chatgpt', color: 'green' },
  'gpt-book_gemini.md': { source: 'Gemini', hashtag: '#gemini', color: 'blue' },
  'gpt-boot-gemini-extended.md': { source: 'Gemini Extended', hashtag: '#gemini-extended', color: 'purple' }
};

// Функция для определения источника по имени файла
export function getSourceInfo(filename) {
  const basename = path.basename(filename);
  return FILE_SOURCE_MAP[basename] || { source: 'Unknown', hashtag: '#unknown', color: 'gray' };
}

// Функция для извлечения глав из текста
export function extractChapters(content, sourceInfo) {
  const chapters = [];
  const lines = content.split('\n');
  
  let currentChapter = null;
  let chapterContent = [];
  let chapterId = 1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Ищем заголовки глав (разные форматы)
    const chapterMatch = line.match(/^(?:#+\s*)?(Глава\s+\d+\.?\s*.*|Пролог|Эпилог)/i);
    
    if (chapterMatch) {
      // Сохраняем предыдущую главу если есть
      if (currentChapter && chapterContent.length > 0) {
        chapters.push({
          ...currentChapter,
          content: chapterContent.join('\n').trim()
        });
      }

      // Начинаем новую главу
      currentChapter = {
        id: `${sourceInfo.hashtag.slice(1)}-${chapterId}`,
        title: chapterMatch[1].trim(),
        source: sourceInfo.source,
        hashtag: sourceInfo.hashtag,
        color: sourceInfo.color,
        originalId: chapterId
      };
      
      chapterContent = [];
      chapterId++;
    } else if (currentChapter) {
      // Добавляем контент к текущей главе
      chapterContent.push(line);
    }
  }

  // Добавляем последнюю главу
  if (currentChapter && chapterContent.length > 0) {
    chapters.push({
      ...currentChapter,
      content: chapterContent.join('\n').trim()
    });
  }

  return chapters;
}

// Функция для обработки специального форматирования
export function processMarkdownContent(content) {
  // Заменяем "Куретик Кэньшань" на "ixxtab"
  content = content.replace(/Куретик\s+Кэньшань/g, 'ixxtab');
  
  // Обрабатываем специальные блоки в Gemini Extended формате
  content = content.replace(/\*\*\[(.*?)\]\*\*/g, '**[$1]**');
  
  // Обрабатываем код блоки
  content = content.replace(/`\[(.*?)\]`/g, '`[$1]`');
  
  return content;
}

// Функция для чтения всех markdown файлов из директории
export async function loadAllMarkdownFiles(dirPath) {
  const allChapters = [];
  
  try {
    const files = fs.readdirSync(dirPath);
    const markdownFiles = files.filter(file => file.endsWith('.md'));
    
    for (const file of markdownFiles) {
      const filePath = path.join(dirPath, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const sourceInfo = getSourceInfo(file);
      
      // Обрабатываем контент
      const processedContent = processMarkdownContent(content);
      
      // Извлекаем главы
      const chapters = extractChapters(processedContent, sourceInfo);
      
      allChapters.push(...chapters);
    }
    
    // Сортируем главы по источнику и ID
    allChapters.sort((a, b) => {
      if (a.source !== b.source) {
        return a.source.localeCompare(b.source);
      }
      return a.originalId - b.originalId;
    });
    
  } catch (error) {
    console.error('Error loading markdown files:', error);
  }
  
  return allChapters;
}

// Функция для отслеживания изменений файлов
export function watchMarkdownFiles(dirPath, callback) {
  if (typeof window !== 'undefined') {
    // В браузере не можем использовать fs.watch
    console.warn('File watching not available in browser environment');
    return;
  }
  
  try {
    fs.watch(dirPath, (eventType, filename) => {
      if (filename && filename.endsWith('.md')) {
        console.log(`Markdown file ${filename} was ${eventType}`);
        callback();
      }
    });
  } catch (error) {
    console.error('Error setting up file watcher:', error);
  }
}