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
}
