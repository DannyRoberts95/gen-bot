import React, { useRef, useState } from 'react';

import clsxm from '@/lib/clsxm';

import Button from '@/components/buttons/Button';
import Layout from '@/components/layout/Layout';
import NextImage from '@/components/NextImage';
import Seo from '@/components/Seo';

// import styles from './styles.module.css'

const abortController = new AbortController();

import Viewpager from '@/components/ViewPager';

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
    setFeedback('Let me think for a few moments...');
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
      setFeedback('I think this one will be new to you...');
    } catch (error) {
      setFeedback('Sorry, I am not able to remember my dream.');
      console.log('Error caught', error);
      handleError('Hmm, I cant think of one right now. Ask me again later.');
    }
  };

  // const generateContent = () => {
  //   console.log(Boolean(data));
  //   if (!data) return null;
  //   return (

  //   );
  // };

  return (
    <>
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
            <div className='an my-8'>
              <p
                className={clsxm('text-xl font-medium', [
                  loading && ['animate-pulse'],
                ])}
              >
                {feedback}
              </p>
            </div>

            <section>
              {data && (
                <>
                  <Viewpager pages={data.images.data.map((img) => img.url)} />

                  <div className='w-full'>
                    {data.completion.choices[0].text}
                  </div>

                  <section className='overflow-hidden text-gray-700 '>
                    <div className='container mx-auto px-5 py-2 lg:px-32 lg:pt-12'>
                      <div className='-m-1 flex flex-wrap md:-m-2'>
                        {data.images.data.map((img) => {
                          return (
                            <div key={img.url} className='flex w-1/3 flex-wrap'>
                              <div className='w-full p-1 md:p-2'>
                                <NextImage
                                  className='block h-full  w-[200px] rounded-lg object-cover object-center'
                                  alt='AI Image generated from you prompt'
                                  src={img.url}
                                  width={500}
                                  height={500}
                                  // priority
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </section>

                  <div className='grid grid-cols-4 gap-4'></div>
                </>
              )}
            </section>
          </section>
        </main>
      </Layout>
    </>
  );
}
