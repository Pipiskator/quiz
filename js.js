let questions = [
    {
        question: "Что такое HTML?",
        allOptions: [
            { text: "Язык программирования", correct: false },
            { text: "Язык разметки", correct: true },
            { text: "Язык стилей", correct: false },
            { text: "Язык запросов", correct: false },
            { text: "Язык обработки данных", correct: false },
            { text: "Язык структурирования", correct: false }
        ]
    },
    {
        question: "Что такое CSS?",
        allOptions: [
            { text: "Язык программирования", correct: false },
            { text: "Язык разметки", correct: false },
            { text: "Язык стилей", correct: true },
            { text: "Язык запросов", correct: false },
            { text: "Язык выполнения кода", correct: false },
            { text: "Язык управления", correct: false }
        ]
    },
    {
        question: "Как добавить CSS в HTML?",
        allOptions: [
            { text: "style", correct: true },
            { text: "css", correct: false },
            { text: "script", correct: false },
            { text: "link", correct: true },
            { text: "stylesheet", correct: false },
            { text: "style-link", correct: false }
        ]
    },
    {
        question: "Что такое JavaScript?",
        allOptions: [
            { text: "Язык разметки", correct: false },
            { text: "Язык программирования", correct: true },
            { text: "Язык стилей", correct: false },
            { text: "Язык запросов", correct: false },
            { text: "Язык анализа данных", correct: false },
            { text: "Язык выполнения кода", correct: false }
        ]
    },
    {
        question: "Что такое DOM?",
        allOptions: [
            { text: "Программная библиотека", correct: false },
            { text: "Документный объектный модель", correct: true },
            { text: "Язык программирования", correct: false },
            { text: "Стиль разметки", correct: false },
            { text: "Формат данных", correct: false },
            { text: "Объектная модель", correct: false }
        ]
    },
    {
        question: "Что такое API?",
        allOptions: [
            { text: "Анализ данных", correct: false },
            { text: "Интерфейс программирования приложений", correct: true },
            { text: "Интерфейс пользователя", correct: false },
            { text: "Автоматизация процесса", correct: false },
            { text: "Интерфейс веб-сервисов", correct: false },
            { text: "Использование библиотек", correct: false }
        ]
    },
    {
        question: "Что такое событие onClick в JavaScript?",
        allOptions: [
            { text: "Событие, срабатывающее при клике по элементу", correct: true },
            { text: "Событие, срабатывающее при наведении мыши", correct: false },
            { text: "Событие, срабатывающее при загрузке страницы", correct: false },
            { text: "Событие, срабатывающее при изменении текста", correct: false },
            { text: "Событие, срабатывающее при прокрутке страницы", correct: false },
            { text: "Событие, срабатывающее при изменении стилей", correct: false }
        ]
    }
];

let currentQuestionIndex = 0;
let correctAnswers = 0;
const totalQuestions = 5; // Количество вопросов для теста

// Массив для статистики пользователей, который будет обновляться после каждого теста
let userStats = JSON.parse(localStorage.getItem('userStats')) || [];

// Функция для перемешивания массива и выбора случайных вопросов
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Получаем случайные 5 вопросов из 7
function getRandomQuestions() {
    const shuffledQuestions = [...questions];
    shuffle(shuffledQuestions);
    return shuffledQuestions.slice(0, totalQuestions);
}

// Функция для выбора случайных неправильных вариантов ответа
function getOptionsWithRandomWrongAnswers(correctAnswer) {
    const wrongAnswers = correctAnswer.allOptions.filter(option => !option.correct);
    shuffle(wrongAnswers);
    const randomWrongAnswers = wrongAnswers.slice(0, 3); // Получаем 3 случайных неправильных ответа
    return [correctAnswer.allOptions.find(option => option.correct), ...randomWrongAnswers];
}

// Отображение вопроса и вариантов ответов
function showQuestion(index) {
    const question = questions[index];
    const selectedOptions = getOptionsWithRandomWrongAnswers(question);
    const quizContainer = document.getElementById("quiz-container");
    quizContainer.innerHTML = `
        <h2>${question.question}</h2>
        <div id="answers-container">
            ${selectedOptions.map((option, i) => `
                <div class="answer" onclick="selectAnswer(${i})">
                    <input type="radio" name="answer" value="${i}" id="answer-${i}" style="display: none;">
                    <span>${option.text}</span>
                </div>
            `).join('')}
        </div>
    `;
}

