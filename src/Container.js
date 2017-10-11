/**
 * A special type of themed component, that displays an image if
 * its available on the theme, if not, falls back display the
 * children. Note that if the image is available, the children
 * are not rendered.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Animated } from 'react-native';

import { registerComponent, getCurrentTheme } from './Theme';
import ThemedStyle from './ThemedStyle';

const stylePropType = PropTypes.oneOfType([
  PropTypes.number,                       // For StyleSheet.create
  PropTypes.instanceOf(ThemedStyle),      // For Themed styles
  PropTypes.object,                       // For inline styles
  PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.instanceOf(ThemedStyle),
    PropTypes.object,
  ])),
]);

class Container extends Component {
  static propTypes = {
    viewStyle: stylePropType,
    imageStyle: stylePropType,
    children: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.arrayOf(PropTypes.node),
    ]),
    image: PropTypes.string.isRequired,
  };

  static defaultProps = {
    viewStyle: undefined,
    imageStyle: undefined,
    children: undefined,
  };

  constructor(props) {
    super(props);

    const theme = getCurrentTheme();
    this.state = {
      theme,
      image: theme.getProp(props.image),
    };
  }

  componentWillMount() {
    this.unregister = registerComponent(this);
  }

  componentWillReceiveProps(nextProps) {
    const { theme, image } = this.state;

    const newImage = theme.getProps(nextProps.image);
    if (newImage !== image) {
      this.setState({
        image: newImage,
      });
    }
  }

  componentWillUnmount() {
    this.unregister();
  }

  setTheme(newTheme) {
    this.setState({
      theme: newTheme,
      image: newTheme.getProp(this.props.image),
    });
  }

  render() {
    const { viewStyle, imageStyle, children, ...other } = this.props;
    const { theme, image } = this.state;

    // If there is an image available, use that image
    if (image) {
      return <Animated.Image style={theme.getStyle(imageStyle)} {...other} source={image} />;
    }

    // If no image has been defined, use a view container to put in the children
    return (
      <Animated.View style={theme.getStyle(viewStyle)} {...other}>
        {children}
      </Animated.View>
    );
  }
}

export default Container;
