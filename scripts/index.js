// by default a text show when no button clicked 
function LoadNOLesson() {
  const wordCardContainer = document.getElementById("word-cards");
  wordCardContainer.innerHTML = `
<div class="col-span-full">
              <p
                class="font-hind-siliguri text-[rgba(121,113,107,1)] text-base font-normal leading-6 text-center"
              >
                আপনি এখনো কোন Lesson Select করেন ন
              </p>
              <h2
                class="font-hind-siliguri text-[rgba(41,37,36,1)] text-2xl font-medium leading-10 text-center"
              >
                একটি Lesson Select করুন।
              </h2>
            </div>
`;
}

// remove previous active button 
function removeActiveClass() {
  const activeClass = document.getElementsByClassName("active");

  for (let btn of activeClass) {
    btn.classList.remove("active");
  }
}

// fetch lesson button api
function loadLessons() {
  fetch("https://openapi.programming-hero.com/api/levels/all")
    .then((res) => res.json())
    .then((data) => displayLesson(data.data));
}

// show the lesson button
function displayLesson(lessons) {
  const lessonButtons = document.getElementById("lessons");

  for (let lesson of lessons) {
    console.log(lesson.lessonName);
    const lessonDiv = document.createElement("div");
    lessonDiv.innerHTML = `
        <button
        id="btn-${lesson.level_no}" onclick='loadLessonCard( ${lesson.level_no})'
            class="btn bg-white border-2 text-[var(--color-primary)] text-xs border-[var(--color-primary)] rounded-md hover:bg-[var(--color-primary)] hover:text-white"
          >
            <i class="fa-solid fa-book-open text-[var(--color-primary)] hover:text-white"></i>
            
            ${lesson.lessonName}
          </button>
        
        `;

    lessonButtons.appendChild(lessonDiv);
  }
}

// fetch card data according to lesson id 
function loadLessonCard(id) {
  const url = `https://openapi.programming-hero.com/api/level/${id}`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
        removeActiveClass();                  //remove previous active class
          const clickedButton = document.getElementById(`btn-${id}`);
        clickedButton.classList.add("active");              // add active class

      displayWord(data.data);
    });
}

const displayWord = (words) => {
  const wordCardContainer = document.getElementById("word-cards");

  wordCardContainer.innerHTML = "";

  console.log(words.length);

  if (words.length === 0) {
    wordCardContainer.innerHTML = `
    
     <div class="col-span-full flex flex-col items-center">
              <img class="w-24" src="./assets/alert-error.png" alt="error" />
              <p
                class="font-hind-siliguri text-[rgba(121,113,107,1)] text-base font-normal leading-6 text-center"
              >
                এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।
              </p>
              <h2
                class="font-hind-siliguri text-[rgba(41,37,36,1)] text-2xl font-medium leading-10 text-center"
              >
                পরের লেসনে যান।
              </h2>
            </div>`;

    return;
  }

  words.forEach((word) => {
    const wordCardDiv = document.createElement("div");
    wordCardDiv.innerHTML = `
    
                  <div
              class="card bg-base-100 shadow-sm p-5 font-poppins hover:bg-[#e8f4ff]"
            >
              <div class="flex flex-col justify-center gap-4">
                <h2
                  class="text-center text-[rgba(0,0,0,1)] text-3xl font-bold leading-[24px]"
                >
                  ${word.word}
                </h2>
                <p
                  class="text-center text-[rgba(0,0,0,1)] text-lg font-medium leading-6"
                >
                  Meaning /Pronounciation
                </p>
                <p
                  class="font-hind-siliguri text-center text-[rgba(24,24,27,1)] text-2xl font-semibold leading-10"
                >
                ${(word.meaning !== null && word.meaning !== undefined && word.meaning !== "") 
                   ? word.meaning 
                   : "No meaning available for this word"}
                </p>
              </div>

              <div class="card-actions flex justify-between items-center mt-14">
                <button onclick="LoadWordDetails('${word.id}')" class="btn">
                  <i class="fa-solid fa-circle-info bg-[#e8f4ff]"></i>
                </button>
                <button class="btn">
                  <i class="fa-solid fa-volume bg-[#e8f4ff]"></i>
                </button>
              </div>
            </div>
    `;
    wordCardContainer.appendChild(wordCardDiv);
  });
};


const LoadWordDetails = (wordID) =>{
console.log(wordID);

  const url = ` https://openapi.programming-hero.com/api/word/${wordID}`;

  fetch(url)
  .then(res => res.json())
  .then(data => displayWordDetails(data.data))
}

const displayWordDetails = (word) =>{
    document.getElementById('word_details').showModal()
  const modalContainer = document.getElementById('modal-container')

  modalContainer.innerHTML = `
   <div class="modal-box min-w-fit p-10 ">
            <h3
              class="font-poppins text-black text-4xl font-semibold leading-10 text-left"
            >
              ${word.word}
            </h3>
            <p class="font-poppins text-lg font-semibold leading-10">Meaning</p>
            <p class="font-hind-siliguri text-lg font-medium"> ${(word.meaning !== null && word.meaning !== undefined && word.meaning !== "") 
                   ? word.meaning 
                   : "No meaning available for this word"}</p>

            <p class="font-poppins text-lg font-semibold leading-10 mt-4">
              Example
            </p>
            <p class="font-poppins text-lg font-normal opacity-80 mb-4">
               ${ (word.sentence !== null && word.sentence !== undefined && word.sentence !== "") 
                   ? word.sentence 
                   : "No grammar info"}
            </p>


            <p class="font-poppins text-lg font-semibold leading-10 mt-4">
              Grammer
            </p>
            <p class="font-poppins text-lg font-normal opacity-80 mb-4">
               ${word.partsOfSpeech || "No grammer available for this word"}
            </p>

            <p class="font-hind-siliguri text-lg font-semibold leading-10">
              সমার্থক শব্দ গুলো
            </p>
            <div id="synonymsContainer" class="flex items-center justify-start gap-3">
            </div>

            <div class="modal-action justify-start">
              <form method="dialog">
                <!-- if there is a button in form, it will close the modal -->
                <button
                  class="btn rounded-xl bg-[var(--color-primary)] text-white"
                >
                  Complete Learning
                </button>
              </form>
            </div>
          </div>
  
  `

   // Generate synonyms buttons dynamically
    const container = document.getElementById("synonymsContainer");

    // If there are synonyms
    if (word.synonyms && word.synonyms.length > 0) {
        word.synonyms.forEach(syn => {
            const btn = document.createElement("button");
            btn.className = "font-poppins text-base font-normal border border-[rgba(215,228,239,1)] rounded-md bg-[rgba(237,247,255,1)] py-2 px-5";
            btn.textContent = syn; // Each button shows one synonym
            container.appendChild(btn);
        });
    } else {
        // If no synonyms
        container.innerHTML = ``;
    }

}

// by default all button remain active
document.addEventListener("DOMContentLoaded", function () {
  LoadNOLesson();
});
loadLessons();
