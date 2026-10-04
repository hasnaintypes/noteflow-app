import React from "react";
import { useContext } from "react";
import { NotesContext } from "../context/NotesContext";
import { db } from "../lib/db";

const Color = ({ color }) => {
    const { selectedNote, notes, setNotes } = useContext(NotesContext);

    const changeColor = () => {
        // Expected case when nothing is selected — don't use try/catch + alert().
        if (!selectedNote) {
            return;
        }

        const currentNoteIndex = notes.findIndex(
            (note) => note.$id === selectedNote.$id
        );
        if (currentNoteIndex === -1) {
            return;
        }

        const updatedNote = {
            ...notes[currentNoteIndex],
            colors: JSON.stringify(color),
        };

        const newNotes = [...notes];
        newNotes[currentNoteIndex] = updatedNote;
        setNotes(newNotes);

        db.notes.update(selectedNote.$id, {
            colors: JSON.stringify(color),
        });
    };

    return (
        <div
            onClick={changeColor}
            className="color"
            style={{ backgroundColor: color.colorHeader }}
            role="button"
            title={selectedNote ? "Change note color" : "Select a note first"}
            aria-disabled={!selectedNote}
        ></div>
    );
};

export default Color;
