---

title: "Blog Page"
layout: "layouts/blog-base.html"

---


<ul>
 {% for post in collections.posts %}
 <li>
<a href="{{ post.url }}"> {{post.data.title}} </a>
 </li>
{% endfor  %}

</ul>
