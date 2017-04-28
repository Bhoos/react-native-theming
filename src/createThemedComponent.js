import React, { Component, PropTypes } from 'react';

import { registerComponent, getCurrentTheme } from './Theme';
import ThemedStyle from './ThemedStyle';
import flattenStyle from 'flattenStyle';
import detectTheming from './detectTheming';

// Allow string starting with '@'
// const DecoratedStylePropType = (props, propName) => {
//   const value = props[propName];

// }

const ThemedPropType = C => (props, propName, componentName, ...args) => {
  console.log('Checking propType', propName, ' of ', componentName);
  if (!detectTheming(props[propName])) {
    // Fall back to default propType
    return C.propTypes[propName](props, propName, componentName, ...args);
  }

  return undefined;
};

const DecoratedStylePropTypes = C => (props, propName, componentName, ...args) => {
  // Expected propType is an object in this case
  const value = props[propName];
  if (value) {
    const style = flattenStyle(props[propName]);
    const newProps = {
      [propName]: {},
    };

    // Remove all decorated values
    Object.keys(style).forEach((key) => {
      if (!detectTheming(style[key])) {
        newProps[propName][key] = style[key];
      }
    });

    // finally check with the default checker
    return C.propTypes.style(newProps, propName, componentName, ...args);
  }

  return undefined;
};


export default function createThemedComponent(C, themedProps = []) {
  class ThemedComponent extends Component {
    static displayName = `Theme.${C.displayName}`;

    static propTypes = {
      style: PropTypes.oneOfType([
        PropTypes.instanceOf(ThemedStyle),
        DecoratedStylePropTypes(C),
      ]),
      children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node),
      ]),
    };

    static defaultProps = {
      style: undefined,
      children: undefined,
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
      const { style, children, ...other } = this.props;
      const { theme, props } = this.state;

      const themedStyle = theme.getStyle(style);

      return (
        <C style={themedStyle} {...other} {...props}>
          {children}
        </C>
      );
    }
  }

  // Add the additional propTypes
  themedProps.forEach((prop) => {
    ThemedComponent.propTypes[prop] = ThemedPropType(C);
  });

  return ThemedComponent;
}
