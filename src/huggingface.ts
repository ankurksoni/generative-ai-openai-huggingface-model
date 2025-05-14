import { HfInference } from "@huggingface/inference";
import fs from "fs";

const inference = new HfInference(process.env.HF_TOKEN);

async function embed() {
    try {
        const output = await inference.featureExtraction({
            inputs: "Hello, world!",
            model: "BAAI/bge-small-en-v1.5",
        });
        console.log("Embedding:", output);
    } catch (err) {
        console.error("Feature extraction error:", err);
    }
}

async function translate() {
    const output = await inference.translation({
        inputs: "I love my country",
        model: "Helsinki-NLP/opus-mt-en-fr",
    });
    console.log("Translation:", output);
}

async function questionAnswering() {
    const output = await inference.questionAnswering({
        inputs: {
            context: "I love my country, which is France which is land of love",
            question: "What is my country famous for?",
        },
        // model: "deepset/roberta-base-squad2",
    });
    console.log("Question answering:", output);
}

// async function textToImage() {
//     const output = await inference.textToImage({
//         inputs: "A beautiful landscape",
//         model: "hakurei/waifu-diffusion",
//         parameters: {
//             negative_prompt: "low quality, blurry",
//         },
//     });
//     const buffer = Buffer.from(await output.arrayBuffer());
//     fs.writeFileSync("output.png", buffer);
// }

translate();
