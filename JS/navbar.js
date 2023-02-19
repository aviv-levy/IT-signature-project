let navbar = document.querySelectorAll('.nav')[0];

navbar.innerHTML = `
<ul class="menu-bar">
<a href="/panel"><li>כלל העובדים</li></a>
<a href="/newWorker"><li>עובד חדש</li></a>
<a href="/securitySign"><li>אבטחת מידע</li></a>
<a href="/retiredWorkers"><li>עובדם שעזבו</li></a>
</ul>
`