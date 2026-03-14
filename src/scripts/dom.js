export const createCard = () => {
  const card = document.createElement('section');
  card.classList.add('card');
  return card;
};

export const createImage = (imageUrl, id) => {
  const image = document.createElement('img');
  image.setAttribute('src', imageUrl);
  image.setAttribute('id', id);
  image.onerror = () => {
    image.setAttribute('src', 'https://placehold.co/800x400?text=Ingen+bild');
  };
  return image;
};

export const createSpan = (text, className) => {
  const span = document.createElement('span');
  span.textContent = text;
  span.classList.add(className);
  return span;
};

export const createHeader = (text, headerType, classes) => {
  const header = document.createElement(headerType);
  header.setAttribute('class', classes);
  header.textContent = text;
  return header;
};

export const addCardNavigateClickHandler = (cards, url) => {
  cards.forEach((card) => {
    const id = card.getAttribute('id');
    card.addEventListener('click', () => {
      location.href = url + '?id=' + id;
    });
  });
};

export const createCourseDetailsView = (course) => {
  return `
    <a class="goback" href="../courses/courses.html">
      <i class="fa-regular fa-arrow-left-long"></i> Tillbaka till kurser
    </a>
    <section class="card">
      <img src="${course.imageUrl}" alt="${course.title}" />
      <div class="info">
        <h2>${course.title}</h2>
        <div>
          <span>Kursnummer</span>
          <span>${course.courseNumber}</span>
        </div>
        <div>
          <span>Antal dagar</span>
          <span>${course.days}</span>
        </div>
        <div>
          <span>Pris</span>
          <span>${course.cost} kr</span>
        </div>
        <div>
          <span>Lärare</span>
          <span>${course.teacher}</span>
        </div>
        <div>
          <span>Startdatum</span>
          <span>${course.startDate}</span>
        </div>
        <div>
          <span>Klassrum</span>
          <span>${course.classroom ? 'Ja' : 'Nej'}</span>
        </div>
        <div>
          <span>Distans</span>
          <span>${course.distance ? 'Ja' : 'Nej'}</span>
        </div>
        <h3>Beskrivning</h3>
        <div class="description">${course.description}</div>
        <a href="../booking/booking.html?id=${course.id}" class="btn">Boka kurs</a>
      </div>
    </section>
  `;
};