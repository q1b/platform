import { action } from '@storybook/addon-actions';

import {FolderMenu} from '@/ui/FileExplorer/FolderMenu';

export default {
  title: 'Folder Menu',
  component: FolderMenu,
};

export const WithText = () => <FolderMenu onclick={action('clicked')}>Hello Button</FolderMenu>;

WithText.storyName = 'with text';

export const WithSomeEmoji = () => (
  <FolderMenu onclick={action('clicked')}>
    <span role="img" aria-label="so cool">
      😀 😎 👍 💯
    </span>
  </FolderMenu>
);

WithSomeEmoji.storyName = 'with some emoji';