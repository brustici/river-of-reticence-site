// All editable site content lives here. Edit this file, then rebuild/redeploy.
// Anything set to null (or an empty list) is hidden.

export const book = {
  title: 'River of Reticence',
  subtitle: 'A Novel',
  author: 'Geri Miller',
  tagline: 'Some secrets are carried for a lifetime. Some are carried by the river.',
  genre: 'Suspense · Dual-perspective mystery',
  // Plain-text summary used for meta descriptions and structured data.
  description: 'River of Reticence is a dual-perspective suspense novel by Geri Miller, set in small-town Vermont from 1968 to 1984. Told in two voices, it follows Linnea, a girl who learns that silence is the safest answer, and the rookie officer who finds a town full of unspoken history.',
  genres: ['Suspense', 'Mystery', 'Coming-of-age fiction'],
  isbn: '9798993956718',
  setting: 'Sugar Maple Heights, Vermont · 1968–1984',
  blurb: [
    'Sugar Maple Heights, Vermont, 1968. Four-year-old Linnea doesn’t know what a nickname is until the girl across the road gives her one. Jett is older, braver and the prettiest girl Linnea has ever seen. She calls her Sprite, and she becomes the one bright thing in a house ruled by a father’s temper and a mother’s silence.',
    'Linnea learns early that the safest thing to say is nothing. As she grows up in the shadow of the woods and the river that runs beside River Road, she keeps her silence about what happens at home, about Jett, and about the things a girl should never have to carry alone.',
    'Ten years later, rookie officer Hank Jones arrives in maple country to make up a third of a two-town police force. He expects quiet back roads and fender benders. Instead he finds a town full of unspoken history, and a girl with a hiking pack who is holding on to more than anyone knows.',
    'Told in two voices across two decades, River of Reticence is a story about friendship, survival and the weight of the things we never say.',
  ],
  // Light content note shown under the blurb. Set to null to hide.
  contentNote: 'Contains depictions of domestic abuse and suicide.',
  details: [
    { label: 'Format', value: 'Paperback' },
    { label: 'Published', value: '2026' },
    { label: 'ISBN (paperback)', value: '979-8-9939567-1-8' },
    { label: 'Cover art', value: 'Lisa Rustici' },
    { label: 'Editor', value: 'Deborah K. Frontiera' },
  ],
};

// Buy links. Add a store only once it has a real URL.
// TODO: the Amazon link is an ISBN search; swap in the direct /dp/ product URL when available.
export const retailers: { name: string; url: string }[] = [
  { name: 'Amazon', url: 'https://www.amazon.com/s?k=9798993956718&i=stripbooks&linkCode=qs' },
  { name: 'Barnes & Noble', url: 'https://www.barnesandnoble.com/w/river-of-reticence-geril-miller/1151197976?ean=9798993956718' },
  { name: 'Bookshop.org', url: 'https://bookshop.org/p/books/river-of-reticence/78f3626dfdf9f576?ean=9798993956718' },
];

// Formats shown in the buy section, e.g. ['Paperback', 'Ebook'].
export const formats = ['Paperback'];

// Short excerpt (the prologue). Keep it short: the full text is an early draft.
export const excerpt = {
  heading: 'Prologue',
  place: 'Sugar Maple Heights, Vermont · 1982',
  paragraphs: [
    'I headed north on River Road pushing Daisy as hard as she would go. I knew I needed to get up as much speed as possible, so I tried to force the gas pedal deeper into the floorboard. I briefly glanced down at the gauges and saw that the speedometer needle was buried way past the 100-mph mark, and the rpms were in the red hovering at 6000.',
    'The song playing over the radio, “Fire and Rain,” was barely audible over the roar of the engine, but it didn’t matter; I knew every word by heart. I didn’t WANT to do this, but I knew there would be more lives at stake if I didn’t end this right now, so all I could think about was getting the job done. I started to reflect on when Jett had entered my life and how I had come to own her car. I was around four and the flood of memories brought tears to my eyes. I remember it all as if it was yesterday…',
  ],
};

// Reader and author quotes. Section is hidden while this list is empty.
export const reviews: { quote: string; source: string }[] = [];

export const authorInfo = {
  name: 'Geri Miller',
  // Homepage teaser (first two sentences of the bio), linking to /about.
  teaser: 'Geri Miller lives in Michigan’s Upper Peninsula with her husband of forty-one years. A lifelong mystery lover inspired by Nancy Drew, she now writes suspense shaped by the rugged beauty of the north and the complexities of her upbringing.',
  // Full bio, from the book's About the Author page (shown on /about).
  bio: [
    'Geri Miller lives in Michigan’s Upper Peninsula with her husband of forty-one years. A lifelong mystery lover inspired by Nancy Drew, she now writes suspense shaped by the rugged beauty of the north and the complexities of her upbringing.',
    'A former runner who has always loved the water, she began writing three years ago, pursuing her long-held dream of crafting a dual-perspective mystery and drawing her stories from the resilience of her own childhood. She is a proud member of the Upper Peninsula Publishers and Authors Association (UPPAA).',
    'When she isn’t writing, she enjoys fishing, making maple syrup, and spending time on the St. Mary’s River with family and friends.',
  ],
  // Short bio for structured data (schema.org Person description).
  shortBio: 'Geri Miller is a suspense author from Michigan’s Upper Peninsula and a member of the Upper Peninsula Publishers and Authors Association. She is the author of River of Reticence, a dual-perspective mystery.',
  location: { region: 'Upper Peninsula, Michigan', state: 'MI', country: 'US' },
  memberOf: { name: 'Upper Peninsula Publishers and Authors Association', alternateName: 'UPPAA', url: 'https://www.uppaa.org/' },
  // PLACEHOLDER: add a photo at src/assets/author.jpg and set photo: true
  // (the /about page and Person structured data will pick it up).
  photo: false,
  // PLACEHOLDER: Geri's official profile URLs, used as schema.org `sameAs`
  // so search engines and AI assistants can connect her identity. Add only
  // real URLs, e.g. Amazon Author page, Goodreads author page, Instagram,
  // Facebook. Do not guess.
  sameAs: [] as string[],
  dedication: 'In memory of my mom, the one true Jett.',
};

// Newsletter signup. Set url to a provider's hosted signup page (Mailchimp,
// Kit, Buttondown, MailerLite…) to show the section; null hides it.
export const newsletter: { url: string | null; blurb: string } = {
  url: null,
  blurb: 'Be the first to hear about events, readings and what Geri is writing next.',
};

export const contactEmail: string | null = null;
