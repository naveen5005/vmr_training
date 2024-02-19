let allAnchorElements = document.getElementsByClassName("collapsed");

for (let index = 0; index < allAnchorElements.length; index++) {
  const element = allAnchorElements[index];
  element.addEventListener("click", function (e,) {
    e.preventDefault(); // Will Stop the Default Behavour (Navigation)
    index !== 0 ? handleFormDisplay(index - 1) : handleFormDisplay(index); // we can change the behaviour later
    const clickedText = e.target.innerHTML;
    document.querySelector("#subjectName").innerHTML =
      clickedText + " Questions";
  });
}

function navigateToAdmin() {
  window.location.href = "admin.html";
}

function navigateToUser() {
  window.location.href = "index.html";
}
createHtmlElement = (elementName) => {
  const element = document.createElement(elementName);
  return element;
};
const addContentToElement = (element, elementName, text, idValue) => {
  if (elementName !== "input") {
    element.innerHTML = text;
  } else if (elementName === "input") {
    element.value = text;
    element.setAttribute("id", idValue);
    element.setAttribute("type", "text");
    element.setAttribute("readonly", "");
    element.classList.add("form-control");
  }
  return element;
};

handleQuestionDisplay = (question) => {
  console.log(question);
  const wrapperElement = createHtmlElement("div");
  wrapperElement.classList.add("card");
  const questionTypeElement = addContentToElement(
    createHtmlElement("p"),
    "p",
    "Question Type : " + question.type
  );

  const questionlabelElement = addContentToElement(
    createHtmlElement("label"),
    "label",
    "Question : "
  );
  const questionInputElement = addContentToElement(
    createHtmlElement("input"),
    "input",
    Object.values(question)[2],
    Object.keys(question)[2]
  );
  const answerlabelElement = addContentToElement(
    createHtmlElement("label"),
    "label",
    "Answer : "
  )
  const answerInputElement = addContentToElement(
    createHtmlElement("input"),
    "input",
    Object.values(question.options[0])[0],
    Object.keys(question.options[0])[0]
  )
  wrapperElement.appendChild(questionlabelElement);
  wrapperElement.appendChild(questionInputElement);
  wrapperElement.appendChild(answerlabelElement);
  wrapperElement.appendChild(answerInputElement);
  wrapperElement.prepend(questionTypeElement);

  question.options.forEach((option) => {
    // console.log(option);
    Object.keys(option).forEach((opt) => {
      const optionsWrapper = createHtmlElement("div");
      optionsWrapper.classList.add("option-wrapper");
      const optionLabelElement = addContentToElement(
        createHtmlElement("label"),
        "label",
        opt.substring(0, 7) + " : "
      );
      const optionInputElement = addContentToElement(
        createHtmlElement("input"),
        "input",
        option[opt],
        opt
      );
      optionsWrapper.appendChild(optionLabelElement);
      optionsWrapper.appendChild(optionInputElement);
      wrapperElement.appendChild(optionsWrapper);
    });
  });
  question.isEdit = true;
  question.isEdit ? dynamicButtons("EDIT", wrapperElement, editQuestionFunctionality, question) : dynamicButtons("UPDATE", wrapperElement, updateQuestionFunctionality, question);

  // dynamicButtons("EDIT", wrapperElement, editQuestionFunctionality, question);
  // dynamicButtons("UPDATE", wrapperElement, updateQuestionFunctionality, question);
  document.querySelector("form").appendChild(wrapperElement);
};
dynamicButtons = (text, target, event, question) => {
  const buttonElement = addContentToElement(
    createHtmlElement("button"),
    "button",
    text
  )
  buttonElement.setAttribute("type", "button");
  buttonElement.setAttribute("class", "btn btn-secondary");
  buttonElement.addEventListener("click", function () {
    event(question);
  })
  target.appendChild(buttonElement);

};

function editQuestionFunctionality(question) {
  question.isEdit = false;
  for (a in question) {
    if (a.includes("question")) {
      const questionInput = document.getElementById(a);
      questionInput.removeAttribute("readonly");
      question[a] = questionInput.value;
    } else if (a === "options") {
      question[a].forEach((option) => {
        for (b in option) {
          const optionInput = document.getElementById(b);
          optionInput.removeAttribute("readonly");
          option[b] = optionInput.value;
        }
      })
    }
  }
  return question
}

function updateQuestionFunctionality(question) {
  var updatedQuestion = editQuestionFunctionality(question)
  console.log(updatedQuestion)
  // getAllQuestions("PUT",updatedQuestion)
}


displayQuestions = () => {
  const formElement = createHtmlElement("form");
  const formButtonElement = addContentToElement(
    createHtmlElement("button"),
    "submit",
    "Submit"
  );
  handleFormDisplay = (i) => {
    document.querySelector("form").innerHTML = "";
    questions[i].fields.forEach((question) => {
      handleQuestionDisplay(question);
    });
  }
  formButtonElement.classList.add("btn", "btn-success");
  formElement.appendChild(formButtonElement);
  document.querySelector(".col-lg-9").appendChild(formElement);

};

let questions = [];
getAllQuestions = async (method, payload) => {
  method === "GET" ? url = "http://localhost:3000/forms" : url = "http://localhost:3000/forms/" + payload.id;
  questions = await (await fetch(url, {
    method: method,
    headers: { 'Content-Type': 'application/json' },
    body: method === "GET" ? null : JSON.stringify(payload)
  })).json();
  displayQuestions();
};

getAllQuestions("GET");
