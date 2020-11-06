import { Config } from 'bili'

const config: Config = {
  input: 'src/index.ts',
  plugins: {
    typescript2: {
      // Override the config in `tsconfig.json`
      tsconfigOverride: {
        include: ['src'],
      },
    },
  },
}

export default config
