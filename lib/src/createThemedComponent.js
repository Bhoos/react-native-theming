import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { registerComponent, getCurrentTheme } from './Theme';
import ThemedStyle from './ThemedStyle';

export default function createThemedComponent(C, themedProps = []) {
  class ThemedComponent extends Component {
    static displayName = `Theme.${C.displayName}`;

    static propTypes = {
      style: PropTypes.oneOfType([
        PropTypes.number, // For StyleSheet.create
        PropTypes.instanceOf(ThemedStyle), // For Themed styles
        PropTypes.object, // For inline styles
        PropTypes.arrayOf(
          PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.instanceOf(ThemedStyle),
            PropTypes.object,
          ]),
        ),
      ]),
      forwardRef: PropTypes.node,
      children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node),
      ]),
    };

    static defaultProps = {
      style: undefined,
      children: undefined,
      forwardRef: undefined,
    };

    constructor(props) {
      super(props);

      const theme = getCurrentTheme();
      this.state = {
        theme,
        props: themedProps.reduce((res, key) => {
          res[key] = theme.getProp(props[key]);
          return res;
        }, {}),
      };
    }

    componentWillMount() {
      this.unregister = registerComponent(this);
    }

    componentWillReceiveProps(nextProps) {
      const { theme, props } = this.state;

      let changed = false;
      // See if props have changed, only in which case change the state
      const newPropsState = themedProps.reduce((res, key) => {
        const newValue = theme.getProp(nextProps[key]);
        if (props[key] !== newValue) {
          changed = true;
        }
        res[key] = newValue;
        return res;
      }, {});

      if (changed) {
        this.setState({
          props: newPropsState,
        });
      }
    }

    componentWillUnmount() {
      this.unregister();
    }

    setTheme(newTheme) {
      this.setState({
        theme: newTheme,
        props: themedProps.reduce((res, key) => {
          res[key] = newTheme.getProp(this.props[key]);
          return res;
        }, {}),
      });
    }

    render() {
      const { style, children, forwardRef, ...other } = this.props;
      const { theme, props } = this.state;

      const themedStyle = theme.getStyle(style);

      return (
        <C style={themedStyle} ref={forwardRef} {...other} {...props}>
          {children}
        </C>
      );
    }
  }

  return React.forwardRef((props, ref) => (
    <ThemedComponent {...props} forwardRef={ref} />
  ));
}
