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
          'https://transmit-2ftr2uhms-app-vantix.vercel.app/api/feed.xml',
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
        // Return a fallback episode with real podcast audio
        return [
          {
            id: 'episode-01-grouping',
            title: 'Episode 01 - Grouping',
            published: new Date('2025-01-20'),
            description: 'This episode explores the psychology of how humans mentally "group" experiences and possessions, leading to diminishing appreciation over time. It reflects on why both success and material gain often fail to sustain happiness.',
            content: `
              <h2>Summary</h2>
              <p>The episode begins by examining our tendency to categorize life's pleasures—relationships, achievements, or belongings—into mental "groups." This habit makes once-special things feel ordinary. For instance, the newness of a car, home, or relationship soon fades as our brain stops noticing what's constant and familiar. Instead of continuing to appreciate them, they become background noise in our daily lives.</p>
              
              <p>Through relatable examples—like the feeling of cold water that fades after a moment—the host illustrates that human brains are wired to detect change, not constancy. This neural bias explains why both wealthy and poor individuals can feel unfulfilled: satisfaction fades not from loss, but from habituation.</p>
              
              <p>The episode closes with a mindful reflection encouraging listeners to reconnect with gratitude. By intentionally revisiting the initial joy tied to something or someone in their lives, they can renew appreciation and contentment. The key message is simple yet profound: happiness often comes from remembering the value in what already exists, not from seeking what's next.</p>
            `,
            audio: {
              src: 'https://s326.podbean.com/pb/c93ff3ae643872c9b4fba1c078fef78a/68f87709/data1/fs123/21531923/uploads/Episode_01_-_Grouping_9gqqh.mp3?pbss=fca8047d-3fcf-5775-bb6a-02aa8cd9f149',
              type: 'audio/mpeg'
            }
          }
        ]
  }
}
