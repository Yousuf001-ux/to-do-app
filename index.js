let all = document.getElementById("all-tasks")
let toDo = document.getElementById("to-do")
let completed = document.getElementById("completed")
let counter = document.getElementById("counter")
let form = document.getElementById("form")
let inputValue = document.getElementById("task")
let emptyState = document.getElementById("empty-state")
let mainContent = document.getElementById("main-content")
let toDoContainer = document.getElementById("todos-container")

let allTasks = []
form.addEventListener("submit", collectInputValue)
function collectInputValue(event){
    event.preventDefault()

    let taskTitle = inputValue.value
    taskTitle = capitalizeFirstLetter(taskTitle)
    let taskDetails = {
        taskName : taskTitle
    }

    allTasks.push(taskDetails)
    localStorage.setItem("tasks", JSON.stringify(allTasks))
    form.reset()
    getDetails()
}

function getDetails(){
    if(localStorage.getItem("tasks")){
        allTasks = JSON.parse(localStorage.getItem("tasks"))
        printOnUI()
    }
}
getDetails()

function printOnUI(){
    toDoContainer.innerHTML = " "
    allTasks.forEach((items)=>{
        let UITitle = items.taskName
        
        toDoContainer.classList.add("todos")

        let cardContainer = document.createElement("div")
        cardContainer.classList.add("card")

        let topContent = document.createElement("div")
        topContent.classList.add("top-content")
        let verticalRule = document.createElement("div")
        verticalRule.classList.add("vr")
        let tag = document.createElement("p")
        tag.textContent = "TO-DO"

        let title = document.createElement("div")
        title.classList.add("main-content")
        let heading = document.createElement("h1")
        heading.textContent = UITitle

        let bottomContent = document.createElement("div")
        bottomContent.classList.add("bottom-content","actions")
        let markIcon = document.createElement("img")
        markIcon.setAttribute("src", "./assets/fluent-mdl2_check-mark.png")
        markIcon.setAttribute("alt","mark")
        markIcon.setAttribute("title","Mark as completed")
        let editIcon = document.createElement("i")
        editIcon.classList.add("fa-regular","fa-pen-to-square")
        editIcon.setAttribute("title","Edit")
        let deleteIcon = document.createElement("i")
        deleteIcon.classList.add("fa-regular","fa-trash-can")
        deleteIcon.setAttribute("title","Delete")

        bottomContent.append(markIcon, editIcon, deleteIcon)
        title.append(heading)
        topContent.append(verticalRule, tag)
        cardContainer.append(topContent, title, bottomContent)
        toDoContainer.append(cardContainer)
    })
}
printOnUI

function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}