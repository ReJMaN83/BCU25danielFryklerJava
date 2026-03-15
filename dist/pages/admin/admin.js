import HttpClient from '../../data/httpClient.js';
const form = document.querySelector('#add-course-form');
const bookingsList = document.querySelector('#bookings-list');
const overlay = document.querySelector('#overlay');
const dialog = document.querySelector('#modal');
form.noValidate = true;
const initApp = async () => {
    try {
        const today = new Date().toISOString().split('T')[0];
        document.querySelector('#startDate').setAttribute('min', today);
        document.querySelector('#edit-startDate').setAttribute('min', today);
        await displayBookings();
        await displayCourseList();
    }
    catch (error) {
        console.error(error);
    }
};
const displayCourseList = async () => {
    const courses = await new HttpClient('courses').listAll();
    const coursesList = document.querySelector('#courses-list');
    coursesList.innerHTML = '';
    const header = document.createElement('div');
    header.classList.add('course-row', 'course-row-header');
    header.innerHTML = `
    <i></i>
    <i></i>
    <div class="course-row-title">Kurstitel</div>
    <div class="course-row-number">Kursnummer</div>
    <div class="course-row-days">Dagar</div>
  `;
    coursesList.appendChild(header);
    courses.map((course) => {
        const row = document.createElement('section');
        row.classList.add('course-row');
        const icon = document.createElement('i');
        icon.classList.add('fa-light', 'fa-pen-to-square');
        icon.setAttribute('id', course.id);
        icon.addEventListener('click', displayCourseModal);
        const deleteIcon = document.createElement('i');
        deleteIcon.classList.add('fa-light', 'fa-trash-can');
        deleteIcon.setAttribute('id', course.id);
        deleteIcon.addEventListener('click', deleteCourse);
        const titleDiv = document.createElement('div');
        titleDiv.classList.add('course-row-title');
        titleDiv.textContent = course.title;
        const numberDiv = document.createElement('div');
        numberDiv.classList.add('course-row-number');
        numberDiv.textContent = course.courseNumber;
        const daysDiv = document.createElement('div');
        daysDiv.classList.add('course-row-days');
        daysDiv.textContent = course.days + ' dagar';
        row.appendChild(icon);
        row.appendChild(deleteIcon);
        row.appendChild(titleDiv);
        row.appendChild(numberDiv);
        row.appendChild(daysDiv);
        coursesList.appendChild(row);
    });
};
const displayCourseModal = async (e) => {
    e.preventDefault();
    const icon = e.target;
    const courseId = icon.getAttribute('id');
    const course = await new HttpClient('courses').findById(courseId);
    overlay.classList.add('show');
    dialog.classList.add('show');
    const editForm = document.querySelector('#edit-course-form');
    const newEditForm = editForm.cloneNode(true);
    editForm.parentNode.replaceChild(newEditForm, editForm);
    newEditForm.noValidate = true;
    populateModal(course);
    document.querySelector('#closeModal').addEventListener('click', (e) => {
        e.preventDefault();
        overlay.classList.remove('show');
        dialog.classList.remove('show');
    });
    newEditForm.addEventListener('submit', (e) => updateCourse(e, courseId, newEditForm));
};
const populateModal = (course) => {
    const editForm = document.querySelector('#edit-course-form');
    const titleInput = editForm.querySelector('[name="title"]');
    const courseNumberInput = editForm.querySelector('[name="courseNumber"]');
    const daysInput = editForm.querySelector('[name="days"]');
    const costInput = editForm.querySelector('[name="cost"]');
    const teacherInput = editForm.querySelector('[name="teacher"]');
    const startDateInput = editForm.querySelector('[name="startDate"]');
    const imageUrlInput = editForm.querySelector('[name="imageUrl"]');
    const descriptionInput = editForm.querySelector('[name="description"]');
    const classroomInput = editForm.querySelector('[name="classroom"]');
    const distanceInput = editForm.querySelector('[name="distance"]');
    const popularInput = editForm.querySelector('[name="popular"]');
    titleInput.value = course.title;
    courseNumberInput.value = course.courseNumber;
    daysInput.value = course.days;
    costInput.value = course.cost;
    teacherInput.value = course.teacher;
    startDateInput.value = course.startDate;
    imageUrlInput.value = course.imageUrl;
    descriptionInput.value = course.description;
    classroomInput.checked = course.classroom;
    distanceInput.checked = course.distance;
    popularInput.checked = course.popular;
};
const updateCourse = async (e, courseId, form) => {
    e.preventDefault();
    const fields = Array.from(form.elements);
    fields.forEach(f => f.classList.remove('invalid'));
    const titleInput = form.querySelector('[name="title"]');
    const courseNumberInput = form.querySelector('[name="courseNumber"]');
    const daysInput = form.querySelector('[name="days"]');
    const costInput = form.querySelector('[name="cost"]');
    titleInput.validity.valueMissing ? titleInput.setCustomValidity('Kurstitel måste anges') : titleInput.setCustomValidity('');
    courseNumberInput.validity.valueMissing ? courseNumberInput.setCustomValidity('Kursnummer måste anges') : courseNumberInput.setCustomValidity('');
    daysInput.validity.valueMissing ? daysInput.setCustomValidity('Antal dagar måste anges') : daysInput.setCustomValidity('');
    costInput.validity.valueMissing ? costInput.setCustomValidity('Kostnad måste anges') : costInput.setCustomValidity('');
    form.reportValidity();
    if (!form.checkValidity()) {
        fields.forEach(f => {
            if (!f.checkValidity())
                f.classList.add('invalid');
        });
    }
    else {
        const formData = new FormData(form);
        const course = {
            title: formData.get('title'),
            courseNumber: formData.get('courseNumber'),
            days: Number(formData.get('days')),
            cost: Number(formData.get('cost')),
            teacher: formData.get('teacher'),
            startDate: formData.get('startDate'),
            imageUrl: formData.get('imageUrl'),
            description: formData.get('description'),
            classroom: formData.get('classroom') === 'true',
            distance: formData.get('distance') === 'true',
            popular: formData.get('popular') === 'true'
        };
        try {
            await new HttpClient('courses').update(courseId, course);
            alert('Kursen har uppdaterats!');
            overlay.classList.remove('show');
            dialog.classList.remove('show');
            form.reset();
            await displayCourseList();
        }
        catch (error) {
            console.error(error);
        }
    }
};
const deleteCourse = async (e) => {
    const icon = e.target;
    const courseId = icon.getAttribute('id');
    const confirmed = confirm('Är du säker på att du vill ta bort kursen?');
    if (confirmed) {
        try {
            await new HttpClient('courses').delete(courseId);
            await displayCourseList();
        }
        catch (error) {
            console.error(error);
        }
    }
};
const displayBookings = async () => {
    const courses = await new HttpClient('courses').listAll();
    const bookings = await new HttpClient('bookings').listAll();
    if (bookings.length === 0) {
        bookingsList.innerHTML = '<p>Inga bokningar ännu.</p>';
        return;
    }
    courses.map((course) => {
        const courseBookings = bookings.filter((b) => b.courseId === course.id);
        if (courseBookings.length === 0)
            return;
        const section = document.createElement('section');
        section.classList.add('booking-group');
        section.innerHTML = `<h3>${course.title}</h3>`;
        courseBookings.map((booking) => {
            const item = document.createElement('div');
            item.classList.add('booking-item');
            item.innerHTML = `
        <p><span>Namn:</span> ${booking.name}</p>
        <p><span>E-post:</span> ${booking.email}</p>
        <p><span>Telefon:</span> ${booking.phone}</p>
        <p><span>Kurstyp:</span> ${booking.courseType === 'classroom' ? 'Klassrum' : 'Distans'}</p>
      `;
            section.appendChild(item);
        });
        bookingsList.appendChild(section);
    });
};
const handleSubmit = async (e) => {
    e.preventDefault();
    const fields = Array.from(form.elements);
    fields.forEach(f => f.classList.remove('invalid'));
    const titleInput = form.querySelector('[name="title"]');
    const courseNumberInput = form.querySelector('[name="courseNumber"]');
    const daysInput = form.querySelector('[name="days"]');
    const costInput = form.querySelector('[name="cost"]');
    const teacherInput = form.querySelector('[name="teacher"]');
    const startDateInput = form.querySelector('[name="startDate"]');
    const imageUrlInput = form.querySelector('[name="imageUrl"]');
    const descriptionInput = form.querySelector('[name="description"]');
    const classroomInput = form.querySelector('[name="classroom"]');
    const distanceInput = form.querySelector('[name="distance"]');
    titleInput.validity.valueMissing ? titleInput.setCustomValidity('Kurstitel måste anges') : titleInput.setCustomValidity('');
    courseNumberInput.validity.valueMissing ? courseNumberInput.setCustomValidity('Kursnummer måste anges') : courseNumberInput.setCustomValidity('');
    daysInput.validity.valueMissing ? daysInput.setCustomValidity('Antal dagar måste anges') : daysInput.setCustomValidity('');
    costInput.validity.valueMissing ? costInput.setCustomValidity('Kostnad måste anges') : costInput.setCustomValidity('');
    teacherInput.validity.valueMissing ? teacherInput.setCustomValidity('Lärare måste anges') : teacherInput.setCustomValidity('');
    startDateInput.validity.valueMissing ? startDateInput.setCustomValidity('Startdatum måste anges') : startDateInput.setCustomValidity('');
    imageUrlInput.validity.valueMissing ? imageUrlInput.setCustomValidity('Bild-URL måste anges') : imageUrlInput.setCustomValidity('');
    descriptionInput.validity.valueMissing ? descriptionInput.setCustomValidity('Beskrivning måste anges') : descriptionInput.setCustomValidity('');
    if (!classroomInput.checked && !distanceInput.checked) {
        classroomInput.setCustomValidity('Minst ett alternativ måste väljas');
    }
    else {
        classroomInput.setCustomValidity('');
    }
    form.reportValidity();
    if (!form.checkValidity()) {
        fields.forEach(f => {
            if (!f.checkValidity())
                f.classList.add('invalid');
        });
    }
    else {
        const formData = new FormData(form);
        const course = {
            title: formData.get('title'),
            courseNumber: formData.get('courseNumber'),
            days: Number(formData.get('days')),
            cost: Number(formData.get('cost')),
            teacher: formData.get('teacher'),
            startDate: formData.get('startDate'),
            imageUrl: formData.get('imageUrl'),
            description: formData.get('description'),
            classroom: formData.get('classroom') === 'true',
            distance: formData.get('distance') === 'true',
            popular: formData.get('popular') === 'true'
        };
        try {
            await new HttpClient('courses').post(course);
            alert('Kursen har lagts till!');
            form.reset();
            bookingsList.innerHTML = '';
            await displayBookings();
            await displayCourseList();
        }
        catch (error) {
            console.error(error);
        }
    }
};
document.addEventListener('DOMContentLoaded', initApp);
form.addEventListener('submit', handleSubmit);
