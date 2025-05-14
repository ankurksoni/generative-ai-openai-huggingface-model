# aiagent

A modern, TypeScript-based agentic data pipeline for document and web scraping, semantic search, and LLM-powered Q&A using LangChain, OpenAI, ChromaDB, HuggingFace, and local Transformers.

---

## Features
- **PDF and Web Scraping**: Extracts and processes data from PDFs and web pages.
- **Semantic Chunking**: Splits documents into context-aware chunks for better embeddings.
- **Vector Search**: Supports both in-memory and persistent (ChromaDB) vector stores.
- **LLM Q&A**: Uses OpenAI's GPT models to answer questions based on your data.
- **HuggingFace & Local Transformers**: Run inference via cloud or local models.
- **TypeScript, Strong Typing**: Clean, maintainable, and type-safe codebase.
- **Dockerized ChromaDB**: Easy local setup for persistent vector search.

---

## Architecture

### High-Level Flow
```
[PDF/Web] → [Loader] → [Text Splitter] → [Embeddings] → [Vector Store] → [Retriever] → [Prompt] → [LLM]
```
- **Loader**: Loads data from PDFs or web pages.
- **Text Splitter**: Breaks content into semantic chunks for better context.
- **Embeddings**: Converts text chunks into vector representations using OpenAI or Transformers.
- **Vector Store**: Stores vectors for fast similarity search (in-memory or ChromaDB).
- **Retriever**: Finds the most relevant chunks for a given query.
- **Prompt**: Formats the context and question for the LLM.
- **LLM**: Answers the question using the provided context.

### Component Roles
- **LangChain**: Orchestrates the pipeline, provides loaders, splitters, and vector store interfaces.
- **OpenAI**: Supplies embeddings and LLM completions.
- **ChromaDB**: Persistent, high-performance vector database for scalable search.
- **Cheerio**: Efficient HTML parsing for web scraping.
- **TypeScript**: Ensures type safety and maintainability.

### Extensibility
- Swap out loaders for other data sources (e.g., CSV, DOCX, APIs).
- Use different LLMs or embedding models.
- Add custom retrievers, chunking strategies, or prompt templates.

---

## Tech Stack & Rationale
- **TypeScript**: Strong typing, maintainability, and modern JS features.
- **LangChain**: Modular, extensible framework for LLM pipelines; simplifies chaining and orchestration.
- **OpenAI**: Industry-leading LLMs and embeddings for high-quality Q&A and semantic search.
- **ChromaDB**: Fast, persistent vector database; ideal for production-scale semantic search.
- **Cheerio**: Lightweight, fast HTML parsing for robust web scraping.
- **Docker**: Simplifies local ChromaDB setup and ensures environment consistency.

---

## Source Files & Their Purpose (Detailed)

### `src/pdf-scraping.ts`
- **Purpose:** Loads a PDF, splits it into semantic chunks, stores embeddings in memory, and answers a question using OpenAI.
- **Packages Used:**
  - `@langchain/openai`: For OpenAI LLM and embeddings.
  - `@langchain/core`: For prompt templates.
  - `@langchain/textsplitters`: For chunking text.
  - `@langchain/community`: For PDF loading.
  - `langchain/vectorstores/memory`: In-memory vector store.

### `src/pdf-chromadb-scraping.ts`
- **Purpose:** Like `pdf-scraping.ts`, but stores embeddings in ChromaDB for persistence and scalability.
- **Packages Used:**
  - All from `pdf-scraping.ts`, plus:
  - `@langchain/community/vectorstores/chroma`: ChromaDB vector store.
  - `uuid`: For generating unique IDs for ChromaDB documents.

### `src/web-scraping.ts`
- **Purpose:** Loads a web page, splits it, stores embeddings in memory, and answers a question.
- **Packages Used:**
  - `@langchain/openai`: For OpenAI LLM and embeddings.
  - `@langchain/core`: For prompt templates.
  - `@langchain/textsplitters`: For chunking text.
  - `@langchain/community/document_loaders/web/cheerio`: For web scraping with Cheerio.
  - `langchain/vectorstores/memory`: In-memory vector store.

### `src/huggingface.ts`
- **Purpose:** Demonstrates use of HuggingFace Inference API for feature extraction, translation, and question answering.
- **Packages Used:**
  - `@huggingface/inference`: HuggingFace Inference API client.
  - `fs`: Node.js file system (for saving images, if text-to-image is used).

### `src/transformers.ts`
- **Purpose:** Uses the `@xenova/transformers` library for local model inference (feature extraction and text generation).
- **Packages Used:**
  - `@xenova/transformers`: Local transformer models for embeddings and text generation.

### `src/types.d.ts`
- **Purpose:** Declares a module for a specific internal PDF.js build used by `pdf-parse`.
- **Packages Used:**
  - `pdf-parse`: PDF parsing utility.

