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
            { text: "Язык выполнения кода", correct: false },
            { text: "Язык управления", correct: false },
            { text: "Язык синтаксиса", correct: false }
        ]
    },
    {
        question: "Каким тегом добавляется CSS в HTML?",
        allOptions: [
            { text: "style", correct: true },
            { text: "css", correct: false },
            { text: "script", correct: false },
            { text: "head", correct: false },
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
let selectedAnswers = []; // Массив для хранения выбранных пользователем ответов

// Массив для статистики пользователей, который будет обновляться после каждого теста
let userStats = JSON.parse(localStorage.getItem('userStats')) || [];

// Получаем случайные 5 вопросов из 7
function getRandomQuestions() {
    const shuffledQuestions = [...questions];
    shuffle(shuffledQuestions); // Перемешиваем все вопросы
    return shuffledQuestions.slice(0, totalQuestions); // Берем только 5 случайных вопросов
}

// Перемешиваем массив
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Выбор 4 случайных ответов, включая 1 правильный
function getRandomAnswers(question) {
    const correctAnswer = question.allOptions.filter(option => option.correct);
    const incorrectAnswers = question.allOptions.filter(option => !option.correct);
    shuffle(incorrectAnswers);

    // Выбираем 3 случайных неправильных ответа
    const selectedIncorrectAnswers = incorrectAnswers.slice(0, 3);

    // Собираем все ответы (1 правильный + 3 неправильных)
    const allSelectedAnswers = [...correctAnswer, ...selectedIncorrectAnswers];

    // Перемешиваем выбранные ответы
    shuffle(allSelectedAnswers);

    return allSelectedAnswers;
}

// Отображение вопроса и вариантов ответов
function showQuestion(index) {
    const question = questions[index];
    const selectedOptions = getRandomAnswers(question); // Получаем случайные ответы

    const quizContainer = document.getElementById("quiz-container");
    quizContainer.innerHTML = `
        <h2>${question.question}</h2>
        <div id="answers-container">
            ${selectedOptions.map((option, i) => ` 
                <div class="answer" onclick="selectAnswer(${i}, ${selectedOptions[i].correct})">
                    <input type="radio" name="answer" value="${i}" id="answer-${i}" style="display: none;">
                    <span>${option.text}</span>
                </div>
            `).join('')}
        </div>
    `;
}

// Обработчик выбора ответа
function selectAnswer(index, isCorrect) {
    const allAnswers = document.querySelectorAll('.answer'); // Получаем все варианты ответов
    allAnswers.forEach(answer => answer.classList.remove('bar-user')); // Удаляем выделение

    const selectedAnswer = allAnswers[index]; // Получаем выбранный элемент
    selectedAnswer.classList.add('bar-user'); // Добавляем выделение

    const radioButton = document.getElementById(`answer-${index}`);
    radioButton.checked = true; // Устанавливаем активную радиокнопку

    // Сохраняем правильность ответа
    selectedAnswers[currentQuestionIndex] = isCorrect;
}

// Обработчик для перехода к следующему вопросу
function nextQuestion() {
    const selectedOption = document.querySelector('input[name="answer"]:checked');
    if (selectedOption) {
        const isCorrect = selectedAnswers[currentQuestionIndex]; // Получаем, правильный ли был выбранный ответ
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
    const correctAnswerCounts = new Array(totalQuestions + 1).fill(0); // Массив для подсчета количества пользователей, ответивших на определенное количество правильных ответов

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
