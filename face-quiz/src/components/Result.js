import React from 'react';
import PropTypes from 'prop-types';
import { CSSTransitionGroup } from 'react-transition-group';

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
		
      </div>
	  < button onClick = {_refreshPage} > Restart the quiz </button>
    </CSSTransitionGroup>
  );
}

function _refreshPage() {
        console.log("Clicked");
        window.location.reload();
      }

Result.propTypes = {
  quizResult: PropTypes.string.isRequired
};

export default Result;