import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const repoName = 'omoide-wiki'; 

export default defineConfig({

  base: `/${repoName}/`, 
  
  plugins: [react()],
});