// Обработчик выбора ответа
function selectAnswer(index) {
    const radioButton = document.getElementById(`answer-${index}`);
    radioButton.checked = true; // Активируем радиокнопку при клике на контейнер
}

// Обработчик для перехода к следующему вопросу
function nextQuestion() {
    const selectedOption = document.querySelector('input[name="answer"]:checked');
    if (selectedOption) {
        const isCorrect = questions[currentQuestionIndex].allOptions[selectedOption.value].correct;
        if (isCorrect) {
            correctAnswers++;
        }
        currentQuestionIndex++;

        if (currentQuestionIndex < totalQuestions) {
            showQuestion(currentQuestionIndex);
        } else {
            showResult();
        }
    }
}

// Вывод результата
function showResult() {
    const quizContainer = document.getElementById("quiz-container");
    quizContainer.style.display = 'none';  // Скрыть вопросы

    const nextButton = document.getElementById("next-btn");
    nextButton.style.display = 'none';  // Скрыть кнопку "Далее"

    const result = document.getElementById("result");
    result.innerHTML = `Вы ответили правильно на ${correctAnswers} из ${totalQuestions} вопросов.`;
    result.classList.remove("hidden"); // Показываем результаты

    // Добавляем результат текущего пользователя в статистику
    addUserResult(correctAnswers);

    setTimeout(() => {
        showGraph();
    }, 500);  // Задержка перед отображением графика
}

// Функция для добавления результата в статистику пользователей
function addUserResult(correctAnswers) {
    userStats.push(correctAnswers);
    // Сохраняем статистику в localStorage
    localStorage.setItem('userStats', JSON.stringify(userStats));
}

// Построение графика
function showGraph() {
    const graphContainer = document.getElementById("graph-container");
    graphContainer.classList.remove("hidden"); // Показываем график

    if (!graphContainer) {
        console.error("Контейнер для графика не найден!");
        return;
    }

    const graph = document.createElement("div");
    graph.classList.add("graph");

    // Расчет статистики
    const totalParticipants = userStats.length;
    const userCorrectAnswers = correctAnswers; // Это количество верных ответов для текущего пользователя
    const correctAnswerCounts = new Array(totalQuestions + 1).fill(0); // Массив для подсчета количества пользователей, ответивших на определенное количество вопросов

    // Подсчитываем, сколько пользователей выбрали каждое количество правильных ответов
    userStats.forEach(correctAnswers => correctAnswerCounts[correctAnswers]++);
    const maxCount = Math.max(...correctAnswerCounts); // Находим максимальное значение, чтобы масштабировать график

    // Столбцы графика
    for (let i = 0; i <= totalQuestions; i++) {
        const bar = document.createElement("div");
        bar.classList.add("bar");
        bar.style.height = `${(correctAnswerCounts[i] / maxCount) * 100}%`; // Пропорциональная высота
        bar.style.width = "50px";
        bar.style.margin = "0 10px";
        bar.style.backgroundColor = i === userCorrectAnswers ? '#ff5722' : '#4CAF50'; // Выделяем столбец для текущего пользователя
        bar.title = `Верных ответов: ${i} (${correctAnswerCounts[i]} человек)`; // Текст с количеством
        graph.appendChild(bar);
    }

    // Очищаем старый график, если он есть
    graphContainer.querySelector('.graph')?.remove();
    graphContainer.appendChild(graph);

    // Метки для оси X
    const labelsContainer = document.createElement("div");
    labelsContainer.classList.add("labels");

    for (let i = 0; i <= totalQuestions; i++) {
        const label = document.createElement("div");
        label.classList.add("label");
        label.textContent = `${i}`;
        labelsContainer.appendChild(label);
    }

    graph.appendChild(labelsContainer);

    // Добавление оси Y
    const yAxis = document.createElement("div");
    yAxis.classList.add("y-axis");
    yAxis.textContent = "Количество пользователей";
    graph.appendChild(yAxis);

    // Ось X
    const xAxis = document.createElement("div");
    xAxis.classList.add("x-axis");
    graph.appendChild(xAxis);
}

// Запуск теста
window.onload = function() {
    questions = getRandomQuestions(); // Получаем случайные 5 вопросов
    showQuestion(currentQuestionIndex);
};
