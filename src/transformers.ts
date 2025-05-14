import { round, pipeline } from "@xenova/transformers";

console.log(round(5.555, 2));

async function embedded() {
    const embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    const result = await embedder("Hello, world!", {
        pooling: 'mean',
        normalize: true,
    });
    console.log(result);
}

async function textGeneration() {
    const generator = await pipeline('text2text-generation', 'Xenova/LaMini-Flan-T5-783M');
    const result = await generator("list of books banned in USA", {
        max_length: 100,
        max_new_tokens: 100,
        temperature: 0.9,
        repetition_penalty: 2.0,
    });
    console.log(result);
}

// embedded();
textGeneration();