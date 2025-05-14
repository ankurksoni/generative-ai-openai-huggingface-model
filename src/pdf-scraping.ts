// Import required LangChain modules and PDF loader
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

// Initialize the OpenAI chat model with config
const model = new ChatOpenAI({
    model: "gpt-3.5-turbo", // Model name
    apiKey: process.env.OPENAI_API_KEY, // API key from environment
    temperature: 0.7, // Controls randomness
    maxTokens: 100, // Max tokens in response
});

// The question to ask the LLM
const question = "When to use LangChain?";

/**
 * Main pipeline: loads PDF, splits, stores in memory, retrieves, and answers.
 */
async function main(): Promise<void> {
    // Load the PDF file (single document)
    const loader = new PDFLoader('langchain.pdf', {
        splitPages: false, // Load as one document
    });
    const docs = await loader.load(); // docs: Document[]

    // Split the PDF into smaller chunks for embedding
    const splitter = new RecursiveCharacterTextSplitter({
        separators: [". \n"] // Split on sentence and newline
    });
    const splitDocs = await splitter.splitDocuments(docs); // Array of chunks
    console.log(splitDocs); // Show split chunks for learning

    // Create an in-memory vector store for embeddings
    const vectorStore = new MemoryVectorStore(new OpenAIEmbeddings());
    await vectorStore.addDocuments(splitDocs); // Add all chunks

    // Create a retriever to fetch top-k relevant chunks
    const retriever = vectorStore.asRetriever({
        k: 2 // Number of relevant chunks to retrieve
    });
    const results = await retriever.getRelevantDocuments(question); // Search
    const resultDocs = results.map(
        result => result.pageContent // Extract text
    );
    console.log(resultDocs); // Show relevant chunks

    // Build a prompt template for the LLM
    const prompt = ChatPromptTemplate.fromMessages([
        'system', 'You are a helpful assistant that can answer questions about the user\'s data',
        'user', 'User: {question}\n\n{context}'
    ]);

    // Pipe prompt to model
    const chain = await prompt.pipe(model);
    // Invoke the chain with question and context
    const response = await chain.invoke({
        question,
        context: resultDocs.join('\n\n') // Join context chunks
    });
    console.log(response.content); // Print the answer
}

main(); // Run the pipeline
