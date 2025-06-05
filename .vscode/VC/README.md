<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Simulador de Prueba POMA</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    header {
      background-color:rgb(175, 99, 76);
      color: white;
      padding: 1rem;
      text-align: center;
    }
    .container {
      width: 80%;
      margin: 0 auto;
      padding: 1rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .question {
      margin: 1.5rem 0;
    }
    .answers {
      margin-top: 0.5rem;
    }
    .answers button {
      margin: 0.5rem 0;
      padding: 0.7rem;
      width: 100%;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .answers button:hover {
      background-color: #45a049;
    }
    .timer {
      font-size: 1.2rem;
      font-weight: bold;
      text-align: right;
      margin-bottom: 1rem;
    }
    .score {
      text-align: center;
      margin-top: 2rem;
      font-size: 1.5rem;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <header>
    <h1>Simulador de Prueba POMA</h1>
  </header>
  <div class="container">
    <div id="instructions">
      <p>¡Bienvenido al simulador de la prueba POMA! Tienes 40 minutos para responder 60 preguntas. Presiona el botón de abajo para comenzar.</p>
      <button onclick="startQuiz()">Comenzar Prueba</button>
    </div>
    <div id="quiz" style="display: none;">
      <div class="timer" id="timer">Tiempo restante: 40:00</div>
      <div id="question-container"></div>
    </div>
    <div id="score-container" style="display: none;">
      <p class="score" id="final-score"></p>
      <button onclick="location.reload()">Reintentar</button>
    </div>
  </div>

  <script>
    const questions = [
      // Preguntas de Historia Dominicana (20)
      { question: "¿En qué año fue la independencia dominicana?", answers: ["1844", "1845", "1843"], correct: 0 },
      { question: "¿Quién fue el primer presidente de la República Dominicana?", answers: ["Juan Pablo Duarte", "Pedro Santana", "Juan Alejandro Acosta"], correct: 1 },
      { question: "¿En qué año se produjo la ocupación estadounidense en la República Dominicana?", answers: ["1916", "1905", "1940"], correct: 0 },
      { question: "¿Qué evento ocurrió el 27 de febrero de 1844?", answers: ["Independencia Dominicana", "Batalla del 30 de Marzo", "La Guerra de la Restauración"], correct: 0 },
      { question: "¿Quién fue el dictador de la República Dominicana entre 1930 y 1961?", answers: ["Rafael Leónidas Trujillo", "Juan Bosch", "José María Cabral"], correct: 0 },
      { question: "¿Qué país ayudó a la República Dominicana a obtener su independencia en 1844?", answers: ["Haití", "España", "Estados Unidos"], correct: 0 },
      { question: "¿En qué año se fundó la República Dominicana?", answers: ["1844", "1821", "1795"], correct: 0 },
      { question: "¿Quién fue el líder de la guerra de la Restauración?", answers: ["Gregorio Luperón", "Juan Pablo Duarte", "Pedro Santana"], correct: 0 },
      { question: "¿En qué batalla la República Dominicana derrotó a Haití en 1856?", answers: ["Batalla de Sabana Larga", "Batalla del 30 de marzo", "Batalla de Beller"], correct: 0 },
      { question: "¿Quién fue el presidente dominicano durante la ocupación de 1916?", answers: ["Carlos Felipe Morales", "Juan Isidro Jiménez", "Ramón Cáceres"], correct: 1 },
      { question: "¿Cómo se llama el tratado firmado en 1856 que reconoció la independencia de la República Dominicana?", answers: ["Tratado de Paz y Amistad", "Tratado de París", "Tratado de Washington"], correct: 2 },
      { question: "¿Qué nombre recibe el periodo en que la República Dominicana estuvo bajo el control de Trujillo?", answers: ["La Era de la Dictadura", "La Era de la Paz", "La Era de la Restauración"], correct: 0 },
      { question: "¿Quién fue el líder independentista que participó en la Revolución de Abril de 1965?", answers: ["Juan Bosch", "José Francisco Peña Gómez", "Juan Pablo Duarte"], correct: 0 },
      { question: "¿Qué dictador tomó el poder tras la muerte de Trujillo?", answers: ["Joaquín Balaguer", "Rafael Fiallo", "Héctor Bienvenido Trujillo"], correct: 0 },
      { question: "¿Cuándo se firmó la primera constitución de la República Dominicana?", answers: ["1844", "1821", "1854"], correct: 0 },
      { question: "¿En qué conflicto internacional participó la República Dominicana en 1916?", answers: ["La Primera Guerra Mundial", "La Guerra Civil Dominicana", "La intervención estadounidense"], correct: 2 },
      { question: "¿Qué evento ocurrió el 27 de febrero de 1844?", answers: ["Independencia Dominicana", "Batalla del 30 de marzo", "La Guerra de la Restauración"], correct: 0 },
      // Agrega más preguntas de Matemáticas y Lógica aquí...
    ];

    let currentQuestionIndex = 0;
    let score = 0;
    let timer;
    const totalTime = 40 * 60; // 40 minutos en segundos
    let timeLeft = totalTime;

    const instructionsDiv = document.getElementById("instructions");
    const quizDiv = document.getElementById("quiz");
    const questionContainer = document.getElementById("question-container");
    const timerDiv = document.getElementById("timer");
    const scoreContainer = document.getElementById("score-container");
    const finalScore = document.getElementById("final-score");

    function startQuiz() {
      instructionsDiv.style.display = "none";
      quizDiv.style.display = "block";
      displayQuestion();
      startTimer();
    }

    function startTimer() {
      timer = setInterval(() => {
        timeLeft--;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDiv.textContent = `Tiempo restante: ${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
        if (timeLeft <= 0) {
          clearInterval(timer);
          endQuiz();
        }
      }, 1000);
    }

    function displayQuestion() {
      const question = questions[currentQuestionIndex];
      questionContainer.innerHTML = `
        <div class="question">${question.question}</div>
        <div class="answers">
          ${question.answers
            .map(
              (answer, index) =>
                `<button onclick="selectAnswer(${index})">${answer}</button>`
            )
            .join("")}
        </div>
      `;
    }

    function selectAnswer(selectedIndex) {
      const question = questions[currentQuestionIndex];
      if (selectedIndex === question.correct) {
        score++;
      }
      currentQuestionIndex++;
      if (currentQuestionIndex < questions.length) {
        displayQuestion();
      } else {
        endQuiz();
      }
    }

    function endQuiz() {
      clearInterval(timer);
      quizDiv.style.display = "none";
      scoreContainer.style.display = "block";
      finalScore.textContent = `Tu puntaje es ${score} de ${questions.length}`;
    }
  </script>
</body>
</html>
