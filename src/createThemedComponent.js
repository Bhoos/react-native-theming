import React, { Component, PropTypes } from 'react';

import { registerComponent, getCurrentTheme } from './Theme';
import ThemedStyle from './ThemedStyle';

export default function createThemedComponent(C) {
  return class ThemedComponent extends Component {
    static propTypes = {
      style: PropTypes.oneOfType([
        PropTypes.instanceOf(ThemedStyle),
        C.propTypes.style,
      ]),
      source: PropTypes.oneOfType([
        PropTypes.string,
        C.propTypes.source,
      ]),
      children: C.propTypes.children,
    };

    static defaultProps = {
      style: undefined,
      source: undefined,
      children: undefined,
    };

    state = {
      theme: getCurrentTheme(),
    };

    componentWillMount() {
      this.unregister = registerComponent(this);
    }

    componentWillUnmount() {
      this.unregister();
    }

    setTheme(newTheme) {
      this.setState({
        theme: newTheme,
      });
    }

    render() {
      const { style, source, children, ...other } = this.props;
      const { theme } = this.state;

      const themedStyle = theme.getStyle(style);
      const themedSource = theme.getProp(source);

      return (
        <C style={themedStyle} source={themedSource} {...other}>
          {children}
        </C>
      );
    }
  };
}
