import React from 'react';
import PropTypes from 'prop-types';
import { CSSTransitionGroup } from 'react-transition-group';

function BlindDate(props) {
  return (
    <CSSTransitionGroup
      className="container BlindDate"
      component="div"
      transitionName="fade"
      transitionEnterTimeout={800}
      transitionLeaveTimeout={500}
      transitionAppear
      transitionAppearTimeout={500}
    >
      <div>
        asdf		
      </div>
    </CSSTransitionGroup>
  );
}

BlindDate.propTypes = {
  quizBlindDate: PropTypes.string.isRequired
};

export default BlindDate;