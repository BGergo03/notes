import "./styles.css";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { db } from "./firestore";
import { collection, getDocs } from "firebase/firestore";

const quill = new Quill("#editor", {
  theme: "snow",
});

interface Note {
  title: string;
  body: string;
  description: string;
}

async function fetchNotes(): Promise<any> {
  try {
    const notesCollection = collection(db, "notes");
    const notesSnapshot = await getDocs(notesCollection);
    const notesMap: { [key: string]: Note } = {};
    notesSnapshot.docs.forEach((doc: any) => {
      notesMap[doc.id] = {
        ...doc.data(),
      };
    });
    return notesMap;
  } catch (error) {
    console.error("Error fetching notes:", error);
    return {};
  }
}

function createNoteElement(id: string, note: Note): HTMLElement {
  const li = document.createElement("li");
  li.className = "note";
  li.id = id;

  const h3 = document.createElement("h3");
  h3.textContent = note.title;
  li.appendChild(h3);
  const p = document.createElement("p");
  p.textContent = note.description;

  li.addEventListener("click", () => {
    for (let listNote of notesList?.children || []) {
      listNote.classList.remove("selected");
    }
    li.classList.add("selected");
  });

  li.appendChild(p);
  return li;
}

let notesList = document.getElementById("notes");

async function renderNotes() {
  const notesMap = await fetchNotes();
  for (const id in notesMap) {
    const note = notesMap[id];
    const noteElement = createNoteElement(id, note);
    notesList?.appendChild(noteElement);
  }
}

renderNotes();
