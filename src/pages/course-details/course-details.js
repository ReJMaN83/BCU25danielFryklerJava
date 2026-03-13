import HttpClient from '../../data/httpClient.js';
import { createCourseDetailsView } from '../../scripts/dom.js';

const initApp = async () => {
  try {
    const courseId = location.search.split('=')[1];

    if (!courseId) {
      document.querySelector('#details-area').innerHTML = '<p>Ingen kurs vald.</p>';
      return;
    }

    const course = await new HttpClient('courses').findById(courseId);
    displayCourse(course);
  } catch (error) {
    console.error(error);
  }
};

const displayCourse = (course) => {
  document.querySelector('#details-area').innerHTML = createCourseDetailsView(course);
};

document.addEventListener('DOMContentLoaded', initApp);