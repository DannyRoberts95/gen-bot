import React, { useRef, useState } from 'react';

import Button from '@/components/buttons/Button';
import Layout from '@/components/layout/Layout';
import NextImage from '@/components/NextImage';
import Seo from '@/components/Seo';

const abortController = new AbortController();

export default function HomePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('Enter a Prompt');

  const promptInput = useRef(null);

  // useEffect(() => {
  //   return () => abortController.abort();
  // }, []);

  const handleSubmit = (e: React.FormEvent) => {
    const prompt = promptInput?.current?.value;
    setFeedback('Generating dream....');
    console.log('prompt', prompt);

    if (prompt) {
      dream(prompt);
    }
  };

  const handleError = (msg: string) => {
    if (msg) {
      setFeedback(msg);
    } else setFeedback('An error occured');
  };

  const dream = async (prompt: string) => {
    try {
      const response = await fetch('/api/dream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
        }),
        // signal: abortController.signal,
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }
      setData(data.result);
      console.log(data.result);
      setFeedback('This is what I can remember about my dream.');
    } catch (error) {
      setFeedback('Sorry, I am not able to remember my dream.');
      console.log('Error caught', error);
      handleError('error' + error);
    }
  };

  const generateContent = () => {
    console.log(Boolean(data));
    if (!data) return null;
    return (
      <section>
        {data && (
          <div className=''>
            <div className='w-full'>{data.completion.choices[0].text}</div>

            <div className='grid w-full grid-cols-4 gap-4'>
              {data.images.data.map((img, i) => {
                return (
                  <div className='relative'>
                    <NextImage
                      alt='AI Image'
                      width={200}
                      height={200}
                      src={img.url}
                      priority={i === 0}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>
    );
  };

  return (
    <Layout>
      <Seo templateTitle='Home' />

      <main>
        <section className='min-h-screen bg-white'>
          <div className='layout relative flex flex-col items-center justify-center py-12 text-center'>
            <div>
              <input
                ref={promptInput}
                type='text'
                id='prompt'
                className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 '
                placeholder='Enter A prompt'
                required
              />
            </div>
            <Button onClick={handleSubmit}>Submit Man</Button>
          </div>
          {feedback}
          {generateContent()}
        </section>
      </main>
    </Layout>
  );
}
