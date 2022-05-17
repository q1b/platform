import type { Component } from 'solid-js';

import { FolderMenu } from './ui/FileExplorer/FolderMenu';


const App: Component = () => {
  return (
    <div>
      <FolderMenu name={"Other files"} />
    </div>
  );
};

export default App;
