import { it, expect, describe, vi } from 'vitest';
import { Window } from 'happy-dom';
import { createCard, createImage, createSpan, createHeader } from './dom.js';

const window = new Window();
const document = window.document;

vi.stubGlobal('document', document);

describe('DOM', () => {
  describe('createCard', () => {
    it('should return a html section with class = "card"', () => {
      // Arrange
      // Act
      const section = createCard();

      // Assert
      expect(section.nodeName).toBe('SECTION');
      expect(section.className).toBe('card');
    });
  });

  describe('createImage', () => {
    it('should return an image element with correct src and id', () => {
      // Arrange
      const imageUrl = 'https://images.unsplash.com/photo-1579468118864?w=800';
      const id = '123';

      // Act
      const image = createImage(imageUrl, id);

      // Assert
      expect(image.nodeName).toBe('IMG');
      expect(image.getAttribute('id')).toBe('123');
      expect(image.getAttribute('src')).toBe(imageUrl);
    });
  });

  describe('createSpan', () => {
    it('should return a span element with correct text and class', () => {
      // Arrange
      const text = 'JavaScript Grundkurs';
      const className = 'course-title';

      // Act
      const span = createSpan(text, className);

      // Assert
      expect(span.nodeName).toBe('SPAN');
      expect(span.textContent).toBe(text);
      expect(span.className).toBe(className);
    });
  });

  describe('createHeader', () => {
    it('should return a header element with correct text and class', () => {
      // Arrange
      const text = 'Välkommen';
      const headerType = 'h1';
      const classes = 'page-title';

      // Act
      const header = createHeader(text, headerType, classes);

      // Assert
      expect(header.nodeName).toBe('H1');
      expect(header.textContent).toBe(text);
      expect(header.className).toBe(classes);
    });
  });
});