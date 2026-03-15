import HttpClient from '../../data/httpClient.js';

const form = document.querySelector('#booking-form');
form.noValidate = true;
const courseSummary = document.querySelector('#course-summary');
const courseType = document.querySelector('#course-type');

let selectedCourse = null;

const initApp = async () => {
  try {
    const courseId = location.search.split('=')[1];
    selectedCourse = await new HttpClient('courses').findById(courseId);
    displayCourseSummary(selectedCourse);
    displayCourseType(selectedCourse);
  } catch (error) {
    console.error(error);
  }
};

const displayCourseSummary = (course) => {
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

const displayCourseType = (course) => {
  if (course.classroom) {
    const label = document.createElement('label');
    label.innerHTML = `<input type="radio" name="courseType" value="classroom" required /> Klassrum`;
    courseType.appendChild(label);
  }

  if (course.distance) {
    const label = document.createElement('label');
    label.innerHTML = `<input type="radio" name="courseType" value="distance" required /> Distans`;
    courseType.appendChild(label);
  }
};

const handleSubmit = (e) => {
  e.preventDefault();

  const fields = Array.from(form.elements);

  fields.forEach(f => f.classList.remove('invalid'));

  form.name.validity.valueMissing ? form.name.setCustomValidity('Namn måste anges') : form.name.setCustomValidity('');
  form.address.validity.valueMissing ? form.address.setCustomValidity('Fakturaadress måste anges') : form.address.setCustomValidity('');
  form.email.validity.valueMissing ? form.email.setCustomValidity('E-postadress måste anges') : form.email.setCustomValidity('');
  form.phone.validity.valueMissing ? form.phone.setCustomValidity('Mobilnummer måste anges') : form.phone.setCustomValidity('');
  form.reportValidity();

  if (!form.checkValidity()) {
    fields.forEach(f => {
      if (!f.checkValidity()) {
        f.classList.add('invalid');
      }
    });
  } else {
    fields.forEach(f => f.classList.remove('invalid'));

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const booking = {
      courseId: selectedCourse.id,
      courseTitle: selectedCourse.title,
      name: data.name,
      address: data.address,
      email: data.email,
      phone: data.phone,
      courseType: data.courseType
    };

    saveBooking(booking);
  }
};

const saveBooking = async (booking) => {
  try {
    await new HttpClient('bookings').post(booking);
    alert('Din bokning är registrerad!');
    location.href = '../courses/courses.html';
  } catch (error) {
    console.error(error);
  }
};

document.addEventListener('DOMContentLoaded', initApp);
form.addEventListener('submit', handleSubmit);