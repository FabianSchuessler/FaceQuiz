import React, { Component } from 'react';
import quizStaff from './api/quizStaff'; 
import Quiz from './components/Quiz';
import Result from './components/Result';
import BlindDate from './components/BlindDate';
import './App.css';
import {ToastContainer, ToastStore} from 'react-toasts';
import firebase from './firebase.js';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      counter: 0,
      questionId: 1,
      question: '',
      answerOptions: [],
      answer: '',
      answersCount: {
        1: 0,
        2: 0,
        3: 0
      },
      result: '',
	  site: 'quiz',
	  quizQuestions: this.genRandList(quizStaff),
	  answers: []
    };

    this.handleAnswerSelected = this.handleAnswerSelected.bind(this);
  }

  componentDidMount() {
    const itemsRef = firebase.database().ref('items');
    itemsRef.on('value', (snapshot) => {
      console.log(snapshot.val());
      let items = snapshot.val();
      let newState = [];
      for (let item in items) {
        newState.push({
          id: item,
          image: items[item].image,
          isAnswerCorrect: items[item].isAnswerCorrect
        });
      }
      this.setState({
        answers: newState
      });
    });
  }
  
  componentWillMount() {
    const shuffledAnswerOptions = this.state.quizQuestions.map(question =>
      this.shuffleArray(question.answers)
    );
	
    this.setState({
      question: this.state.quizQuestions[0].question,
      answerOptions: shuffledAnswerOptions[0]
    });
  }

  shuffleArray(array) {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  handleAnswerSelected(event) {
    this.setUserAnswer(event.currentTarget.value);

    if (this.state.questionId < this.state.quizQuestions.length) {
      setTimeout(() => this.setNextQuestion(), 300);
    } else {
      setTimeout(() => this.setResults(this.getResults()), 300);
    }
  }

  setUserAnswer(answer) {
	const itemsRef = firebase.database().ref('items');
	
    this.setState((state, props) => ({
      answersCount: {
        ...state.answersCount,
        [state.questionId]: answer
      },
      answer: answer
    }));
	
	var isAnswerCorrect = false;
	var trueAnswer = quizStaff.find(x => x.photo === this.state.question.toString());
	
	console.log(answer);
	if (answer === trueAnswer.firstname + ' ' + trueAnswer.lastname + ', ' + trueAnswer.jobtitle + ', ' + trueAnswer.department) {
		console.log("true");
		isAnswerCorrect = true;
		ToastStore.success('Correct answer!', 2000);
	} else {
		isAnswerCorrect = false;
		console.log("false");
		ToastStore.error('The correct answer would have been ' + trueAnswer.firstname + ' ' + trueAnswer.lastname + ', ' + trueAnswer.jobtitle + ', ' + trueAnswer.department, 6000);
	}
	
    const item = {
      image: parseInt(this.state.question.slice(0, -4)),
      isAnswerCorrect: isAnswerCorrect
    }
	
	itemsRef.push(item);	
  }
  
    setNextQuestion() {
    const counter = this.state.counter + 1;
    const questionId = this.state.questionId + 1;

    this.setState({
      counter: counter,
      questionId: questionId,
      question: this.state.quizQuestions[counter].question,
      answerOptions: this.state.quizQuestions[counter].answers,
      answer: ''
    });
  }

  getResults() {
    const answersCount = this.state.answersCount;
    const answersCountKeys = Object.keys(answersCount);
    const answersCountValues = answersCountKeys.map(key => answersCount[key]);
    const maxAnswerCount = Math.max.apply(null, answersCountValues);

    return answersCountKeys.filter(key => answersCount[key] === maxAnswerCount);
  }

  setResults(result) {
    if (result.length === 1) {
      this.setState({ result: result[0] });
    } else {
      this.setState({ result: 'Undetermined' });
    }
  }

  setBlindDate(blindDate) {
    if (blindDate.length === 1) {
      this.setState({ blindDate: blindDate[0] });
    } else {
      this.setState({ blindDate: 'Undetermined' });
    }
  }
  
  genRandList(input) {
    //console.log(JSON.stringify("Test"));

    var cont = {};
    var quizQuestions = [];
    var n = input.length; // number of employees
	//console.log(JSON.stringify(n));
    var q = 4; // number of options
    
    var j = 0;
    cont.quizQuestions = quizQuestions;
    // Generate options for each employee
	while (j < n) {
    var photo = input[j].photo;
    var answers = [];
    
    var i = 0;
    var i_rand = 0;
    var rand_list = [];
    while (i<q) {
    var answer = {};
	// Mark
    if (i === 0) {
	    //answer.type = "true";
	    answer.content = input[j].firstname + ' ' + input[j].lastname + ', ' + input[j].jobtitle + ', ' + input[j].department;
	    rand_list.push(answer.content);
	    answers.push(answer);
	    i++;
	    continue;
    }
    else {
	    //answer.type = "false";
	    // pick random name index
	    i_rand = Math.floor(Math.random() * (n) );
	    
	    var rand_name = input[i_rand].firstname + ' ' + input[i_rand].lastname + ', ' + input[i_rand].jobtitle + ', ' + input[i_rand].department;	
	   
	    //console.log(JSON.stringify(i_rand));
	    if (rand_list.includes(rand_name)) {}
	    // Add name if not on the list
	    else {
 		    answer.content = rand_name;
		    answers.push(answer);
		    rand_list.push(rand_name);
		    i++;
	    	}
	    }
    }
    // assign correct option to random position
    //Math.floor(Math.random() * (max - min) ) + min;
    
    var question = {"question" : photo, "answers" : answers};
    cont.quizQuestions.push(question);
    

    j++;
    }
    // console.log(JSON.stringify(cont.quizQuestions));
	
	console.log(quizQuestions);
	var shuffledQuizQuestions = this.shuffleArray(quizQuestions);
	console.log(shuffledQuizQuestions);
    return shuffledQuizQuestions;
    //console.log(JSON.stringify(input.length));
  }

  renderQuiz() {
    return (
      <Quiz
        answer={this.state.answer}
        answerOptions={this.state.answerOptions}
        questionId={this.state.questionId}
        question={this.state.question}
        questionTotal={this.state.quizQuestions.length}
        onAnswerSelected={this.handleAnswerSelected}
      />
    );
  }

  renderResult() {
    return <Result 
	         quizResult={this.state.result}
		   />;
  }

  renderBlindDate() {
    return <BlindDate
			  quizBlindDate={this.state.site}
			  answers={this.state.answers}
	       />;
  }
  
   onClick = () => {
     this.setState({
       site: 'blindLunchDate'
     });
   }
  
  onClick2 = () => {
     this.setState({
       site: 'quiz'
     });
   }

  
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>FaceQuiz</h2>
          {this.state.site === 'quiz' ? <button onClick={this.onClick}>Switch to Blind Lunch Date</button> : <button onClick={this.onClick2}>Switch to Quiz</button>}
        </div>
        {this.state.result ? this.state.site !== 'quiz' ? this.renderBlindDate() : this.renderResult() : this.state.site !== 'quiz' ? this.renderBlindDate() : this.renderQuiz()}
		<ToastContainer store={ToastStore}/>
      </div>
	  
    );
  }
}

export default App;