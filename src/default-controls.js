import React from 'react';

const defaultButtonStyles = disabled => ({
  border: 0,
  background: 'rgba(0,0,0,0.4)',
  color: 'white',
  padding: 10,
  opacity: disabled ? 0.3 : 1,
  cursor: disabled ? 'not-allowed' : 'pointer'
});

export class PreviousButton extends React.Component {
  constructor() {
    super(...arguments);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(event) {
    event.preventDefault();
    this.props.previousSlide();
  }
  render() {
    const disabled =
      (this.props.currentSlide === 0 && !this.props.wrapAround) ||
      this.props.slideCount === 0;
    return (
      <button
        style={defaultButtonStyles(disabled)}
        disabled={disabled}
        onClick={this.handleClick}
        aria-label="previous"
      >
        PREV
      </button>
    );
  }
}

export class NextButton extends React.Component {
  constructor() {
    super(...arguments);
    this.handleClick = this.handleClick.bind(this);
    this.nextButtonDisable = this.nextButtonDisabled.bind(this);
  }
  handleClick(event) {
    event.preventDefault();
    this.props.nextSlide();
  }

  nextButtonDisabled(params) {
    const {
      wrapAround,
      slidesToShow,
      currentSlide,
      cellAlign,
      slideCount
    } = params;

    let buttonDisabled = false;
    if (!wrapAround) {
      const lastSlideIndex = slideCount - 1;
      let slidesShowing = slidesToShow;
      let lastSlideOffset = 0;

      switch (cellAlign) {
        case 'center':
          slidesShowing = (slidesToShow - 1) * 0.5;
          lastSlideOffset = Math.floor(slidesToShow * 0.5) - 1;
          break;
        case 'right':
          slidesShowing = 1;
          break;
      }

      if (slidesToShow > 1) {
        buttonDisabled =
          currentSlide + slidesShowing > lastSlideIndex + lastSlideOffset;
      } else {
        buttonDisabled = currentSlide + 1 > lastSlideIndex;
      }
    }
    return buttonDisabled;
  }
  render() {
    const {
      wrapAround,
      slidesToShow,
      currentSlide,
      cellAlign,
      slideCount
    } = this.props;

    const disabled = this.nextButtonDisabled({
      wrapAround,
      slidesToShow,
      currentSlide,
      cellAlign,
      slideCount
    });

    return (
      <button
        style={defaultButtonStyles(disabled)}
        disabled={disabled}
        onClick={this.handleClick}
        aria-label="next"
      >
        NEXT
      </button>
    );
  }
}

export class PagingDots extends React.Component {
  getDotIndexes(slideCount, slidesToScroll, slidesToShow, cellAlign) {
    const dotIndexes = [];
    let lastDotIndex = slideCount - slidesToShow;

    switch (cellAlign) {
      case 'center':
      case 'right':
        lastDotIndex += slidesToShow - 1;
        break;
    }
    if (lastDotIndex < 0) {
      return [0];
    }

    for (let i = 0; i < lastDotIndex; i += slidesToScroll) {
      dotIndexes.push(i);
    }
    dotIndexes.push(lastDotIndex);
    return dotIndexes;
  }

  getListStyles() {
    return {
      position: 'relative',
      margin: 0,
      top: -15,
      padding: 0,
      height: 5,
      overflow: 'hidden'
    };
  }

  getListItemStyles() {
    return {
      listStyleType: 'none',
      display: 'inline-block'
    };
  }

  getButtonStyles(active) {
    return {
      opacity: active ? 1 : 0.5,
      width: '35px',
      height: '5px',
      background: active ? 'rgba(240,185,11,1)' : '#fff',
      border: 'none',
      margin: '0 5px'
    };
  }

  render() {
    const indexes = this.getDotIndexes(
      this.props.slideCount,
      this.props.slidesToScroll,
      this.props.slidesToShow,
      this.props.cellAlign
    );
    return (
      <ul style={this.getListStyles()}>
        {indexes.map(index => {
          return (
            <li style={this.getListItemStyles()} key={index}>
              <button
                style={this.getButtonStyles(this.props.currentSlide === index)}
                onClick={this.props.goToSlide.bind(null, index)}
                aria-label={`slide ${index + 1} bullet`}
              >
                &bull;
              </button>
            </li>
          );
        })}
      </ul>
    );
  }
}
