let all = document.getElementById("all-tasks")
let toDo = document.getElementById("to-do")
let completed = document.getElementById("completed")
let counter = document.getElementById("counter")
let counterToDo = document.getElementById("counter-todo")
let counterCompleted = document.getElementById("counter-com")
let form = document.getElementById("form")
let inputValue = document.getElementById("task")
let emptyState = document.getElementById("empty-state")
let mainContent = document.getElementById("main-content")
let toDoContainer = document.getElementById("todos-container")
let addTask = document.getElementById("submit")

let allTasks = []
let activeTab = "all"
let taskIdCounter = 0
let isEditing = false
let editingTaskID = null
form.addEventListener("submit", collectInputValue)
function collectInputValue(event){
    event.preventDefault()

    let taskTitle = inputValue.value
    if(!taskTitle){
        inputValue.focus()
        alert("You have to enter a task")
        return;
    }
    taskTitle = capitalizeFirstLetter(taskTitle)

    if(isEditing == true){
        allTasks = allTasks.map((items)=>{
            if(items.id === editingTaskID){
                return { ...items, taskName: taskTitle }
            }
            return items
        })
        isEditing = false
        editingTaskID = null
    } else {
        taskIdCounter+=1
        localStorage.setItem("taskID", JSON.stringify(taskIdCounter))

        let taskDetails = {
            id : taskIdCounter,
            taskName : taskTitle,
            completed : false
        }
        allTasks.push(taskDetails)
    }
    
    localStorage.setItem("tasks", JSON.stringify(allTasks))
    form.reset()
    getDetails()
    updateCounters()
}

function getDetails(){
    if(localStorage.getItem("tasks")){
        allTasks = JSON.parse(localStorage.getItem("tasks"))

        if(allTasks.length > 0){
            taskIdCounter = Math.max(...allTasks.map((items)=>{
                return items.id
            }))
        } else {
            taskIdCounter = 1
        }
    }
    printOnUI()
}
getDetails()

function printOnUI(){
    toDoContainer.innerHTML = " "

    let filteredTasks = allTasks
    if(activeTab === "to-do"){
        filteredTasks = allTasks.filter((items)=>{
            return items.completed === false
        })
    }else if(activeTab === "completed"){
        filteredTasks = allTasks.filter((items)=>{
            return items.completed === true
        })
    }

    filteredTasks.forEach((items)=>{
        let taskID = items.id
        let UITitle = items.taskName
        
        toDoContainer.classList.add("todos")

        let cardContainer = document.createElement("div")
        if(items.completed == true){
            cardContainer.classList.add("card-complete")
        }
        cardContainer.classList.add("card")

        let topContent = document.createElement("div")
        topContent.classList.add("top-content")
        let verticalRule = document.createElement("div")
        if(items.completed == true){
            verticalRule.classList.add("vr-complete")
        }
        verticalRule.classList.add("vr")
        let tag = document.createElement("p")
        if (items.completed === true) {
            tag.textContent = "COMPLETED"
        } else {
            tag.textContent = "TO-DO"
        }

        let mainPart = document.createElement("div")
        mainPart.classList.add("second-part")

        let title = document.createElement("div")
        title.classList.add("main-content")
        let heading = document.createElement("h1")
        if(items.completed == true){
            heading.classList.add("h-one")
        }
        heading.textContent = UITitle

        let bottomContent = document.createElement("div")
        bottomContent.classList.add("bottom-content","actions")
        let markIcon = document.createElement("img")
        markIcon.setAttribute("src", "./assets/fluent-mdl2_check-mark.png")
        markIcon.setAttribute("alt","mark")
        markIcon.setAttribute("title","Mark as completed")
        markIcon.addEventListener("click", function(){
            markAsComplete(taskID)
        })
        if(items.completed === true){
            markIcon.classList.add("mark-done")
        }
        

        let editIcon = document.createElement("i")
        editIcon.classList.add("fa-regular","fa-pen-to-square")
        editIcon.setAttribute("title","Edit")
        editIcon.addEventListener("click", function(){
            editTask(taskID)
        })
        if(items.completed === true){
            editIcon.classList.add("mark-done")
        }

        let deleteIcon = document.createElement("i")
        deleteIcon.classList.add("fa-regular","fa-trash-can")
        deleteIcon.setAttribute("title","Delete")
        deleteIcon.addEventListener("click", function(){
            deleteTask(taskID)
        })

        bottomContent.append(markIcon, editIcon, deleteIcon)
        title.append(heading)
        topContent.append(verticalRule, tag)
        mainPart.append(title, bottomContent)
        cardContainer.append(topContent, mainPart)
        toDoContainer.append(cardContainer)
    })
    updateCounters()
}
printOnUI

function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function deleteTask(id){
    id = Number(id)
    allTasks = allTasks.filter((items)=>{
       return items.id !== id
    })
    localStorage.setItem("tasks", JSON.stringify(allTasks))
    updateCounters()
    printOnUI()
}

function editTask(id){
    id = Number(id)
    allTasks.forEach((items)=>{
        if(items.id === id){
            inputValue.focus()
            inputValue.value = items.taskName
            isEditing = true
            editingTaskID = id
        } 
    })
    localStorage.setItem("tasks", JSON.stringify(allTasks))
    printOnUI()
}

function markAsComplete(id){

    id = Number(id)
    allTasks = allTasks.map((items)=>{
        if(items.id === id){
            return {
                ...items,
                completed : true
            }
        }
        return items
    })
    localStorage.setItem("tasks", JSON.stringify(allTasks))
    updateCounters()
    printOnUI()
}

function updateCounters(){
    let todoLength = allTasks.filter((items)=>{
        return items.completed === false
    }).length
    counterToDo.textContent = todoLength

    let completedLength = allTasks.filter((items)=>{
        return items.completed === true
    }).length
    counterCompleted.textContent = completedLength

    let counterNumber = allTasks.length
    counter.textContent = counterNumber

    localStorage.setItem("tasks", JSON.stringify(allTasks))
}

toDo.addEventListener("click", activateTodo)
function activateTodo(){
    activeTab = "to-do"

    if(completed.classList.contains("completed")){
        completed.classList.remove("completed")
        completed.classList.add("completed-no-border")
    }

    if(all.classList.contains("all")){
        all.classList.remove("all")
        all.classList.add("all-no-border")
    }

    if(toDo.classList.contains("to-do-no-border")){
    toDo.classList.remove("to-do-no-border")
    toDo.classList.add("to-do")
    }
    printOnUI()
    updateCounters()
}

all.addEventListener("click", activateAll)
function activateAll(){
    activeTab = "all"

    if(completed.classList.contains("completed")){
        completed.classList.remove("completed")
        completed.classList.add("completed-no-border")
    }

    if(toDo.classList.contains("to-do")){
        toDo.classList.remove("to-do")
        toDo.classList.add("to-do-no-border")
    }

    if(all.classList.contains("all-no-border")){
        all.classList.remove("all-no-border")
        all.classList.add("all")
    }
    printOnUI()
    updateCounters()
}

completed.addEventListener("click", activateComplete)
function activateComplete(){
    activeTab = "completed"

    if(toDo.classList.contains("to-do")){
        toDo.classList.remove("to-do")
        toDo.classList.add("to-do-no-border")
    }

    if(all.classList.contains("all")){
        all.classList.remove("all")
        all.classList.add("all-no-border")
    }

    if(completed.classList.contains("completed-no-border")){
        completed.classList.remove("completed-no-border")
        completed.classList.add("completed")
    }
    printOnUI()
    updateCounters()
}
