import HttpClient from '../../data/httpClient.js';

const form = document.querySelector('#add-course-form');
form.noValidate = true;
const bookingsList = document.querySelector('#bookings-list');

const initApp = async () => {
  try {
    await displayBookings();
  } catch (error) {
    console.error(error);
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
    const courseBookings = bookings.filter(b => b.courseId === course.id);

    if (courseBookings.length === 0) return;

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

  // Återställ fälten
  fields.forEach(f => f.classList.remove('invalid'));

  // Validera varje fält
  form.title.validity.valueMissing ? form.title.setCustomValidity('Kurstitel måste anges') : form.title.setCustomValidity('');
  form.courseNumber.validity.valueMissing ? form.courseNumber.setCustomValidity('Kursnummer måste anges') : form.courseNumber.setCustomValidity('');
  form.days.validity.valueMissing ? form.days.setCustomValidity('Antal dagar måste anges') : form.days.setCustomValidity('');
  form.cost.validity.valueMissing ? form.cost.setCustomValidity('Kostnad måste anges') : form.cost.setCustomValidity('');
  form.teacher.validity.valueMissing ? form.teacher.setCustomValidity('Lärare måste anges') : form.teacher.setCustomValidity('');
  form.startDate.validity.valueMissing ? form.startDate.setCustomValidity('Startdatum måste anges') : form.startDate.setCustomValidity('');
  form.imageUrl.validity.valueMissing ? form.imageUrl.setCustomValidity('Bild-URL måste anges') : form.imageUrl.setCustomValidity('');
  form.description.validity.valueMissing ? form.description.setCustomValidity('Beskrivning måste anges') : form.description.setCustomValidity('');
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

    const course = {
      title: data.title,
      courseNumber: data.courseNumber,
      days: Number(data.days),
      cost: Number(data.cost),
      teacher: data.teacher,
      startDate: data.startDate,
      imageUrl: data.imageUrl,
      description: data.description,
      classroom: data.classroom === 'true',
      distance: data.distance === 'true',
      popular: data.popular === 'true'
    };

    try {
      await new HttpClient('courses').post(course);
      alert('Kursen har lagts till!');
      form.reset();
      bookingsList.innerHTML = '';
      await displayBookings();
    } catch (error) {
      console.error(error);
    }
  }
};

document.addEventListener('DOMContentLoaded', initApp);
form.addEventListener('submit', handleSubmit);