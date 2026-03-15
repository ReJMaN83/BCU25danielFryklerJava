import HttpClient from '../../data/httpClient.js';
import { createCard, createImage, createSpan, addCardNavigateClickHandler } from '../../scripts/dom.js';

const coursesGrid = document.querySelector('#courses-grid') as HTMLDivElement;

const initApp = async (): Promise<void> => {
  try {
    const courses = await new HttpClient<any[]>('courses').listAll();
    displayCourses(courses);
  } catch (error) {
    console.error(error);
  }
};

const displayCourses = (courses: any[]): void => {
  courses.map((course: any) => {
    const card = createCard();
    const image = createImage(course.imageUrl, course.id);
    const title = createSpan(course.title, 'course-title');
    const date = createSpan(course.startDate, 'course-date');

    card.appendChild(image);
    card.appendChild(title);
    card.appendChild(date);
    coursesGrid.appendChild(card);
  });

  const images = document.querySelectorAll('#courses-grid .card img') as NodeListOf<HTMLImageElement>;
  addCardNavigateClickHandler(Array.from(images), '../course-details/course-details.html');
};

document.addEventListener('DOMContentLoaded', initApp);