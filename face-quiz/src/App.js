import React, { Component } from 'react';
import quizQuestions from './api/quizQuestions';
import quizEmployees from './api/quizEmployees';
import Quiz from './components/Quiz';
import Result from './components/Result';
import logo from './svg/logo.svg';
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
      result: ''
    };

    this.handleAnswerSelected = this.handleAnswerSelected.bind(this);
  }

  componentWillMount() {
    const shuffledAnswerOptions = quizQuestions.map(question =>
      this.shuffleArray(question.answers)
    );
    this.setState({
      question: quizQuestions[0].question,
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

    if (this.state.questionId < quizQuestions.length) {
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
	var trueAnswer = quizEmployees.find(x => x.image === this.state.questionId.toString());
	if (answer === trueAnswer.lastname + ' ' + trueAnswer.firstname) {
		console.log("true");
		isAnswerCorrect = true;
		ToastStore.success('Oh wow, you knew your colleague!');
	} else {
		isAnswerCorrect = false;
		console.log("false");
		ToastStore.error('Oh no, this was actually your colleague ' + trueAnswer.firstname + ' ' + trueAnswer.lastname + ' from ' + trueAnswer.department);
	}
	
    const item = {
      image: this.state.questionId,
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
      question: quizQuestions[counter].question,
      answerOptions: quizQuestions[counter].answers,
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

  renderQuiz() {
    return (
      <Quiz
        answer={this.state.answer}
        answerOptions={this.state.answerOptions}
        questionId={this.state.questionId}
        question={this.state.question}
        questionTotal={quizQuestions.length}
        onAnswerSelected={this.handleAnswerSelected}
      />
    );
  }

  renderResult() {
    return <Result quizResult={this.state.result} />;
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>FaceQuiz</h2>
        </div>
        {this.state.result ? this.renderResult() : this.renderQuiz()}
		<ToastContainer store={ToastStore}/>
      </div>
	  
    );
  }
}

export default App;
