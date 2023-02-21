import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';

import Button from '@/components/buttons/Button';
import Layout from '@/components/layout/Layout';
import LoadingDisplay from '@/components/LoadingDisplay';
import Seo from '@/components/Seo';

// !STARTERCONF -> Select !STARTERCONF and CMD + SHIFT + F
// Before you begin editing, follow all comments with `STARTERCONF`,
// to customize the default configuration.

const abortController = new AbortController();

export default function DefinePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('Enter a Prompt');
  const promptInput = useRef(null);

  const { query } = useRouter();
  const { word } = query;

  useEffect(() => {
    if (word) {
      generateCompletion(word);
    }

    return () => abortController.abort();
  }, [word]);

  const handleSubmit = (e: React.FormEvent) => {
    setFeedback('');
    // e.preventDeafault()
    const { current: c1 } = promptInput;

    c1 && generateCompletion(c1.value);
  };

  const handleError = (msg: string) => {
    if (msg) {
      setFeedback(msg);
    } else setFeedback('An error occured');
  };

  const generateCompletion = async (prompt: string) => {
    setLoading(true);
    setFeedback(`Defining ${prompt}...`);
    try {
      const response = await fetch('/api/define', {
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
      console.log('RESPONSE DATA', data);

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
      console.log(data.result);
    } catch (error) {
      console.log(error);
      // Consider implementing your own error handling logic here
      setFeedback('An error occured', error);
      setLoading(false);
    }
  };

  const words: string[] = [];
  if (data) {
    data.choices.forEach((choice) => {
      choice.text.split(' ').forEach((item) => words.push(`${item} `));
    });
  }

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

            <Button onClick={handleSubmit}>Generate text</Button>

            {loading && <LoadingDisplay message={feedback} />}

            <section className='my-8'>
              {word && <h3 className='text-xl'>{word}</h3>}
              {data && !loading && (
                <div className='mb-8 flex flex-col md:mb-16'>
                  <div className='flex flex-wrap whitespace-normal '>
                    {words.map((word, i) => (
                      <Link
                        className='mr-1'
                        key={word + i}
                        as={`/define/${word.replace(/[^a-zA-Z ]/g, '')}`}
                        href='/define/[word]'
                      >
                        {`${word} `}{' '}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </div>
        </section>
      </main>
    </Layout>
  );
}
