import { TextToImage } from "deepinfra";
import { createWriteStream } from "fs";
import { Readable } from "stream";

const DEEPINFRA_API_KEY = "e7sy9bXI1NUG48UOCECmh4VNiaVQptGV";
const MODEL = "black-forest-labs/FLUX-1-schnell";

const main = async (query) => {
  const model = new TextToImage(MODEL, DEEPINFRA_API_KEY);
  const response = await model.generate({
    prompt: query,
    width: 384,
    height:256
  });

  const result = await fetch(response.images[0]);
  

  if (result.ok && result.body) {
    let writer = createWriteStream("image.png");
    Readable.from(result.body).pipe(writer);
  }
};

// Exporting the main function

export { main };

