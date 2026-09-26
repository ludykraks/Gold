---
title: "GoldChest Blog"
description: "Practical guides and useful ideas about websites, digital business, technology and everyday services in Ghana."
layout: "layouts/studio.html"
permalink: "/blog/index.html"
---

<section class="page-hero shell blog-hero">
  <p class="eyebrow">Ideas &amp; practical guides</p>
  <h1>Useful information,<br>clearly explained.</h1>
  <p>Explore practical guides about websites, digital business, technology and everyday services in Ghana.</p>
</section>

<section class="light-section">
  <div class="shell blog-index" aria-labelledby="latest-articles">
    <h2 id="latest-articles">Latest articles</h2>
    <div class="blog-grid">
      {% for post in collections.blogPosts %}
        {% set image = post | postImage %}
        <article class="blog-card">
          <a class="blog-card-image" href="{{ post.url }}" tabindex="-1" aria-hidden="true">
            {% if image %}
              <img src="{{ image }}" alt="" width="640" height="360" loading="lazy">
            {% else %}
              <span class="blog-card-fallback"><span class="brand-symbol" aria-hidden="true"></span>GoldChest</span>
            {% endif %}
          </a>
          <div class="blog-card-body">
            <time datetime="{{ (post | blogDate).toISOString() }}">{{ post | blogDate | readableBlogDate }}</time>
            <h3><a href="{{ post.url }}">{{ post.data.title }}</a></h3>
            <a class="blog-card-link" href="{{ post.url }}" aria-label="Read {{ post.data.title }}">Read article <span aria-hidden="true">↗</span></a>
          </div>
        </article>
      {% endfor %}
    </div>
  </div>
</section>

