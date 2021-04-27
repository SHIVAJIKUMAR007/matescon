import axios from "axios";

// const authService = axios.create({
//   baseURL: "https://matescon-auth-service.herokuapp.com/api/",
// });

// const ffService = axios.create({
//   baseURL: "https://matescon-ffservice.herokuapp.com/api/",
// });

// const massageService = axios.create({
//   baseURL: "https://matescon-massage.herokuapp.com/api/",
// });

// const newsFeedService = axios.create({
//   baseURL: "https://matescon-newsfeed.herokuapp.com/api/",
// });

// const postService = axios.create({
//   baseURL: "https://matescon-postservice.herokuapp.com/api/",
// });

// const quansService = axios.create({
//   baseURL: "https://matscon-quans.herokuapp.com/api/",
// });

// const reportService = axios.create({
//   baseURL: "https://matescon-report.herokuapp.com/api/",
// });
// const notificationService = axios.create({
//   baseURL: "https://matescon-notification.herokuapp.com/api/",
// });

// const profilePic = "https://matescon-auth-service.herokuapp.com/";
// const postAssest = "https://matescon-postservice.herokuapp.com/";
// const notifiSocket = "https://matescon-notification.herokuapp.com/";
// const massageSocket = "https://matescon-massage.herokuapp.com/";

const authService = axios.create({
  baseURL: "http://localhost:5000/api/",
});

const ffService = axios.create({
  baseURL: "http://localhost:5010/api/",
});

const massageService = axios.create({
  baseURL: "http://localhost:5020/api/",
});

const newsFeedService = axios.create({
  baseURL: "http://localhost:5030/api/",
});

const postService = axios.create({
  baseURL: "http://localhost:5040/api/",
});

const quansService = axios.create({
  baseURL: "http://localhost:5050/api/",
});

const reportService = axios.create({
  baseURL: "http://localhost:5060/api/",
});
const notificationService = axios.create({
  baseURL: "http://localhost:5070/api/",
});

const profilePic = "http://localhost:5000/";
const postAssest = "http://localhost:5040/";
const notifiSocket = "http://localhost:5070/";
const massageSocket = "http://localhost:5020/";
export {
  authService,
  ffService,
  massageService,
  newsFeedService,
  postService,
  quansService,
  reportService,
  notificationService,
  profilePic,
  postAssest,
  notifiSocket,
  massageSocket,
};
