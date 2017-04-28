import { StyleSheet } from 'react-native';
import ThemedStyle from './ThemedStyle';

const allStyles = [];
const allThemes = [];

const allComponents = [];
export function registerComponent(component) {
  allComponents.push(component);
  return () => {
    const idx = allComponents.indexOf(component);
    allComponents.splice(idx, 1);
  };
}

let currentTheme = null;
export function getCurrentTheme() {
  return currentTheme;
}

function detectTheming(value) {
  return typeof value === 'string' && value[0] === '@';
}

export function createStyle(stylesObject) {
  const themedStyles = {};
  const nonThemedStyles = {};

  Object.keys(stylesObject).forEach((key) => {
    const style = stylesObject[key];

    // See if there is anykind of theming applied on this style
    const themed = Object.keys(style).find(styleName => detectTheming(style[styleName]));

    if (themed) {
      const id = allStyles.push(style);
      // also map this theme to all the existing themes
      allThemes.forEach(theme => theme.addStyle(style));
      themedStyles[key] = new ThemedStyle(id);
    } else {
      nonThemedStyles[key] = style;
    }
  });

  return Object.assign(themedStyles, StyleSheet.create(nonThemedStyles));
}

class Theme {

  constructor(def) {
    this.def = def;

    // All the styles registered for the application that are dependent
    // on the theme
    this.styles = allStyles.map(style => this.mapStyle(style));

    if (currentTheme === null) {
      currentTheme = this;
    }
  }

  addStyle(style) {
    this.styles.push(this.mapStyle(style));
  }

  mapStyle(style) {
    const mapped = {};
    Object.keys(style).forEach((styleName) => {
      const styleValue = style[styleName];
      mapped[styleName] = this.parse(styleValue);
    });

    return StyleSheet.create({ mapped }).mapped;
  }

  parse(value) {
    if (detectTheming(value)) {
      return this.def[value.substr[1]];
    }

    return value;
  }

  apply() {
    if (currentTheme !== this) {
      currentTheme = this;

      // Re-render all the themed components
      allComponents.forEach(component => component.setTheme(currentTheme));
    }
  }

  getStyle(style) {
    if (style) {
      if (style.map) {
        return style.map(s => this.getStyle(s));
      } else if (style instanceof ThemedStyle) {
        return this.styles[style.id - 1];
      }
    }

    return style;
  }

  getProp(value) {
    return this.parse(value);
  }
}

export default Theme;
