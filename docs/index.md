---
layout: home
title: Taejun Lee
permalink: /
hide_title: true
---

{% assign cv = site.data.cv %}
<main class="cv">
  <header class="cv-hero">
    <div class="cv-hero__main">
      <p class="cv-eyebrow">{{ cv.profile.eyebrow | escape }}</p>
      <h1 class="no_toc">{{ cv.profile.name | escape }}</h1>
      <p class="cv-lead">{{ cv.profile.summary | escape }}</p>
      <nav class="cv-contact" aria-label="Contact links">
        <a href="mailto:{{ cv.profile.email | escape }}">{{ cv.profile.email | escape }}</a>
        <a href="{{ cv.profile.github_url | escape }}">{{ cv.profile.github_label | escape }}</a>
        <a class="cv-contact__print" href="{{ '/cv/' | relative_url }}" target="_blank" rel="noopener noreferrer">Print CV <span aria-hidden="true">↗</span></a>
      </nav>
    </div>
    <dl class="cv-snapshot">
      <div>
        <dt>Education</dt>
        <dd>{{ cv.profile.education_short | escape }}</dd>
      </div>
      <div>
        <dt>GPA</dt>
        <dd>{{ cv.profile.gpa_short | escape }}</dd>
      </div>
      <div>
        <dt>Focus</dt>
        <dd>{{ cv.profile.focus_short | escape }}</dd>
      </div>
    </dl>
  </header>

  <section class="cv-section cv-section--compact">
    <div class="cv-section__heading">
      <p>Focus</p>
      <h2 id="research-interests">Research Interests</h2>
    </div>
    <ul class="cv-tags" aria-label="Research interests">
      {% for interest in cv.research_interests %}
      <li>{{ interest | escape }}</li>
      {% endfor %}
    </ul>
  </section>

  <section class="cv-section">
    <div class="cv-section__heading">
      <p>Background</p>
      <h2 id="education">Education</h2>
    </div>
    <div class="cv-entries cv-entries--ruled">
      {% for item in cv.education %}
      <article class="cv-entry{% unless item.gpa %} cv-entry--brief{% endunless %}">
        <div class="cv-entry__topline">
          <h3 class="no_toc">{{ item.institution | escape }}</h3>
          <time>{{ item.dates | escape }}</time>
        </div>
        <p class="cv-entry__meta">{{ item.degree | escape }}{% if item.note %} · {{ item.note | escape }}{% endif %}</p>
        {% if item.gpa %}
        <p class="cv-entry__metric"><strong>GPA {{ item.gpa | escape }}</strong>{% if item.credits %}<span>{{ item.credits | escape }}</span>{% endif %}</p>
        {% endif %}
      </article>
      {% endfor %}
    </div>
  </section>

  <section class="cv-section">
    <div class="cv-section__heading">
      <p>Selected Work</p>
      <h2 id="research-experience">Research Experience</h2>
    </div>
    <div class="cv-entries cv-entries--timeline">
      {% for item in cv.research_experience %}
      <article class="cv-entry">
        <div class="cv-entry__topline">
          <h3 class="no_toc">{{ item.title | escape }}</h3>
          <time>{{ item.date | escape }}</time>
        </div>
        <p class="cv-entry__meta">{{ item.type | escape }}</p>
        <ul>
          {% for bullet in item.bullets %}
          <li>{{ bullet | escape }}</li>
          {% endfor %}
        </ul>
        {% if item.slides_url %}
        <p class="cv-entry__links"><a href="{{ item.slides_url | relative_url }}?v={{ site.time | date: '%s' }}" target="_blank" rel="noopener noreferrer">Slides <span aria-hidden="true">↗</span></a></p>
        {% endif %}
      </article>
      {% endfor %}
    </div>
  </section>

  <section class="cv-section">
    <div class="cv-section__heading">
      <p>Recognition</p>
      <h2 id="honors-and-awards">Honors &amp; Awards</h2>
    </div>
    <div class="cv-awards">
      {% for item in cv.awards %}
      <article class="cv-award{% if item.featured %} cv-award--featured{% endif %}">
        <div class="cv-entry__topline">
          <h3 class="no_toc">{{ item.title | escape }}</h3>
          <time>{{ item.date | escape }}</time>
        </div>
        <p class="cv-entry__meta">{% if item.event %}{{ item.event | escape }} · {% endif %}{{ item.organization | escape }}</p>
        {% if item.bullets %}
        <ul>
          {% for bullet in item.bullets %}
          <li>{{ bullet | escape }}</li>
          {% endfor %}
        </ul>
        {% endif %}
        {% if item.slides_url %}
        <p class="cv-entry__links"><a href="{{ item.slides_url | relative_url }}?v={{ site.time | date: '%s' }}" target="_blank" rel="noopener noreferrer">Slides <span aria-hidden="true">↗</span></a></p>
        {% endif %}
        {% if item.todo %}<!-- TODO: {{ item.todo }} -->{% endif %}
      </article>
      {% endfor %}
    </div>
  </section>

  <section class="cv-section">
    <div class="cv-section__heading">
      <p>Professional</p>
      <h2 id="industry-experience">Industry Experience</h2>
    </div>
    {% for item in cv.industry_experience %}
    <article class="cv-entry cv-entry--standalone">
      <div class="cv-entry__topline">
        <h3 class="no_toc">{{ item.role | escape }}</h3>
        <time>{{ item.dates | escape }}</time>
      </div>
      <p class="cv-entry__meta">{{ item.company | escape }}</p>
      <ul>
        {% for bullet in item.bullets %}
        <li>{{ bullet | escape }}</li>
        {% endfor %}
      </ul>
    </article>
    {% endfor %}
  </section>

  <section class="cv-section">
    <div class="cv-section__heading">
      <p>Implementation</p>
      <h2 id="selected-projects">Selected Projects</h2>
    </div>
    <div class="cv-projects">
      {% for item in cv.projects %}
      <article class="cv-project">
        <h3 class="no_toc">{{ item.title | escape }}</h3>
        <p>{{ item.summary | escape }}</p>
      </article>
      {% endfor %}
    </div>
  </section>

  <section class="cv-section cv-section--details">
    <div class="cv-section__heading">
      <p>Toolkit</p>
      <h2 id="technical-background">Technical Background</h2>
    </div>
    <dl class="cv-details">
      {% for item in cv.skills %}
      <div>
        <dt>{{ item.label | escape }}</dt>
        <dd>{{ item.values | escape }}</dd>
      </div>
      {% endfor %}
      <div>
        <dt>Coursework</dt>
        <dd>{{ cv.coursework | escape }}</dd>
      </div>
      <div>
        <dt>English</dt>
        <dd>{{ cv.english.label | escape }} · {{ cv.english.score | escape }}</dd>
      </div>
    </dl>
  </section>
</main>
