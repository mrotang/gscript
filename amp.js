(function() {
  const feedContainer = document.querySelector('.container.FeedPosts');
  const labels = feedContainer.querySelector('.data-labels').textContent.trim();
  const maxPosts = feedContainer.querySelector('.data-maxposts').textContent.trim();
  const thumbSize = feedContainer.querySelector('.data-thumbsize').textContent.trim().split(',');

  const apiUrl = `https://planetsehat-com.blogspot.com/feeds/posts/summary/-/${labels}?alt=json&max-results=${maxPosts}`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const posts = data.feed.entry;

      const postElements = posts.map(post => {
        const thumbnailUrl = post.media$thumbnail.url.replace('s72-c', `s${thumbSize[0]}-c`);
        const postUrl = post.link.find(link => link.rel === 'alternate').href;
        const title = post.title.$t;
        const snippet = post.summary.$t.replace(/<[^>]*>/g, '').substring(0, 100) + '...';

        return `
          <article class='feed-post nosnippet'>
            <div class='feed-post-thumbnail'>
              <a href='${postUrl}' target='_blank'>
                <amp-img src='${thumbnailUrl}' width='${thumbSize[0]}' height='${thumbSize[1]}' layout='responsive' alt='${title}'></amp-img>
              </a>
            </div>
            <h4 class='feed-post-title'>
              <a href='${postUrl}' target='_blank'>${title}</a>
            </h4>
            <div class='feed-post-snippet'>${snippet}</div>
          </article>
        `;
      }).join('');

      feedContainer.innerHTML = postElements;
    })
    .catch(error => {
      console.error('Error fetching posts:', error);
    });
})();
