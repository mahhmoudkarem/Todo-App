    "use strict";

    const input = document.querySelector("#input");
    const formInput = document.querySelector("form");
    const apiKey = "67697ff360a208ee1fdeaf5f";
    const loading = document.querySelector('.loading')
    getAllTodos();

    formInput.addEventListener("submit", (e) => {
    e.preventDefault();
    if (input.value.trim().length > 0) {
        getTodos();
    } else {
        toastr.error("Please enter a task.", "Todo App");
    }
    });

    async function getTodos() {
        showLoading()
    const todo = {
        title: `${input.value}`,
        apiKey: apiKey,
    };

    const response = await fetch("https://todos.routemisr.com/api/v1/todos", {
        method: "POST",
        body: JSON.stringify(todo),
        headers: {
        "Content-Type": "application/json",
        },
    });

    if (response.ok) {
        const data = await response.json();

        if (data.message === "success") {
        toastr.success("Added Successfully.", "Todo App");
        getAllTodos();
        formInput.reset();
    }
    hideLoading()
    }
    }

    async function getAllTodos() {
        showLoading()
    const response = await fetch(
        `https://todos.routemisr.com/api/v1/todos/${apiKey}`
    );

    if (response.ok) {
        const data = await response.json();
        if (data.message === "success") {
        let allTodos = data.todos;
        
        dispalyData(allTodos);
        changeProgress(allTodos)
        hideLoading()
        }
    }
    }

    function dispalyData(allTodos) {
    let cartona = ``;
    for (const todo of allTodos) {
        cartona += `<li class="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
            <span onclick="markCompleted('${
            todo._id
            }')" class="task-name position-relative" style="${
        todo.completed ? "text-decoration: line-through;" : ""
        }">${todo.title}</span>
            <div>
                ${
                todo.completed
                    ? '<span class="me-3 rounded"><i class="fa-regular fa-circle-check" style="color: #63E6BE;"></i></span>'
                    : ""
                }
                <span onclick="deleteTodo('${
                todo._id
                }')" class="icon rounded"><i class="fa-solid fa-trash"></i></span>
            </div>
        </li>`;
    }
    document.querySelector(".task-container").innerHTML = cartona;
    }

    async function deleteTodo(id) {
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#936",
        cancelButtonColor: "#000",
        confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
        if (result.isConfirmed) {

            showLoading()
        const todoData = {
            todoId: id,
        };

        const response = await fetch(`https://todos.routemisr.com/api/v1/todos`, {
            method: "DELETE",
            body: JSON.stringify(todoData),
            headers: {
            "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            Swal.fire({
                title: "Deleted!",
                text: "Your Todo has been deleted.",
                icon: "success",
            });
            getAllTodos();
            hideLoading()
        }


        }
    });
    }

    async function markCompleted(id) {
        showLoading()
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#936",
        cancelButtonColor: "#000",
        confirmButtonText: "Yes, Complete it!",
    }).then(async (result) => {
        if (result.isConfirmed) {
        const todoData = {
            todoId: id,
        };

        const response = fetch(`https://todos.routemisr.com/api/v1/todos`, {
            method: "PUT",
            body: JSON.stringify(todoData),
            headers: {
            "Content-Type": "application/json",
            },
        });

        Swal.fire({
            title: "Completed!",
            text: "Your Todo has been completed.",
            icon: "success",
        });
        getAllTodos();
        hideLoading();
        window.location.reload();
        }
    });
    }


    function showLoading(){
        loading.classList.remove('d-none')
    }
    function hideLoading(){
        loading.classList.add('d-none')
    }

    function changeProgress(all){
        const completeTodos = all.filter((todo) => todo.completed)
        const totalTodos = all.length
        document.getElementById('progress-todo').style.width = `${(completeTodos.length / totalTodos) * 100}%`

        const statusNumber = document.querySelectorAll('.status-number span');
        statusNumber[0].textContent = completeTodos.length;
        statusNumber[1].textContent = totalTodos;
        
    }


    