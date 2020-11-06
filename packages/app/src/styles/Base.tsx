import { createGlobalStyle } from 'styled-components'

import button from './button'

export default createGlobalStyle`
  :root {
    --foreground: #352940;
    --background: #EDEAEE;
    --primary: #83468A;
    --header-font: Convergence, sans-serif;
    --body-font: Convergence, sans-serif;

    --discord-blue: #7289DA;
  }

  html, body {
    background: var(--background);
    color: var(--foreground);
    font-size: 1vmin;
    font-family: var(--body-font);
  }

  html, body, #root, .page {
    height: 100%;
    margin: 0;
    padding: 0;
  }

  button, .button {
    ${button}
  }

  h1, h2, h3 {
    font-family: var(--header-font);
    margin: 0 0 0.5em;
    line-height: 1.3;
  }

  h1 {
    font-size: 4rem;
    margin-bottom: 1em;

    small {
      display: block;
      font-size: 2.5rem;
      font-weight: normal;
    }
  }

  h2 {
    font-size: 2.25rem;
  }
`
