// schema.org structured data (JSON-LD). Entities are linked by @id so search
// engines and AI assistants can tie the book, the paperback and the author together.
import { book, retailers, authorInfo } from './site';

export const SITE_URL = 'https://riverofreticence.com';
export const ABOUT_URL = `${SITE_URL}/about/`;

export const SHARE_IMAGE = {
  url: `${SITE_URL}/og-cover.jpg`,
  width: 1200,
  height: 630,
  alt: `Cover of ${book.title} by ${book.author}`,
};
export const COVER_URL = `${SITE_URL}/cover.jpg`;
export const AUTHOR_PHOTO_URL = `${SITE_URL}/author.jpg`;

export const ids = {
  website: `${SITE_URL}/#website`,
  book: `${SITE_URL}/#book`,
  paperback: `${SITE_URL}/#paperback`,
  author: `${ABOUT_URL}#geri-miller`,
};

const website = {
  '@type': 'WebSite',
  '@id': ids.website,
  url: `${SITE_URL}/`,
  name: book.title,
  description: book.description,
  inLanguage: 'en-US',
  publisher: { '@id': ids.author },
};

const authorRef = { '@type': 'Person', '@id': ids.author, name: authorInfo.name, url: ABOUT_URL };

export const homeJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    website,
    {
      '@type': 'Book',
      '@id': ids.book,
      name: book.title,
      alternateName: `${book.title}: ${book.subtitle}`,
      url: `${SITE_URL}/`,
      author: authorRef,
      image: COVER_URL,
      description: book.description,
      genre: book.genres,
      inLanguage: 'en-US',
      copyrightYear: 2026,
      copyrightHolder: { '@id': ids.author },
      editor: { '@type': 'Person', name: 'Deborah K. Frontiera' },
      illustrator: { '@type': 'Person', name: 'Lisa Rustici' },
      mainEntityOfPage: { '@id': ids.website },
      workExample: {
        '@type': 'Book',
        '@id': ids.paperback,
        name: book.title,
        bookFormat: 'https://schema.org/Paperback',
        isbn: book.isbn,
        inLanguage: 'en-US',
        datePublished: '2026',
        author: { '@id': ids.author },
        image: COVER_URL,
        offers: retailers.map((r) => ({
          '@type': 'Offer',
          url: r.url,
          availability: 'https://schema.org/InStock',
          itemCondition: 'https://schema.org/NewCondition',
          seller: { '@type': 'Organization', name: r.name },
        })),
        potentialAction: retailers.map((r) => ({
          '@type': 'BuyAction',
          name: `Buy on ${r.name}`,
          target: r.url,
          seller: { '@type': 'Organization', name: r.name },
        })),
      },
    },
  ],
};

export const aboutJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    { ...website },
    {
      '@type': 'ProfilePage',
      '@id': `${ABOUT_URL}#page`,
      url: ABOUT_URL,
      name: `About ${authorInfo.name}, Author of ${book.title}`,
      isPartOf: { '@id': ids.website },
      inLanguage: 'en-US',
      mainEntity: { '@id': ids.author },
    },
    {
      '@type': 'Person',
      '@id': ids.author,
      name: authorInfo.name,
      url: ABOUT_URL,
      jobTitle: 'Author',
      description: authorInfo.shortBio,
      address: {
        '@type': 'PostalAddress',
        addressRegion: authorInfo.location.state,
        addressCountry: authorInfo.location.country,
        description: authorInfo.location.region,
      },
      homeLocation: { '@type': 'Place', name: `${authorInfo.location.region}, United States` },
      memberOf: { '@type': 'Organization', ...authorInfo.memberOf },
      knowsAbout: ['Mystery fiction', 'Suspense fiction'],
      ...(authorInfo.photo ? { image: AUTHOR_PHOTO_URL } : {}),
      // PLACEHOLDER: filled from authorInfo.sameAs in site.ts (empty until real profile URLs exist).
      sameAs: authorInfo.sameAs,
    },
    // The Book (fully described on the homepage) points back here via author @id.
    { '@type': 'Book', '@id': ids.book, name: book.title, url: `${SITE_URL}/`, author: { '@id': ids.author } },
  ],
};
