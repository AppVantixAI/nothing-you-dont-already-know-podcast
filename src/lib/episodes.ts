import { parse as parseFeed } from 'rss-to-json'
import { array, number, object, parse, string } from 'valibot'

export interface Episode {
  id: string
  title: string
  published: Date
  description: string
  content: string
  audio: {
    src: string
    type: string
  }
}

export async function getAllEpisodes() {
  try {
    let FeedSchema = object({
      items: array(
        object({
          id: string(),
          title: string(),
          published: number(),
          description: string(),
          content: string(),
          enclosures: array(
            object({
              url: string(),
              type: string(),
            }),
          ),
        }),
      ),
    })

    let feed = (await parseFeed(
      'https://nothingyoudontalreadyknow.com/feed.xml',
    )) as unknown
    let items = parse(FeedSchema, feed).items

    let episodes: Array<Episode> = items.map(
      ({ id, title, description, content, enclosures, published }, index) => ({
        id: id || `episode-${index}`,
        title: title,
        published: new Date(published),
        description,
        content,
        audio: enclosures.map((enclosure) => ({
          src: enclosure.url,
          type: enclosure.type,
        }))[0],
      }),
    )

    return episodes
  } catch (error) {
    console.error('Error fetching episodes:', error)
    // Return a sample episode as fallback for testing
    return [
      {
        id: 'sample-episode',
        title: 'Sample Episode - Nothing You Don\'t Already Know',
        published: new Date(),
        description: 'A sample episode to test the website functionality.',
        content: '<p>This is a sample episode content.</p>',
        audio: {
          src: 'https://example.com/sample.mp3',
          type: 'audio/mpeg'
        }
      }
    ]
  }
}
