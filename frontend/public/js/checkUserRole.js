function checkUserRole() {
  const baseUrl = "https://localhost:5000";

  let token = sessionStorage.getItem("token");
  // let userId = sessionStorage.getItem("user_id");
  axios({
    headers: {
      // user: userId,
      authorization: `Bearer ${token}`,
    },
    method: "get",
    url: baseUrl + "/api/currentUserRole/",
  })
    .then(function (response) {
      //retrieve the role of the user
      if (response.data.role == "admin") {
        window.location.assign(
          "https://localhost:3001/admin/manage_users.html"
        );
      } else if (response.data.role != "user") {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user_id");
        sessionStorage.removeItem("role_name");
        window.location.assign("https://localhost:3001/login.html");
      }
    })
    .catch(function (response) {
      //Handle error
      // console.dir(response);
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user_id");
      sessionStorage.removeItem("role_name");
      window.location.assign("https://localhost:3001/login.html");
    });
}
checkUserRole();
