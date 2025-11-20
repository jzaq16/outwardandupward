import whoAreYouEn from './content/who-are-you-really.html?raw';
import whoAreYouVi from './content/who-are-you-really.vi.html?raw';
import whoAreYouEs from './content/who-are-you-really.es.html?raw';

import whyTheNameEn from './content/why-the-name.html?raw';

import apostlesAndProphetsContent from './content/apostles-and-prophets.html?raw';



import testMultilingualEn from './content/test-multilingual.html?raw';
import testMultilingualVi from './content/test-multilingual.vi.html?raw';
// -- IMPORTS --

export const posts = [
    // -- POSTS --



    {
        id: 'who-are-you-really',
        date: '2025-11-18',
        image: '/images/posts/whoareyou.jpg',
        translations: {
            en: {
                title: 'Who are you, really?',
                excerpt: 'The ocean chose . . . my 3-year-old (?) My daughter has recently been on a Moana kick...',
                content: whoAreYouEn
            },
            vi: {
                title: 'Bạn thực sự là ai?',
                excerpt: 'Đại dương đã chọn . . . con gái tôi (?) Con gái ba tuổi của tôi gần đây rất thích Moana...',
                content: whoAreYouVi
            },
            es: {
                title: '¿Quién eres realmente?',
                excerpt: 'El océano eligió . . . a mi hija (?) Mi hija de tres años ha estado recientemente obsesionada con Moana...',
                content: whoAreYouEs
            }
        }
    },
    {
        id: 'apostles-and-prophets',
        date: '2025-10-25',
        image: '/images/posts/apostles-and-prophets.webp',
        translations: {
            en: {
                title: 'Modern Apostles and Prophets: Living Proof of God\'s Love',
                excerpt: 'It’s an incredible idea, isn’t it? The concept of living prophets in Christianity today.',
                content: apostlesAndProphetsContent
            }
        }
    },
    {
        id: 'why-the-name',
        date: '2025-10-13',
        image: '/images/posts/why-the-name.jpeg',
        translations: {
            en: {
                title: 'Why the Name “Outward and Upward”?',
                excerpt: 'Ultimately, it’s about trying to live Christ’s two great commandments.',
                content: whyTheNameEn
            }
        }
    }
];
