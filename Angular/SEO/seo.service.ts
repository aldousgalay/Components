/*
  SEO service for Angular + Angular Universal

  // use during initialization
  this.seo.generateTags({
    title: 'Home',
    description: 'Home page.',
    image: 'image.png',
    slug: 'home-page'
  })
*/

import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SeoService {

  currentConfig = {
    title: 'DEFAULT_TITLE',
    description: 'DEFAULT_DESCRIPTION',
    image: 'DEFAULT_IMG_URL',
    slug: 'DEFAULT_SLUG',
  }

  constructor(
    private meta: Meta,
    private title: Title,
  ) { }

  generateTags(config) {
    config = {
      title: 'DEFAULT_TITLE',
      description: 'DEFAULT_DESCRIPTION',
      image: 'DEFAULT_IMG_URL',
      slug: 'DEFAULT_SLUG',
      ...config
    };
    
    this.currentConfig = config;

    this.title.setTitle(config.title);
    this.meta.updateTag({ name: 'twitter:card', content: 'summary' });
    this.meta.updateTag({ name: 'twitter:site', content: 'SITE_TITLE' });
    this.meta.updateTag({ name: 'twitter:title', content: config.title });
    this.meta.updateTag({ name: 'twitter:description', content: config.description });
    this.meta.updateTag({ name: 'twitter:image', content: config.image });

    this.meta.updateTag({ property: 'og:type', content: 'article' });
    this.meta.updateTag({ property: 'og:site_name', content: 'SITE_TITLE' });
    this.meta.updateTag({ property: 'og:title', content: config.title });
    this.meta.updateTag({ property: 'og:description', content: config.description });
    this.meta.updateTag({ property: 'og:image', content: config.image });
    this.meta.updateTag({ property: 'og:url', content: `SITE_URL/${config.slug}` });

  }
}