import React, { useState, useEffect } from 'react';
import './App.css';
import { Button, Tree, Layout } from 'antd';

// import 'antd/dist/antd.css';

import {QuizData, poemDic} from './QuizData';

import treeData from './TreeData';
import Sider from 'antd/es/layout/Sider';
import { Content } from 'antd/es/layout/layout';

const App = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answerUp, setAnswerUp] = useState(1);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false); // 用于显示正确答案
  const [quizData, setQuizData] = useState(QuizData);

  const logRandomBinary = () => {
    const newAnswerUp = Math.round(Math.random());
    setAnswerUp(newAnswerUp);
    if (newAnswerUp != answerUp) {
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
      if (input.toLowerCase() === quizData.sentences[currentQuestion].questionText.toLowerCase()) {
        setFeedback('Correct!');
      } else {
        setFeedback(''); // 当答案不正确时清除反馈
      }
      return
    }
    if (input.toLowerCase() === quizData.sentences[currentQuestion].correctAnswer.toLowerCase()) {
      setFeedback('Correct!');
    } else {
      setFeedback('');
    }
  };

  const qDiv = <div className='question-section'>
    <div className='question-text'>{quizData.sentences[currentQuestion].questionText}</div>
  </div>
  const qDiv2 = <div className='question-section'>
    <div className='question-text'>{quizData.sentences[currentQuestion].correctAnswer}</div>
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
        // logRandomBinary()
        setFeedback('');
        setUserAnswer('');
        setShowCorrectAnswer(false);
        setCurrentQuestion(currentQuestion == quizData.sentences.length - 1 ? 0 : currentQuestion + 1);
      }
      if (event.key === '[') {
        // logRandomBinary()

        setFeedback('');
        setUserAnswer('');
        setShowCorrectAnswer(false);
        setCurrentQuestion(currentQuestion === 0 ? quizData.sentences.length - 1 : currentQuestion - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);




    // 清除事件监听
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentQuestion]);
  
  const onSelect = (selectedKeys, { node }) => {
    if (node.title in poemDic) {
      console.log('Selected node title:', node.title);  // 打印节点的 title
      setQuizData(poemDic[node.title]);
      setCurrentQuestion(0); // Reset to the first question
      setUserAnswer(''); // Clear user answer
      setFeedback(''); // Clear feedback
      setShowCorrectAnswer(false); // Hide correct answer
    }
  };
  
  return (
    <div className='app'>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider style={{ background: '#fff' }}>
          <Tree treeData={treeData}
          onSelect = {onSelect} ></Tree>
        </Sider>
        <Content style={{ padding: '20px' }}>
          <h3>
            {quizData.title}
          </h3>
          
            <>
              <div className='question-count'>
                <span>Question {currentQuestion + 1}</span>/{quizData.sentences.length}
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
                    Correct Answer: {quizData.sentences[currentQuestion].questionText},  {quizData.sentences[currentQuestion].correctAnswer}
                  </div>
                )}

              </div>
            </>
          

        </Content>
      </Layout>
      


    </div>
  );
};

export default App;
