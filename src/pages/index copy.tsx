import React, { useRef, useState } from 'react';

import Button from '@/components/buttons/Button';
import Layout from '@/components/layout/Layout';
import LoadingDisplay from '@/components/LoadingDisplay';
import NextImage from '@/components/NextImage';
import Seo from '@/components/Seo';

// !STARTERCONF -> Select !STARTERCONF and CMD + SHIFT + F
// Before you begin editing, follow all comments with `STARTERCONF`,
// to customize the default configuration.

const abortController = new AbortController();

export default function HomePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('Enter a Prompt');
  const promptInput = useRef(null);
  const nInput = useRef(null);

  // useEffect(() => {
  //   return () => abortController.abort();
  // }, []);

  const handleSubmit = (e: React.FormEvent) => {
    setFeedback('');
    // e.preventDeafault()
    const { current: c1 } = promptInput;
    const { current: c2 } = nInput;

    if (c1 && c2) {
      generateImage(c1.value, parseInt(c2.value));
    }
  };

  const handleError = (msg: string) => {
    if (msg) {
      setFeedback(msg);
    } else setFeedback('An error occured');
  };

  const generateImage = async (prompt: string, n: number) => {
    setLoading(true);
    setFeedback('Generating your image...');
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          n,
        }),
        signal: abortController.signal,
      });

      const data = await response.json();
      if (response.status !== 200) {
        setLoading(false);
        setFeedback('');
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      setFeedback('success');
      setLoading(false);
      setData(data.result);
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.log('Error caught', error);
      handleError('error' + error);
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Seo templateTitle='Home' />

      <main>
        <section className='bg-white'>
          <div className='layout relative flex min-h-screen flex-col items-center justify-center py-12 text-center'>
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
            <div>
              <input
                ref={nInput}
                type='number'
                id='nInput'
                className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 '
                defaultValue={1}
                required
              />
            </div>
            <Button onClick={handleSubmit}>Generate Image</Button>

            <section className='my-8'>
              {data ? (
                <div className='mb-8 flex flex-col md:mb-16'>
                  {data.data.map((img) => {
                    return (
                      <NextImage
                        key={img.url}
                        alt='AI Image'
                        width={500}
                        height={500}
                        src={img.url}
                        // priority
                      />
                    );
                  })}
                </div>
              ) : (
                <LoadingDisplay message={feedback} />
              )}
            </section>
          </div>
        </section>
      </main>
    </Layout>
  );
}
