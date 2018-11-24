import React from 'react';
import PropTypes from 'prop-types';

function Question(props) {
  return <img src={ require(('./employee_pictures/' + props.content)) } />;
}

Question.propTypes = {
  content: PropTypes.string.isRequired
};

export default Question;
