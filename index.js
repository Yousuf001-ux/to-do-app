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

// This function collect the input value from the input field, captilise the first letter of the input value,distinguish when the user is trying to edit and when the user is trying to enter a new task. This function set an additional increment value of 1 to the taskiscounter and send it to the local storage to  make it persistent. Then the function push the taskDetails  into all task array and then send the alltask array to the local storage for persistence
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
        let taskDetails = {
            id : taskIdCounter,
            taskName : taskTitle,
            completed : false
        }
        allTasks.push(taskDetails)
        taskIdCounter += 1
        localStorage.setItem("taskID", JSON.stringify(taskIdCounter))

    }
    
    localStorage.setItem("tasks", JSON.stringify(allTasks))
    form.reset()
    getDetails()
    updateCounters()
}

// This function basically gets the alltask array sent to the local storage
function getDetails(){
    if(localStorage.getItem("tasks")){
        allTasks = JSON.parse(localStorage.getItem("tasks"))

        if(allTasks.length > 0){
            taskIdCounter = Math.max(...allTasks.map((items)=>{
                return items.id
            })) + 1
        }else {
            taskIdCounter = 1
        }
    }else {
        taskIdCounter = 1
    }
    printOnUI()
}
getDetails()

// This function clears the UI and ensures that the data shown by default on the UI is the data under the all tasks tab. This function loops through the all tasks array that's also the same as the filtered tasks in this situation, and gets the necesarry detail out of the array the print it on the ui after creating all the elements, the class and set all the attributes needed. Each element is then appended to their respective parents
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

// This function capitalizes the first letter of every word passes into it.
function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// This function deletes card. It does so taking the id(and converting it to the number data type) of the card as an argument. This allows the function to be specific about which card to delete as the id is unique to each card. the all tasks object is then looped through using filter to filter out the card containing the id then the rest details are retrned and printed on the ui 
function deleteTask(id){
    id = Number(id)
    allTasks = allTasks.filter((items)=>{
       return items.id !== id
    })
    localStorage.setItem("tasks", JSON.stringify(allTasks))
    updateCounters()
    printOnUI()
}

// This function edits the task name. It does so taking the id(and converting it to the number data type) of the card as an argument. This allows the function to be specific about which card to edit as the id is unique to each card.
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

// This function marks a task as completed. The all task array is looped through using map. the specific task to mark as completed is identified by passing its id into the function.The value of the completed key is then changed to true. The new object is then returned into the new all tasks array. The local storage is the refreshed with the new all task obejcts and the task ids printed on the ui
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


// This function updates the counters by filtering through the all tasks array and returning the tasks depending on the condition passed. The length of the array is the checked and stored and displayed on the ui.
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

// This function prints only the tasks under to the todo category on the ui(it brings all the tasks with the boolean property of the completed key as false) and updates the css
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

// This function prints all the tasks on the ui and updates the css
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

// This function prints only the tasks under to the completed category on the ui and updates the css
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
