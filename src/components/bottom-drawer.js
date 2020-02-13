import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, Dimensions } from "react-native";

import Animator from "./animator";

const SCREEN_HEIGHT = Dimensions.get("window").height;

export default class BottomDrawer extends Component {
  static propTypes = {
    containerHeight: PropTypes.number.isRequired,
    offset: PropTypes.number,
    startUp: PropTypes.bool,
    downDisplay: PropTypes.number,
    backgroundColor: PropTypes.string,
    roundedEdges: PropTypes.bool,
    shadow: PropTypes.bool,
    onExpanded: PropTypes.func,
    onCollapsed: PropTypes.func
  };

  static defaultProps = {
    offset: 0,
    startUp: true,
    backgroundColor: "#ffffff",
    roundedEdges: true,
    shadow: true,
    onExpanded: () => {},
    onCollapsed: () => {}
  };

  constructor(props) {
    super(props);
    this.TOGGLE_THRESHOLD = this.props.containerHeight / 11;
    this.DOWN_DISPLAY =
      this.props.downDisplay || this.props.containerHeight / 1.5;
    this.UP_POSITION = this._calculateUpPosition(
      SCREEN_HEIGHT,
      this.props.containerHeight,
      this.props.offset
    );
    this.DOWN_POSITION = this._calculateDownPosition(
      this.UP_POSITION,
      this.DOWN_DISPLAY
    );

    this.state = {
      currentPosition: this.props.startUp
        ? this.UP_POSITION
        : this.DOWN_POSITION
    };
  }

  render() {
    return (
      <Animator
        currentPosition={this.state.currentPosition}
        setCurrentPosition={position => this.setCurrentPosition(position)}
        toggleThreshold={this.TOGGLE_THRESHOLD}
        upPosition={this.UP_POSITION}
        downPosition={this.DOWN_POSITION}
        roundedEdges={this.props.roundedEdges}
        shadow={this.props.shadow}
        containerHeight={this.props.containerHeight}
        backgroundColor={this.props.backgroundColor}
        onExpanded={() => this.props.onExpanded()}
        onCollapsed={() => this.props.onCollapsed()}
      >
        {this.props.children}

        <View
          style={{
            height: Math.sqrt(SCREEN_HEIGHT),
            backgroundColor: this.props.backgroundColor
          }}
        />
      </Animator>
    );
  }

  setCurrentPosition(position) {
    this.setState({ currentPosition: position });
  }

  _calculateUpPosition(screenHeight, containerHeight, offset) {
    return {
      x: 0,
      y: screenHeight - (containerHeight + offset)
    };
  }

  _calculateDownPosition(upPosition, downDisplay) {
    return {
      x: 0,
      y: upPosition.y + downDisplay
    };
  }
}
