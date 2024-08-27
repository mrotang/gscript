const script = document.currentScript;
const feedPosts = script.closest('.feed-posts');
const labels = feedPosts.querySelector('.data-labels').textContent.split(',');
const maxPosts = parseInt(feedPosts.querySelector('.data-maxposts').textContent, 10);
const thumbSize = feedPosts.querySelector('.data-thumbsize').textContent.split(',');
const container = feedPosts.querySelector('.container.FeedPosts');
const ampParameter = feedPosts.querySelector('.data-ampparameter').textContent;
const contentTemplate = feedPosts.querySelector('.data-content').innerHTML;

const blogUrl = `https://${window.location.hostname}`;  // Secara otomatis menyesuaikan dengan URL blog yang dikunjungi
const feedUrl = `${blogUrl}/feeds/posts/default/-/${labels.join('|')}?alt=json&max-results=${maxPosts}&thumbsize=${thumbSize.join(',')}&orderby=published&callback=?`;

function fetchPosts(url) {
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const posts = data.feed.entry || [];
      container.innerHTML = posts.map(post => {
        const title = post.title.$t;
        const url = post.link.find(link => link.rel === 'alternate').href;
        const thumbnail = post.media$thumbnail ? `<img src="${post.media$thumbnail.url.replace('s72-c', `s${thumbSize[0]}-${thumbSize[1]}`)}" alt="${title}"/>` : '';
        const snippet = post.summary ? post.summary.$t.substring(0, 100) + '...' : '';

        return contentTemplate
          .replace(/#{title}/g, title)
          .replace(/#{url}/g, url)
          .replace(/#{thumbnail}/g, thumbnail)
          .replace(/#{snippet}/g, snippet);
      }).join('');

      if (ampParameter === 'amp') {
        // Reinitialize AMP components if needed
        AMP.getState()._AMP_BIND.reset(/* User-initiated reset */ true);
      }
    })
    .catch(err => console.error('Error fetching related posts:', err));
}

fetchPosts(feedUrl);
