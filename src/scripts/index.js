import HttpClient from '../data/httpClient.js';
import { createCard, createImage, createSpan, addCardNavigateClickHandler } from './dom.js';

const coursesGrid = document.querySelector('#courses-grid');

const initApp = async () => {
  try {
    const courses = await new HttpClient('courses').listAll();
    const popularCourses = courses.filter(course => course.popular);
    displayCourses(popularCourses);
  } catch (error) {
    console.error(error);
  }
};

const displayCourses = (courses) => {
  courses.map((course) => {
    const card = createCard();
    const image = createImage(course.imageUrl, course.id);
    const title = createSpan(course.title, 'course-title');
    const date = createSpan(course.startDate, 'course-date');

    card.appendChild(image);
    card.appendChild(title);
    card.appendChild(date);
    coursesGrid.appendChild(card);
  });

  const images = document.querySelectorAll('#courses-grid .card img');
  addCardNavigateClickHandler(images, './pages/course-details/course-details.html');
};

document.addEventListener('DOMContentLoaded', initApp);