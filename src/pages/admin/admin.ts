import HttpClient from '../../data/httpClient.js';
import { Course } from '../../models/course.js';
import { Booking } from '../../models/booking.js';

const form = document.querySelector('#add-course-form') as HTMLFormElement;
const bookingsList = document.querySelector('#bookings-list') as HTMLDivElement;
const overlay = document.querySelector('#overlay') as HTMLDivElement;
const dialog = document.querySelector('#modal') as HTMLDivElement;

form.noValidate = true;

const initApp = async (): Promise<void> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    document.querySelector('#startDate')!.setAttribute('min', today);
    document.querySelector('#edit-startDate')!.setAttribute('min', today);
    await displayBookings();
    await displayCourseList();
  } catch (error) {
    console.error(error);
  }
};

const displayCourseList = async (): Promise<void> => {
  const courses = await new HttpClient<Course[]>('courses').listAll();
  const coursesList = document.querySelector('#courses-list') as HTMLDivElement;
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

  courses.map((course: Course) => {
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

const displayCourseModal = async (e: Event): Promise<void> => {
  e.preventDefault();
  const icon = e.target as HTMLElement;
  const courseId = icon.getAttribute('id') as string;
  const course = await new HttpClient<Course>('courses').findById(courseId);

  overlay.classList.add('show');
  dialog.classList.add('show');

  const editForm = document.querySelector('#edit-course-form') as HTMLFormElement;
  const newEditForm = editForm.cloneNode(true) as HTMLFormElement;
  editForm.parentNode!.replaceChild(newEditForm, editForm);
  newEditForm.noValidate = true;

  populateModal(course);

  document.querySelector('#closeModal')!.addEventListener('click', (e: Event) => {
    e.preventDefault();
    overlay.classList.remove('show');
    dialog.classList.remove('show');
  });

  newEditForm.addEventListener('submit', (e: Event) => updateCourse(e, courseId, newEditForm));
};

const populateModal = (course: Course): void => {
  const editForm = document.querySelector('#edit-course-form') as HTMLFormElement;
  const titleInput = editForm.querySelector<HTMLInputElement>('[name="title"]')!;
  const courseNumberInput = editForm.querySelector<HTMLInputElement>('[name="courseNumber"]')!;
  const daysInput = editForm.querySelector<HTMLInputElement>('[name="days"]')!;
  const costInput = editForm.querySelector<HTMLInputElement>('[name="cost"]')!;
  const teacherInput = editForm.querySelector<HTMLInputElement>('[name="teacher"]')!;
  const startDateInput = editForm.querySelector<HTMLInputElement>('[name="startDate"]')!;
  const imageUrlInput = editForm.querySelector<HTMLInputElement>('[name="imageUrl"]')!;
  const descriptionInput = editForm.querySelector<HTMLTextAreaElement>('[name="description"]')!;
  const classroomInput = editForm.querySelector<HTMLInputElement>('[name="classroom"]')!;
  const distanceInput = editForm.querySelector<HTMLInputElement>('[name="distance"]')!;
  const popularInput = editForm.querySelector<HTMLInputElement>('[name="popular"]')!;

  titleInput.value = course.title;
  courseNumberInput.value = course.courseNumber;
  daysInput.value = course.days.toString();
  costInput.value = course.cost.toString();
  teacherInput.value = course.teacher;
  startDateInput.value = course.startDate;
  imageUrlInput.value = course.imageUrl;
  descriptionInput.value = course.description;
  classroomInput.checked = course.classroom;
  distanceInput.checked = course.distance;
  popularInput.checked = course.popular;
};

const updateCourse = async (e: Event, courseId: string, form: HTMLFormElement): Promise<void> => {
  e.preventDefault();

  const fields = Array.from(form.elements) as HTMLInputElement[];
  fields.forEach(f => f.classList.remove('invalid'));

  const titleInput = form.querySelector<HTMLInputElement>('[name="title"]')!;
  const courseNumberInput = form.querySelector<HTMLInputElement>('[name="courseNumber"]')!;
  const daysInput = form.querySelector<HTMLInputElement>('[name="days"]')!;
  const costInput = form.querySelector<HTMLInputElement>('[name="cost"]')!;

  titleInput.validity.valueMissing ? titleInput.setCustomValidity('Kurstitel måste anges') : titleInput.setCustomValidity('');
  courseNumberInput.validity.valueMissing ? courseNumberInput.setCustomValidity('Kursnummer måste anges') : courseNumberInput.setCustomValidity('');
  daysInput.validity.valueMissing ? daysInput.setCustomValidity('Antal dagar måste anges') : daysInput.setCustomValidity('');
  costInput.validity.valueMissing ? costInput.setCustomValidity('Kostnad måste anges') : costInput.setCustomValidity('');
  form.reportValidity();

  if (!form.checkValidity()) {
    fields.forEach(f => {
      if (!f.checkValidity()) f.classList.add('invalid');
    });
  } else {
    const formData = new FormData(form);
    const course: Course = {
      id: courseId,
      title: formData.get('title') as string,
      courseNumber: formData.get('courseNumber') as string,
      days: Number(formData.get('days')),
      cost: Number(formData.get('cost')),
      teacher: formData.get('teacher') as string,
      startDate: formData.get('startDate') as string,
      imageUrl: formData.get('imageUrl') as string,
      description: formData.get('description') as string,
      classroom: formData.get('classroom') === 'true',
      distance: formData.get('distance') === 'true',
      popular: formData.get('popular') === 'true'
    };

    try {
      await new HttpClient<Course>('courses').update(courseId, course);
      alert('Kursen har uppdaterats!');
      overlay.classList.remove('show');
      dialog.classList.remove('show');
      form.reset();
      await displayCourseList();
    } catch (error) {
      console.error(error);
    }
  }
};

const deleteCourse = async (e: Event): Promise<void> => {
  const icon = e.target as HTMLElement;
  const courseId = icon.getAttribute('id') as string;
  const confirmed = confirm('Är du säker på att du vill ta bort kursen?');

  if (confirmed) {
    try {
      await new HttpClient<Course>('courses').delete(courseId);
      await displayCourseList();
    } catch (error) {
      console.error(error);
    }
  }
};

const displayBookings = async (): Promise<void> => {
  const courses = await new HttpClient<Course[]>('courses').listAll();
  const bookings = await new HttpClient<Booking[]>('bookings').listAll();

  if (bookings.length === 0) {
    bookingsList.innerHTML = '<p>Inga bokningar ännu.</p>';
    return;
  }

  courses.map((course: Course) => {
    const courseBookings = bookings.filter((b: Booking) => b.courseId === course.id);
    if (courseBookings.length === 0) return;

    const section = document.createElement('section');
    section.classList.add('booking-group');
    section.innerHTML = `<h3>${course.title}</h3>`;

    courseBookings.map((booking: Booking) => {
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

const handleSubmit = async (e: Event): Promise<void> => {
  e.preventDefault();

  const fields = Array.from(form.elements) as HTMLInputElement[];
  fields.forEach(f => f.classList.remove('invalid'));

  const titleInput = form.querySelector<HTMLInputElement>('[name="title"]')!;
  const courseNumberInput = form.querySelector<HTMLInputElement>('[name="courseNumber"]')!;
  const daysInput = form.querySelector<HTMLInputElement>('[name="days"]')!;
  const costInput = form.querySelector<HTMLInputElement>('[name="cost"]')!;
  const teacherInput = form.querySelector<HTMLInputElement>('[name="teacher"]')!;
  const startDateInput = form.querySelector<HTMLInputElement>('[name="startDate"]')!;
  const imageUrlInput = form.querySelector<HTMLInputElement>('[name="imageUrl"]')!;
  const descriptionInput = form.querySelector<HTMLTextAreaElement>('[name="description"]')!;
  const classroomInput = form.querySelector<HTMLInputElement>('[name="classroom"]')!;
  const distanceInput = form.querySelector<HTMLInputElement>('[name="distance"]')!;

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
  } else {
    classroomInput.setCustomValidity('');
  }

  form.reportValidity();

  if (!form.checkValidity()) {
    fields.forEach(f => {
      if (!f.checkValidity()) f.classList.add('invalid');
    });
  } else {
    const formData = new FormData(form);
    const course: Course = {
      id: '',
      title: formData.get('title') as string,
      courseNumber: formData.get('courseNumber') as string,
      days: Number(formData.get('days')),
      cost: Number(formData.get('cost')),
      teacher: formData.get('teacher') as string,
      startDate: formData.get('startDate') as string,
      imageUrl: formData.get('imageUrl') as string,
      description: formData.get('description') as string,
      classroom: formData.get('classroom') === 'true',
      distance: formData.get('distance') === 'true',
      popular: formData.get('popular') === 'true'
    };

    try {
      await new HttpClient<Course>('courses').post(course);
      alert('Kursen har lagts till!');
      form.reset();
      bookingsList.innerHTML = '';
      await displayBookings();
      await displayCourseList();
    } catch (error) {
      console.error(error);
    }
  }
};

document.addEventListener('DOMContentLoaded', initApp);
form.addEventListener('submit', handleSubmit);