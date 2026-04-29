firebase.initializeApp(window.firebaseConfig);
const db = firebase.firestore();

// Festgelegter Zeitplan (8. Mai)
const missionSchedule = [
    { time: "16:30 – 16:45", title: "Orga & Tech check", desc: "Vorbereitung (15 min)" },
    { time: "16:45 – 18:00", title: "SWTOR", desc: "Star Wars: The Old Republic (1:15 h)" },
    { time: "18:00 – 18:45", title: "Essen", desc: "Pause (45 min)" },
    { time: "18:45 – 19:15", title: "Kahoot", desc: "Interaktives Quiz (30 min)" },
    { time: "19:20 – 20:20", title: "BF II HvV Hide & Seek", desc: "Battlefront II - Heroes vs. Villains (60 min)" },
    { time: "20:25 – 21:25", title: "BF 2005 Mods testen", desc: "Klassisches Battlefront II (60 min)" },
    { time: "21:30 – 22:30", title: "BF II HvV", desc: "Heroes vs. Villains (60 min)" },
    { time: "22:35 – 23:45", title: "BF II GA / Supremacy", desc: "Galactic Assault & Supremacy (1:10 h)" },
    { time: "23:50 – 0:00", title: "Gewinner Reveal / Ende", desc: "Abschluss (10 min)" }
];

const timelineContainer = document.getElementById("timeline");
timelineContainer.innerHTML = missionSchedule.map(mission => `
    <div class="timeline-item">
        <strong>${mission.time}</strong>
        <h3>${mission.title}</h3>
        <p>${mission.desc}</p>
    </div>
`).join("");

const regForm = document.getElementById("registrationForm");
const feedback = document.getElementById("registrationFeedback");

if (regForm) {
    regForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const nameVal = document.getElementById("userNameInput").value;
        const gameVal = document.getElementById("gameSelect").value;

        try {
            await db.collection("registrations").add({
                username: nameVal,
                game: gameVal,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
            feedback.textContent = "REGISTRIERT: " + nameVal;
            feedback.style.color = "#00d2ff";
            regForm.reset();
        } catch (err) {
            feedback.textContent = "FEHLER: " + err.message;
            feedback.style.color = "#ff4444";
        }
    });
}

db.collection("registrations").orderBy("timestamp", "desc").onSnapshot(snap => {
    const list = document.getElementById("adminList");
    if (snap.empty) return;
    list.innerHTML = snap.docs.map(doc => {
        const d = doc.data();
        return `<div class="admin-entry"><span>${d.username}</span> <strong>${d.game}</strong></div>`;
    }).join("");
});