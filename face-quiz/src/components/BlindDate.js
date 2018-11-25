import React from 'react';
import PropTypes from 'prop-types';
import { CSSTransitionGroup } from 'react-transition-group';
import quizStaff from './quizStaff'; 

function BlindDate(props) {
  return (
    <CSSTransitionGroup
      className="container blinddate"
      component="div"
      transitionName="fade"
      transitionEnterTimeout={800}
      transitionLeaveTimeout={500}
      transitionAppear
      transitionAppearTimeout={500}
    >
      <div>
        Suggestions for Blind Lunch Date:	

      <section className='display-item'>
        <div className="wrapper">
          <ul>
			<div dangerouslySetInnerHTML={{__html: html(foo(props.answers))}} />
          </ul>
        </div>
      </section>
		
      </div>
    </CSSTransitionGroup>
  );
}

         

function html(myArray) {
	var result = '<b>Number of wrong guesses:</b> Firstname Lastname, Jobtitle, Department';
	for(var i=0; i<myArray[0].length; i++) {
        result += "<li> <b>"+myArray[1][i]+": </b>";
		var employee = quizStaff.find(x => x.photo === myArray[0][i] + '.jpg')		
		result += employee.firstname + ' ' + employee.lastname + ', ' + employee.jobtitle + ', ' + employee.department
        // result += "<h3>"+myArray[0][i]+"</h3>";
        result += "</li>";
    }
	return result;
}

function sortNodes(a, b) {
	//console.log('asdf');
	//console.log(a);
    return a.image - b.image;
}

function foo(arr) {
    var a = [], b = [], prev;

    arr.sort(sortNodes);
	console.log(arr);
	
    for ( var i = 0; i < arr.length; i++ ) {
		if (arr[i].isAnswerCorrect === false){
			if ( arr[i].image !== prev ) {
				a.push(arr[i].image);
				b.push(1);
			} else {
				b[b.length-1]++;
			}
			prev = arr[i].image;
		}
    }
	
	//1) combine the arrays:
	var list = [];
	for (var j = 0; j < a.length; j++) 
		list.push({'image': a[j], 'total': b[j]});

	//2) sort:
	list.sort(function(a, b) {
		return ((a.total > b.total) ? -1 : ((a.total == b.total) ? 0 : 1));
		//Sort could be modified to, for example, sort on the age 
		// if the name is the same.
	});

	//3) separate them back out:
	for (var k = 0; k < list.length; k++) {
		a[k] = list[k].image;
		b[k] = list[k].total;
	}	
	console.log(a + ' asdf '+ b);
	
    return [a, b];
}

BlindDate.propTypes = {
  quizBlindDate: PropTypes.string.isRequired,
  answers: PropTypes.array.isRequired
};

export default BlindDate;


