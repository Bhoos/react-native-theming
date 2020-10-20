import { ViewStyle, TextStyle, ImageStyle } from 'react-native';

declare module 'react-native-theming' {
  type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };

  export function createStyle<T extends NamedStyles<T> | NamedStyles<any>>(
    styles: T | NamedStyles<T>
  ): T;

  type themeVariables<T> = { [P in keyof T]: T[P] };

  export function createTheme<T>(
    variables: themeVariables<T>,
    themeName: string
  ): { apply(): void };

  export function createThemedComponent<P>(
    Comp: React.ComponentType<P>,
    props?: Array<string>
  ): React.ComponentType<P>;
}
