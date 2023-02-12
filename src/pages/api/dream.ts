import type { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function dream(req: NextApiRequest, res: NextApiResponse) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          'OpenAI API key not configured, please follow instructions in README.md',
      },
    });
    return;
  }

  const { prompt = '' } = req.body;

  if (prompt.trim().length === 0) {
    res.status(400).json({
      error: {
        message: 'Please enter a valid prompt',
      },
    });
    return;
  }

  try {
    // Generate a dream from the user prompt
    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      suffix:
        'You recently had a dream about the following prompt. Please describe the vivid dream as best you can.',
      prompt,
      max_tokens: 256,
      n: 1,
    });
    const { data: completionData } = completion;
    const { choices } = completionData;
    const imagePrompt = choices[0].text;

    const images = await openai.createImage({
      prompt: `${imagePrompt}`,
      n: 6,
      size: '256x256',
    });

    const obj = {
      result: { images: images.data, completion: completion.data },
    };

    res.status(200).json(obj);
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        },
      });
    }
  }
}
export default dream;