---

## Dependencies (with Usage Context)

| Package                        | Used In Files                        | Purpose/Role                                      |
|--------------------------------|--------------------------------------|---------------------------------------------------|
| @huggingface/inference         | huggingface.ts                       | HuggingFace Inference API client                  |
| @langchain/openai              | pdf-scraping.ts, pdf-chromadb-scraping.ts, web-scraping.ts | OpenAI LLM and embeddings         |
| @langchain/community           | pdf-scraping.ts, pdf-chromadb-scraping.ts, web-scraping.ts | Document loaders, vector stores    |
| @langchain/core                | pdf-scraping.ts, pdf-chromadb-scraping.ts, web-scraping.ts | Prompt templates, pipeline         |
| @langchain/textsplitters       | pdf-scraping.ts, pdf-chromadb-scraping.ts, web-scraping.ts | Text chunking                      |
| @xenova/transformers           | transformers.ts                      | Local transformer inference                        |
| cheerio                        | web-scraping.ts                      | HTML parsing for web scraping                      |
| chromadb                       | pdf-chromadb-scraping.ts             | Persistent vector storage (ChromaDB)              |
| langchain                      | (transitive, all LangChain scripts)  | Core LangChain utilities                          |
| pdf-parse                      | types.d.ts                           | PDF parsing utility                               |
| uuidv4                         | pdf-chromadb-scraping.ts             | Unique document IDs for ChromaDB                  |
| fs (Node.js built-in)          | huggingface.ts                       | File system operations                            |

---

## File Structure (Updated)
```
├── src/
│   ├── pdf-scraping.ts           # PDF → Memory Vector Q&A (LangChain, OpenAI)
│   ├── pdf-chromadb-scraping.ts  # PDF → ChromaDB Q&A (LangChain, ChromaDB, uuid)
│   ├── web-scraping.ts           # Web → Memory Vector Q&A (LangChain, Cheerio)
│   ├── huggingface.ts            # HuggingFace Inference API demo
│   ├── transformers.ts           # Local transformer inference (Xenova)
│   └── types.d.ts                # Custom type declarations for pdf-parse
├── langchain.pdf                 # Sample PDF
├── docker-compose.yml            # ChromaDB service
├── package.json                  # Scripts & dependencies
├── tsconfig.json                 # TypeScript config
└── README.md
```

---

## Execution Details

### Prerequisites
- Node.js (v18+ recommended)
- OpenAI API key (for LangChain scripts)
- (Optional) Docker for ChromaDB
- (Optional) HuggingFace API key (for huggingface.ts)

### Running the Pipelines

#### PDF Q&A (In-Memory)
```bash
npm run start:pdf
```
- Loads `langchain.pdf`, splits, embeds, and answers a sample question.

#### PDF Q&A (ChromaDB)
```bash
npm run start:pdf-chromadb
```
- Same as above, but embeddings are stored in ChromaDB (must be running via Docker).

#### Web Q&A
```bash
npm run start:web
```
- Loads a web page, splits, embeds, and answers a sample question.

#### HuggingFace Inference
```bash
npm run start:huggingface
```
- Runs the HuggingFace API demo for feature extraction, translation, and QA.

#### Local Transformers
```bash
npm run start:transformers
```
- Runs local transformer inference for embeddings and text generation.

---

## Setup

### 1. Clone & Install
```bash
git clone <repo-url>
cd aiagent
npm install
```

### 2. Environment Variables
Create a `.env` file with your API keys:
```
OPENAI_API_KEY=sk-...
HF_TOKEN=hf_...
```

### 3. (Optional) Start ChromaDB with Docker
If you want persistent vector search (for `pdf-chromadb-scraping.ts`):
```bash
docker-compose up -d
```
This starts ChromaDB at `http://localhost:8000`.

---

## Scripts
- `start:pdf` — Run PDF pipeline (in-memory)
- `start:pdf-chromadb` — Run PDF pipeline (ChromaDB)
- `start:web` — Run web scraping pipeline
- `start:huggingface` — Run HuggingFace API demo
- `start:transformers` — Run local transformer demo

---

## TypeScript Configuration
- **Strict mode** enabled
- Output to `dist/`
- ESNext target, NodeNext modules
- See [`tsconfig.json`](./tsconfig.json)

---

## Learning & Extending
- All scripts are heavily commented for learning.
- Swap out loaders, chunking, or vector stores as needed.
- Extend with your own prompts, retrievers, or LLMs.

---

## Example: How it Works
1. **Load** a PDF or web page
2. **Split** into semantic chunks
3. **Embed** each chunk with OpenAI, HuggingFace, or Transformers
4. **Store** in memory or ChromaDB
5. **Retrieve** relevant chunks for a question
6. **Prompt** the LLM with context
7. **Get** an answer grounded in your data

---

## License
MIT
