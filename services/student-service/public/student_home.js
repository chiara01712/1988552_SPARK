async function fetchNotes() {
    const studentId = "your-student-id-here"; // Replace with actual ID dynamically
    try {
        const response = await fetch(`/api/notes?student_id=${studentId}`);
        const notes = await response.json();
        
        const carouselContent = document.getElementById('carousel-content');
        carouselContent.innerHTML = '';

        if (notes.length === 0) {
            carouselContent.innerHTML = '<div class="text-center">No notes available</div>';
            return;
        }

        notes.forEach((note, index) => {
            const isActive = index === 0 ? 'active' : '';
            const noteHtml = `
                <div class="carousel-item ${isActive}">
                    <div class="card text-center p-3">
                        <h5>${note.title}</h5>
                        <p>${note.description || 'No description available'}</p>
                        ${note.file_url ? `<a href="${note.file_url}" target="_blank">Download File</a>` : ''}
                        <p><small>Uploaded on: ${new Date(note.uploaded_at).toLocaleDateString()}</small></p>
                    </div>
                </div>
            `;
            carouselContent.innerHTML += noteHtml;
        });
    } catch (error) {
        console.error('Error fetching notes:', error);
    }
}
async function addNote(event) {
    event.preventDefault(); // Prevent form from refreshing page

    const noteData = {
        student_id: document.getElementById("studentId").value,
        course_id: document.getElementById("courseId").value,
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        file_url: document.getElementById("fileUrl").value,
        file_type: document.getElementById("fileType").value,
    };

    try {
        const response = await fetch('/api/notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(noteData),
        });

        const result = await response.json();
        alert(result.message);

        if (response.status === 200) {
            fetchNotes(); // Refresh carousel after adding a note
        }
    } catch (error) {
        console.error('Error adding note:', error);
    }
}

document.getElementById("noteForm").addEventListener("submit", addNote);

document.addEventListener('DOMContentLoaded', fetchNotes);