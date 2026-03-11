
const loadLessons = () => {
    fetch('https://openapi.programming-hero.com/api/levels/all')
        .then(response => response.json())
        .then(json => { displayLessons(json.data); })
        .catch(error => {
            console.error('Error fetching lessons:', error);
        });
};


const removeActiveClass = () => {
    const lessonButtons = document.querySelectorAll(".lesson-btn");
    lessonButtons.forEach(btn => btn.classList.remove("active"));
}


const loadLevelWord = (id) => {
    manageLoading(true);
    const url = `https://openapi.programming-hero.com/api/level/${id}`;
    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            removeActiveClass(); // Remove active class from all buttons
            const clickBtn = document.getElementById(`lesson-btn-${id}`);
            clickBtn.classList.add("active");
            displayLevelWords(data.data);
        });
};

const loadWordDetail = async (id) => {
    const url = `https://openapi.programming-hero.com/api/word/${id}`;
    const response = await fetch(url);
    const details = await response.json();
    // Display word detail in a modal or dedicated section
    displayWordDetail(details.data);
};

const createElement = (arr) => {
    const htmlElements = arr.map(item => `<span class="badge badge-lg badge-info p-4">${item}</span>`).join("");
    console.log(htmlElements);
    return htmlElements;
}

const manageLoading = (status) => {
    if (status === true) {
        document.getElementById("spinner").classList.remove("hidden");
        document.getElementById("word-container").classList.add("hidden");
    } else {
        document.getElementById("spinner").classList.add("hidden");
        document.getElementById("word-container").classList.remove("hidden");
    }
};


const displayWordDetail = (word) => {
    console.log(word);
    const infoBox = document.getElementById("word-detail-container");
    infoBox.innerHTML = `
    <div class="mb-3">
    <h2 class="text-4xl font-bold mb-2">
        ${word.word} (<i class="fa-solid fa-microphone-lines"></i>: ${word.pronunciation})
    </h2>

    <div class="mb-3">
        <h3 class="text-2xl font-bold">Meaning</h3>
        <p class="font-bangla text-xl">${word.meaning}</p>
    </div>

    <div class="mb-3">
        <h3 class="text-2xl font-bold">Example</h3>
        <p class="font-bangla text-xl text-gray-700">${word.sentence}</p>
    </div>

    <div>
        <h3 class="text-2xl font-bold mb-3">Synonyms</h3>
        <div class="flex gap-4 flex-wrap">
            ${createElement(word.synonyms)}
        </div>
    </div>

    <div class="flex justify-between items-center mt-3">
        <div class="modal-action justify-start mt-6">
        <form method="dialog">
            <button class="btn btn-primary px-8">
            Complete Learning
            </button>
        </form>
        </div>

        <div class="modal-action">
            <form method="dialog">
                <button class="btn">Close</button>
            </form>
        </div>
        </div>
</div> 
`;
    document.getElementById("word_modal").showModal();
};


const displayLevelWords = (words) => {
    const wordContainer = document.getElementById("word-container");
    wordContainer.innerHTML = "";

    if (words.length === 0) {
        wordContainer.innerHTML = `<div class="text-center col-span-full shadow-sm p-5 rounded-sm space-y-5">
                <img class="mx-auto" src="./assets/alert-error.png" alt="Empty">
                <p class="font-bangla text-xl font-medium text-gray-500">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
                <h2 class="font-bangla font-bold text-4xl">নেক্সট Lesson এ যান</h2>
            </div>`;
        manageLoading(false);
        return;
    }

    words.forEach(word => {
        const wordCard = document.createElement("div");
        wordCard.innerHTML = `
            <div class="card bg-white rounded-xl shadow-md text-center py-10 px-5 space-y-5">
                <h2 class="font-bold text-2xl">${word.word ? word.word : "শব্দ পাওয়া যায়নি"}</h2>
                <p class="font-semibold ">Meaning / Pronunciation</p>
                <div class="font-bangla font-medium text-2xl">"${word.meaning ? word.meaning : "অর্থ পাওয়া যায়নি"} / ${word.pronunciation ? word.pronunciation : "উচ্চারণ পাওয়া যায়নি"}"</div>
                <div class="flex justify-between items-center mt-5">
                    <button onclick="loadWordDetail(${word.id})" class="btn hover:bg-blue-500"><i class="fa-solid fa-circle-info"></i></button>
                    <button class="btn hover:bg-blue-500"><i class="fa-solid fa-volume-up"></i></button>  
                </div>
            </div>
        `;
        wordContainer.append(wordCard);
    });
    manageLoading(false);
};


const displayLessons = (lessons) => {
    const levelContainer = document.getElementById("level-container");
    levelContainer.innerHTML = "";

    for (const lesson of lessons) {
        const btnDiv = document.createElement("div");
        btnDiv.innerHTML = `
            <button id="lesson-btn-${lesson.level_no}" onclick="loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary lesson-btn"><i class="fa-solid fa-book-open"></i>
            Lesson - ${lesson.level_no}</button>
        `;
        levelContainer.append(btnDiv);
    }
};

loadLessons();