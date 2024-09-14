import React, { useState, useEffect } from 'react';
import './App.css';

import QuizData from './QuizData';
import treeData from './TreeData';
import Tree from './Tree';

const App = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answerUp, setAnswerUp] = useState(1);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false); // 用于显示正确答案

  const logRandomBinary = () => {
    const newAnswerUp = Math.round(Math.random());
    setAnswerUp(newAnswerUp);
    if (newAnswerUp != answerUp){
      console.log('swap', newAnswerUp);
    
    }
    console.log('answerUp changed to:', newAnswerUp);
  };
  
  
  const handleAnswerInput = (event) => {
    const input = event.target.value;
    console.log('change input:');
    if (input.includes('=') || input.includes('【') || input.includes('】')) {
      return; // 如果输入包含 '='，直接返回，不更新 userAnswer
    }
    setUserAnswer(input);
    if (answerUp === 0) {
      if (input.toLowerCase() === QuizData.sentences[currentQuestion].questionText.toLowerCase()) {
        setFeedback('Correct!');
        setScore(score + 1);
      } else {
        setFeedback(''); // 当答案不正确时清除反馈
      }
      return 
    }
    if (input.toLowerCase() === QuizData.sentences[currentQuestion].correctAnswer.toLowerCase()) {
      setFeedback('Correct!');
      setScore(score + 1);
    } else {
      setFeedback(''); 
    }
  };

  const qDiv = <div className='question-section'>
    <div className='question-text'>{QuizData.sentences[currentQuestion].questionText}</div>
  </div>
  const qDiv2 = <div className='question-section'>
    <div className='question-text'>{QuizData.sentences[currentQuestion].correctAnswer}</div>
  </div>

const aDiv = <div className='answer-section'>
    <input
      type='text'
      value={userAnswer}
      onChange={handleAnswerInput}
      placeholder='Enter your answer'
    />

  </div>
  // 添加键盘事件监听
  useEffect(() => {
    // console.log('current change:' + currentQuestion);
    const handleKeyDown = (event) => {
      if (event.key === '=') {
        event.preventDefault(); // 阻止默认行为
        setShowCorrectAnswer(true); // 当按下 '=' 键时显示正确答案
      }
      if (event.key === ']') {
        logRandomBinary()
        setFeedback('');
        setUserAnswer('');
        setShowCorrectAnswer(false);
        setCurrentQuestion(currentQuestion == QuizData.sentences.length - 1 ? 0 : currentQuestion + 1);
      }
      if (event.key === '[') {
        logRandomBinary()

        setFeedback('');
        setUserAnswer('');
        setShowCorrectAnswer(false);
        setCurrentQuestion(currentQuestion === 0 ? QuizData.sentences.length - 1 : currentQuestion - 1); 
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    
    
    
    // 清除事件监听
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentQuestion]);

  return (
    <div className='app'>
      <Tree data = {treeData} ></Tree>
      <h3>
      {QuizData.title}
      </h3>
      {showScore ? (
        <div className='score-section'>
          You scored {score} out of {QuizData.sentences.length}
        </div>
      ) : (
        <>
          <div className='question-count'>
            <span>Question {currentQuestion + 1}</span>/{QuizData.sentences.length}
          </div>
          <div className='question-answer-container'>

          {answerUp === 1 ? (
            <>
              {qDiv}
              {aDiv}
            </>
          ) : (
            <>
              {aDiv}
              {qDiv2}
            </>
          )}

            <div className='feedback'>{feedback}</div>
            {showCorrectAnswer && (
              <div className='correct-answer'>
                Correct Answer: {QuizData.sentences[currentQuestion].questionText},  {QuizData.sentences[currentQuestion].correctAnswer}
              </div>
            )}

          </div>
        </>
      )}
    </div>
  );
};

export default App;
