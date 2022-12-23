class Comment {
  post_id = "";
  user_id = "";
  content = "";
  username = "";
  id = "";
  server_url = "https://62f2988118493ca21f3701b4.mockapi.io";

  create() {
    let data = {
      post_id: this.post_id,
      user_id: this.user_id,
      content: this.content,
      username: document.querySelector("#korisnicko_ime").value,
      id: this.id,
    };
    data = JSON.stringify(data);

    fetch(this.server_url + "/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    })
      .then((response) => response.json())
      .then((data) => {});
  }
  async get(post_id) {
    let server_url = this.server_url + "/comments";

    const response = await fetch(server_url);
    const data = await response.json();
    let post_comments = [];

    let i = 0;
    data.forEach((item) => {
      if (item.post_id === post_id) {
        post_comments[i] = item;
        i++;
      }
    });
    return post_comments;
  }
  delete(id) {
    fetch(this.server_url + "/comments/" + id, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {});
  }
}
