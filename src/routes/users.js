import knex from "../config/knex";

const requestHandler = (request, reply) => {
  return (
    knex
      .from("users")
      // .where({ deleted: false })
      .select("oid", "username", "email", "done")
      .then(results => reply.response(results))
      .catch(err => console.log(err))
  );
};

const users = [
  {
    method: "GET",
    path: "/users",
    handler: (request, reply) => {
      return requestHandler(request, reply);
    }
  },
  {
    method: "GET",
    path: "/users",
    handler: (request, reply) => {
      return requestHandler(request, reply);
    }
  },
  {
    method: "GET",
    path: "/users/",
    handler: (request, reply) => {
      return requestHandler(request, reply);
    }
  },
 
  {
    method: "PUT",
    path: "/users/{user_id}",
    handler: (request, reply) => {
      try {
        const { username, email } = JSON.parse(request.payload);
        const id = request.params.user_id;
        let user = {};
        if (username != undefined) {
          user.username = username;
        }
        if (email != undefined) {
          user.email = email;
        }
        return knex("users")
          .where("oid", id)
          .update(user)
          .then(result =>
            knex("users")
              .where("oid", id)
              .select("oid", "username", "email", "deleted", "done")
              .then(result =>
                reply.response({ status: "updated", data: result[0] }).code(200)
              )
          )
          .catch(err => reply.response(err).code(401));
      } catch (err) {
        return reply.response(err).code(401);
      }
    }
  },
 
  {
    method: "DELETE",
    path: "/users/{user_id}",
    handler: (request, reply) => {
      const id = request.params.user_id;
      return knex("users")
        .where("oid", id)
        .update({ deleted: true })
        .then(result => {
          console.log(result);
          if (result === 0) {
            return reply
              .response({
                status: "not deleted",
                message: "user not found!"
              })
              .code(409);
          } else {
            return knex("users")
              .where("oid", id)
              .select("oid", "username", "email", "deleted", "done")
              .then(result =>
                reply.response({ status: "deleted", data: result[0] }).code(200)
              );
          }
        })
        .catch(err => reply.response(err).code(401));
    }
  }
];

export default users;