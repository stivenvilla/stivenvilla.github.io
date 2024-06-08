const addBox = document.querySelector(".add-box"),
popupBox = document.querySelector(".popup-box"),
popupTitle = popupBox.querySelector("header p"),
close = popupBox.querySelector("header i"),
NoteTitle = popupBox.querySelector("input"),
TextareaNote = popupBox.querySelector("textarea"),
ButtomNote = popupBox.querySelector("button");

ButtomNote.addEventListener("click", () => {
    const title = NoteTitle.value.trim();
    const description = TextareaNote.value.trim();
    if (!title && !description) {
        alert("Los campos no pueden estar vacíos");
        return;
    }
    if (!title || !description) {
        confirm("La nota se creará con campos vacíos");
    }
});


NoteTitle.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault(); 
        TextareaNote.focus(); 
    }
});

const months = ["January", "February", "March", "April", "May", "June", "July",
              "August", "September", "October", "November", "December"];
const notes = JSON.parse(localStorage.getItem("notes") || "[]");
let isUpdate = false, updateId;

const togglePopup = (show) => {
    popupBox.classList.toggle("show", show);
    document.body.style.overflow = show ? "hidden" : "auto";
    if (show && window.innerWidth > 660) NoteTitle.focus();
};

addBox.addEventListener("click", () => {
    popupTitle.innerText = "Crear Nueva Nota";
    ButtomNote.innerText = "Crear Nota";
    togglePopup(true);
});

close.addEventListener("click", () => {
    isUpdate = false;
    [NoteTitle.value, TextareaNote.value] = ["", ""];
    togglePopup(false);
});

const showNotes = () => {
    document.querySelectorAll(".note").forEach(li => li.remove());
    notes.forEach((note, id) => {
        let filterDesc = note.description.replaceAll("\n", '<br/>');
        let liTag = `<li class="note">
                        <div class="details">
                            <p>${note.title}</p>
                            <span>${filterDesc}</span>
                        </div>
                        <div class="bottom-content">
                            <span>${note.date}</span>
                            <div class="settings">
                                <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                                <ul class="menu">
                                    <li onclick="updateNote(${id}, '${note.title}', '${filterDesc}')"><i class="uil uil-pen"></i>Edit</li>
                                    <li onclick="deleteNote(${id})"><i class="uil uil-trash"></i>Delete</li>
                                </ul>
                            </div>
                        </div>
                    </li>`;
        addBox.insertAdjacentHTML("afterend", liTag);
    });
};
showNotes();

const showMenu = (elem) => {
    elem.parentElement.classList.add("show");
    document.addEventListener("click", e => {
        if(e.target.tagName !== "I" || e.target !== elem) {
            elem.parentElement.classList.remove("show");
        }
    });
};

const deleteNote = (noteId) => {
    if(confirm("¿Estás seguro de eliminar la nota?")) {
        notes.splice(noteId, 1);
        localStorage.setItem("notes", JSON.stringify(notes));
        showNotes();
    }
};

const updateNote = (noteId, title, filterDesc) => {
    TextareaNote.value = filterDesc.replaceAll('<br/>', '\r\n');
    updateId = noteId;
    isUpdate = true;
    addBox.click();
    NoteTitle.value = title;
    popupTitle.innerText = ButtomNote.innerText = "Editar Nota";
};

ButtomNote.addEventListener("click", event => {
    event.preventDefault();
    const title = NoteTitle.value.trim();
    const description = TextareaNote.value.trim();

    if (title || description) {
        const currentDate = new Date();
        const formattedDate = `${months[currentDate.getMonth()]} ${currentDate.getDate()}, ${currentDate.getFullYear()}`;

        const noteInfo = { title, description, date: formattedDate };

        if (!isUpdate) {
            notes.push(noteInfo);
        } else {
            notes[updateId] = noteInfo;
            isUpdate = false;
        }

        localStorage.setItem("notes", JSON.stringify(notes));
        showNotes();
        close.click();
    }
});