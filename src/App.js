import React, { useState, useEffect, useMemo } from 'react';
import './App.css';
import { Menu, Button, Tree, Layout, Tooltip, Card } from 'antd';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';

import { PoemData3, poemDic } from './QuizData';

import treeData from './TreeData';
import Sider from 'antd/es/layout/Sider';
import { Content, Header } from 'antd/es/layout/layout';

const App = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answerUp, setAnswerUp] = useState(1);
  const [isRandom, setIsRandom] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false); // 用于显示正确答案
  const [quizData, setQuizData] = useState(PoemData3);
  const [currentTitle, setCurrentTitle] = useState('兵车行');
  const [collectedSentences, setCollectedSentences] = useState([]);
  const [collapsed, setCollapsed] = useState(false); // 添加状态以控制侧边栏的隐藏

  const collectedTreeData = useMemo(() => {
    const collected = {
      label: '收藏夹',
      key: 'collected',
      children: []
    };

    const titleMap = {};

    collectedSentences.forEach((sentence, index) => {
      if (!titleMap[sentence.title]) {
        titleMap[sentence.title] = {
          label: sentence.title,
          key: `collected-${sentence.title}`,
          fromCollect: true
        };
        collected.children.push(titleMap[sentence.title]);
      }
    });

    return [collected];
  }, [collectedSentences]);

  const combinedTreeData = useMemo(() => {
    return [...treeData, ...collectedTreeData];
  }, [treeData, collectedTreeData]);

  useEffect(() => {
    const storedSentences = localStorage.getItem('collectedSentences');
    if (storedSentences) {
      setCollectedSentences(JSON.parse(storedSentences));
    }
  }, []);

  // Add this useEffect hook at the beginning of the component
  useEffect(() => {
    console.log('treeData:', treeData);
  }, []);

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

  const questionSpan =
    <span className='question-text'> {quizData[currentQuestion].questionText}</span>

  const questionSpan2 =
    <span className='question-text'> {quizData[currentQuestion].correctAnswer}</span>

  const answerInput =
    <input
      className='answer-section'
      type='text'
      value={userAnswer}
      onChange={handleAnswerInput}
      placeholder='Enter your answer'
      style={{ width: '100%', maxWidth: '300px' }} // 添加样式以适配手机屏幕
    />


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

  const onSelect = ( node) => {
    node.title = node.key.replace('collected-','')
    if (node.title in poemDic) {
      console.log('Selected node title:', node.title);
      if (node.keyPath[1] == 'collected') {
        console.log('Selected node title c:', node.fromCollect);
        const selectedPoemSentences = collectedSentences.filter(item => item.title === node.title);
        const formattedQuizData = selectedPoemSentences.map((sentence, index) => ({
          id: index,
          questionText: sentence.content.split(', ')[0],
          correctAnswer: sentence.content.split(', ')[1]
        }));
        // Sort formattedQuizData to match the order in poemDic[node.title]
        const poemOrder = poemDic[node.title].map(item => item.questionText + ', ' + item.correctAnswer);
        formattedQuizData.sort((a, b) => {
          const aIndex = poemOrder.indexOf(a.questionText + ', ' + a.correctAnswer);
          const bIndex = poemOrder.indexOf(b.questionText + ', ' + b.correctAnswer);
          return aIndex - bIndex;
        });
        setQuizData(formattedQuizData);
      } else {
        setQuizData(poemDic[node.title]);
      }
      setCurrentTitle(node.title);
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

  const toggleCollectSentence = () => {
    const currentSentence = {
      title: currentTitle,
      content: `${quizData[currentQuestion].questionText}, ${quizData[currentQuestion].correctAnswer}`
    };

    const updatedCollectedSentences = [...collectedSentences];

    const index = updatedCollectedSentences.findIndex(
      item => item.title === currentSentence.title && item.content === currentSentence.content
    );

    if (index > -1) {
      updatedCollectedSentences.splice(index, 1);
    } else {
      updatedCollectedSentences.push(currentSentence);
    }

    setCollectedSentences(updatedCollectedSentences);
    localStorage.setItem('collectedSentences', JSON.stringify(updatedCollectedSentences));
  };

  const isSentenceCollected = () => {
    return collectedSentences.some(
      item => item.title === currentTitle &&
        item.content === `${quizData[currentQuestion].questionText}, ${quizData[currentQuestion].correctAnswer}`
    );
  };

  const buttonStyle = {
    margin: '5px 10px',
    backgroundColor: '#4CAF50',
    color: 'white',
    borderRadius: '5px',
    border: 'none',
    padding: '10px 20px',
    fontSize: '16px',
  };

  return (
    <div className='app'>
        <Header
         style={{
           display: 'flex',
           alignItems: 'center',
          }}
        >
          <h2 style={{  textAlign: 'left', fontFamily: 'SimSun', color: 'white' }}>杜甫诗歌助手</h2>
          {/* <h2 style={{ marginTop: '0px', textAlign: 'left', fontFamily: 'SimSun', color: 'white' }}>杜甫诗歌助手</h2> */}
        </Header>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} style={{ background: '#fff' }}>
          <Menu
            collapsible
            mode="inline" 
            defaultSelectedKeys={[9]}
            items={combinedTreeData} 
            onClick={(node) => {onSelect(node)}} />
        </Sider>
        <Content style={{ padding: '20px' }}>
          <>
            <Card title={<div style={{ textAlign: 'left' }}>{currentTitle}</div>}
              extra={<span>{currentQuestion + 1} / {quizData.length}</span>} // Moved question count to card extra
              style = {{margin : '10px 5%', maxWidth: '90%'}}
              styles={{ header: { fontSize: '24px' } }}
              actions={[
              <>
              {showCorrectAnswer ? (
                <div className='correct-answer' style = {{margin : '0px 0px'}}>
                  {quizData[currentQuestion].questionText},  {quizData[currentQuestion].correctAnswer}
                </div>
              ) : (
                <div className='correct-answer'></div>
              )}
              </>  ,
            
                <Tooltip title={isSentenceCollected() ? "Remove sentence from collection" : "Add sentence to collection"}>
                  <Button
                    icon={isSentenceCollected() ? <HeartFilled /> : <HeartOutlined />}
                    onClick={toggleCollectSentence}
                    style={{ float: 'right', margin : '0px 10px' }} // 添加右对齐样式
                  />
                </Tooltip>
              ]}
            >
              <div 
                className='question-answer-container'>
                {answerUp === 1 ? (
                  <>
                    {questionSpan}
                    <br></br>
                    {answerInput}
                  </>
                ) : (
                  <>
                    {answerInput}
                    <br></br>
                    {questionSpan2}
                  </>
                )}
              </div>
              <div className='feedback'>{feedback}</div>
            </Card>
            <Card 
              style = {{margin : '10px 5%', maxWidth: '90%'}}
            > 

              <Button 
                onClick={toggleRandom} 
                style={buttonStyle} // 统一样式
              >
                {!isRandom ?  '随机上下句' : '只考下半句'}
              </Button>
              <Tooltip title="Shortcut: [" >
                <Button onClick={handleLastSentence} style={buttonStyle}>上一句</Button>
              </Tooltip>
              <Tooltip title="Shortcut: ]">
                <Button onClick={handleNextSentence} style={buttonStyle}>下一句</Button>
              </Tooltip>
              
              <Tooltip title="Shortcut: =">
                <Button 
                  onClick={toggleShowAnswer} 
                  style={{ ...buttonStyle, backgroundColor: '#007bff' }} // 统一样式，修改背景色
                >
                  {showCorrectAnswer ? '隐藏答案' : '查看答案'}
                </Button>
              </Tooltip>
              
            </Card>
            
            
            
  
          </>


        </Content>
      </Layout>



    </div>
  );
};

export default App;
