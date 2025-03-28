
import { Devvit } from '@devvit/public-api';
import { WhichPostGame } from './WhichPostGame';

// Configure Devvit app
Devvit.configure({
  redditAPI: true,
});

Devvit.addMenuItem({
  location: 'subreddit',
  label: 'Create WhichPost Game',
  onPress: async (_, context) => {
    const currentSubreddit = await context.reddit.getCurrentSubreddit();
    await context.reddit.submitPost({
      title: 'WhichPost Game',
      subredditName: currentSubreddit.name,
      preview: (
        <vstack>
          <text>Loading...</text>
        </vstack>
      ),
    });
    context.ui.showToast(`Created WhichPost Game in ${currentSubreddit.name}`);
  },
});

// Add custom post type
Devvit.addCustomPostType({
  name: 'WhichPost Game',
  height: 'tall',
  render: (context) => (
    <vstack height="100%" width="100%">
      <WhichPostGame context={context}/>
    </vstack>
  ),
});

export default Devvit;
