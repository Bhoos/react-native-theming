import { View, Image, Text, Animated } from 'react-native';

import createThemedComponent from './createThemedComponent';
import Theme, { createStyle, getCurrentTheme } from './Theme';

export default {
  View: createThemedComponent(View),
  Image: createThemedComponent(Image),
  Text: createThemedComponent(Text),

  AniamtedView: createThemedComponent(Animated.View),
  AniamtedImage: createThemedComponent(Animated.Image),
  AnimatedText: createThemedComponent(Animated.Text),
};

export {
  getCurrentTheme,
  createStyle,
};

export function createTheme(definition) {
  return new Theme(definition);
}
