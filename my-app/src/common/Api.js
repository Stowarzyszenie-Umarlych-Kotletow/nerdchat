import config from './endpoints.json'
import {ChatContext} from '../App'

const request = (options) => {
    const headers = new Headers();
  
    if (options.setContentType !== false) {
      headers.append("Content-Type", "application/json");
    }

    const defaults = { headers: headers };
    options = Object.assign({}, defaults, options);
  
    return fetch(options.url, options).then((response) =>
      response.json().then((json) => {
        if (!response.ok) {
          return Promise.reject(json);
        }
        return json;
      })
    );
  };

export function logIn(username, password) {
    console.log(config);
    return request({
        url: config.apiUrl + "/user/id/by/nickname/" + encodeURI(username),
        method: "GET",
    })
}

export function getChatRoomList(userId) {

    return request({
        url: config.apiUrl + "/chatroom/list/" + encodeURI(userId),
        method: "GET",
    })
}