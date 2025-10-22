import { getAllEpisodes } from '@/lib/episodes'

export async function GET() {
  try {
    const episodes = await getAllEpisodes()
    
    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Nothing You Don't Already Know</title>
    <description>A short, daily podcast exploring philosophy, stoic ideas, minimalist living, and ways to increase contentment and fulfillment.</description>
    <link>https://nothingyoudontalreadyknow.com</link>
    <language>en-us</language>
    <copyright>© 2025 Camden Burke</copyright>
    <managingEditor>camden@nothingyoudontalreadyknow.com (Camden Burke)</managingEditor>
    <webMaster>camden@nothingyoudontalreadyknow.com (Camden Burke)</webMaster>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <pubDate>${new Date().toUTCString()}</pubDate>
    <ttl>60</ttl>
    <itunes:author>Camden Burke</itunes:author>
    <itunes:summary>A short, daily podcast exploring philosophy, stoic ideas, minimalist living, and ways to increase contentment and fulfillment.</itunes:summary>
    <itunes:owner>
      <itunes:name>Camden Burke</itunes:name>
      <itunes:email>camden@nothingyoudontalreadyknow.com</itunes:email>
    </itunes:owner>
    <itunes:image href="https://nothingyoudontalreadyknow.com/poster.png"/>
    <itunes:category text="Society &amp; Culture">
      <itunes:category text="Philosophy"/>
    </itunes:category>
    <itunes:explicit>false</itunes:explicit>
    <itunes:type>episodic</itunes:type>
    ${episodes.map(episode => `
    <item>
      <title><![CDATA[${episode.title}]]></title>
      <description><![CDATA[${episode.description}]]></description>
      <link>https://nothingyoudontalreadyknow.com/${episode.id}</link>
      <guid isPermaLink="true">https://nothingyoudontalreadyknow.com/${episode.id}</guid>
      <pubDate>${episode.published.toUTCString()}</pubDate>
      <enclosure url="${episode.audio.src}" type="${episode.audio.type}" length="0"/>
      <itunes:duration>0:00</itunes:duration>
      <itunes:episodeType>full</itunes:episodeType>
      <itunes:explicit>false</itunes:explicit>
      <content:encoded><![CDATA[${episode.content}]]></content:encoded>
    </item>`).join('')}
  </channel>
</rss>`

    return new Response(rss, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    console.error('Error generating RSS feed:', error)
    return new Response('Error generating RSS feed', { status: 500 })
  }
}
