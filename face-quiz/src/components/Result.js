import React from 'react';
import PropTypes from 'prop-types';
import { CSSTransitionGroup } from 'react-transition-group';

function  handleClick() {
    console.log('this is:', this);
    this.setState({ isBlindDate: 'Undetermined' });
  }

function Result(props) {
  return (
    <CSSTransitionGroup
      className="container result"
      component="div"
      transitionName="fade"
      transitionEnterTimeout={800}
      transitionLeaveTimeout={500}
      transitionAppear
      transitionAppearTimeout={500}
    >
      <div>
        You already guessed all employees! 
		<strong> Good job!</strong>
		
		<button onClick={(e) => handleClick(e)}>
          Click me
        </button>
		
      </div>
    </CSSTransitionGroup>
  );
}

Result.propTypes = {
  quizResult: PropTypes.string.isRequired
};

export default Result;