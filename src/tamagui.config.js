import { createTamagui } from 'tamagui'
import { createInterFont } from '@tamagui/font-inter'
import { shorthands } from '@tamagui/shorthands'
import { themes } from '@tamagui/themes'
import { tokens } from '@tamagui/themes'

const appConfig = createTamagui({
  fonts: {
    body: createInterFont(),
    heading: createInterFont({
      face: {
        700: { normal: 'InterBold' }
      }
    })
  },
  tokens,
  themes: {
    ...themes,
    light: {
      ...themes.light,
      background: '#FFFFFF',
      color: '#000000',
      card: '#F3F3F3',
      inputBackground: '#FFFFFF',
      inputText: '#000000',
      inputBorder: '#E0E0E0',
      accent: '#EAAA00',
      secondary: '#666666'
    },
    dark: {
      ...themes.dark,
      background: '#000000',
      color: '#FFFFFF',
      card: '#1A1A1A',
      inputBackground: '#333333',
      inputText: '#FFFFFF',
      inputBorder: '#555555',
      accent: '#EAAA00',
      secondary: '#BBBBBB'
    }
  },
  shorthands
})

export default appConfig 