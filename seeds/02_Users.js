exports.seed = function(knex, Promise) {
    const tableName = "users";
    const data = [
      {
        nome: "Anna Julia",
        email: "jujuba@gmail.com",
        senha: "julia123"
      },
      {
        nome: "Minora",
        email: "profminora@gmail.com",
        senha: "minorinha123"
      },
      {
        nome: "Anne Gabrielle",
        email: "annegabs65@gmail.com",
        senha: "anne123"
      }
    ];
  
    // Deletes ALL existing entries
    return knex(tableName)
      .del()
      .then(function() {
        return knex(tableName).insert(data);
      });
  };