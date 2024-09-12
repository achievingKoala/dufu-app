import React, { useState, useEffect } from 'react';
import './App.css';
import QuizData from './QuizData';

const App = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false); // 用于显示正确答案

  const handleAnswerInput = (event) => {
    const input = event.target.value;
    setUserAnswer(input);

    if (input.toLowerCase() === QuizData[currentQuestion].correctAnswer.toLowerCase()) {
      setFeedback('Correct!');
      setScore(score + 1);

      setTimeout(() => {
        setFeedback('');
        setUserAnswer('');
        setShowCorrectAnswer(false); // 清除显示的正确答案
        const nextQuestion = currentQuestion + 1;
        if (nextQuestion < QuizData.length) {
          setCurrentQuestion(nextQuestion);
        } else {
          setShowScore(true);
        }
      }, 1000); // 1秒后自动跳转到下一个问题
    } else {
      setFeedback(''); // 当答案不正确时，清除反馈
    }
  };

  // 添加键盘事件监听
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === '=') {
        setShowCorrectAnswer(true); // 当按下 '=' 键时显示正确答案
      }
      if (event.key === ']') {
        setCurrentQuestion(currentQuestion + 1); // 当按下 '=' 键时显示正确答案
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
      {showScore ? (
        <div className='score-section'>
          You scored {score} out of {QuizData.length}
        </div>
      ) : (
        <>
          <div className='question-section'>
            <div className='question-count'>
              <span>Question {currentQuestion + 1}</span>/{QuizData.length}
            </div>
            <div className='question-text'>{QuizData[currentQuestion].questionText}</div>
          </div>
          <div className='answer-section'>
            <input
              type='text'
              value={userAnswer}
              onChange={handleAnswerInput}
              placeholder='Enter your answer'
            />
            <div className='feedback'>{feedback}</div>
            {showCorrectAnswer && (
              <div className='correct-answer'>
                Correct Answer: {QuizData[currentQuestion].correctAnswer}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default App;
