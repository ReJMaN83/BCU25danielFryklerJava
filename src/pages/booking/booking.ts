import HttpClient from '../../data/httpClient.js';
import { Course } from '../../models/course.js';
import { Booking } from '../../models/booking.js';

const form = document.querySelector('#booking-form') as HTMLFormElement;
form.noValidate = true;
const courseSummary = document.querySelector('#course-summary') as HTMLDivElement;
const courseType = document.querySelector('#course-type') as HTMLDivElement;

let selectedCourse: Course | null = null;

const initApp = async (): Promise<void> => {
  try {
    const courseId = location.search.split('=')[1];
    selectedCourse = await new HttpClient<Course>('courses').findById(courseId);
    displayCourseSummary(selectedCourse);
    displayCourseType(selectedCourse);
  } catch (error) {
    console.error(error);
  }
};

const displayCourseSummary = (course: Course): void => {
  courseSummary.innerHTML = `
    <div class="course-summary">
      <h2>${course.title}</h2>
      <p><span>Kursnummer:</span> ${course.courseNumber}</p>
      <p><span>Antal dagar:</span> ${course.days}</p>
      <p><span>Startdatum:</span> ${course.startDate}</p>
      <p><span>Pris:</span> ${course.cost} kr</p>
    </div>
  `;
};

const displayCourseType = (course: Course): void => {
  if (course.classroom) {
    const label = document.createElement('label');
    label.innerHTML = `<input type="radio" name="courseType" value="classroom" /> Klassrum`;
    courseType.appendChild(label);
  }

  if (course.distance) {
    const label = document.createElement('label');
    label.innerHTML = `<input type="radio" name="courseType" value="distance" /> Distans`;
    courseType.appendChild(label);
  }
};

const handleSubmit = (e: Event): void => {
  e.preventDefault();

  const fields = Array.from(form.elements) as HTMLInputElement[];
  fields.forEach(f => f.classList.remove('invalid'));

  const nameInput = form.querySelector<HTMLInputElement>('[name="name"]')!;
  const addressInput = form.querySelector<HTMLInputElement>('[name="address"]')!;
  const emailInput = form.querySelector<HTMLInputElement>('[name="email"]')!;
  const phoneInput = form.querySelector<HTMLInputElement>('[name="phone"]')!;
  const courseTypeInput = form.querySelector<HTMLInputElement>('input[name="courseType"]');
  const courseTypeSelected = form.querySelector<HTMLInputElement>('input[name="courseType"]:checked');

  nameInput.validity.valueMissing ? nameInput.setCustomValidity('Namn måste anges') : nameInput.setCustomValidity('');
  addressInput.validity.valueMissing ? addressInput.setCustomValidity('Fakturaadress måste anges') : addressInput.setCustomValidity('');
  emailInput.validity.valueMissing ? emailInput.setCustomValidity('E-postadress måste anges') : emailInput.setCustomValidity('');
  phoneInput.validity.valueMissing ? phoneInput.setCustomValidity('Mobilnummer måste anges') : phoneInput.setCustomValidity('');

  if (courseTypeInput) {
    if (!courseTypeSelected) {
      courseTypeInput.setCustomValidity('Du måste välja kurstyp');
    } else {
      courseTypeInput.setCustomValidity('');
    }
  }

  form.reportValidity();

  if (!form.checkValidity()) {
    fields.forEach(f => {
      if (!f.checkValidity()) f.classList.add('invalid');
    });
    return;
  }

  fields.forEach(f => f.classList.remove('invalid'));

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  const booking: Booking = {
    courseId: selectedCourse!.id,
    courseTitle: selectedCourse!.title,
    name: data.name as string,
    address: data.address as string,
    email: data.email as string,
    phone: data.phone as string,
    courseType: data.courseType as string
  };

  saveBooking(booking);
};

const saveBooking = async (booking: Booking): Promise<void> => {
  try {
    await new HttpClient<Booking>('bookings').post(booking);
    alert('Din bokning är registrerad!');
    location.href = '../courses/courses.html';
  } catch (error) {
    console.error(error);
  }
};

document.addEventListener('DOMContentLoaded', initApp);
form.addEventListener('submit', handleSubmit);