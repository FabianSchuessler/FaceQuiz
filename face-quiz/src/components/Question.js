import React from 'react';
import PropTypes from 'prop-types';

function Question(props) {
  return <center><img src={ require(('./employee_pictures/' + props.content)) } /></center>;
}

Question.propTypes = {
  content: PropTypes.string.isRequired
};

export default Question;
