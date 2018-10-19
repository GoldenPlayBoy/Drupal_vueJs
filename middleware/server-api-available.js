// Check if server is up before loading page
import axios from 'axios';
export default function(context) {
  const apiUrl = process.env.jsonApiUrl;
  return axios.get(apiUrl).catch(e => {
    if (context.route.path != '/server-unreachable') {
      context.redirect('/server-unreachable');
    }
  });
}
