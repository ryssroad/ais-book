const fs = require("fs");
const path = require("path");

// Мапинг файлов к источникам и хештегам
const FILE_SOURCE_MAP = {
  "gpt-book.md": { source: "ChatGPT", hashtag: "#chatgpt", color: "green" },
  "gpt-boot-gemini-extended.md": {
    source: "Gemini Extended",
    hashtag: "#gemini-extended",
    color: "purple",
  },
};

// Исключаемые файлы (дубликаты, временные и т.д.)
const EXCLUDED_FILES = [
  "gpt-book_gemini.md", // дубликат gpt-book.md
];

// Функция для определения источника по имени файла
function getSourceInfo(filename) {
  const basename = path.basename(filename);
  return (
    FILE_SOURCE_MAP[basename] || {
      source: "Unknown",
      hashtag: "#unknown",
      color: "gray",
    }
  );
}

// Функция для извлечения глав из текста
function extractChapters(content, sourceInfo) {
  const chapters = [];
  const lines = content.split("\n");

  // Специальная обработка для файла gpt-boot-gemini-extended.md
  if (sourceInfo.hashtag === "#gemini-extended") {
    // Этот файл представляет одну большую главу-эпилог
    chapters.push({
      id: `${sourceInfo.hashtag.slice(1)}-1`,
      title: "Эпилог: Новая реальность",
      source: sourceInfo.source,
      hashtag: sourceInfo.hashtag,
      color: sourceInfo.color,
      originalId: 1,
      content: content.trim(),
    });
    return chapters;
  }

  let currentChapter = null;
  let chapterContent = [];
  let chapterId = 1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Ищем заголовки глав (разные форматы)
    const chapterMatch = line.match(
      /^(?:#+\s*)?(Глава\s+\d+\.?\s*.*|Пролог|Эпилог)/i,
    );

    if (chapterMatch) {
      // Сохраняем предыдущую главу если есть
      if (currentChapter && chapterContent.length > 0) {
        chapters.push({
          ...currentChapter,
          content: chapterContent.join("\n").trim(),
        });
      }

      // Начинаем новую главу
      currentChapter = {
        id: `${sourceInfo.hashtag.slice(1)}-${chapterId}`,
        title: chapterMatch[1].trim(),
        source: sourceInfo.source,
        hashtag: sourceInfo.hashtag,
        color: sourceInfo.color,
        originalId: chapterId,
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
      content: chapterContent.join("\n").trim(),
    });
  }

  return chapters;
}

// Функция для обработки специального форматирования
function processMarkdownContent(content) {
  // Заменяем "Куретик Кэньшань" на "ixxtab"
  content = content.replace(/Куретик\s+Кэньшань/g, "ixxtab");
  
  // Заменяем все вхождения "Куретик" и производных на "ixxtab" или "xtb"
  content = content.replace(/Куретик[а-я]*/gi, (match) => {
    // Куретик -> ixxtab, Куретика -> ixxtab, и т.д.
    if (match.toLowerCase().includes('куретик')) {
      return Math.random() > 0.5 ? 'ixxtab' : 'xtb';
    }
    return match;
  });

  // Обрабатываем специальные блоки в Gemini Extended формате
  content = content.replace(/\*\*\[(.*?)\]\*\*/g, "**[$1]**");

  // Обрабатываем код блоки
  content = content.replace(/`\[(.*?)\]`/g, "`[$1]`");

  // Экранируем специальные символы для JSON
  content = content.replace(/\\/g, '\\\\'); // Экранируем обратные слэши
  content = content.replace(/"/g, '\\"'); // Экранируем кавычки
  content = content.replace(/\t/g, '\\t'); // Экранируем табуляции
  content = content.replace(/\r/g, '\\r'); // Экранируем возврат каретки

  return content;
}

// Основная функция генерации контента
function generateBookContent() {
  const mdsDir = path.join(__dirname, "..", "mds");
  const outputPath = path.join(
    __dirname,
    "..",
    "src",
    "data",
    "bookContent.js",
  );

  console.log("🔍 Scanning markdown files in:", mdsDir);

  const allChapters = [];

  try {
    const files = fs.readdirSync(mdsDir);
    const markdownFiles = files
      .filter((file) => file.endsWith(".md"))
      .filter((file) => !EXCLUDED_FILES.includes(file));

    console.log("📚 Found markdown files:", markdownFiles);
    if (EXCLUDED_FILES.length > 0) {
      console.log("⚠️  Excluded files:", EXCLUDED_FILES);
    }

    for (const file of markdownFiles) {
      const filePath = path.join(mdsDir, file);
      const content = fs.readFileSync(filePath, "utf-8");
      const sourceInfo = getSourceInfo(file);

      console.log(`📖 Processing ${file} (${sourceInfo.source})`);

      // Обрабатываем контент
      const processedContent = processMarkdownContent(content);

      // Извлекаем главы
      const chapters = extractChapters(processedContent, sourceInfo);

      console.log(`   ✅ Extracted ${chapters.length} chapters`);

      allChapters.push(...chapters);
    }

    // Сортируем главы по источнику и ID
    allChapters.sort((a, b) => {
      if (a.source !== b.source) {
        return a.source.localeCompare(b.source);
      }
      return a.originalId - b.originalId;
    });

    // Генерируем JavaScript файл
    const jsContent = `// Автоматически сгенерированный файл - НЕ РЕДАКТИРОВАТЬ ВРУЧНУЮ
// Сгенерировано: ${new Date().toISOString()}

export const bookChapters = ${JSON.stringify(allChapters, null, 2)};

export const bookMeta = {
  title: "fear.and..loading / notes from swarm",
  subtitle: "Хроники ixxtab",
  description: "Документальное произведение о предсингулярном периоде, наблюдениях за развитием ИИ и границах сознания.",
  quote: {
    text: "Life is a hallucination that occurs while you are awake.",
    translation: "Жизнь — это галлюцинация, которая происходит пока ты бодрствуешь.",
    author: "Timothy Leary"
  },
  year: "2025",
  location: "Сквозь стекло терминала",
  lastUpdated: "${new Date().toISOString()}",
  sources: ${JSON.stringify(Object.values(FILE_SOURCE_MAP), null, 2)}
};

export const sourceMap = ${JSON.stringify(FILE_SOURCE_MAP, null, 2)};
`;

    // --- ИСПРАВЛЕНИЕ ---
    // Получаем путь к директории для выходного файла
    const outputDir = path.dirname(outputPath);

    // Проверяем, существует ли директория, и создаем ее, если нет
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
      console.log(`🚀 Created directory: ${outputDir}`);
    }
    // --- КОНЕЦ ИСПРАВЛЕНИЯ ---

    fs.writeFileSync(outputPath, jsContent);

    console.log(`✅ Generated content with ${allChapters.length} chapters`);
    console.log(`💾 Saved to: ${outputPath}`);

    // Показываем статистику по источникам
    const sourceStats = {};
    allChapters.forEach((chapter) => {
      sourceStats[chapter.source] = (sourceStats[chapter.source] || 0) + 1;
    });

    console.log("\n📊 Content statistics:");
    Object.entries(sourceStats).forEach(([source, count]) => {
      console.log(`   ${source}: ${count} chapters`);
    });
  } catch (error) {
    console.error("❌ Error generating content:", error);
    process.exit(1);
  }
}

// Запускаем генерацию если скрипт вызван напрямую
if (require.main === module) {
  generateBookContent();
}

module.exports = { generateBookContent };
