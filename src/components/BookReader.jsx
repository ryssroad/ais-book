import React, { useState } from "react";
import { bookChapters, bookMeta } from "../data/bookContent";

// Компонент для отображения источника в терминальном стиле
function SourceBadge({ source, hashtag, color }) {
  const colorClasses = {
    green: "text-green-400 border-green-400",
    blue: "text-cyan-400 border-cyan-400",
    purple: "text-purple-400 border-purple-400",
    gray: "text-gray-400 border-gray-400",
  };

  return (
    <div
      className={`inline-flex items-center gap-1 px-2 py-1 border text-xs font-mono ${colorClasses[color] || colorClasses.gray}`}
    >
      <span>[</span>
      <span className="font-medium">{hashtag}</span>
      <span>]</span>
    </div>
  );
}

export function BookReader() {
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [showChapterList, setShowChapterList] = useState(true);
  const [sourceFilter, setSourceFilter] = useState("all");

  const handleChapterSelect = (chapter) => {
    setSelectedChapter(chapter);
    setShowChapterList(false);
  };

  const handleBackToChapters = () => {
    setSelectedChapter(null);
    setShowChapterList(true);
  };

  const handleNextChapter = () => {
    const currentIndex = bookChapters.findIndex(
      (ch) => ch.id === selectedChapter.id,
    );
    if (currentIndex < bookChapters.length - 1) {
      setSelectedChapter(bookChapters[currentIndex + 1]);
    }
  };

  const handlePrevChapter = () => {
    const currentIndex = bookChapters.findIndex(
      (ch) => ch.id === selectedChapter.id,
    );
    if (currentIndex > 0) {
      setSelectedChapter(bookChapters[currentIndex - 1]);
    }
  };

  // Фильтрация глав по источнику
  const filteredChapters =
    sourceFilter === "all"
      ? bookChapters
      : bookChapters.filter((chapter) => chapter.source === sourceFilter);

  // Получаем уникальные источники для фильтра
  const sources = [...new Set(bookChapters.map((chapter) => chapter.source))];

  if (showChapterList) {
    return (
      <div className="min-h-screen bg-black text-green-400">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-4">
              <span className="text-green-400 font-mono text-lg">$</span>
              <h1 className="text-4xl md:text-6xl font-mono text-green-400 tracking-tight">
                {bookMeta.title}
              </h1>
            </div>
            <p className="text-xl text-green-300 mb-2 font-mono">
              {bookMeta.subtitle}
            </p>
            <p className="text-green-500 max-w-2xl mx-auto leading-relaxed font-mono text-sm">
              {bookMeta.description}
            </p>
            <div className="mt-4 text-sm text-green-600 font-mono">
              [{bookMeta.year}] • {bookMeta.location}
            </div>
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              {bookMeta.sources &&
                bookMeta.sources.map((sourceInfo, index) => (
                  <SourceBadge
                    key={index}
                    source={sourceInfo.source}
                    hashtag={sourceInfo.hashtag}
                    color={sourceInfo.color}
                  />
                ))}
            </div>
          </div>

          {/* Chapter Grid */}
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-mono text-green-400 flex items-center gap-2">
                <span>[</span>
                <span>Содержание</span>
                <span>]</span>
              </h2>

              {/* Source Filter */}
              <div className="flex gap-2">
                <button
                  onClick={() => setSourceFilter("all")}
                  className={`px-3 py-1 text-xs font-mono border transition-colors ${
                    sourceFilter === "all"
                      ? "bg-green-400 text-black border-green-400"
                      : "text-green-400 border-green-400 hover:bg-green-400 hover:text-black"
                  }`}
                >
                  [ALL:{bookChapters.length}]
                </button>
                {sources.map((source) => (
                  <button
                    key={source}
                    onClick={() => setSourceFilter(source)}
                    className={`px-3 py-1 text-xs font-mono border transition-colors ${
                      sourceFilter === source
                        ? "bg-green-400 text-black border-green-400"
                        : "text-green-400 border-green-400 hover:bg-green-400 hover:text-black"
                    }`}
                  >
                    [{source.toUpperCase()}:
                    {bookChapters.filter((ch) => ch.source === source).length}]
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {filteredChapters.map((chapter) => (
                <div
                  key={chapter.id}
                  className="border border-green-400 bg-black hover:bg-green-400/10 transition-all duration-200 cursor-pointer group p-4"
                  onClick={() => handleChapterSelect(chapter)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-green-400 group-hover:text-green-300 transition-colors text-lg leading-tight font-mono">
                        {chapter.title}
                      </h3>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-green-600 text-sm font-mono">
                          [Chapter {chapter.originalId}]
                        </span>
                        <SourceBadge
                          source={chapter.source}
                          hashtag={chapter.hashtag}
                          color={chapter.color}
                        />
                      </div>
                    </div>
                    <span className="text-green-600 group-hover:text-green-400 transition-colors font-mono">
                      &gt;
                    </span>
                  </div>
                  <p
                    className="text-green-500 text-sm leading-relaxed overflow-hidden font-mono"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {chapter.content.substring(0, 120)}...
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Chapter View
  const currentIndex = bookChapters.findIndex(
    (ch) => ch.id === selectedChapter.id,
  );
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < bookChapters.length - 1;

  return (
    <div className="min-h-screen bg-black text-green-400">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleBackToChapters}
            className="text-green-400 hover:text-green-300 border border-green-400 hover:bg-green-400/10 px-3 py-2 font-mono transition-colors"
          >
            &lt; [BACK_TO_INDEX]
          </button>

          <div className="flex items-center gap-2 font-mono">
            <button
              onClick={handlePrevChapter}
              disabled={!canGoPrev}
              className="text-green-400 hover:text-green-300 border border-green-400 hover:bg-green-400/10 px-2 py-1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              &lt;
            </button>
            <span className="text-green-600 text-sm px-3">
              [{currentIndex + 1}/{bookChapters.length}]
            </span>
            <button
              onClick={handleNextChapter}
              disabled={!canGoNext}
              className="text-green-400 hover:text-green-300 border border-green-400 hover:bg-green-400/10 px-2 py-1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              &gt;
            </button>
          </div>
        </div>

        {/* Chapter Content */}
        <div className="max-w-4xl mx-auto">
          <div className="border border-green-400 bg-black">
            <div className="p-6 border-b border-green-400">
              <h1 className="text-3xl md:text-4xl text-green-400 leading-tight font-mono">
                {selectedChapter.title}
              </h1>
              <div className="flex items-center justify-between mt-4">
                <div className="text-green-600 text-sm font-mono">
                  [Chapter {selectedChapter.originalId}]
                </div>
                <SourceBadge
                  source={selectedChapter.source}
                  hashtag={selectedChapter.hashtag}
                  color={selectedChapter.color}
                />
              </div>
            </div>
            <div className="p-6">
              <div className="h-[600px] overflow-y-auto pr-4 scrollbar-thin scrollbar-track-black scrollbar-thumb-green-400">
                <div className="text-green-300 leading-relaxed text-base font-mono">
                  {selectedChapter.content
                    .split("\n\n")
                    .map((paragraph, index) => {
                      // Handle quoted text
                      if (
                        paragraph.startsWith('"') &&
                        paragraph.endsWith('"')
                      ) {
                        return (
                          <blockquote
                            key={index}
                            className="border-l-2 border-cyan-400 pl-4 my-6 italic text-cyan-300"
                          >
                            &gt; {paragraph.slice(1, -1)}
                          </blockquote>
                        );
                      }
                      // Handle dialogue
                      if (paragraph.includes("—") || paragraph.includes("– ")) {
                        return (
                          <div
                            key={index}
                            className="my-4 pl-4 border-l border-green-600"
                          >
                            <p className="text-green-300 leading-relaxed">
                              {paragraph}
                            </p>
                          </div>
                        );
                      }
                      // Handle code blocks or special formatting
                      if (
                        paragraph.includes("`") ||
                        (paragraph.includes("[") && paragraph.includes("]"))
                      ) {
                        return (
                          <div
                            key={index}
                            className="my-4 p-3 bg-green-400/5 border border-green-600"
                          >
                            <pre className="text-green-400 text-sm whitespace-pre-wrap">
                              {paragraph}
                            </pre>
                          </div>
                        );
                      }
                      // Regular paragraph
                      return (
                        <p
                          key={index}
                          className="mb-6 text-green-300 leading-relaxed"
                        >
                          {paragraph}
                        </p>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>

          {/* Chapter Navigation Footer */}
          <div className="flex justify-between items-center mt-8">
            {canGoPrev ? (
              <button
                onClick={handlePrevChapter}
                className="text-green-400 hover:text-green-300 border border-green-400 hover:bg-green-400/10 px-4 py-2 font-mono transition-colors"
              >
                &lt; [PREV_CHAPTER]
              </button>
            ) : (
              <div />
            )}

            {canGoNext ? (
              <button
                onClick={handleNextChapter}
                className="text-green-400 hover:text-green-300 border border-green-400 hover:bg-green-400/10 px-4 py-2 font-mono transition-colors"
              >
                [NEXT_CHAPTER] &gt;
              </button>
            ) : (
              <div />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
