import React, { useState, useEffect } from 'react';
import './App.css';
import { Button, Tree, Layout, Tooltip, Progress } from 'antd';

// import 'antd/dist/antd.css';

import { QuizData, PoemData3, poemDic } from './QuizData';

import treeData from './TreeData';
import Sider from 'antd/es/layout/Sider';
import { Content } from 'antd/es/layout/layout';

const App = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answerUp, setAnswerUp] = useState(1);
  const [isRandom, setIsRandom] = useState(false);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false); // 用于显示正确答案
  const [quizData, setQuizData] = useState(PoemData3);
  const [currentTitle, setCurrentTitle] = useState('');

  const logRandomBinary = () => {
    if (!isRandom) {
      return
    }
    const newAnswerUp = Math.round(Math.random());
    setAnswerUp(newAnswerUp);
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
      if (input === quizData[currentQuestion].questionText) {
        setFeedback('Correct!');
      } else {
        setFeedback(''); // 当答案不正确时清除反馈
      }
      return
    }
    if (input === quizData[currentQuestion].correctAnswer) {
      setFeedback('Correct!');
    } else {
      setFeedback('');
    }
  };

  const qDiv = 
  <div className='question-section'>
    <div className='question-text'>{quizData[currentQuestion].questionText}</div>
  </div>
  
  const qDiv2 = 
  <div className='question-section'>
    <div className='question-text'>{quizData[currentQuestion].correctAnswer}</div>
  </div>

  const aDiv = 
  <div className='answer-section'>
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
        setShowCorrectAnswer(prevState => !prevState);
        // console.log(showCorrectAnswer)
      }
      if (event.key === ']') {
        logRandomBinary()
        setFeedback('');
        setUserAnswer('');
        setShowCorrectAnswer(false);
        setCurrentQuestion(currentQuestion == quizData.length - 1 ? 0 : currentQuestion + 1);
      }
      if (event.key === '[') {
        logRandomBinary()

        setFeedback('');
        setUserAnswer('');
        setShowCorrectAnswer(false);
        setCurrentQuestion(currentQuestion === 0 ? quizData.length - 1 : currentQuestion - 1);
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
      console.log('Selected node title:', node.title);
      setCurrentTitle(node.title);
      setQuizData(poemDic[node.title]);
      setCurrentQuestion(0); // Reset to the first question
      setUserAnswer(''); // Clear user answer
      setFeedback(''); // Clear feedback
      setShowCorrectAnswer(false); // Hide correct answer
    }
  };

  const toggleRandom = () => {
    // setAnswerUp(answerUp == 0 ? 1 : 0)
    setIsRandom(!isRandom);
  };

  const handleLastSentence = () => {
    logRandomBinary();
    setFeedback('');
    setUserAnswer('');
    setShowCorrectAnswer(false);
    setCurrentQuestion(currentQuestion === 0 ? quizData.length - 1 : currentQuestion - 1);
  };

  const handleNextSentence = () => {
    logRandomBinary();
    setFeedback('');
    setUserAnswer('');
    setShowCorrectAnswer(false);
    setCurrentQuestion(currentQuestion === quizData.length - 1 ? 0 : currentQuestion + 1);
  };

  const toggleShowAnswer = () => {
    setShowCorrectAnswer(!showCorrectAnswer);
  };

  return (
    <div className='app'>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider style={{ background: '#fff' }}>
          <Tree 
          defaultExpandAll = {true}
          treeData={treeData} onSelect={onSelect} />
        </Sider>
        <Content style={{ padding: '20px' }}>
          <h3>{currentTitle}</h3>
          <>
          <h3>
            {currentQuestion + 1}  / { quizData.length}
          </h3>
            
            <Button onClick={toggleRandom} style={{ margin: '0 10px' }}>
              {!isRandom ? '只考下半句' : '随机上下句'}
            </Button>
            <Tooltip title="Shortcut: [" >
              <Button onClick={handleLastSentence} style={{ margin: '0 10px' }}>上一句</Button>
            </Tooltip>
            <Tooltip title="Shortcut: ]">
              <Button onClick={handleNextSentence} style={{ margin: '0 10px' }} >下一句</Button>
            </Tooltip>
            <Tooltip title="Shortcut: =">
              <Button onClick={toggleShowAnswer} style={{ margin: '0 10px' }}>
                {showCorrectAnswer ? 'Hide Answer' : 'Show Answer'}
              </Button>
            </Tooltip>
            <hr></hr>
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
                  Correct Answer: {quizData[currentQuestion].questionText},  {quizData[currentQuestion].correctAnswer}
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
