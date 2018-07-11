import { View, Image, ImageBackground, Text, Animated } from 'react-native';

import createThemedComponent from './createThemedComponent';
import Theme, { createStyle, getCurrentTheme } from './Theme';

import Container from './Container';

export default {
  View: createThemedComponent(View),
  Image: createThemedComponent(Image, ['source']),
  Text: createThemedComponent(Text),
  ImageBackground: createThemedComponent(ImageBackground, ['source']),

  AnimatedView: createThemedComponent(Animated.View),
  AnimatedImage: createThemedComponent(Animated.Image, ['source']),
  AnimatedText: createThemedComponent(Animated.Text),

  Container,
};

export {
  createStyle,
  createThemedComponent,
  getCurrentTheme,
  Container,
};

export function createTheme(definition, name) {
  return new Theme(definition, name);
}

