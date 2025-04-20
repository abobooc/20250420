let questions = [];
let currentQuestionIndex = 0;
let correctCount = 0;
let wrongCount = 0;
let inputBox;
let submitButton;
let choices = [];
let isMultipleChoice = false;
let feedbackText = ''; // 用于显示反馈文字
let feedbackTimer = 0; // 用于控制反馈文字显示时间

function setup() {
  createCanvas(windowWidth, windowHeight); // 画布充满整个视窗
  generateQuestions();
  setupQuestionUI();
}

function draw() {
  background('#f7e1d7'); // 背景颜色

  // 显示分数
  fill(0);
  textSize(16);
  textAlign(RIGHT, TOP);
  text(`答對: ${correctCount}`, width - 20, 20);
  text(`答錯: ${wrongCount}`, width - 20, 40);

  // 显示当前题目
  textSize(24);
  textAlign(CENTER, CENTER);
  text(questions[currentQuestionIndex].question, width / 2, height / 2 - 50);

  if (isMultipleChoice) {
    // 显示选择题选项
    for (let i = 0; i < choices.length; i++) {
      textAlign(LEFT, CENTER);
      text(`${i + 1}: ${choices[i]}`, width / 2 - 50, height / 2 + i * 30);
    }
  }

  // 显示反馈文字
  if (feedbackText) {
    fill(0, 150, 0); // 绿色文字
    textSize(20);
    textAlign(CENTER, CENTER);
    text(feedbackText, width / 2, height / 2 + 100);

    // 控制反馈文字显示时间
    if (millis() > feedbackTimer) {
      feedbackText = ''; // 清除反馈文字
      nextQuestion(); // 跳转到下一题
    }
  }
}

function generateQuestions() {
  for (let i = 0; i < 20; i++) {
    let num1 = floor(random(1, 50));
    let num2 = floor(random(1, 50));
    let isAddition = random() > 0.5;
    let questionText = `${num1} ${isAddition ? '+' : '-'} ${num2} = ?`;
    let answer = isAddition ? num1 + num2 : num1 - num2;

    // 随机决定是填空题还是选择题
    let isMCQ = random() > 0.5;
    let options = [];
    if (isMCQ) {
      options = generateChoices(answer);
    }

    questions.push({
      question: questionText,
      answer: answer,
      isMCQ: isMCQ,
      options: options,
    });
  }
}

function generateChoices(correctAnswer) {
  let choices = [correctAnswer];
  while (choices.length < 4) {
    let choice = floor(random(correctAnswer - 10, correctAnswer + 10));
    if (!choices.includes(choice)) {
      choices.push(choice);
    }
  }
  return shuffle(choices);
}

function setupQuestionUI() {
  inputBox = createInput();
  inputBox.position(width / 2 - 50, height / 2 + 50);
  inputBox.size(100);

  submitButton = createButton('提交');
  submitButton.position(inputBox.x + inputBox.width + 10, inputBox.y);
  submitButton.mousePressed(checkAnswer);

  updateQuestionUI();
}

function updateQuestionUI() {
  let currentQuestion = questions[currentQuestionIndex];
  isMultipleChoice = currentQuestion.isMCQ;

  if (isMultipleChoice) {
    inputBox.hide();
    submitButton.hide();
    choices = currentQuestion.options;
  } else {
    inputBox.show();
    submitButton.show();
    choices = [];
  }
}

function checkAnswer() {
  let userAnswer = inputBox.value();
  let correctAnswer = questions[currentQuestionIndex].answer;

  if (parseInt(userAnswer) === correctAnswer) {
    correctCount++;
    feedbackText = '恭喜答對！'; // 答对反馈
  } else {
    wrongCount++;
    feedbackText = `答錯！正確答案是: ${correctAnswer}`; // 答错反馈
  }

  feedbackTimer = millis() + 800; // 设置反馈文字显示时间为 0.8 秒
}

function mousePressed() {
  if (isMultipleChoice) {
    for (let i = 0; i < choices.length; i++) {
      let x = width / 2 - 50;
      let y = height / 2 + i * 30 - 10;
      if (mouseX > x && mouseX < x + 100 && mouseY > y && mouseY < y + 20) {
        if (choices[i] === questions[currentQuestionIndex].answer) {
          correctCount++;
          feedbackText = '恭喜答對！'; // 答对反馈
        } else {
          wrongCount++;
          feedbackText = `答錯！正確答案是: ${questions[currentQuestionIndex].answer}`; // 答错反馈
        }
        feedbackTimer = millis() + 800; // 设置反馈文字显示时间为 0.8 秒
        break;
      }
    }
  }
}

function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex >= questions.length) {
    currentQuestionIndex = 0; // 重新开始或结束测验
  }
  inputBox.value('');
  updateQuestionUI();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight); // 窗口大小调整时重新设置画布大小
}
